<!--
Alternativa de despliegue — Deployment Architecture Hub
Grupo: production · Alternativa: azure-serverless
Diagrama hermano: deployment-diagram.md
-->

# Azure Serverless — Producción Elástica (Container Apps + Functions)

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Deployment-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Proposed-f39c12?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-1.0.0-042139?style=flat-square" alt="Versión">
</p>

**← [Inicio](../../../../../../README.md) / [Hub de Arquitectura](../../../README.md) / [Deployment Hub](../../hub/deployment-architecture-hub.md) / Azure Serverless**

> **Meta:** desplegar la suite en producción elástica y de pago por uso sobre **Azure serverless**, seleccionando el modelo adecuado por tipo de workload — **Azure Container Apps** para reusar los MISMOS contenedores, **Azure Functions** para lo event-driven/programado — sin asumir que «todo es Functions».
> **Owner:** Architecture Board · **Fase SDLC:** 5 — Entrega y Operaciones · **Última revisión:** 2026-07-22

---

## Metadatos de gobierno

| Campo | Valor |
| :-- | :-- |
| Architecture ID | `DEPLOY-AZ-SLS` |
| Architecture Name | Azure Serverless — Producción Elástica (Container Apps + Functions) |
| Environment | Producción elástica / DR |
| Type | Serverless / PaaS |
| Status | Proposed |
| Owner | Architecture Board |
| Version | 1.0.0 |
| Created / Updated | 2026-07-22 / 2026-07-22 |
| Applicable Products | DT, TMS, WMS, MMS, SIL, UMS, XMS |
| Decision Records | [ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md) · [ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md) · [ADR-0039](../../../adrs/core/0039-switcher-abstraccion-topologia-despliegue.es.md) · [ADR-0010](../../../adrs/core/0010-estrategia-arquitectura-multitenant.es.md) · [ADR-0014](../../../adrs/core/0014-estrategia-cache-distribuido-redis.es.md) · [ADR-0030](../../../adrs/core/0030-api-gateway-ingress-vs-nestjs.es.md) |
| Diagram | [deployment-diagram.md](./deployment-diagram.md) |

## 1. Arquitectura — resumen

