# Kubernetes Local — k3d / Minikube / Rancher Desktop / Docker Desktop

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Deployment-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Proposed-f39c12?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-0.1.0-042139?style=flat-square" alt="Versión">
</p>

**← [Inicio](../../../../../../README.md) / [Hub de Arquitectura](../../../README.md) / [Deployment Hub](../../hub/deployment-architecture-hub.md) / Kubernetes Local**

> **Meta:** Ofrecer una distribución de Kubernetes local (k3d / Minikube / Rancher Desktop / Docker Desktop) para validar **los mismos Helm charts que producción**, con recomendación gobernada de la variante preferida para UNIMAR.
> **Owner:** Architecture Board · **Fase SDLC:** 5 — Entrega y Operaciones · **Última revisión:** 2026-07-22

---

## Metadatos de gobierno

| Campo | Valor |
| :-- | :-- |
| Architecture ID | `DEPLOY-K8SLOCAL` |
| Architecture Name | Kubernetes Local (k3d / Minikube / Rancher / Docker Desktop) |
| Environment | Desarrollo / pre-prod local |
| Type | Kubernetes autogestionado local |
| Status | Proposed |
| Owner | Architecture Board |
| Version | 0.1.0 |
| Created / Updated | 2026-07-22 / 2026-07-22 |
| Applicable Products | DT, TMS, WMS, MMS, SIL, UMS, XMS |
| Decision Records | [ADR-0039](../../../adrs/core/0039-switcher-abstraccion-topologia-despliegue.es.md) · [ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md) · [ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md) · [ADR-0106](../../../adrs/core/0106-seguridad-calidad-local-first.es.md) |
| Diagram | [deployment-diagram.md](./deployment-diagram.md) |

## 1. Arquitectura — resumen

**Dónde corre:** en la estación del desarrollador, sobre una **distribución ligera de Kubernetes local**, alternativa a [kind](../kind/README.md) cuando se requiere una experiencia más cercana a un clúster productivo o menor huella de recursos. Las opciones consideradas:

| Distribución | Sustrato | Rasgo distintivo |
| :-- | :-- | :-- |
| **k3d** | k3s (Rancher) en Docker | Muy ligero; multi-nodo trivial; ingress Traefik integrado; `k3d image import` |
| **Minikube** | VM o Docker | Maduro; muchos *addons*; más pesado (VM por defecto) |
| **Rancher Desktop** | k3s + moby/containerd | GUI; reemplaza Docker Desktop; k3s de fábrica |
| **Docker Desktop K8s** | K8s embebido | "Un clic"; retiene puertos 80/443; menos configurable |

**El mismo binario, la misma topología:** cualquiera de estas distribuciones ejecuta el chart Helm agnóstico al sabor ([stack §6](../../../stack-tecnologico-autorizado-agnostico.es.md), principio 4 del [Hub](../../hub/deployment-architecture-hub.md)), con `DEPLOYMENT_TOPOLOGY` local ([ADR-0039](../../../adrs/core/0039-switcher-abstraccion-topologia-despliegue.es.md)) e infraestructura tras Puertos ([ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md)). El objetivo declarado es **validar localmente exactamente los mismos manifests/Helm que AKS/EKS/on-prem**.

### Recomendación para UNIMAR: **k3d**

Se recomienda **k3d** como distribución preferida, y aquí la justificación con criterio:

1. **Paridad + ligereza a la vez.** k3d ejecuta **k3s**, una distribución de Kubernetes conforme (CNCF), en contenedores Docker — igual de fiel que kind, pero con menor huella de memoria, lo que importa dado que la VM de Docker de UMS ya sufrió presión de CPU (TLS handshake timeouts) al competir con otros clústeres.
2. **Multi-nodo trivial.** `k3d cluster create -a 3` levanta *agents* adicionales en segundos, permitiendo probar `nodeSelector`, `affinity`, `tolerations` y *rolling updates* reales que un solo nodo de kind no ejercita.
3. **Carga de imágenes equivalente al flujo actual.** `k3d image import ums/backend:latest` reemplaza 1:1 al `kind load docker-image` que UMS ya usa (`pullPolicy: Never`), o se puede levantar un *registry* local integrado — migración de bajo costo.
4. **Ingress integrado.** k3s trae Traefik; el chart `ums-helm` ya parametriza `ingress.className`, de modo que conmutar de Ingress-NGINX (kind) a Traefik (k3d) es un cambio de *values*, sin tocar código.
5. **No sustituye el tooling del desarrollador.** A diferencia de Rancher Desktop (que reemplaza Docker Desktop) o Docker Desktop K8s (que retiene 80/443 y es poco configurable), k3d convive con el Docker existente y es totalmente scriptable/versionable.

