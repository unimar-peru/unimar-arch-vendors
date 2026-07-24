# Kind — Kubernetes local en Docker

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Deployment-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Approved-27ae60?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-1.0.0-042139?style=flat-square" alt="Versión">
</p>

**← [Inicio](../../../../../../README.md) / [Hub de Arquitectura](../../../README.md) / [Deployment Hub](../../hub/deployment-architecture-hub.md) / Kind**

> **Meta:** Ejecutar la suite sobre un clúster **Kubernetes real dentro de Docker** (kind), desplegada con el mismo Helm chart que producción, para validar *manifests*, Ingress, Services y probes antes de QA.
> **Owner:** Architecture Board · **Fase SDLC:** 5 — Entrega y Operaciones · **Última revisión:** 2026-07-22

---

## Metadatos de gobierno

| Campo | Valor |
| :-- | :-- |
| Architecture ID | `DEPLOY-KIND` |
| Architecture Name | Kind — Kubernetes local en Docker |
| Environment | Desarrollo / QA local |
| Type | Kubernetes autogestionado (kind, nodos como contenedores) |
| Status | Approved |
| Owner | Architecture Board |
| Version | 1.0.0 |
| Created / Updated | 2026-07-22 / 2026-07-22 |
| Applicable Products | DT, TMS, WMS, MMS, SIL, UMS, XMS |
| Decision Records | [ADR-0039](../../../adrs/core/0039-switcher-abstraccion-topologia-despliegue.es.md) · [ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md) · [ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md) · [ADR-0106](../../../adrs/core/0106-seguridad-calidad-local-first.es.md) |
| Diagram | [deployment-diagram.md](./deployment-diagram.md) |

## 1. Arquitectura — resumen

**Dónde corre:** en la estación del desarrollador, pero como un **clúster Kubernetes v1.28+ real** cuyos nodos son contenedores Docker (*Kubernetes IN Docker*). A diferencia de [Docker Compose](../docker/README.md), aquí hay API server, scheduler, kubelet, Services, Ingress y un ciclo de reconciliación real.

