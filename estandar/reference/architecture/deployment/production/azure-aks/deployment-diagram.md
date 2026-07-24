# Azure AKS — Diagrama de Despliegue

<p align="right">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Deployment_Diagram-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Proposed-f39c12?style=flat-square" alt="Estado">
</p>

**← [Volver a Azure AKS](./README.md)** · [Deployment Hub](../../hub/deployment-architecture-hub.md)

> Diagrama **Mermaid por capas** (Internet → Edge/Security → Application → Service → Messaging → Data → External Systems), conforme a la [convención del Hub §5](../../hub/deployment-architecture-hub.md#5-convención-de-diagramas-de-despliegue). Consolida el [Escenario Azure de cumplimiento estricto](../../../escenarios-despliegue-multinube.es.md#2-escenario-azure-cumplimiento-estricto-empresarial).

## Vista por capas

```mermaid
graph TD
    subgraph Internet["Internet / Usuarios"]
        U["Usuarios Web / Mobile · Integradores externos"]
    end

    subgraph Edge["Edge / Security — global"]
        AFD["Azure Front Door + WAF v2\n(ingreso global · health-probe · reroute inter-región)"]
        AGW["Application Gateway\n(TLS 1.3 termination)"]
    end

    subgraph App["Application Layer — AKS (Multi-AZ)"]
        KONG["Kong Edge Gateway (ingress)\nSSL · rate-limit · JWT · WAF rules"]
        FE["Frontend React (pods)"]
        BFFW["NestJS Web BFF (pods)"]
        BFFM["NestJS Mobile BFF (pods)"]
        APIM["API Management (opcional)"]
    end

    subgraph Svc["Service Layer — AKS user node pool"]
        API["APIs de dominio (pods · HPA)"]
        WRK["Workers (KEDA · profundidad de cola)"]
        JOB["Jobs programados / background (CronJob)"]
    end

    subgraph Msg["Messaging"]
        RMQ["RabbitMQ en clúster (referencia)\n/ Azure Service Bus (adaptador)"]
        EVT["Event Grid (eventos de plataforma)"]
    end

    subgraph Data["Data Layer"]
        PG["Azure DB for PostgreSQL Flexible\n/ Azure SQL Hyperscale (Always Encrypted)"]
        REDIS["Azure Cache for Redis (Premium, zona-redundante)"]
        BLOB["S3-API: MinIO en AKS / Blob Storage (compat)"]
        KV["Azure Key Vault (secretos · claves)"]
    end

    subgraph Ext["External Systems"]
        SUITE["Satélites suite: MMS · UMS · XMS · DT · TMS · WMS · SIL"]
        ENTRA["Microsoft Entra ID (Workload Identity)"]
        UMS["UMS — IdP nativo de la suite (OIDC)"]
        SUNAT["SUNAT / OSE"]
    end

    subgraph Obs["Observabilidad / IaC"]
        OTEL["OTel Collector → Azure Monitor + Managed Grafana"]
        ACR["Azure Container Registry (geo-replicado)"]
        BICEP["IaC Bicep · Helm ums-helm"]
    end

    U -->|HTTPS| AFD --> AGW --> KONG
    KONG --> FE
    KONG --> BFFW
    KONG --> BFFM
    KONG --> APIM
    BFFW --> API
    BFFM --> API
    APIM --> API
    API --> WRK
    API --> JOB
    API -->|AMQP / CloudEvents| RMQ
    WRK --> RMQ
    RMQ --> EVT
    API -->|Private Link| PG
    API -->|ICachePort| REDIS
    API -->|S3-API| BLOB
    API -.->|CSI / sidecar| KV
    API --> SUITE
    API -.-> UMS
    KONG -.-> ENTRA
    SUITE --> SUNAT
    API -.-> OTEL
    ACR -.-> API
    BICEP -.-> API
```

## Notas del diagrama

- **Ingreso global** por Azure Front Door + WAF v2 con reroute inter-región ([ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md)).
- **Dos capas de gateway**: Kong Edge (no funcional) + BFF NestJS (composición) según [ADR-0030](../../../adrs/core/0030-api-gateway-ingress-vs-nestjs.es.md).
- **Tráfico privado** a BD y Key Vault vía Private Link; secretos por sidecar/CSI, nunca en Git ([stack §5.2](../../../stack-tecnologico-autorizado-agnostico.es.md)).
- **Caché multi-capa** (borde CDN opcional · BFF · núcleo) tras `ICachePort` ([ADR-0014](../../../adrs/core/0014-estrategia-cache-distribuido-redis.es.md)).
- **Portabilidad**: cada recurso Azure (línea punteada a servicios gestionados) se consume tras un Puerto ([ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md)); el mismo chart corre en Kind/EKS/RKE2.

---

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-07-22
</p>
