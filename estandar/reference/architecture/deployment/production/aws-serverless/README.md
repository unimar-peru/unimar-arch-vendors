<!--
Alternativa de despliegue: AWS Serverless / PaaS — Producción elástica.
Diagrama hermano: ./deployment-diagram.md
-->

# AWS Serverless — Producción elástica pago por uso

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Deployment-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Proposed-f39c12?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-0.1.0-042139?style=flat-square" alt="Versión">
</p>

**← [Inicio](../../../../../../README.md) / [Hub de Arquitectura](../../../README.md) / [Deployment Hub](../../hub/deployment-architecture-hub.md) / AWS Serverless**

> **Meta:** Desplegar la suite UNIMAR en un modelo **serverless/PaaS de AWS** con escalado a demanda y pago por uso, reutilizando **los mismos contenedores OCI** donde conviene un contenedor y **Lambda** donde la carga es event-driven o programada.
> **Owner:** Architecture Board · **Fase SDLC:** 5 — Entrega y Operaciones · **Última revisión:** 2026-07-22

---

## Metadatos de gobierno

| Campo | Valor |
| :-- | :-- |
| Architecture ID | `DEPLOY-AWS-SLESS` |
| Architecture Name | AWS Serverless — Producción elástica pago por uso |
| Environment | Producción elástica |
| Type | Serverless / PaaS |
| Status | Proposed |
| Owner | Architecture Board |
| Version | 0.1.0 |
| Created / Updated | 2026-07-22 / 2026-07-22 |
| Applicable Products | DT, TMS, WMS, MMS, SIL, UMS, XMS |
| Decision Records | [ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md) · [ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md) · [ADR-0039](../../../adrs/core/0039-switcher-abstraccion-topologia-despliegue.es.md) · [ADR-0010](../../../adrs/core/0010-estrategia-arquitectura-multitenant.es.md) · [ADR-0014](../../../adrs/core/0014-estrategia-cache-distribuido-redis.es.md) · [ADR-0030](../../../adrs/core/0030-api-gateway-ingress-vs-nestjs.es.md) |
| Diagram | [deployment-diagram.md](./deployment-diagram.md) |

## 1. Arquitectura — resumen

Esta alternativa aplica el principio **«orquestación progresiva»** del Hub: antes de exigir Kubernetes ([AWS EKS](../aws-eks/README.md)), un producto puede correr en **serverless/PaaS** con menor carga operativa y **pago por uso**. Mantiene los invariantes: mismo binario OCI, adaptadores tras Puertos ([ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md)), conmutador `DEPLOYMENT_TOPOLOGY=SAAS_CLOUD` ([ADR-0039](../../../adrs/core/0039-switcher-abstraccion-topologia-despliegue.es.md)) y autorización por sucursal en aplicación ([ADR-0010](../../../adrs/core/0010-estrategia-arquitectura-multitenant.es.md), **RLS prohibida**).

**Decisión central — qué es contenedor y qué es serverless puro, por workload:**

| Workload | Destino en AWS | Justificación |
| :-- | :-- | :-- |
| **Web (Frontend React)** | **S3 + CloudFront** (estático) o **App Runner** si requiere SSR | El bundle estático se sirve desde CDN sin servidor; el SSR reutiliza el contenedor del frontend en App Runner |
| **API / BFF (NestJS)** | **App Runner** (contenedor serverless) tras **API Gateway** | Reutiliza **el mismo contenedor OCI** del BFF ([ADR-0030](../../../adrs/core/0030-api-gateway-ingress-vs-nestjs.es.md)); App Runner escala a demanda sin gestionar clúster. Evita reescribir el BFF como funciones |
| **Event-driven (handlers de eventos/colas)** | **AWS Lambda** | Ejecución efímera por evento (SQS/SNS/EventBridge/S3); paga solo por invocación; encaja el arquetipo serverless-event-driven |
| **Background de larga duración** | **ECS Fargate** | Procesos que exceden el límite de Lambda (15 min) o mantienen conexiones persistentes; contenedor gestionado sin EC2 |
| **Scheduled (cron/batch)** | **EventBridge Scheduler → Lambda** (o Fargate task si es pesado) | Disparo programado sin infraestructura ociosa |

