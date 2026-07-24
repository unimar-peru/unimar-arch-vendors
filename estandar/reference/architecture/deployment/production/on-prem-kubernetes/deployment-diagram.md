# Diagrama de despliegue — Producción On-Premise con Kubernetes

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Deployment-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Proposed-f39c12?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-1.0.0-042139?style=flat-square" alt="Versión">
</p>

**← [Inicio](../../../../../../README.md) / [Hub de Arquitectura](../../../README.md) / [Deployment Hub](../../hub/deployment-architecture-hub.md) / [On-Premise K8s](./README.md) / Diagrama**

> Diagrama **Mermaid por capas** del despliegue On-Premise con RKE2, según la [convención del Hub §5](../../hub/deployment-architecture-hub.md#5-convención-de-diagramas-de-despliegue): Usuarios/Red corporativa → Edge/Security → Application → Service → Messaging → Data → External Systems, con observabilidad transversal y Sitio DR físico.

---

## 1. Vista por capas — Sitio Primario

```mermaid
flowchart TB
    subgraph Users["Usuarios / Red corporativa"]
        U["Usuarios internos<br/>Sucursales UNIMAR"]
        VPN["VPN site-to-site"]
    end

    subgraph Edge["Edge / Security (DMZ)"]
        NGFW["Firewall NGFW"]
        LB["Load Balancer<br/>MetalLB + HAProxy (VIP)"]
        ING["Ingress-NGINX<br/>Terminación TLS 1.3"]
    end

    subgraph App["Application Layer — RKE2"]
        CP["Control Plane x3<br/>etcd (quórum) + API-server (VIP)"]
        FE["Frontend Web / BFF<br/>(pods, HPA)"]
        GW["API Gateway"]
    end

    subgraph Svc["Service Layer — RKE2 (Worker Nodes)"]
        SVC["Servicios de dominio<br/>DT · TMS · WMS · MMS · SIL · UMS · XMS"]
        WRK["Workers / Jobs programados"]
    end

    subgraph Msg["Messaging"]
        RMQ["RabbitMQ<br/>cluster + quorum queues"]
    end

    subgraph Data["Data Layer"]
        PG["PostgreSQL v16<br/>Patroni / etcd (bare metal)"]
        SQL["SQL Server<br/>Always On AG"]
        MDB["MongoDB<br/>replica set"]
        REDIS["Redis<br/>Sentinel"]
        MINIO["MinIO (S3-API)<br/>Object Storage"]
        STOR["Storage replicado<br/>Longhorn / Ceph / NFS"]
    end

    subgraph Sec["Secretos e Identidad"]
        VAULT["HashiCorp Vault<br/>(sidecar injection)"]
        IDP["UMS / Keycloak (OIDC)"]
    end

    subgraph Ext["External Systems"]
        CORP["Sistemas corporativos<br/>ERP · SUNAT/OSE · SMTP"]
        DR["Sitio DR físico<br/>warm-standby"]
    end

    subgraph Obs["Observabilidad (transversal)"]
        OTEL["OpenTelemetry Collector"]
        PROM["Prometheus"]
        GRAF["Grafana"]
        LOKI["Loki"]
        TEMPO["Tempo"]
    end

    subgraph Bkp["Backup"]
        VELERO["Velero (clúster/PV)"]
        VEEAM["Veeam (VM/BD, inmutable 3-2-1)"]
    end

    U --> NGFW
    VPN --> NGFW
    NGFW --> LB --> ING
    ING --> GW --> FE
    FE --> SVC
    CP -.gestiona.- SVC
    SVC --> WRK
    SVC --> RMQ
    WRK --> RMQ
    SVC --> PG
    SVC --> SQL
    SVC --> MDB
    SVC --> REDIS
    SVC --> MINIO
    PG --- STOR
    MDB --- STOR
    MINIO --- STOR
    SVC -.secretos.-> VAULT
    SVC -.authn/z.-> IDP
    SVC --> CORP
    SVC -.telemetría.-> OTEL
    OTEL --> PROM --> GRAF
    OTEL --> LOKI --> GRAF
    OTEL --> TEMPO --> GRAF
    STOR --> VELERO
    PG --> VEEAM
    SQL --> VEEAM
    MINIO --> VEEAM
    PG -.streaming async.-> DR
    SQL -.async.-> DR
    MINIO -.replicación.-> DR
    VEEAM -.copia off-site.-> DR
```

## 2. Vista de doble sitio — Primario y DR

```mermaid
flowchart LR
    subgraph SiteA["Sitio Primario (activo)"]
        A_LB["LB + Ingress"]
        A_K8S["Clúster RKE2<br/>3 control plane + 4-6 workers"]
        A_DATA["Data tier<br/>PG/SQL/Mongo/Redis/MinIO"]
    end

    subgraph Link["Enlace inter-sitio"]
        WAN["Enlace dedicado ≥ 1 GbE<br/>replicación asíncrona"]
    end

    subgraph SiteB["Sitio DR (warm-standby)"]
        B_LB["LB + Ingress"]
        B_K8S["Clúster RKE2<br/>~50-70% capacidad"]
        B_DATA["Réplicas standby<br/>PG/SQL/Mongo/MinIO"]
    end

    A_DATA --> WAN --> B_DATA
    A_K8S -.manifiestos idénticos.- B_K8S
    A_LB -.failover DNS/VIP.- B_LB
```

## 3. Leyenda de capas

| Capa | Componentes | Referencia |
| :-- | :-- | :-- |
| Usuarios / Red corporativa | Usuarios internos, VPN site-to-site | [Escenario 4](../../../escenarios-despliegue-multinube.es.md#4-escenario-on-premise-control-total-y-soberanía-extrema) |
| Edge / Security | NGFW, MetalLB+HAProxy, Ingress (TLS 1.3) | [ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md) |
| Application | Control plane (etcd/API-server), Frontend/BFF, API Gateway | [ADR-0039](../../../adrs/core/0039-switcher-abstraccion-topologia-despliegue.es.md) |
| Service | Servicios de dominio (7 sistemas), Workers/Jobs | [stack §7](../../../stack-tecnologico-autorizado-agnostico.es.md) |
| Messaging | RabbitMQ (quorum queues) | [ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md) |
| Data | PostgreSQL/Patroni, SQL Server, MongoDB, Redis, MinIO, Storage replicado | [ADR-0051](../../../adrs/core/0051-estrategia-motor-base-datos-empresarial.es.md) |
| Secretos / Identidad | Vault (sidecar), UMS/Keycloak (OIDC) | [ADR-0010](../../../adrs/core/0010-estrategia-arquitectura-multitenant.es.md) |
| Observabilidad | OpenTelemetry, Prometheus, Grafana, Loki, Tempo | [stack §6](../../../stack-tecnologico-autorizado-agnostico.es.md) |
| Backup / DR | Velero, Veeam (3-2-1 inmutable), Sitio DR físico | [ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md) |

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-07-22
</p>
</content>
