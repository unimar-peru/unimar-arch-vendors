# Docker — Desarrollo local con Docker Compose

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Deployment-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Approved-27ae60?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-1.0.0-042139?style=flat-square" alt="Versión">
</p>

**← [Inicio](../../../../../../README.md) / [Hub de Arquitectura](../../../README.md) / [Deployment Hub](../../hub/deployment-architecture-hub.md) / Docker**

> **Meta:** Levantar la suite completa de un satélite (backend, frontend, base de datos, cache, mensajería y observabilidad) en la estación del desarrollador con un solo `docker compose up`, sin nube ni Kubernetes.
> **Owner:** Architecture Board · **Fase SDLC:** 5 — Entrega y Operaciones · **Última revisión:** 2026-07-22

---

## Metadatos de gobierno

| Campo | Valor |
| :-- | :-- |
| Architecture ID | `DEPLOY-DKR` |
| Architecture Name | Docker — Desarrollo local con Docker Compose |
| Environment | Desarrollo |
| Type | Contenedores (OCI) sobre Docker Compose |
| Status | Approved |
| Owner | Architecture Board |
| Version | 1.0.0 |
| Created / Updated | 2026-07-22 / 2026-07-22 |
| Applicable Products | DT, TMS, WMS, MMS, SIL, UMS, XMS |
| Decision Records | [ADR-0039](../../../adrs/core/0039-switcher-abstraccion-topologia-despliegue.es.md) · [ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md) · [ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md) · [ADR-0106](../../../adrs/core/0106-seguridad-calidad-local-first.es.md) |
| Diagram | [deployment-diagram.md](./deployment-diagram.md) |

## 1. Arquitectura — resumen

**Dónde corre:** íntegramente en la máquina del desarrollador, dentro de la VM de Docker (Docker Desktop en macOS/Windows o Docker Engine en Linux). No hay nube, ni clúster, ni orquestador: los contenedores se declaran en un archivo Compose y se conectan por una red *bridge* privada.

**Cómo se conecta:** es la topología de **Fase 1** del despliegue progresivo ([stack agnóstico §7](../../../stack-tecnologico-autorizado-agnostico.es.md), [ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md)). El mismo binario OCI que en producción arranca aquí con `DEPLOYMENT_TOPOLOGY` seleccionando adaptadores locales en el contenedor DI ([ADR-0039](../../../adrs/core/0039-switcher-abstraccion-topologia-despliegue.es.md)); toda dependencia de infraestructura vive tras un Puerto ([ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md)), de modo que Postgres, Redis y el colector OTel locales son adaptadores intercambiables.

