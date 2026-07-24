# Azure Serverless — Diagrama de Despliegue

<p align="right">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Deployment_Diagram-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Proposed-f39c12?style=flat-square" alt="Estado">
</p>

**← [Volver a Azure Serverless](./README.md)** · [Deployment Hub](../../hub/deployment-architecture-hub.md)

> Diagrama **Mermaid por capas** (Internet → Edge/Security → Application → Service → Messaging → Data → External Systems), conforme a la [convención del Hub §5](../../hub/deployment-architecture-hub.md#5-convención-de-diagramas-de-despliegue). Modelo serverless seleccionado por tipo de workload: **contenedores en Container Apps** para lo de larga vida, **Functions** solo para eventos/timers.

## Vista por capas

```mermaid
graph TD
    subgraph Internet["Internet / Usuarios"]
        U["Usuarios Web / Mobile · Integradores externos"]
    end

    subgraph Edge["Edge / Security — global"]
        AFD["Azure Front Door + WAF v2\n(ingreso global · reroute inter-región)"]
        APIM["API Management (gateway gestionado)\n+ Kong (Container App, opcional)"]
    end

    subgraph App["Application Layer"]
        SWA["Static Web Apps / App Service\n(Frontend React)"]
        BFFW["NestJS Web BFF — Container App"]
        BFFM["NestJS Mobile BFF — Container App"]
    end

    subgraph Svc["Service Layer"]
        API["APIs de dominio — Container Apps (escala a cero)"]
        WRK["Workers — Container Apps + KEDA (cola)"]
        FEVT["Handlers event-driven — Azure Functions"]
        FTIM["Jobs programados — Functions Timer / Container Apps Jobs"]
    end

    subgraph Msg["Messaging"]
        SB["Azure Service Bus (AMQP · comandos/eventos + Outbox)"]
        EG["Event Grid (pub/sub de plataforma)"]
    end

    subgraph Data["Data Layer"]
        PG["Azure DB for PostgreSQL / Azure SQL\n(Cosmos DB solo agregados de alta escala)"]
        REDIS["Azure Cache for Redis"]
        BLOB["Blob Storage tras adaptador S3-API / MinIO"]
        KV["Azure Key Vault"]
    end

    subgraph Ext["External Systems"]
        SUITE["Satélites suite: MMS · UMS · XMS · DT · TMS · WMS · SIL"]
        ENTRA["Microsoft Entra ID (Managed Identity)"]
        UMS["UMS — IdP nativo de la suite (OIDC)"]
        SUNAT["SUNAT / OSE"]
    end

    subgraph Obs["Observabilidad / IaC"]
        OTEL["OTel → Application Insights + Azure Monitor"]
        ACR["Azure Container Registry"]
        BICEP["IaC Bicep · azd"]
    end

    U -->|HTTPS| AFD --> APIM
    APIM --> SWA
    APIM --> BFFW
    APIM --> BFFM
    BFFW --> API
    BFFM --> API
    API --> WRK
    API -->|AMQP| SB
    WRK --> SB
    SB --> FEVT
    EG --> FEVT
    FTIM --> API
    API -->|Private Endpoint| PG
    API -->|ICachePort| REDIS
    API -->|S3-API| BLOB
    API -.->|CSI / referencia| KV
    API --> SUITE
    API -.-> UMS
    APIM -.-> ENTRA
    SUITE --> SUNAT
    API -.-> OTEL
    FEVT -.-> OTEL
    ACR -.-> API
    BICEP -.-> API
```

## Notas del diagrama

- **Contenedor vs función**: BFF, APIs, workers y Kong son **contenedores en Container Apps** (reúso del artefacto `ums-helm`, paridad con AKS); solo los **handlers de eventos** (Service Bus/Event Grid) y **timers** son **Azure Functions**.
- **Escala a cero** en Container Apps y Functions; KEDA para workers por profundidad de cola.
- **Ingreso** por Front Door + WAF v2 ([ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md)) y APIM como gateway gestionado; Kong como Container App si se exige el patrón de dos capas ([ADR-0030](../../../adrs/core/0030-api-gateway-ingress-vs-nestjs.es.md)).
- **Portabilidad**: Service Bus, Cosmos, Blob y Key Vault (líneas punteadas) se consumen tras Puertos ([ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md)); `DEPLOYMENT_TOPOLOGY=SAAS_CLOUD` ([ADR-0039](../../../adrs/core/0039-switcher-abstraccion-topologia-despliegue.es.md)).
- **Cold start**: mitigar con réplicas mínimas / Always Ready en rutas C1 sensibles a p95.

---

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-07-22
</p>