**Referencia real (satélite UMS):** UMS corre en un clúster kind llamado **`unimar-cluster-ums`** (contexto kubectl `kind-unimar-cluster-ums`), namespace **`ums`**, desplegado con el chart **[`src/infra/ums-helm`](https://github.com/unimar-peru/unimar-ums)** (`Chart.yaml`: `ums-helm` v0.1.0, `appVersion 0.1.0-pilot`). El chart despliega:

- **Application:** `ums-frontend` (nginx + SPA, sirve la UI y hace *proxy* de `/api` al backend y de `/grafana/` a Grafana) y `ums-backend` (Deployment .NET, `containerPort 8080`, probes `/health/live` y `/health/ready`).
- **Data:** `ums-postgres` (`postgres:15-alpine`, BD `ums`, Service ClusterIP:5432) y `ums-redis` (`redis:7-alpine`, ClusterIP:6379).
- **Observabilidad:** stack OpenTelemetry en el mismo namespace (otel-collector, loki, tempo, prometheus, alertmanager, grafana) con `observability.enabled=true`; Grafana servido bajo `/grafana/` (NodePort 30300).
- **Networking:** dos Ingress nginx — `ums-frontend` (host `unimar-ums.local`) y uno *wildcard* — y `extraPortMappings` de kind que mapea `0.0.0.0:8080→80`. Acceso en **`http://unimar-ums.local:8080`** (requiere `127.0.0.1 unimar-ums.local` en `/etc/hosts`) o directo en **`http://localhost:8080`**. Se usa 8080/8443 y no 80/443 porque Docker Desktop retiene esos puertos.
- **Secretos:** `templates/secret.yaml` plantilla `ums-db-secret` y `ums-admin-secret` desde `.Values.secrets` (G-019); un `helm install` limpio es autocontenido.
- **Imágenes:** `ums/backend` y `ums/frontend` con `imagePullPolicy: Never` — se construyen local y se inyectan con `kind load docker-image ... --name unimar-cluster-ums` (nunca `latest`: el `tag` vacío cae al `appVersion`, D-R2/TE-09).

**Cómo se conecta al modelo global:** es la misma abstracción `DEPLOYMENT_TOPOLOGY` ([ADR-0039](../../../adrs/core/0039-switcher-abstraccion-topologia-despliegue.es.md)) e infraestructura tras Puertos ([ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md)), pero ejercitando ya la **orquestación Kubernetes** de Fase 3+ ([ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md)) con un chart agnóstico al sabor de distribución.

## 2. Diagrama de despliegue

Ver **[deployment-diagram.md](./deployment-diagram.md)** — Mermaid por capas: Internet/Usuarios → Edge/Security → Application → Service → Messaging → Data → External Systems.

## 3. Componentes requeridos

| Componente | Tecnología (autorizada) | Propósito | Alternativa | Nota DR |
| :-- | :-- | :-- | :-- | :-- |
| Clúster local | kind (K8s v1.28+) sobre Docker v25+ | Nodos como contenedores | k3d / Minikube ([Kubernetes Local](../kubernetes/README.md)) | Fase 3+ ([ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md)) |
| Gestor de paquetes | Helm v3 (`ums-helm`) | Despliegue parametrizado | — | Chart único agnóstico |
| Ingress | Ingress-NGINX | Entrada HTTP `:8080` | Gateway API (HTTPRoute, ya plantillado) | — |
| Frontend | nginx + SPA (`ums-frontend`) | UI + proxy `/api` y `/grafana/` | — | ClusterIP:80 |
| Backend | Deployment .NET (`ums-backend`) | API REST + Outbox | — | probes `/health/*` |
| Base de datos | PostgreSQL 15 (`ums-postgres`) | Persistencia | — | **`emptyDir`** (efímero) — ver §9 |
| Cache | Redis 7 (`ums-redis`) | Cache | — | ClusterIP:6379 |
| Mensajería | MassTransit + Outbox (in-memory local) | Eventos AMQP/CloudEvents | RabbitMQ (ambientes superiores) | Outbox en Postgres |
| Secretos | K8s Secret plantillado (`.Values.secrets`) | Credenciales de arranque | Sidecar/Vault (prod) | G-019; en prod `secrets.create=false` |
| Observabilidad | OTel Collector · Prometheus · Alertmanager · Grafana · Loki · Tempo | Logs, métricas, trazas, alertas | — | NodePort 30300 |

Anclado al [stack tecnológico autorizado — agnóstico §7](../../../stack-tecnologico-autorizado-agnostico.es.md).

## 4. Requerimientos técnicos

- **Infraestructura:** CPU 6–14 vCPU · RAM 12–16 GB en el host (asignar ≥ 8–10 GB a la VM de Docker; el control-plane + todos los pods + observabilidad es exigente) · Storage 30–50 GB SSD · Networking: `extraPortMappings` de kind para publicar el Ingress al host.
- **Software:** Docker v25+, kind, kubectl, Helm v3. Ingress-NGINX instalado en el clúster.
- **Seguridad:** Secrets nativos de K8s plantillados por el chart (valores de desarrollo `postgres`/`root`); en producción se sobreescriben cifrados o se gestionan fuera del chart (`secrets.create=false`) y se migra al patrón **sidecar/Vault** del [stack §7](../../../stack-tecnologico-autorizado-agnostico.es.md). Aislamiento por namespace `ums`; sin TLS externo (HTTP en `:8080`).
- **Observabilidad:** el backend exporta trazas/métricas por OTLP al colector y logs a Loki (sink Serilog); alertas enrutadas por Alertmanager (`webhookUrl` vacío por defecto → visibles en UI, sin notificación hasta configurar Slack/Teams). Tableros en Grafana bajo `/grafana/`.
- **DevOps:** sin CI de servidor; puertas local-first vía husky ([ADR-0106](../../../adrs/core/0106-seguridad-calidad-local-first.es.md)). Sin registro de contenedores: `kind load docker-image` inyecta las imágenes en los nodos (`pullPolicy: Never`). IaC = el chart Helm versionado.
- **Operación:** ciclo de redeploy = *rebuild* imagen → `kind load docker-image ums/backend:latest --name unimar-cluster-ums` → `kubectl -n ums rollout restart deploy/ums-backend`. Acceso robusto por Ingress (`:8080`) en vez de `kubectl port-forward` (se cae bajo presión).

## 5. Escalabilidad y alta disponibilidad

`replicaCount: 1` y `autoscaling.enabled: false` por defecto: **una réplica por servicio, un solo nodo lógico, sin HA**. El chart trae el andamiaje de HPA (`autoscaling` en `values.yaml`) que en producción escala por CPU/memoria, pero en kind no se activa. Los objetivos de Disponibilidad/RTO/RPO de la [matriz NFR](../../../matriz-nfr-suite.es.md) no se persiguen; el valor es **validar el modelo de escalado y las probes**, no ejercer HA. Las probes se configuran tolerantes (`timeoutSeconds: 5`, `failureThreshold: 6`) para no matar el backend bajo presión de CPU del host.

## 6. Estimated Infrastructure Cost

> Estimación en RANGOS. Región: N/A (ejecución local) · Supuestos: 1 desarrollador, 1 clúster kind de un nodo, sin tráfico externo, sin storage gestionado, stack completo con observabilidad.

| Concepto | Estimación |
| :-- | :-- |
| Costo mensual estimado | ~USD 0 en infraestructura + amortización de la estación (~USD 55–110/mes) |
| Costo anual estimado | ~USD 0 + ~USD 650–1 300/año de amortización de hardware |
| Costo de implementación inicial | ~USD 0 (OSS; horas de setup: 1–2 días para dominar kind/Helm) |
| Costo operativo estimado | ~USD 0 directo; mayor consumo de CPU/RAM/energía que Docker Compose |

**Variables que afectan el costo:** kind consume más RAM/CPU que Compose (control-plane + observabilidad), por lo que exige una estación de gama media-alta (16 GB+); competir con otros clústeres kind en la misma VM de Docker degrada el rendimiento (visto en UMS: TLS handshake timeouts bajo presión). Software 100% OSS: sin licencias.

## 7. Operación, monitoreo, seguridad, recuperación

- **Operación:** crear clúster con la config de `extraPortMappings`, `helm install`/`upgrade` del chart `ums-helm`, redeploy por `rollout restart`. Acceso por Ingress en `:8080`; para caja negra directa a la API, `kubectl port-forward -n ums svc/ums-backend 18080:80`.
- **Monitoreo:** Grafana bajo `/grafana/` con Prometheus/Loki/Tempo; Alertmanager para reglas (sin notificación externa hasta fijar webhook). Estado de pods con `kubectl -n ums get pods`.
- **Seguridad:** namespace aislado, Secrets plantillados de desarrollo (no reutilizables), escaneo de secretos en `pre-push` ([ADR-0106](../../../adrs/core/0106-seguridad-calidad-local-first.es.md)). Patrón sidecar/Vault reservado a producción.
- **Recuperación:** sin DR; el estado de Postgres es **efímero** (`emptyDir`: se pierde al reiniciar el pod). "Recuperar" = reconstruir clúster/chart y re-seed (`Persistence__SeedDevData=true`). Para persistencia estable habría que migrar a un PVC (ver §9).

## 8. Cuándo usar / Ventajas y desventajas

**Cuándo conviene:** cuando el desarrollador o QA necesita **paridad con producción** — validar los mismos Helm charts, Ingress, Services, Secrets y probes que se desplegarán en AKS/EKS/on-prem, sin costo de nube. Ideal para el *outer loop* previo a QA y para depurar problemas específicos de Kubernetes (networking, RBAC, ordenación de recursos).

| Ventajas | Desventajas |
| :-- | :-- |
| **Paridad real con producción:** mismos manifests/Helm | Mayor consumo de recursos que Compose |
| Valida Ingress, Services, Secrets, probes, HPA (andamiaje) | Curva de aprendizaje (kubectl, Helm, kind) |
| Clúster desechable y reproducible | Config de `extraPortMappings` no versionada en UMS (ver §9) |
| Mismo pipeline OpenTelemetry que producción | Postgres efímero (`emptyDir`) por defecto |
| 100% OSS, autohospedable ([ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md)) | `pullPolicy: Never` obliga a `kind load` en cada cambio de imagen |

**Docker vs Kind:** el [Docker Compose](../docker/README.md) gana en el *inner loop* diario (velocidad, ligereza); **kind** gana cuando importa la fidelidad a Kubernetes. Para escoger entre kind y otros Kubernetes locales (k3d/Minikube/Rancher), ver **[Kubernetes Local](../kubernetes/README.md)**.

## 9. Relación con el SDLC de UNIMAR-ARCH

Aplica en la **Fase 5** como ambiente de validación de despliegue y en el *outer loop* previo a QA. La gobiernan [ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md) (Kubernetes desde Fase 3+), [ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md), [ADR-0039](../../../adrs/core/0039-switcher-abstraccion-topologia-despliegue.es.md) y [ADR-0106](../../../adrs/core/0106-seguridad-calidad-local-first.es.md). La adopción por producto se registra en el `DECISIONS.md` del satélite y los hallazgos en su `GAPS.md`.

**Hallazgos detectados (registrar en `GAPS.md` del satélite):**
- **Config de `extraPortMappings` no versionada:** la definición del clúster kind (mapeo `:8080→80`) vive en scratchpad, no en el repo. Un desarrollador nuevo no puede recrear el clúster de forma reproducible. Conviene versionar un `kind-config.yaml`.
- **Postgres efímero (`emptyDir`):** `templates/postgres.yaml` usa `emptyDir`, no un PVC; los datos se pierden al reiniciar el pod. Aceptable en desarrollo, pero conviene ofrecer un PVC opcional.
- **Probes relajadas fuera del chart:** el clúster vivo tenía probes parcheadas por `kubectl patch` que un redeploy del chart revierte; el chart ya trae probes tolerantes, pero conviene alinear ambos.
- **Broker AMQP ausente en local:** transporte in-memory; RabbitMQ no se valida hasta ambientes superiores.

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-07-22
</p>