**Referencia real (satélite UMS):** el Compose canónico de UMS ([`src/infra/local/compose/docker-compose.yml`](https://github.com/unimar-peru/unimar-ums)) declara doce servicios en la red `ums-network`:

- **Aplicación:** `ums-api` (.NET, construido con Dockerfile multi-stage canónico, expuesto en `localhost:5293`) y `ums-web` (nginx que sirve la SPA y hace *proxy* de `/api` al backend, en `localhost:5173`).
- **Datos:** `postgres` (`postgres:15-alpine`, BD `UmsDev`, `localhost:5432`, volumen `postgres_data`), `pgadmin` (`localhost:5050`) y `redis` (`redis:7.4-alpine`, `localhost:6379`).
- **Observabilidad:** stack OpenTelemetry completo — `otel-collector`, `tempo` (trazas), `loki` (logs), `promtail`, `prometheus` (métricas) y `grafana` (`localhost:3000`, login anónimo con rol Admin).

**Mensajería:** el bus se resuelve con **MassTransit + patrón Transactional Outbox** (outbox persistido en Postgres, `Persistence__EnableOutbox=true`). En local el transporte es **in-memory** (`UsingInMemory`); el broker AMQP autorizado (RabbitMQ) se reserva para ambientes compartidos/producción — ver [§ hallazgos](#9-relación-con-el-sdlc-de-unimar-arch).

## 2. Diagrama de despliegue

Ver **[deployment-diagram.md](./deployment-diagram.md)** — Mermaid por capas: Internet/Usuarios → Edge/Security → Application → Service → Messaging → Data → External Systems.

## 3. Componentes requeridos

| Componente | Tecnología (autorizada) | Propósito | Alternativa | Nota DR |
| :-- | :-- | :-- | :-- | :-- |
| Motor de contenedores | Docker v25+ (multi-stage, Distroless en prod) | Runtime OCI local | Podman | N/A en local |
| Orquestación local | Docker Compose | Ciclo de vida y red de los servicios | — | Fase 1 ([ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md)) |
| Frontend | nginx + SPA | UI y *proxy* `/api` | — | — |
| Backend | Contenedor de aplicación (.NET) | API REST del dominio | — | — |
| Base de datos | PostgreSQL 15 | Persistencia + outbox | SQL Server (tras Puerto) | Volumen local; sin réplica |
| Cache | Redis 7 | Cache de configuración/sesión | — | Efímero |
| Mensajería | MassTransit + Outbox (in-memory local) | Propagación de eventos AMQP/CloudEvents | RabbitMQ (ambientes compartidos) | Outbox en Postgres |
| Observabilidad | OTel Collector · Prometheus · Grafana · Loki · Tempo · Promtail | Logs, métricas y trazas | — | Sin retención larga |
| Object storage | MinIO (S3-API) | Documentos/archivos | AWS S3 / Azure Blob (tras Puerto) | Opcional en local |
| Secretos de build | BuildKit secret (`gh_token`) | Feed privado NuGet sin filtrarse en capas | — | Nunca en imagen |

Anclado al [stack tecnológico autorizado — agnóstico §7](../../../stack-tecnologico-autorizado-agnostico.es.md).

## 4. Requerimientos técnicos

- **Infraestructura:** CPU 4–8 vCPU · RAM 8–16 GB (asignar ≥ 8 GB a la VM de Docker; el stack completo con observabilidad ronda 6–8 GB) · Storage 20–40 GB SSD para imágenes y volúmenes · Networking: red `bridge` privada, puertos publicados a `localhost`.
- **Software:** Docker v25+, Docker Compose v2, Postgres 15, Redis 7, colector OpenTelemetry. Sin Kubernetes.
- **Seguridad:** sin IAM externo; credenciales de desarrollo en variables de entorno del Compose (no aptas para prod). Secretos de *build* inyectados por **BuildKit secret** (`GH_TOKEN=$(gh auth token)`), nunca horneados en capas de imagen. Aislamiento por red *bridge*; sin WAF ni TLS (HTTP en `localhost`). El patrón de secretos vía sidecar/Vault del [stack §7](../../../stack-tecnologico-autorizado-agnostico.es.md) **no aplica** aquí: es una simplificación consciente del ambiente de desarrollo.
- **Observabilidad:** trazas y métricas del backend por OTLP gRPC (`otel-collector:4317`); logs a Loki; tableros en Grafana (`localhost:3000`). Es el **mismo pipeline OpenTelemetry** que en Kind y en producción, lo que da paridad de instrumentación desde el día 1.
- **DevOps:** sin CI de servidor; las puertas de calidad corren en local vía husky (build + unitarias + coverage + escaneo de secretos) según [ADR-0106](../../../adrs/core/0106-seguridad-calidad-local-first.es.md). Registro de contenedores no requerido (build local). IaC: el propio `docker-compose.yml` versionado.
- **Operación:** autoservicio del desarrollador — `docker compose up/down`, `logs`, `ps`. Sin SRE, sin backup formal (los volúmenes son descartables), sin DR.

## 5. Escalabilidad y alta disponibilidad

No aplica alta disponibilidad: **una réplica por servicio, un solo host, sin conmutación por error**. El escalado se limita a `docker compose up --scale` para pruebas puntuales de concurrencia, sin balanceo real. Los objetivos de Disponibilidad/RTO/RPO de la [matriz NFR](../../../matriz-nfr-suite.es.md) **no se persiguen** en desarrollo: el ambiente es efímero y reconstruible. `depends_on` con `healthcheck` garantiza únicamente orden de arranque (la BD y Redis sanos antes del backend), no continuidad de servicio.

## 6. Estimated Infrastructure Cost

> Estimación en RANGOS. Región: N/A (ejecución local) · Supuestos: 1 desarrollador, 1 host, sin tráfico externo, sin storage gestionado, stack completo con observabilidad.

| Concepto | Estimación |
| :-- | :-- |
| Costo mensual estimado | ~USD 0 en infraestructura + amortización de la estación (~USD 40–85/mes) |
| Costo anual estimado | ~USD 0 + ~USD 500–1 000/año de amortización de hardware |
| Costo de implementación inicial | ~USD 0 (software OSS; horas de setup: 0.5–1 día/desarrollador) |
| Costo operativo estimado | ~USD 0 directo; electricidad y mantenimiento del equipo del desarrollador |

**Variables que afectan el costo:** gama de la laptop/workstation (amortización a 3 años sobre USD 1 500–3 000), tarifa eléctrica local y licencia de Docker Desktop (gratuita para uso individual/empresas pequeñas; de pago según tamaño de organización — evaluable frente a Docker Engine/Podman en Linux). No hay costo de nube porque no hay nube.

## 7. Operación, monitoreo, seguridad, recuperación

- **Operación:** `docker compose up -d` levanta el stack; `docker compose down -v` lo destruye con sus volúmenes. Reconstrucción de imágenes con BuildKit y el secret de NuGet: `GH_TOKEN=$(gh auth token) docker compose build ums-api`.
- **Monitoreo:** Grafana en `localhost:3000` con Prometheus/Loki/Tempo aprovisionados; healthchecks por servicio visibles en `docker compose ps`.
- **Seguridad:** ambiente de confianza local, sin exposición a Internet; credenciales de desarrollo bien conocidas y **no reutilizables** fuera de local. El escaneo de secretos (gitleaks, allowlist de fixtures) corre en el `pre-push` ([ADR-0106](../../../adrs/core/0106-seguridad-calidad-local-first.es.md)).
- **Recuperación:** no hay DR; la "recuperación" es `down -v && up` reconstruyendo el estado (seeding de datos de desarrollo con `Persistence__SeedDevData=true`). Los volúmenes (`postgres_data`, `grafana_data`, etc.) sobreviven a un `down` sin `-v`, pero no son un backup gobernado.

## 8. Cuándo usar / Ventajas y desventajas

**Cuándo conviene:** *inner loop* diario del desarrollador — codificar, depurar y correr pruebas de integración contra dependencias reales (Postgres/Redis/OTel) sin la latencia ni el consumo de un clúster. Es el punto de partida por defecto y la base de los Testcontainers de integración.

| Ventajas | Desventajas |
| :-- | :-- |
| Arranque en minutos; curva de aprendizaje mínima | Sin paridad con producción: no hay manifests K8s, Ingress, Services ni HPA |
| Consumo de recursos moderado frente a Kubernetes local | Una réplica por servicio; sin HA ni escalado real |
| Mismo pipeline OpenTelemetry que Kind/producción | Secretos y red simplificados (no representan el modelo de prod) |
| Reproducible y descartable (`down -v && up`) | No valida los charts Helm ni el modelo de despliegue real |
| Base natural para Testcontainers e integración | Broker real (RabbitMQ) no presente; transporte in-memory local |

**Docker vs Kind:** usa **Docker Compose** para el desarrollo diario y las pruebas de integración (rápido, ligero). Cambia a **[Kind](../kind/README.md)** cuando necesites validar los *manifests*/Helm reales, el Ingress, los Services y el comportamiento en Kubernetes antes de tocar QA/producción.

## 9. Relación con el SDLC de UNIMAR-ARCH

Aplica en la **Fase 5 (Entrega y Operaciones)** como ambiente de desarrollo, y transversalmente en el *inner loop* de todas las fases de construcción. La gobiernan [ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md) (Fase 1 = Compose), [ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md) (infraestructura tras Puertos), [ADR-0039](../../../adrs/core/0039-switcher-abstraccion-topologia-despliegue.es.md) (`DEPLOYMENT_TOPOLOGY`) y [ADR-0106](../../../adrs/core/0106-seguridad-calidad-local-first.es.md) (puertas local-first). La adopción por producto se registra en el `DECISIONS.md` del satélite y los hallazgos en su `GAPS.md`.

**Hallazgos detectados (registrar en `GAPS.md` del satélite):**
- **Dos Compose divergentes en UMS:** `src/docker-compose.yml` (mínimo: `postgres:16-alpine`, BD `UmsReadModel`, puerto `5433`, sólo db+pgadmin) contra `src/infra/local/compose/docker-compose.yml` (completo: `postgres:15-alpine`, BD `UmsDev`, puerto `5432`). Versiones, nombres de BD y puertos distintos: riesgo de confusión. Conviene consolidar o documentar el propósito de cada uno.
- **Broker AMQP ausente en local:** el transporte es in-memory; el patrón Outbox se ejercita, pero el broker RabbitMQ autorizado no se valida hasta ambientes superiores.

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-07-22
</p>