**Dónde corre y para qué ambiente.** Producción **elástica de pago por uso** para sistemas con carga variable o event-driven, y para productos que aún no justifican operar un clúster K8s completo (Fase < 3). Es la contraparte serverless del [Escenario Azure](../../../escenarios-despliegue-multinube.es.md#2-escenario-azure-cumplimiento-estricto-empresarial): mismo borde (Front Door + WAF v2) y misma disciplina de Puertos, pero el cómputo se resuelve con PaaS/serverless en lugar de AKS.

**Selección de modelo serverless por workload — decisión explícita.** No todo es Azure Functions. La regla es: **reusar el MISMO contenedor OCI siempre que el workload sea de larga vida o exija paridad con AKS**, y usar **funciones puras solo para disparadores event-driven/programados**.

| Tipo de workload | Modelo Azure elegido | Justificación |
| :-- | :-- | :-- |
| Frontend Web (React) | **Azure Static Web Apps** o **App Service** | SPA estática servida en el borde; App Service si necesita SSR/Node de larga vida. |
| BFF NestJS (Web/Mobile) | **Azure Container Apps** | Proceso de larga vida con event-loop; **el MISMO contenedor** del chart `ums-helm`, escala a-la-demanda y a cero. No encaja en función pura por su naturaleza HTTP persistente. |
| APIs de dominio | **Azure Container Apps** | Contenedores de servicio de larga vida; paridad total con AKS (mismo binario, [ADR-0039](../../../adrs/core/0039-switcher-abstraccion-topologia-despliegue.es.md)). Escala por HTTP/CPU y a cero en valles. |
| API Gateway / Kong | **API Management** (borde) + Kong como Container App | APIM cubre lo no funcional gestionado; si se exige Kong ([ADR-0030](../../../adrs/core/0030-api-gateway-ingress-vs-nestjs.es.md)) corre como Container App. |
| Workers dirigidos por cola | **Container Apps con escalador KEDA** | Contenedor de worker que escala por profundidad de cola Service Bus; reusa el mismo binario. |
| Handlers event-driven | **Azure Functions** (trigger Service Bus / Event Grid / Blob) | **Función pura**: reacción efímera a un evento; sin estado, sin proceso persistente. Aquí sí conviene Functions. |
| Jobs programados | **Azure Functions (Timer)** o **Container Apps Jobs** | Timer trigger para tareas cortas; Container Apps Job cuando la tarea reusa el contenedor de dominio. |

**Qué queda como contenedor vs función pura.** Frontend, BFF, APIs, gateway Kong y workers de cola quedan como **contenedores en Container Apps** (reutilización directa del artefacto de `ums-helm`, portabilidad y paridad con AKS). Solo los **disparadores event-driven y los timers cortos** quedan como **Azure Functions**. Así se evita reescribir el dominio a un modelo de función y se preserva la regla de «un binario, muchas topologías» ([ADR-0039](../../../adrs/core/0039-switcher-abstraccion-topologia-despliegue.es.md)).

**Con qué invariantes.** `DEPLOYMENT_TOPOLOGY=SAAS_CLOUD`; ningún SDK de Azure en Dominio/Aplicación — Service Bus, Cosmos, Blob y Key Vault viven tras Puertos ([ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md)); aislamiento por sucursal en aplicación ([ADR-0010](../../../adrs/core/0010-estrategia-arquitectura-multitenant.es.md)). IaC en **Bicep**.

## 2. Diagrama de despliegue

Ver **[deployment-diagram.md](./deployment-diagram.md)** — Mermaid por capas: Internet → Front Door/CDN + WAF → App Service/Static Web Apps + APIM → Container Apps (BFF · APIs · Workers) + Functions (eventos/timers) → Service Bus + Event Grid → Azure Database/Cosmos + Cache + Blob → External Systems.

## 3. Componentes requeridos

Anclado al [stack autorizado agnóstico §7](../../../stack-tecnologico-autorizado-agnostico.es.md); la columna «Servicio Azure» es el adaptador serverless justificado.

| Componente | Servicio Azure (justificado) | Propósito | Alternativa / Puerto | Nota DR |
| :-- | :-- | :-- | :-- | :-- |
| Cómputo de larga vida | **Azure Container Apps** (Dapr opcional, KEDA) | BFF, APIs, workers y Kong como contenedores serverless; escala a cero. Elegido para **reusar el mismo contenedor OCI** sin reescribir a función. | AKS (mismo chart) | Container Apps en 2ª región |
| Cómputo event-driven | **Azure Functions** (Consumption/Flex) | Handlers de eventos y timers cortos; pago por invocación. Solo para lo efímero sin estado. | Worker en Container Apps | Functions en 2ª región |
| Frontend | **Static Web Apps** / **App Service** | SPA React en el borde; App Service si requiere Node SSR de larga vida. | Blob + Front Door | Global / geo |
| Gateway | **API Management** + Kong (Container App opcional) | Ingreso gestionado no funcional (rate-limit, JWT, WAF); Kong si se exige el patrón de dos capas ([ADR-0030](../../../adrs/core/0030-api-gateway-ingress-vs-nestjs.es.md)). | Kong OSS | APIM multi-región |
| Base de datos | **Azure DB for PostgreSQL Flexible** · **Azure SQL** · **Cosmos DB** (cuando corresponda) | Relacional por esquema/contexto ([stack §4.1](../../../stack-tecnologico-autorizado-agnostico.es.md)). Cosmos **solo** para agregados de alta escala/documentales tras Puerto, no como default. | Postgres en clúster (Puerto) | Zone-redundant + geo-réplica |
| Messaging | **Azure Service Bus** (AMQP) + **Event Grid** | Bus de comandos/eventos con Outbox; Event Grid para pub/sub de plataforma. Adaptador tras `IBusPort`. | RabbitMQ (Puerto) | Service Bus geo-DR |
| Caché | **Azure Cache for Redis** | Caché multi-capa BFF/núcleo ([ADR-0014](../../../adrs/core/0014-estrategia-cache-distribuido-redis.es.md)) tras `ICachePort`. | Redis en clúster (Puerto) | Premium geo |
| Object Storage | **Blob Storage** tras adaptador **S3-API** / MinIO | Documentos y adjuntos vía protocolo S3 ([stack §4.3](../../../stack-tecnologico-autorizado-agnostico.es.md)). | MinIO | RA-GRS |
| Secretos | **Azure Key Vault** + referencias/CSI | Secretos y cadenas de conexión; inyección gestionada, nunca en Git ([stack §5.2](../../../stack-tecnologico-autorizado-agnostico.es.md)). | Vault | Backup + soft-delete |
| Identidad | **Microsoft Entra ID** (Managed Identity) + UMS IdP de suite | Identidad de plataforma y OIDC; UMS sigue siendo el proveedor auth/authz nativo. | Keycloak | Global |
| Observabilidad | **OTel → Application Insights** (+ Azure Monitor) | Logs JSON, métricas y trazas W3C ([stack §6](../../../stack-tecnologico-autorizado-agnostico.es.md)); OTel mantiene neutralidad. | Prometheus/Loki | Workspace por región |
| Seguridad de borde | **Azure Front Door + WAF v2** | Ingreso global, reroute inter-región ([ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md)), WAF OWASP. | Cloudflare (CDN opcional) | Anycast global |

## 4. Requerimientos técnicos

- **Infraestructura:** sin nodos que gestionar; capacidad = concurrencia/CPU por réplica en Container Apps y plan de consumo en Functions; storage de BD/objetos según retención.
- **Software:** contenedores OCI distroless (mismos artefactos de `ums-helm`), Azure Functions runtime para handlers, Bicep para IaC, `azd`/CLI para despliegue.
- **Seguridad:** Entra ID Managed Identity; Key Vault + CSI; TLS 1.3 y AES-256 en reposo; WAF v2; Private Endpoints a BD/Vault/Service Bus; autorización por sucursal en aplicación ([ADR-0010](../../../adrs/core/0010-estrategia-arquitectura-multitenant.es.md)).
- **Observabilidad:** OTel → Application Insights; logs JSON estructurados; trazas correlacionadas; alertas por SLO; atención a **cold starts** como señal.
- **DevOps:** build local-first ([ADR-0106](../../../adrs/core/0106-seguridad-calidad-local-first.es.md)); imágenes a ACR; despliegue de Container Apps/Functions vía Bicep/azd; puertas en husky.
- **Operación:** operación **mínima** (sin clúster que mantener); backups gestionados; DR por replicación de servicios PaaS.

## 5. Escalabilidad y alta disponibilidad

- **Escalado:** **escala a cero** y ráfaga automática — Container Apps escala por HTTP/CPU/**KEDA** (profundidad de cola), Functions por eventos/invocaciones. Ideal para carga event-driven y picos impredecibles (arquetipo serverless). El caché de borde absorbe lecturas ([ADR-0014](../../../adrs/core/0014-estrategia-cache-distribuido-redis.es.md)).
- **Alta disponibilidad:** zona-redundancia nativa de los servicios PaaS; para DR, **réplica en región secundaria** con Front Door como reroute ([ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md)). El pago por uso reduce el costo del warm-standby frente a AKS activo-activo.
- **Objetivos NFR** ([matriz NFR §Recuperación](../../../matriz-nfr-suite.es.md)): apto para C2–C3 y para C1 con carga variable siempre que el **cold start** no viole la latencia p95 de la ruta crítica; los umbrales numéricos se fijan por producto. Riesgo de latencia en arranque en frío a mitigar con **réplicas mínimas / Always Ready** en flujos C1.

## 6. Estimated Infrastructure Cost

> Estimación en **RANGOS**, no precios exactos. **Región:** Brazil South / East US primaria (+ región secundaria para DR). **Supuestos:** carga **variable** con valles marcados; ~1–3k usuarios; ~5–20M requests/mes con picos; storage 0.5–5 TB; 7 sistemas; ambientes Producción + DR. Variables que mueven el rango: perfil de tráfico (a mayor base sostenida, más se acerca al costo de AKS y menos conviene serverless), réplicas mínimas para mitigar cold start, SKU de BD/Redis, invocaciones de Functions y egress.

| Concepto | Estimación |
| :-- | :-- |
| Costo mensual estimado | Rango **variable / pago por uso**: bajo en valles (escala a cero), sube con el tráfico. Con carga sostenida alta puede igualar o superar a AKS. |
| Costo anual estimado | Fuertemente dependiente del perfil de uso; el extremo inferior es notablemente menor que AKS en cargas intermitentes. |
| Costo de implementación inicial | Rango **bajo-medio**: menos hardening de clúster; foco en Bicep, APIM, WAF y cableado de eventos. |
| Costo operativo estimado | Rango **bajo**: sin operar Kubernetes; el proveedor gestiona escalado, parcheo y disponibilidad. |

Comparación completa en la [matriz de opciones](../../comparison/deployment-options-matrix.md).

## 7. Operación, monitoreo, seguridad, recuperación

- **Quién la opera:** operación reducida; sin clúster que mantener. El proveedor cubre escalado, parcheo y disponibilidad de Container Apps/Functions/BD.
- **Monitoreo:** Application Insights + Azure Monitor alimentados por OTel; alertas por SLO; vigilancia específica de **cold starts** y saturación de concurrencia.
- **Seguridad:** WAF v2 + Front Door; Private Endpoints a datos; Key Vault + CSI/referencias; autorización por sucursal en aplicación ([ADR-0010](../../../adrs/core/0010-estrategia-arquitectura-multitenant.es.md)); cifrado TLS 1.3 / AES-256.
- **Recuperación:** backups gestionados con PITR; geo-réplica de BD/storage/Redis; DR por replicación de servicios PaaS y reroute de Front Door ([ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md)); dry-run de restore como evidencia de gate.

## 8. Cuándo usar / Ventajas y desventajas

**Cuándo conviene:** cargas **variables o event-driven** con valles marcados; productos en Fase < 3 que no justifican operar K8s; equipos que priorizan time-to-market y operación mínima; escenarios donde el pago por uso reduce el costo del DR.

| Ventajas | Desventajas |
| :-- | :-- |
| **Escala a cero** y pago por uso: barato en cargas intermitentes | **Cold start** puede violar p95 de rutas C1 sin réplicas mínimas |
| Operación mínima: sin clúster que mantener | Menor control fino de scheduling/red que AKS |
| **Reúsa el mismo contenedor** en Container Apps ([ADR-0039](../../../adrs/core/0039-switcher-abstraccion-topologia-despliegue.es.md)) | Bajo carga sostenida alta el costo puede igualar o superar a AKS |
| Portabilidad preservada: cada servicio tras un Puerto ([ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md)) | Adaptadores gestionados (Service Bus, Cosmos) añaden acoplamiento si sustituyen a los OSS de referencia |

## 9. Relación con el SDLC de UNIMAR-ARCH

Aplica en la **Fase 5 — Entrega y Operaciones**, especialmente para sistemas en **Fase < 3** o de carga variable donde Kubernetes sería prematuro ([principio de orquestación progresiva, Hub §3](../../hub/deployment-architecture-hub.md#3-principios-de-despliegue)). Gobiernan: ADR-0013, ADR-0028, ADR-0039, ADR-0010, ADR-0014, ADR-0030. La adopción por producto se registra en `DECISIONS.md` y los hallazgos en `GAPS.md`. Estado **Proposed** hasta ADR de adopción aceptado y despliegue verificado. La migración a [Azure AKS](../azure-aks/README.md) es directa cuando la carga se estabiliza, por reutilizar el mismo contenedor.

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-07-22
</p>
