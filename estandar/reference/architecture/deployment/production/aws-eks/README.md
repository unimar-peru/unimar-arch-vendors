<!--
Alternativa de despliegue: AWS EKS (Kubernetes gestionado) — Producción / DR.
Diagrama hermano: ./deployment-diagram.md
-->

# AWS EKS — Kubernetes gestionado en producción

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Deployment-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Proposed-f39c12?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-1.0.0-042139?style=flat-square" alt="Versión">
</p>

**← [Inicio](../../../../../../README.md) / [Hub de Arquitectura](../../../README.md) / [Deployment Hub](../../hub/deployment-architecture-hub.md) / AWS EKS**

> **Meta:** Desplegar la suite UNIMAR sobre **Amazon EKS** (Kubernetes gestionado) en una topología Multi-AZ activo-activo con Aurora PostgreSQL, para producción de alta disponibilidad y DR regional.
> **Owner:** Architecture Board · **Fase SDLC:** 5 — Entrega y Operaciones · **Última revisión:** 2026-07-22

---

## Metadatos de gobierno

| Campo | Valor |
| :-- | :-- |
| Architecture ID | `DEPLOY-AWS-EKS` |
| Architecture Name | AWS EKS — Kubernetes gestionado en producción |
| Environment | Producción / DR |
| Type | Kubernetes gestionado (cloud) |
| Status | Proposed |
| Owner | Architecture Board |
| Version | 1.0.0 |
| Created / Updated | 2026-07-22 / 2026-07-22 |
| Applicable Products | DT, TMS, WMS, MMS, SIL, UMS, XMS |
| Decision Records | [ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md) · [ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md) · [ADR-0039](../../../adrs/core/0039-switcher-abstraccion-topologia-despliegue.es.md) · [ADR-0010](../../../adrs/core/0010-estrategia-arquitectura-multitenant.es.md) · [ADR-0014](../../../adrs/core/0014-estrategia-cache-distribuido-redis.es.md) · [ADR-0030](../../../adrs/core/0030-api-gateway-ingress-vs-nestjs.es.md) |
| Diagram | [deployment-diagram.md](./deployment-diagram.md) |

## 1. Arquitectura — resumen

