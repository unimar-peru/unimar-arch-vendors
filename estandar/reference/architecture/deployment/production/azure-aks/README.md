<!--
Alternativa de despliegue — Deployment Architecture Hub
Grupo: production · Alternativa: azure-aks
Diagrama hermano: deployment-diagram.md
-->

# Azure AKS — Kubernetes Gestionado en Producción

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Deployment-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Proposed-f39c12?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-0.1.0-042139?style=flat-square" alt="Versión">
</p>

**← [Inicio](../../../../../../README.md) / [Hub de Arquitectura](../../../README.md) / [Deployment Hub](../../hub/deployment-architecture-hub.md) / Azure AKS**

> **Meta:** desplegar la suite UNIMAR en producción sobre **Azure Kubernetes Service (AKS)** con entrada de red global, cumplimiento estricto y portabilidad de charts, consolidando el [Escenario Azure de cumplimiento estricto](../../../escenarios-despliegue-multinube.es.md#2-escenario-azure-cumplimiento-estricto-empresarial) ya decidido en el core.
> **Owner:** Architecture Board · **Fase SDLC:** 5 — Entrega y Operaciones · **Última revisión:** 2026-07-22

---

## Metadatos de gobierno

| Campo | Valor |
| :-- | :-- |
| Architecture ID | `DEPLOY-AZ-AKS` |
| Architecture Name | Azure AKS — Kubernetes Gestionado en Producción |
| Environment | Producción / DR |
| Type | Kubernetes gestionado (cloud) |
| Status | Proposed |
| Owner | Architecture Board |
| Version | 0.1.0 |
| Created / Updated | 2026-07-22 / 2026-07-22 |
| Applicable Products | DT, TMS, WMS, MMS, SIL, UMS, XMS |
| Decision Records | [ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md) · [ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md) · [ADR-0039](../../../adrs/core/0039-switcher-abstraccion-topologia-despliegue.es.md) · [ADR-0010](../../../adrs/core/0010-estrategia-arquitectura-multitenant.es.md) · [ADR-0014](../../../adrs/core/0014-estrategia-cache-distribuido-redis.es.md) · [ADR-0030](../../../adrs/core/0030-api-gateway-ingress-vs-nestjs.es.md) |
| Diagram | [deployment-diagram.md](./deployment-diagram.md) |

## 1. Arquitectura — resumen

**Dónde corre y para qué ambiente.** Esta alternativa despliega la suite en **producción y DR** sobre un clúster **AKS v1.28+** multi-zona, materializando el [Escenario 2 «Azure — Cumplimiento estricto»](../../../escenarios-despliegue-multinube.es.md#2-escenario-azure-cumplimiento-estricto-empresarial). No duplica ese escenario: lo consolida como topología de despliegue concreta y le añade el detalle de componentes, costos, operación y NFR exigido por el Hub de Deployment.

**Cómo se estructura.** El tráfico entra por **Azure Front Door (WAF v2)** como punto de ingreso global ([ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md) — entrada de red global), atraviesa **Application Gateway** para terminación TLS 1.3 y llega al **Kong Edge Gateway** ([ADR-0030](../../../adrs/core/0030-api-gateway-ingress-vs-nestjs.es.md)) desplegado como ingress dentro del clúster. Dentro de AKS corren, como pods, el **Frontend React**, los **BFF NestJS** (Web/Mobile), las **APIs de dominio**, los **workers** y los **jobs programados**. La mensajería asíncrona usa **RabbitMQ en el clúster** (patrón de referencia, [ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md)) o **Azure Service Bus** como adaptador gestionado alternativo. La persistencia relacional es **Azure Database for PostgreSQL Flexible Server** (perfil Node.js) o **Azure SQL Hyperscale con Always Encrypted** (perfil .NET / cumplimiento estricto). El caché es **Azure Cache for Redis** ([ADR-0014](../../../adrs/core/0014-estrategia-cache-distribuido-redis.es.md)) y el object storage se resuelve por **protocolo S3-API** (MinIO en clúster o Blob Storage tras adaptador compatible).

**Con qué invariantes.** El clúster es un objetivo más del **mismo Helm chart agnóstico al sabor** — el chart real de referencia `ums-helm` del satélite UMS (`unimar-ums/src/infra/ums-helm/`) que hoy corre en Kind debe correr sin bifurcación en AKS, cambiando solo `values` (registry real, `pullPolicy: IfNotPresent`, ingress, réplicas). La topología se selecciona con `DEPLOYMENT_TOPOLOGY=SAAS_CLOUD` en el arranque DI ([ADR-0039](../../../adrs/core/0039-switcher-abstraccion-topologia-despliegue.es.md)); ningún SDK de Azure cruza a Dominio/Aplicación: cada dependencia vive tras un Puerto ([ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md)). El aislamiento por sucursal se resuelve en aplicación, sin RLS ([ADR-0010](../../../adrs/core/0010-estrategia-arquitectura-multitenant.es.md)). La IaC de aprovisionamiento es **Bicep** (nativo Azure, alineado con el escenario), reservando Helm para la capa de workloads.

## 2. Diagrama de despliegue

Ver **[deployment-diagram.md](./deployment-diagram.md)** — Mermaid por capas: Internet/Usuarios → Edge/Security (Front Door + WAF v2 + App Gateway) → Application (Kong · Frontend · BFF · APIM opcional) → Service (APIs · Workers · Jobs en AKS) → Messaging (Service Bus / RabbitMQ) → Data (PostgreSQL/SQL · Redis · Blob/S3) → External Systems (satélites de la suite · Entra ID · SUNAT/OSE).

## 3. Componentes requeridos

Cada componente se ancla al [stack autorizado agnóstico §6](../../../stack-tecnologico-autorizado-agnostico.es.md); la columna «Servicio Azure» es el adaptador concreto elegido y **justificado** para esta topología.

| Componente | Servicio Azure (justificado) | Propósito | Alternativa / Puerto | Nota DR |
| :-- | :-- | :-- | :-- | :-- |
| Orquestación | **AKS v1.28+** (system + user node pools, Multi-AZ) | Ejecuta todos los pods; HPA y Cluster Autoscaler. Elegido porque es el K8s gestionado que corre el chart agnóstico sin recodificar. | EKS / RKE2 (mismo chart) | Clúster espejo en región secundaria warm-standby |
| Container Registry | **Azure Container Registry (ACR)** con geo-replicación | Imágenes OCI firmadas; escaneo con Microsoft Defender. Justificado por integración nativa AKS (managed identity, sin secretos de pull). | GHCR / Harbor | Geo-replicación a región DR |
| Base de datos | **Azure DB for PostgreSQL Flexible Server** (Node.js) · **Azure SQL Hyperscale + Always Encrypted** (.NET/estricto) | Persistencia relacional por esquema/contexto. PostgreSQL por el perfil de referencia Node.js; SQL Hyperscale cuando el cumplimiento exige cifrado hardware-backed ([escenario Azure](../../../escenarios-despliegue-multinube.es.md#22-implementación-de-seguridad)). | Postgres en clúster (Puerto) | Zone-redundant + réplica geo / auto-failover group |
| Messaging | **RabbitMQ en clúster** (referencia [ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md)) · **Azure Service Bus** (adaptador gestionado) | Bus AMQP / eventos CloudEvents con Transactional Outbox. RabbitMQ preserva portabilidad; Service Bus reduce operación si se acepta el adaptador. | Kafka (Puerto) | RabbitMQ mirrored queues / Service Bus geo-DR |
| Caché | **Azure Cache for Redis** (Premium, zona-redundante) | Caché multi-capa BFF y núcleo ([ADR-0014](../../../adrs/core/0014-estrategia-cache-distribuido-redis.es.md)) tras `ICachePort`. Gestionado para evitar operar Redis a escala. | Redis en clúster (Puerto) | Replicación geo activa (Premium) |
| Object Storage | **S3-API**: MinIO en AKS o **Blob Storage** tras adaptador compat-S3 | Documentos, branding, adjuntos. S3-API como protocolo de cable universal ([stack §4.3](../../../stack-tecnologico-autorizado-agnostico.es.md)); prohibido SDK propietario en dominio. | MinIO autohospedado | RA-GRS / réplica de bucket |
| Secretos | **Azure Key Vault** + **Secrets Store CSI / sidecar Vault** | Claves, cadenas de conexión, claves Always Encrypted. Inyección sidecar como único patrón ([stack §4.2](../../../stack-tecnologico-autorizado-agnostico.es.md)). Prohibido secreto en chart/Git. | HashiCorp Vault | Key Vault con backup + soft-delete |
| Identidad | **Microsoft Entra ID** (Workload Identity) + UMS como IdP de suite | Identidad de plataforma (managed identities de pods) y OIDC. UMS sigue siendo el proveedor de auth/authz nativo de la suite. | Keycloak (on-prem) | Entra ID es global; UMS replicado |
| Observabilidad | **OTel Collector → Azure Monitor / Log Analytics + Managed Grafana** | Logs JSON, métricas y trazas W3C ([stack §5](../../../stack-tecnologico-autorizado-agnostico.es.md)). OTel mantiene neutralidad; Azure Monitor es solo backend de despliegue. | Prometheus/Loki/Tempo en clúster | Workspace en ambas regiones |
| Networking | **VNet Hub-and-Spoke · subnets DMZ/App/Data · Private Link · Azure Policy** | Segmentación, tráfico privado a BD/Key Vault, restricción geográfica de región. | — | Peering inter-región |
| Seguridad de borde | **Azure Front Door + WAF v2 · Application Gateway (TLS 1.3)** | Ingreso global con health-probe y reroute inter-región ([ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md)); reglas WAF OWASP. | Cloudflare (CDN opcional [ADR-0014](../../../adrs/core/0014-estrategia-cache-distribuido-redis.es.md)) | Front Door es global anycast |

## 4. Requerimientos técnicos

- **Infraestructura:** node pools separados (system 3×, user autoscalable 3–N), tamaños de VM serie D/E; discos gestionados Premium SSD para datos con estado en clúster; ancho de banda saliente dominado por Front Door y réplica de BD.
- **Software:** AKS v1.28+, Helm v3 (chart `ums-helm` parametrizado), Docker/OCI distroless multi-stage, Bicep para IaC de infraestructura, GitOps opcional (Flux/Argo).
- **Seguridad:** Entra ID Workload Identity para pods; Key Vault + CSI/sidecar para secretos; TLS 1.3 en tránsito y AES-256 / Always Encrypted en reposo; WAF v2 OWASP; Private Link a BD/Vault; Azure Policy de restricción geográfica; mTLS al activar malla (Fase 3+). Autorización por sucursal en aplicación ([ADR-0010](../../../adrs/core/0010-estrategia-arquitectura-multitenant.es.md)).
- **Observabilidad:** OTel Collector como DaemonSet/Deployment; export a Azure Monitor + Managed Grafana; logs JSON estructurados; trazas correlacionadas W3C; alertas por SLO.
- **DevOps:** build local-first ([ADR-0106](../../../adrs/core/0106-seguridad-calidad-local-first.es.md)); imágenes a ACR; despliegue Helm; IaC Bicep versionada; puertas de release en husky, no CI de servidor.
- **Operación:** SRE de plataforma; backups gestionados de BD; DR warm-standby; runbooks de failover; gestión de incidentes con dashboards Grafana.

## 5. Escalabilidad y alta disponibilidad

- **Escalado:** **HPA** por CPU/memoria/métricas custom en APIs, BFF y workers; **Cluster Autoscaler** ajusta el user node pool; **KEDA** para workers dirigidos por profundidad de cola (Service Bus/RabbitMQ). Front Door absorbe picos de borde y sirve caché ([ADR-0014](../../../adrs/core/0014-estrategia-cache-distribuido-redis.es.md)).
- **Alta disponibilidad:** operación **activo-activo Multi-AZ** con región secundaria **warm-standby** ([ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md)). El costo activo-activo duplica infraestructura de cómputo (consecuencia declarada en el ADR).
- **Objetivos NFR** (contra [matriz NFR §Recuperación](../../../matriz-nfr-suite.es.md), a fijar por producto según criticidad C1–C4): sistemas C1 (DT, facturación, SUNAT/OSE) con disponibilidad 24/7, RTO/RPO obligatorios y probados antes de producción; Front Door + BD zone-redundant + réplica geo habilitan RPO bajo y RTO de minutos en pivot regional. Los valores numéricos finales se declaran en el PRD de cada producto.

## 6. Estimated Infrastructure Cost

> Estimación en **RANGOS**, no precios exactos. **Región:** Brazil South / East US como primaria + región secundaria warm-standby (la UE `westeurope`/`northeurope` aplica solo si el cumplimiento de soberanía lo exige, como en el escenario Azure estricto). **Supuestos:** ~1–3k usuarios concurrentes internos + integradores; ~5–20M requests/mes; storage 0.5–5 TB relacional + objetos; 7 sistemas de la suite; ambientes Producción + DR (Staging/QA se costean aparte). Variables que mueven el rango: activo-activo vs activo-pasivo (duplica cómputo), SKU de BD (Flexible vs Hyperscale), Redis Premium geo, tráfico saliente y retención de logs.

| Concepto | Estimación |
| :-- | :-- |
| Costo mensual estimado | Rango **medio-alto** (USD miles–decenas de miles/mes). Impulsores: node pools AKS, BD gestionada zone-redundant, Redis Premium, Front Door/WAF, egress y Log Analytics. |
| Costo anual estimado | 12× el mensual; el activo-activo Multi-región eleva el extremo superior por duplicación de cómputo y réplica de datos. |
| Costo de implementación inicial | Rango **medio**: IaC Bicep, landing zone, hardening de red/WAF, cableado de OTel y pruebas de DR. |
| Costo operativo estimado | Rango **medio**: SRE de plataforma reducido frente a on-prem (AKS/BD/Redis gestionados), pero mayor que serverless por operar el clúster. |

Comparación completa de costo/complejidad/escala/operación en la [matriz de opciones](../../comparison/deployment-options-matrix.md).

## 7. Operación, monitoreo, seguridad, recuperación

- **Quién la opera:** equipo de plataforma/SRE de UNIMAR sobre servicios gestionados; el proveedor cubre parcheo de control-plane, BD, Redis y ACR.
- **Monitoreo:** dashboards de Managed Grafana alimentados por OTel→Azure Monitor; SLO/alertas por servicio; trazas W3C correlacionadas extremo a extremo.
- **Seguridad:** WAF v2 + Front Door en el borde; Private Link a datos; Key Vault + sidecar para secretos (nunca en Git); Always Encrypted protege frente al DBA en el perfil estricto ([escenario Azure §2.2](../../../escenarios-despliegue-multinube.es.md#22-implementación-de-seguridad)); Azure Policy fija soberanía de región.
- **Recuperación:** backups gestionados con PITR de BD; RA-GRS/geo en storage y Redis Premium; **warm-standby** en región secundaria con failover orquestado por Front Door ([ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md)); runbooks de failover y dry-run de restore como evidencia de gate ([matriz NFR §Recuperación](../../../matriz-nfr-suite.es.md)).

## 8. Cuándo usar / Ventajas y desventajas

**Cuándo conviene:** producción para sistemas C1–C2 con requisitos de disponibilidad 24/7, cumplimiento estricto (RGPD/ISO 27001) y necesidad de portabilidad de charts; cuando existe equipo de plataforma capaz de operar Kubernetes y se prioriza control fino sobre elasticidad extrema.

| Ventajas | Desventajas |
| :-- | :-- |
| Mismo Helm chart agnóstico que corre local/Kind/otras nubes ([ADR-0039](../../../adrs/core/0039-switcher-abstraccion-topologia-despliegue.es.md)) | Operar un clúster K8s exige SRE con madurez; mayor superficie que serverless |
| Cumplimiento «out-of-the-box» (WAF, Private Link, Always Encrypted, Policy de región) | Activo-activo Multi-AZ duplica costo de cómputo ([ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md)) |
| Control fino de scheduling, HPA/KEDA, redes y sidecars | Adaptadores gestionados (Service Bus, Cache) añaden acoplamiento si se usan en vez de los OSS de referencia |
| Portabilidad preservada: cada servicio Azure vive tras un Puerto ([ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md)) | IaC Bicep es específica de Azure (la portabilidad se preserva en app, no en la IaC) |

## 9. Relación con el SDLC de UNIMAR-ARCH

Aplica en la **Fase 5 — Entrega y Operaciones** y solo para sistemas en **Fase arquitectónica 3+** (Kubernetes se adopta cuando el desacoplamiento de servicios lo justifica, no antes — [ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md), [stack §6](../../../stack-tecnologico-autorizado-agnostico.es.md)). Gobiernan: ADR-0013, ADR-0028, ADR-0039, ADR-0010, ADR-0014, ADR-0030. La adopción por producto se registra en el `DECISIONS.md` del satélite (o del core si es transversal) y todo hallazgo en `GAPS.md`, conforme al [Hub §11](../../hub/deployment-architecture-hub.md). Estado **Proposed** hasta contar con ADR de adopción aceptado y un despliegue verificado.

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-07-22
</p>
