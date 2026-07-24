# Diagrama de despliegue — Kubernetes Local (k3d recomendado)

**← [Volver a Kubernetes Local](./README.md)** · [Deployment Hub](../../hub/deployment-architecture-hub.md)

> Topología del chart `ums-helm` sobre una distribución de Kubernetes local. Se ilustra la variante **recomendada (k3d/k3s)**: `--port 8080:80@loadbalancer` publica el ingress al host, Traefik como controlador, `local-path` como PVC dinámico y multi-nodo opcional. Con Minikube/Rancher/Docker Desktop cambia el sustrato, no los manifests.

## Diagrama por capas

```mermaid
flowchart TB
    subgraph Internet["Internet / Usuarios"]
        DEV["Desarrollador / QA<br/>navegador · kubectl · curl"]
    end

    subgraph Edge["Edge / Security"]
        LB["k3d loadbalancer<br/>--port 8080:80@loadbalancer"]
        ING["Ingress: Traefik (k3s) / NGINX<br/>ingress.className en values"]
    end

    subgraph App["Application Layer — namespace ums"]
        FE["Deployment ums-frontend<br/>nginx + SPA · Svc ClusterIP:80<br/>proxy /api y /grafana/"]
        BE["Deployment ums-backend<br/>.NET · :8080 · probes /health/*<br/>Svc ClusterIP:80 · N réplicas posibles"]
    end

    subgraph Svc["Service Layer"]
        WORKER["Outbox dispatcher (MassTransit)<br/>in-process en el backend"]
        HPA["HPA (andamiaje values.yaml)<br/>multi-nodo: affinity / PDB / rolling"]
    end

    subgraph Msg["Messaging"]
        BUS["MassTransit — transporte in-memory<br/>Transactional Outbox en Postgres"]
    end

    subgraph Data["Data Layer"]
        PG[("Deployment ums-postgres<br/>postgres:15-alpine · BD ums<br/>PVC local-path (persistente) · Svc:5432")]
        REDIS[("Deployment ums-redis<br/>redis:7-alpine · Svc:6379")]
        SEC["Secrets plantillados → sidecar/Vault (prod)"]
    end

    subgraph Obs["Observabilidad — namespace ums"]
        OTEL["otel-collector :4317"]
        PROM["prometheus"]
        ALERT["alertmanager"]
        LOKI["loki"]
        TEMPO["tempo"]
        GRAF["grafana · /grafana/"]
    end

    subgraph Ext["External Systems"]
        REG["Imágenes locales<br/>k3d image import / registry integrado"]
        MINIO["MinIO (S3-API) — tras Puerto"]
        SAT["Satélites suite (MMS · XMS · IdP)<br/>mock/ausente en local"]
    end

    DEV --> LB --> ING --> FE
    FE -->|/api| BE
    FE -->|/grafana/| GRAF
    BE --> WORKER --> BUS
    HPA -.->|escala| BE
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

- **Líneas continuas:** tráfico/dependencia activa. **Líneas punteadas:** escalado por HPA, inyección de secretos/imágenes o integraciones tras un Puerto ([ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md)).
- **Edge/Security:** el `loadbalancer` de k3d publica el ingress en `:8080`; el controlador puede ser Traefik (default k3s) o Ingress-NGINX según `ingress.className`. Sin WAF ni TLS externo.
- **Diferencias frente a [kind](../kind/deployment-diagram.md):** PVC `local-path` da **Postgres persistente** (no `emptyDir`), multi-nodo habilita afinidad/PDB/rolling reales, y la config del clúster es **versionable**. Los manifests/Helm son idénticos.
- **Messaging/Observabilidad:** mismos que kind y producción (in-memory local + Outbox; pipeline OpenTelemetry).
- **Estado Proposed:** la promoción a `Approved` requiere un ADR que ratifique k3d como *baseline* local (ver [README §9](./README.md#9-relación-con-el-sdlc-de-unimar-arch)).

---

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-07-22
</p>