**Minikube** queda como alternativa cuando se necesitan *addons* concretos; **Docker Desktop K8s** como opción "cero setup" para quien ya lo tiene; **Rancher Desktop** para equipos que prefieran una GUI y no dependan de Docker Desktop. Ninguna sustituye a [kind](../kind/README.md) como *baseline* aprobado: esta alternativa es `Proposed` hasta ratificar la migración a k3d con un ADR.

## 2. Diagrama de despliegue

Ver **[deployment-diagram.md](./deployment-diagram.md)** — Mermaid por capas: Internet/Usuarios → Edge/Security → Application → Service → Messaging → Data → External Systems.

## 3. Componentes requeridos

| Componente | Tecnología (autorizada) | Propósito | Alternativa | Nota DR |
| :-- | :-- | :-- | :-- | :-- |
| Distribución K8s local | **k3d (k3s)** v1.28+ | Clúster ligero multi-nodo | Minikube / Rancher / Docker Desktop | Fase 3+ ([ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md)) |
| Gestor de paquetes | Helm v3 (`ums-helm`) | Despliegue parametrizado | — | Mismo chart que prod |
| Ingress | Traefik (k3s) / Ingress-NGINX | Entrada HTTP local | Gateway API (HTTPRoute) | `ingress.className` en values |
| Frontend / Backend | nginx+SPA / Deployment .NET | UI + API | — | Idénticos a kind |
| Base de datos | PostgreSQL 15 | Persistencia | — | PVC recomendado (local-path de k3s) |
| Cache | Redis 7 | Cache | — | — |
| Mensajería | MassTransit + Outbox (in-memory local) | Eventos AMQP/CloudEvents | RabbitMQ (superiores) | Outbox en Postgres |
| Object storage | MinIO (S3-API) | Documentos | AWS S3 / Azure Blob (tras Puerto) | Opcional |
| Secretos | K8s Secret plantillado → sidecar/Vault (prod) | Credenciales | — | `secrets.create=false` en prod |
| Observabilidad | OTel Collector · Prometheus · Grafana · Loki · Tempo | Logs, métricas, trazas | — | Mismo stack que kind/prod |

Anclado al [stack tecnológico autorizado — agnóstico §6](../../../stack-tecnologico-autorizado-agnostico.es.md).

## 4. Requerimientos técnicos

- **Infraestructura:** CPU 6–14 vCPU · RAM 12–16 GB (k3d es más frugal que kind, pero un multi-nodo con observabilidad sigue siendo exigente) · Storage 30–50 GB SSD · Networking: `--port 8080:80@loadbalancer` de k3d publica el ingress al host.
- **Software:** Docker v25+, k3d + kubectl + Helm v3 (o la distribución elegida). Traefik/Ingress-NGINX según values.
- **Seguridad:** Secrets de K8s plantillados (desarrollo); en producción, patrón **sidecar/Vault** del [stack §6](../../../stack-tecnologico-autorizado-agnostico.es.md). Namespace aislado; sin TLS externo local.
- **Observabilidad:** idéntico pipeline OpenTelemetry que kind y producción (OTLP → colector; logs a Loki; tableros Grafana).
- **DevOps:** local-first ([ADR-0106](../../../adrs/core/0106-seguridad-calidad-local-first.es.md)); `k3d image import` o *registry* local integrado en vez de registro externo. IaC = chart Helm versionado + script `k3d cluster create` **versionado** (mejora sobre la config no versionada de kind en UMS).
- **Operación:** `k3d cluster create/delete`, `helm upgrade`, `rollout restart`. `local-path-provisioner` de k3s ofrece PVC dinámico, habilitando persistencia estable de Postgres sin `emptyDir`.

## 5. Escalabilidad y alta disponibilidad

Sin HA productiva, pero **mejor cobertura de escenarios que kind**: k3d permite un plano de control y varios *agents*, de modo que se pueden validar HPA (andamiaje presente en `values.yaml`), `PodDisruptionBudget`, *affinity/anti-affinity* y *rolling updates* con varias réplicas, algo imposible con un único nodo. Aun así, los objetivos de Disponibilidad/RTO/RPO de la [matriz NFR](../../../matriz-nfr-suite.es.md) se persiguen sólo en producción; aquí el objetivo es **fidelidad de comportamiento**, no continuidad.

## 6. Estimated Infrastructure Cost