**Cómo se conecta.** **CloudFront** (+ **WAF**) sirve el frontend estático y enruta las rutas de API a **API Gateway**, que integra con **App Runner** (BFF/servicios contenedorizados) y con **Lambda** (funciones). Los eventos fluyen por **EventBridge/SNS/SQS**; la persistencia es **RDS/Aurora PostgreSQL** (motor relacional del stack) y **DynamoDB** solo donde el patrón de acceso clave-valor y la escala serverless lo justifiquen; la caché es **ElastiCache (Redis)** ([ADR-0014](../../../adrs/core/0014-estrategia-cache-distribuido-redis.es.md)) — o **Serverless** de Aurora/ElastiCache donde exista; los objetos van a **S3** (S3-API). Secretos en **Secrets Manager**, identidad por **IAM roles** de ejecución, cifrado por **KMS**.

## 2. Diagrama de despliegue

Ver **[deployment-diagram.md](./deployment-diagram.md)** — Mermaid por capas: Usuarios → CloudFront/WAF → API Gateway (Edge/Application) → App Runner + Lambda + Fargate (Service) → EventBridge/SQS/SNS (Messaging) → RDS/DynamoDB/ElastiCache/S3 (Data) → MMS/UMS/XMS (External Systems).

## 3. Componentes requeridos

Anclados al [stack autorizado agnóstico §6](../../../stack-tecnologico-autorizado-agnostico.es.md). La columna «Alternativa» documenta la estrategia de salida (portabilidad).

| Componente | Tecnología (AWS) | Propósito | Alternativa (portabilidad) | Nota DR |
| :-- | :-- | :-- | :-- | :-- |
| Borde/CDN | **CloudFront** | CDN + TLS 1.3 + frontend estático | Cualquier CDN estándar | Distribución global multiorigen |
| Firewall de app | **AWS WAF** | OWASP, rate-limiting | ModSecurity | Reglas replicadas por región |
| Gateway de API | **Amazon API Gateway** (HTTP API) | Enrutado, throttling, authz JWT | Kong · NGINX ([ADR-0030](../../../adrs/core/0030-api-gateway-ingress-vs-nestjs.es.md)) | API regional redundante |
| API/BFF | **AWS App Runner** (contenedor OCI) | Ejecuta el **mismo contenedor** del BFF/servicios | ECS Fargate · EKS · Container Apps | Servicio replicado por región |
| Funciones event-driven | **AWS Lambda** | Handlers efímeros por evento/scheduled | Contenedor + KEDA en K8s | Funciones desplegadas por región |
| Contenedor de larga duración | **ECS Fargate** | Background persistente > 15 min | EKS · Nomad | Tarea replicada por región |
| Programación | **EventBridge Scheduler** | Cron/batch sin infraestructura ociosa | CronJob de K8s | Regla por región |
| Bus de eventos | **EventBridge** (+ SNS/SQS) | AMQP/CloudEvents lógico, fan-out, colas | RabbitMQ (AMQP nativo) | Colas/reglas redundantes |
| Base de datos relacional | **RDS / Aurora PostgreSQL** (Serverless v2 opcional) | Persistencia relacional (perfil Node.js) | PostgreSQL autohospedado | Multi-AZ + réplica cross-region |
| Base clave-valor | **DynamoDB** (solo cuando aplique) | Estado clave-valor de altísima escala/elasticidad | Cassandra/ScyllaDB tras Puerto | Global Tables multi-region |
| Caché | **ElastiCache (Redis)** | Caché distribuida ([ADR-0014](../../../adrs/core/0014-estrategia-cache-distribuido-redis.es.md)) | Redis/Valkey autohospedado | Réplica Multi-AZ |
| Object storage | **Amazon S3** (S3-API) | Estáticos, documentos, backups | MinIO (mismo contrato) | Versioning + Cross-Region Replication |
| Secretos | **AWS Secrets Manager** | Secretos fuera de Git | HashiCorp Vault | Réplica cross-region |
| Cifrado | **AWS KMS (CMK)** | Cifrado en reposo AES-256 | Vault Transit | CMK multi-region |
| Identidad de ejecución | **IAM execution roles** | Permisos mínimos por función/servicio | OIDC + Vault | Roles por región |
| Observabilidad | **CloudWatch + OpenTelemetry** | Logs/métricas/trazas (X-Ray/OTel) | Prometheus/Grafana/Tempo | Dashboards por región |
| DNS/entrada global | **Route 53** | Failover regional | Cualquier DNS con health-checks | Failover a región secundaria |
| IaC | **Terraform** (backend S3 + DynamoDB lock) | Provisión declarativa | Pulumi · SAM/CDK | Estado remoto versionado |

