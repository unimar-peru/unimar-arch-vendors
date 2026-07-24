# Diagrama de despliegue — Docker (Compose local)

**← [Volver a Docker](./README.md)** · [Deployment Hub](../../hub/deployment-architecture-hub.md)

> Topología de la suite en la estación del desarrollador con Docker Compose. Basado en el Compose canónico de UMS (`src/infra/local/compose/docker-compose.yml`): red *bridge* `ums-network`, una réplica por servicio, puertos publicados a `localhost`.

## Diagrama por capas

```mermaid
flowchart TB
    subgraph Internet["Internet / Usuarios"]
        DEV["Desarrollador<br/>navegador · IDE · curl"]
    end

    subgraph Edge["Edge / Security — host local"]
        PORTS["Puertos publicados a localhost<br/>:5173 web · :5293 api · :3000 grafana<br/>(sin WAF · sin TLS · HTTP)"]
    end

    subgraph App["Application Layer — red bridge ums-network"]
        WEB["ums-web<br/>nginx + SPA<br/>proxy /api → backend · :5173"]
        API["ums-api<br/>backend .NET (OCI)<br/>DEPLOYMENT_TOPOLOGY local · :5293→8080"]
    end

    subgraph Svc["Service Layer"]
        WORKER["Workers / jobs in-process<br/>Outbox dispatcher (MassTransit)"]
    end

    subgraph Msg["Messaging"]
        BUS["MassTransit — transporte in-memory<br/>patrón Transactional Outbox"]
    end

    subgraph Data["Data Layer"]
        PG[("postgres:15-alpine<br/>BD UmsDev + Outbox<br/>vol postgres_data · :5432")]
        REDIS[("redis:7.4-alpine<br/>cache · :6379")]
        PGADMIN["pgadmin · :5050"]
    end

    subgraph Obs["Observabilidad (pipeline OpenTelemetry)"]
        OTEL["otel-collector<br/>:4317 OTLP"]
        PROM["prometheus :9090"]
        LOKI["loki :3100"]
        TEMPO["tempo :3200"]
        PROMTAIL["promtail"]
        GRAF["grafana :3000"]
    end

    subgraph Ext["External Systems"]
        MINIO["MinIO (S3-API) — opcional"]
        SAT["Otros satélites suite<br/>(MMS · XMS · IdP) — mock/ausente en local"]
    end

    DEV --> PORTS --> WEB
    PORTS --> API
    PORTS --> GRAF
    WEB -->|/api| API
    API --> WORKER
    WORKER --> BUS
    API --> PG
    API --> REDIS
    PGADMIN --> PG
    API -->|OTLP gRPC| OTEL
    OTEL --> TEMPO
    OTEL --> PROM
    API -->|logs| LOKI
    PROMTAIL --> LOKI
    GRAF --> PROM
    GRAF --> LOKI
    GRAF --> TEMPO
    API -.->|tras Puerto| MINIO
    API -.->|tras Puerto| SAT
```

## Leyenda

- **Líneas continuas:** tráfico/dependencia activa en el ambiente local. **Líneas punteadas:** integraciones abstraídas tras un Puerto ([ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md)) que en local suelen estar ausentes o *mockeadas*.
- **Edge/Security** se reduce a la publicación de puertos a `localhost`: no hay DNS, CDN, WAF ni TLS.
- **Messaging** usa transporte in-memory de MassTransit con Outbox en Postgres; el broker AMQP autorizado (RabbitMQ) no está presente en local.
- **Observabilidad** es el mismo stack OpenTelemetry que en Kind y producción, dando paridad de instrumentación.
- Una sola réplica por servicio, sin alta disponibilidad ni escalado (ver [README §5](./README.md#5-escalabilidad-y-alta-disponibilidad)).

---

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-07-22
</p>