> Estimación en RANGOS. Región: N/A (ejecución local) · Supuestos: 1 desarrollador, clúster k3d de 1–3 nodos, sin tráfico externo, stack completo con observabilidad.

| Concepto | Estimación |
| :-- | :-- |
| Costo mensual estimado | ~USD 0 en infraestructura + amortización de la estación (~USD 50–110/mes) |
| Costo anual estimado | ~USD 0 + ~USD 600–1 300/año de amortización de hardware |
| Costo de implementación inicial | ~USD 0 (OSS); horas de setup: 1–2 días + migración de scripts `kind load` → `k3d image import` |
| Costo operativo estimado | ~USD 0 directo; consumo similar o menor a kind por la frugalidad de k3s |

**Variables que afectan el costo:** número de nodos/réplicas simuladas, presencia de observabilidad, gama de la estación. k3s reduce la huella respecto de kind, pero un multi-nodo con stack completo sigue pidiendo 16 GB. Todo el software es OSS.

## 7. Operación, monitoreo, seguridad, recuperación

- **Operación:** `k3d cluster create unimar-ums --port 8080:80@loadbalancer [-a N]` → `helm install ums ums-helm` → `k3d image import` en cada cambio de imagen. Config del clúster **versionada** en el repo (corrige el hallazgo de kind).
- **Monitoreo:** Grafana + Prometheus/Loki/Tempo (mismo stack); Alertmanager para reglas.
- **Seguridad:** Secrets plantillados de desarrollo; escaneo de secretos en `pre-push` ([ADR-0106](../../../adrs/core/0106-seguridad-calidad-local-first.es.md)); ruta a sidecar/Vault en producción.
- **Recuperación:** sin DR. Con `local-path-provisioner` + PVC, el estado de Postgres **sí puede persistir** entre reinicios (ventaja sobre el `emptyDir` de kind); aun así el ambiente es reconstruible con re-seed.

## 8. Cuándo usar / Ventajas y desventajas

**Cuándo conviene:** cuando se quiere **paridad con producción con menor huella que kind** o validar escenarios multi-nodo (afinidad, PDB, *rolling updates*), o cuando el equipo prefiere una distribución con ingress/PVC integrados de fábrica (k3s). Es candidata a suceder a kind como *baseline* local si se ratifica.

| Ventajas | Desventajas |
| :-- | :-- |
| Paridad con producción y menor consumo que kind (k3s frugal) | `Proposed`: aún sin ADR que ratifique la migración desde kind |
| Multi-nodo trivial (`-a N`): valida afinidad/PDB/rolling | Diferencias Traefik vs Ingress-NGINX a reconciliar en values |
| PVC dinámico (`local-path`): Postgres persistente | Curva de aprendizaje de otra herramienta más |
| Config del clúster versionable (corrige gap de kind) | Fragmentación si cada dev elige distinta distribución |
| Mismo Helm chart y pipeline OpenTelemetry | Docker Desktop K8s/Rancher tienen restricciones propias (puertos/GUI) |

**Relación con las otras alternativas:** [Docker Compose](../docker/README.md) para el *inner loop*; [kind](../kind/README.md) como Kubernetes local **aprobado** hoy; **Kubernetes Local (k3d)** como evolución propuesta para más fidelidad/menos recursos. La comparación completa vive en la [matriz de opciones](../../comparison/deployment-options-matrix.md).

## 9. Relación con el SDLC de UNIMAR-ARCH

Aplica en la **Fase 5** como ambiente de validación de despliegue local de alta fidelidad. La gobiernan [ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md), [ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md), [ADR-0039](../../../adrs/core/0039-switcher-abstraccion-topologia-despliegue.es.md) y [ADR-0106](../../../adrs/core/0106-seguridad-calidad-local-first.es.md). Su promoción de `Proposed` a `Approved` exige un **ADR nuevo** que ratifique k3d como distribución preferida y la migración desde kind (principio: no se adopta tecnología fuera del stack sin ADR). La adopción por producto se registrará en el `DECISIONS.md` del satélite y los hallazgos en su `GAPS.md`.

**Hallazgos / decisiones pendientes (registrar en `GAPS.md`):**
- **ADR de ratificación pendiente:** falta decidir formalmente k3d vs kind como *baseline* local; sin él, esta alternativa no puede pasar a `Approved`.
- **Reconciliar Ingress:** definir en `ums-helm` el `ingress.className` para Traefik (k3d) sin romper Ingress-NGINX (kind).
- **PVC opcional en el chart:** aprovechar `local-path` de k3s para dar persistencia a Postgres, cerrando el hallazgo de `emptyDir`.

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-07-22
</p>