## 4. Requerimientos técnicos

- **Infraestructura:** sin servidores que administrar en el plano serverless; capacidad por concurrencia de Lambda, tamaño/instancias de App Runner (auto), y ACUs de Aurora Serverless v2. Storage gestionado (RDS/DynamoDB/S3).
- **Software:** contenedores OCI Distroless para App Runner/Fargate (**mismos artefactos** que EKS/Kind); runtime Node.js/.NET para Lambda; PostgreSQL 15; Redis; API Gateway HTTP API.
- **Seguridad:** IAM execution roles de mínimo privilegio; Secrets Manager (sin secretos en Git); KMS/CMK (AES-256) en reposo, TLS 1.3 en tránsito; WAF en borde; authz JWT RS256 validado en API Gateway y/o BFF; autorización por sucursal en aplicación ([ADR-0010](../../../adrs/core/0010-estrategia-arquitectura-multitenant.es.md)). Para aislamiento de red, VPC + endpoints para Lambda/Fargate/App Runner que acceden a RDS.
- **Observabilidad:** OpenTelemetry + CloudWatch/X-Ray; logs JSON estructurados; trazas correlacionadas end-to-end (API Gateway → App Runner/Lambda → RDS).
- **DevOps:** ECR para las imágenes de App Runner/Fargate; IaC Terraform con estado remoto S3 + lock DynamoDB; despliegue por revisión de servicio (App Runner) o versión/alias (Lambda); verificación **local-first** ([ADR-0106](../../../adrs/core/0106-seguridad-calidad-local-first.es.md)).
- **Operación:** carga operativa baja (AWS opera el plano de ejecución); foco en cuotas de concurrencia, cold-starts, límites de conexión a RDS (RDS Proxy) y control de costos por invocación.

## 5. Escalabilidad y alta disponibilidad

- **Escalado:** **automático y a cero** por servicio — Lambda escala por concurrencia; App Runner por peticiones/CPU; Aurora Serverless v2 por ACUs; DynamoDB on-demand. No hay HPA ni nodos que gestionar.
- **Alta disponibilidad:** los servicios serverless de AWS son Multi-AZ por diseño dentro de la región; DynamoDB Global Tables y Aurora cross-region habilitan HA multi-region con Route 53.
- **Objetivos NFR** ([matriz NFR §3](../../../matriz-nfr-suite.es.md)): idóneo para cargas **C2/C3** con picos impredecibles y ventanas de uso variables; para **C1 24/7** exige mitigar cold-starts (concurrencia provisionada) y proteger RDS con **RDS Proxy**. RTO/RPO gestionados por backups de RDS/DynamoDB PITR; se declaran por producto en el PRD.

## 6. Estimated Infrastructure Cost

> Estimación en **RANGOS**. Región: `us-east-1` (referencia). Supuestos: 1 000–5 000 usuarios, 3–10 M requests/mes, ejecución event-driven intermitente, 100–500 GB storage (RDS + S3 + DynamoDB), tráfico 0.5–2 TB/mes, 6–12 unidades de despliegue (mezcla App Runner/Lambda/Fargate), 2 ambientes + DR. **No se inventan precios exactos**: dominan → invocaciones y GB-segundo de Lambda, horas activas de App Runner/Fargate, ACUs de Aurora, RCU/WCU de DynamoDB, requests de API Gateway y egress de CloudFront.