Esta alternativa **consolida y materializa** el [Escenario 3 «AWS — Resiliencia Global y Privacidad Total»](../../../escenarios-despliegue-multinube.es.md#3-escenario-aws-resiliencia-global-y-privacidad-total) de los escenarios multinube. No lo duplica: aterriza ese blueprint (ALB → EKS con IRSA → Aurora Multi-AZ → VPC Endpoints/PrivateLink → CMK) como arquitectura de despliegue gobernada y trazable, empaquetada con el **mismo Helm chart agnóstico** que corre en Kind local ([`ums-helm`](../../local/kind/README.md)) y provisionada con **Terraform**.

**Dónde corre.** Un clúster **Amazon EKS** (Kubernetes v1.28+, exigido desde Fase 3+ según [ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md) y [stack agnóstico §7](../../../stack-tecnologico-autorizado-agnostico.es.md)) desplegado sobre una VPC con subredes privadas en **tres zonas de disponibilidad** (activo-activo). Los pods de aplicación no tienen ruta directa a Internet: toda salida a servicios AWS viaja por **VPC Endpoints (PrivateLink)**.

**Cómo se conecta.** El tráfico entra por **CloudFront** (CDN + TLS 1.3) → **AWS WAF** (reglas OWASP y rate-limiting de borde) → **Application Load Balancer** (terminación TLS, gestionado por el AWS Load Balancer Controller vía Ingress/HTTPRoute del chart) → **Services de EKS** (frontend React, BFF/API Gateway NestJS, servicios de dominio, workers). La mensajería asíncrona usa **Amazon MQ (RabbitMQ)** para preservar el contrato **AMQP/CloudEvents** del stack, con SQS/SNS como opción para desacoplo de eventos nativos. La persistencia es **Aurora PostgreSQL Multi-AZ**; la caché es **ElastiCache (Redis)** ([ADR-0014](../../../adrs/core/0014-estrategia-cache-distribuido-redis.es.md)); los objetos van a **S3** (contrato S3-API del stack §4.3).

**Con qué se gobierna la portabilidad.** El conmutador `DEPLOYMENT_TOPOLOGY=SAAS_CLOUD` ([ADR-0039](../../../adrs/core/0039-switcher-abstraccion-topologia-despliegue.es.md)) selecciona los adaptadores cloud en el arranque DI. Ningún SDK de AWS cruza a Dominio/Aplicación ([ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md)): S3, KMS y Secrets Manager viven tras Puertos. El aislamiento por sucursal se resuelve **en la capa de aplicación** ([ADR-0010](../../../adrs/core/0010-estrategia-arquitectura-multitenant.es.md)); **RLS nativa prohibida**, idéntico a Azure y On-Premise.

## 2. Diagrama de despliegue

Ver **[deployment-diagram.md](./deployment-diagram.md)** — Mermaid por capas: Usuarios → CloudFront/WAF → ALB (Edge) → EKS Services (Application/Service) → Amazon MQ/SQS/SNS (Messaging) → Aurora/ElastiCache/S3 (Data) → MMS/UMS/XMS (External Systems).

## 3. Componentes requeridos

Anclados al [stack autorizado agnóstico §7](../../../stack-tecnologico-autorizado-agnostico.es.md). Cada servicio AWS es un **adaptador** detrás de un Puerto; la columna «Alternativa» documenta la estrategia de salida (vendor lock-in bajo).

| Componente | Tecnología (AWS) | Propósito | Alternativa (portabilidad) | Nota DR |
| :-- | :-- | :-- | :-- | :-- |
| Orquestación | **Amazon EKS** (K8s 1.28+) | Ejecuta el Helm chart agnóstico | AKS · RKE2 · MicroK8s (mismo chart) | Clúster réplica en región secundaria |
| Registro de imágenes | **Amazon ECR** | Imágenes OCI Distroless firmadas | Harbor · GHCR | Replicación cross-region de ECR |
| Base de datos | **Aurora PostgreSQL** Multi-AZ | Persistencia relacional (perfil Node.js) | RDS PostgreSQL · PostgreSQL bare-metal (Patroni) | Réplica lectora cross-region; backtrack 72 h |
| Caché | **ElastiCache (Redis)** | Caché distribuida multi-capa ([ADR-0014](../../../adrs/core/0014-estrategia-cache-distribuido-redis.es.md)) | Redis/Valkey autohospedado | Réplica Multi-AZ con failover automático |
| Object storage | **Amazon S3** (S3-API) | Documentos, adjuntos, backups | MinIO autohospedado (mismo contrato) | Cross-Region Replication + versioning |
| Mensajería | **Amazon MQ (RabbitMQ)** | Bus de eventos AMQP/CloudEvents | RabbitMQ en K8s · SQS/SNS | Broker Multi-AZ; DLQ persistente |
| Eventos/colas nativas | **SQS / SNS** (opcional) | Desacoplo de eventos y fan-out | EventBridge · RabbitMQ | Colas regionales redundantes |
| Secretos | **AWS Secrets Manager** + sidecar | Inyección de secretos (nunca en Git/ConfigMap) | HashiCorp Vault (patrón sidecar) | Réplica de secretos cross-region |
| Cifrado | **AWS KMS (CMK de cliente)** | Cifrado en reposo AES-256, rotación | Vault Transit · HSM on-prem | CMK multi-region key |
| Identidad de carga | **IAM Roles for Service Accounts (IRSA)** | Credenciales por pod sin llaves estáticas | Vault K8s auth | Roles replicados por región |
| Observabilidad | **CloudWatch + OpenTelemetry Collector** | Logs/métricas/trazas vendor-neutral | Prometheus/Grafana/Loki/Tempo | Dashboards y alarmas por región |
| Balanceo/Ingress | **Application Load Balancer** (ALB) | Terminación TLS, enrutado L7 | NGINX Ingress · Kong | ALB por región tras Route 53 |
| Borde/CDN | **CloudFront** | CDN, caché estática, TLS 1.3 | Cualquier CDN estándar | Distribución global multiorigen |
| Firewall de app | **AWS WAF** | OWASP, rate-limiting, geo-bloqueo | ModSecurity | Reglas replicadas por región |
| Red | **VPC · subredes Multi-AZ · PrivateLink · NAT GW** | Aislamiento de red, sin salida directa a IGW | VNet/Subnets equivalentes | VPC espejo en región DR |
| DNS/entrada global | **Route 53** (routing latencia/failover) | Entrada de red global ([ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md)) | Cualquier DNS con health-checks | Failover DNS a región secundaria |
| IaC | **Terraform** (`>= 1.6`, backend S3 + DynamoDB lock) | Provisión declarativa reproducible | Pulumi · CDKtf | Estado remoto versionado |

> **Artefactos reales que la alimentan:** el chart [`src/infra/ums-helm/`](../../local/kind/README.md) (backend, frontend, PostgreSQL, Redis, observabilidad) corre sin cambios sobre EKS ajustando `image.pullPolicy` a `IfNotPresent` y `repository` al ECR; los módulos Terraform de UMS (`vpc`, `eks`, `rds`, `apigw`, `cloudfront`) son la base de la capa IaC.

## 4. Requerimientos técnicos

- **Infraestructura:** node groups gestionados sobre EC2 (referencia UMS: `t3.medium`, escalable a `m6i`/`c6i` según carga); 3 AZ; subredes privadas para app y data, públicas solo para ALB/NAT. CPU/RAM dimensionadas por HPA; storage EBS gp3 para nodos, almacenamiento gestionado de Aurora con autoescalado.
- **Software:** Kubernetes 1.28+, Helm v3 (chart agnóstico), contenedores OCI Distroless (Docker v25+ multi-stage), Aurora PostgreSQL 15, Redis (ElastiCache), RabbitMQ (Amazon MQ).
- **Seguridad:** IRSA por pod (sin llaves estáticas); secretos vía Secrets Manager + sidecar (patrón único aprobado, stack §5.2); cifrado en reposo con CMK/KMS (AES-256) y en tránsito TLS 1.3; WAF en borde; red Zero-Trust sin salida directa a IGW, tráfico a servicios AWS por PrivateLink; mTLS al activar malla (Fase 3+). Autorización por sucursal en aplicación ([ADR-0010](../../../adrs/core/0010-estrategia-arquitectura-multitenant.es.md)).
- **Observabilidad:** OpenTelemetry Collector (W3C Trace Context) como punto de entrega; export a CloudWatch (o Prometheus/Grafana/Loki/Tempo como decisión de despliegue); logs JSON estructurados; el chart incluye `observability.yaml` y dashboard `ums-overview`.
- **DevOps:** ECR como registro; IaC Terraform con estado remoto en S3 + lock DynamoDB; despliegue GitOps (Argo CD/Flux) o Helm directo; verificación **local-first** ([ADR-0106](../../../adrs/core/0106-seguridad-calidad-local-first.es.md)), las puertas de release no dependen de CI de servidor.
- **Operación:** equipo de plataforma/SRE; backup automatizado de Aurora (snapshots + PITR); DR regional activo-activo o activo-pasivo según criticidad; runbooks y gestión de incidentes ancladas a [ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md).

## 5. Escalabilidad y alta disponibilidad

- **Escalado horizontal:** **HPA** por servicio (CPU/memoria/métricas custom OTel) + **Cluster Autoscaler** (o Karpenter) para node groups. El frontend y el BFF escalan independientemente de los servicios de dominio.
- **Alta disponibilidad:** pods distribuidos en 3 AZ con `topologySpreadConstraints`; ALB balancea entre AZ; Aurora Multi-AZ con failover automático (<60 s típico) y réplicas lectoras; ElastiCache Multi-AZ. Modelo **AP** en lecturas (Reader Endpoints), consistencia fuerte en escrituras.
- **Objetivos NFR** (contra [matriz NFR §3](../../../matriz-nfr-suite.es.md)): esta topología habilita metas **C1 — Crítico Operativo** (24/7): RTO bajo por failover Multi-AZ y región secundaria; RPO cercano a cero por replicación síncrona intra-región y backtrack de 72 h. Los umbrales concretos por producto se declaran en el PRD del satélite.

## 6. Estimated Infrastructure Cost

> Estimación en **RANGOS**. Región: `us-east-1` (referencia; la región legal se ajusta por soberanía). Supuestos: 1 000–5 000 usuarios activos, 3–10 M requests/mes, 200 GB–1 TB de storage (Aurora + S3), tráfico saliente 0.5–3 TB/mes, 6–12 servicios contenedorizados, 2 ambientes gestionados (Staging + Producción) más DR. **No se inventan precios exactos**: dominan estos drivers → nº de nodos EC2 y su familia, IOPS/almacenamiento de Aurora, réplicas Multi-AZ, NAT Gateways por AZ, tráfico de CloudFront/egress y horas de Amazon MQ.

| Concepto | Estimación |
| :-- | :-- |
| Costo mensual estimado | Rango medio-alto (cómputo EKS + Aurora Multi-AZ + ElastiCache + ALB/NAT/CloudFront + Amazon MQ). Base fija no despreciable por HA Multi-AZ aun con tráfico bajo |
| Costo anual estimado | 12× el mensual; optimizable 30–50 % con Savings Plans / Reserved para nodos y Aurora |
| Costo de implementación inicial | Medio: diseño de VPC/PrivateLink, módulos Terraform, hardening WAF/IRSA, pipelines GitOps y ensayo de DR |
| Costo operativo estimado | Medio-alto: requiere equipo de plataforma/SRE; parte del esfuerzo lo absorbe EKS al ser gestionado |

**Variables que mueven el costo:** número y familia de nodos (Cluster Autoscaler/Karpenter reduce el ocioso); Multi-AZ duplica el costo de datos frente a mono-AZ; NAT Gateway se cobra por AZ y por GB procesado (mitigable con VPC Endpoints); egress de CloudFront escala con el tráfico; DR activo-activo aproximadamente duplica el cómputo frente a activo-pasivo.

## 7. Operación, monitoreo, seguridad, recuperación

- **Quién la opera:** equipo de plataforma/SRE de UNIMAR. EKS es gestionado en el plano de control (AWS opera masters); los node groups, charts y políticas los opera UNIMAR.
- **Cómo se monitorea:** OpenTelemetry Collector → CloudWatch (métricas, logs JSON, trazas); alarmas sobre saturación de nodos, latencia p95/p99 del BFF, lag de réplica Aurora y profundidad de colas RabbitMQ; dashboard `ums-overview` del chart.
- **Cómo se protege:** WAF en borde, IRSA sin credenciales estáticas, Secrets Manager + sidecar, KMS/CMK con rotación, red sin salida directa a IGW y PrivateLink para servicios AWS. Cumplimiento ISO 27001 A.13.1.1 (tráfico no cruza Internet pública) y RGPD Art. 32 (separación de llaves KMS y datos).
- **Cómo se recupera:** backups automáticos de Aurora (snapshots + PITR + backtrack 72 h), S3 con versioning y Cross-Region Replication, réplica de clúster/base en región secundaria y failover por Route 53. Se ensaya **restore** y **failover regional** como parte del gate de DR ([ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md)).

## 8. Cuándo usar / Ventajas y desventajas

**Cuándo conviene:** producción **C1/C2** que exige alta disponibilidad Multi-AZ, DR regional y escalado elástico con control fino de plataforma, cuando UNIMAR ya opera (o va a operar) con Kubernetes y dispone de equipo de plataforma; y cuando se requiere el mismo binario/chart en cloud y on-premise sin reescritura.

| Ventajas | Desventajas |
| :-- | :-- |
| Portabilidad real: mismo Helm chart que Kind/AKS/On-Prem | Costo base Multi-AZ elevado incluso con tráfico bajo |
| HA Multi-AZ + DR regional maduros (Aurora, Route 53) | Complejidad operativa alta: exige equipo SRE/plataforma |
| Control fino (HPA/Karpenter, mallas, políticas de red) | Curva de operación de EKS, IRSA, PrivateLink y Terraform |
| Vendor lock-in bajo: todo servicio tras un Puerto | NAT Gateway y egress pueden encarecer si no se optimizan |
| IRSA + KMS + WAF = postura de seguridad robusta | Sobredimensionado para cargas pequeñas o intermitentes |

## 9. Relación con el SDLC de UNIMAR-ARCH

Aplica en la **Fase 5 — Entrega y Operaciones** y se habilita desde **Fase 3+** (adopción de Kubernetes, [ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md), [stack §7](../../../stack-tecnologico-autorizado-agnostico.es.md)). La gobiernan [ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md), [ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md), [ADR-0039](../../../adrs/core/0039-switcher-abstraccion-topologia-despliegue.es.md), [ADR-0010](../../../adrs/core/0010-estrategia-arquitectura-multitenant.es.md), [ADR-0014](../../../adrs/core/0014-estrategia-cache-distribuido-redis.es.md) y [ADR-0030](../../../adrs/core/0030-api-gateway-ingress-vs-nestjs.es.md). La adopción por producto se registra en el `DECISIONS.md` del satélite y todo hallazgo (gap, riesgo, deuda) en su `GAPS.md`. Estado **Proposed**: pasará a **Approved** con ADR de adopción aceptado y al menos un despliegue verificado. Comparación transversal en la [matriz de opciones](../../comparison/deployment-options-matrix.md).

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-07-22
</p>
