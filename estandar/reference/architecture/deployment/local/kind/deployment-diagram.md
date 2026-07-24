# Diagrama de despliegue — Kind (Kubernetes en Docker)

**← [Volver a Kind](./README.md)** · [Deployment Hub](../../hub/deployment-architecture-hub.md)

> Topología del clúster kind `unimar-cluster-ums` (namespace `ums`) desplegado con el chart `src/infra/ums-helm`. `extraPortMappings` de kind publica el Ingress-NGINX en `localhost:8080`. Una réplica por servicio; imágenes inyectadas por `kind load` (`pullPolicy: Never`).

## Diagrama por capas

```mermaid
flowchart TB
    subgraph Internet["Internet / Usuarios"]
        DEV["Desarrollador / QA<br/>navegador · kubectl · curl"]
    end

    subgraph Edge["Edge / Security"]
        HOSTS["/etc/hosts: 127.0.0.1 unimar-ums.local"]
        MAP["kind extraPortMappings<br/>0.0.0.0:8080 → 80"]
        ING["Ingress-NGINX<br/>host unimar-ums.local + wildcard"]
    end

    subgraph App["Application Layer — namespace ums"]
        FE["Deployment ums-frontend<br/>nginx + SPA · Svc ClusterIP:80<br/>proxy /api y /grafana/"]
        BE["Deployment ums-backend<br/>.NET · :8080 · probes /health/live,/ready<br/>Svc ClusterIP:80"]
    end

    subgraph Svc["Service Layer"]
        WORKER["Outbox dispatcher (MassTransit)<br/>in-process en el backend"]
    end

    subgraph Msg["Messaging"]
        BUS["MassTransit — transporte in-memory<br/>Transactional Outbox en Postgres"]
    end

    subgraph Data["Data Layer"]
        PG[("Deployment ums-postgres<br/>postgres:15-alpine · BD ums<br/>emptyDir efímero · Svc:5432")]
        REDIS[("Deployment ums-redis<br/>redis:7-alpine · Svc:6379")]
        SEC["Secrets: ums-db-secret · ums-admin-secret<br/>(plantillados .Values.secrets)"]
    end

    subgraph Obs["Observabilidad — namespace ums"]
        OTEL["otel-collector :4317"]
        PROM["prometheus"]
        ALERT["alertmanager"]
        LOKI["loki :3100"]
        TEMPO["tempo"]
        GRAF["grafana · NodePort 30300<br/>servido bajo /grafana/"]
    end

    subgraph Ext["External Systems"]
        REG["Imágenes locales<br/>kind load (pullPolicy Never)"]
        MINIO["MinIO (S3-API) — tras Puerto"]
        SAT["Satélites suite (MMS · XMS · IdP)<br/>mock/ausente en local"]
    end

    DEV --> HOSTS --> MAP --> ING
    ING --> FE
    FE -->|/api| BE
    FE -->|/grafana/| GRAF
    BE --> WORKER --> BUS
    BE --> PG
    BE --> REDIS
    SEC -.->|secretKeyRef| BE
    SEC -.->|secretKeyRef| PG
    BE -->|OTLP gRPC| OTEL
    OTEL --> TEMPO
    OTEL --> PROM
    PROM --> ALERT
    BE -->|logs| LOKI
    GRAF --> PROM
    GRAF --> LOKI
    GRAF --> TEMPO
    REG -.->|carga imagen| BE
    REG -.->|carga imagen| FE
    BE -.->|tras Puerto| MINIO
    BE -.->|tras Puerto| SAT
```

## Leyenda

- **Líneas continuas:** tráfico/dependencia activa dentro del clúster. **Líneas punteadas:** inyección de secretos/imágenes o integraciones abstraídas tras un Puerto ([ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md)), ausentes o *mockeadas* en local.
- **Edge/Security:** la entrada real es Ingress-NGINX; `extraPortMappings` de kind hace el puente host→clúster en `:8080` (no 80/443, retenidos por Docker Desktop). Sin WAF ni TLS externo.
- **Data:** Postgres con `emptyDir` (efímero) — ver [README §9](./README.md#9-relación-con-el-sdlc-de-unimar-arch); Secrets plantillados por el chart (G-019).
- **Messaging:** transporte in-memory de MassTransit con Outbox en Postgres; RabbitMQ (AMQP autorizado) no presente en local.
- **Paridad:** estos son los **mismos manifests/Helm** que se despliegan en AKS/EKS/on-prem — el diferencial es el sustrato (nodos-contenedor de kind) y la ausencia de HA.

---

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-07-22
</p>