| Concepto | Estimación |
| :-- | :-- |
| Costo mensual estimado | Rango bajo-medio con tráfico intermitente (pago por uso, escala a cero); crece de forma lineal con la carga sostenida |
| Costo anual estimado | 12× el mensual; sin base fija de clúster, pero Aurora Serverless v2 tiene ACU mínimo si se exige siempre-caliente |
| Costo de implementación inicial | Bajo-medio: menos infraestructura de red que EKS; esfuerzo en contratos de API Gateway, IAM por función y observabilidad distribuida |
| Costo operativo estimado | Bajo: AWS opera el plano de ejecución; el foco es control de costos y límites |

**Punto de cruce:** con tráfico **alto y sostenido**, el pago por uso puede superar el costo de un clúster [EKS](../aws-eks/README.md) reservado; con tráfico **variable o intermitente**, serverless es más barato al escalar a cero. La decisión se ancla a los criterios de selección del [Hub §6](../../hub/deployment-architecture-hub.md#6-criterios-de-selección).

## 7. Operación, monitoreo, seguridad, recuperación

- **Quién la opera:** AWS opera el plano de ejecución (Lambda, App Runner, Fargate, API Gateway); UNIMAR opera contratos, código, IAM y cuotas. Carga operativa menor que EKS.
- **Cómo se monitorea:** CloudWatch + X-Ray/OpenTelemetry; alarmas sobre errores/throttles de Lambda, latencia de API Gateway, ACUs de Aurora y conexiones vía RDS Proxy; logs JSON estructurados.
- **Cómo se protege:** WAF en borde, authz JWT en API Gateway, IAM de mínimo privilegio por función, Secrets Manager + KMS/CMK, VPC + endpoints para acceso privado a RDS. Cumple RGPD Art. 32 (separación de llaves) e ISO 27001 A.10 (criptografía).
- **Cómo se recupera:** backups automáticos y PITR de RDS/Aurora; DynamoDB PITR y Global Tables; S3 versioning + CRR; failover regional por Route 53. Se ensayan restore y failover como parte del gate de DR ([ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md)).

## 8. Cuándo usar / Ventajas y desventajas

**Cuándo conviene:** productos **C2/C3** o módulos con **carga event-driven, picos impredecibles o uso intermitente**, donde interesa minimizar carga operativa y pagar por uso; y como paso previo a Kubernetes en la orquestación progresiva. Menos indicado para cargas **C1 24/7** de altísimo throughput sostenido con latencia estricta, donde [EKS](../aws-eks/README.md) da mejor control y costo.

| Ventajas | Desventajas |
| :-- | :-- |
| Escala a cero y pago por uso: barato en tráfico variable | Cold-starts en Lambda; latencia variable sin mitigación |
| Carga operativa mínima: sin clúster que gestionar | Límites de conexión a RDS obligan a RDS Proxy |
| Reutiliza los mismos contenedores (App Runner/Fargate) | Coste puede superar a EKS con tráfico alto y sostenido |
| HA Multi-AZ nativa por servicio | Observabilidad distribuida más compleja de correlacionar |
| Time-to-market rápido por producto/módulo | DynamoDB introduce un modelo de datos no relacional a gobernar |

## 9. Relación con el SDLC de UNIMAR-ARCH

Aplica en la **Fase 5 — Entrega y Operaciones** y encaja como opción de **Fase 1–2** (antes de exigir Kubernetes) o para módulos event-driven de cualquier fase, según la orquestación progresiva de [ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md). La gobiernan [ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md), [ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md), [ADR-0039](../../../adrs/core/0039-switcher-abstraccion-topologia-despliegue.es.md), [ADR-0010](../../../adrs/core/0010-estrategia-arquitectura-multitenant.es.md), [ADR-0014](../../../adrs/core/0014-estrategia-cache-distribuido-redis.es.md) y [ADR-0030](../../../adrs/core/0030-api-gateway-ingress-vs-nestjs.es.md). La adopción por producto se registra en el `DECISIONS.md` del satélite y los hallazgos en su `GAPS.md`. Estado **Proposed**: pasará a **Approved** con ADR de adopción aceptado y un despliegue verificado. Comparación transversal en la [matriz de opciones](../../comparison/deployment-options-matrix.md).

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-07-22
</p>
