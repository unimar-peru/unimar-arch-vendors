# Ejemplo Q-Track — Módulo 5: Infraestructura y Despliegue

> **Ruta:** [Plan de Implementación](../../plan-implementacion-arquitectura.md) → [Hub Módulo 5](../hubs/modulo-5.md) → [Plantilla](./modulo-5-template.md) → Ejemplo Q-Track

Sesión real completamente diligenciada usando el proyecto **Q-Track (Gestor de Colas de Camiones)** como caso de referencia.

---

# Sesión: Módulo 5 — Infraestructura y Despliegue (Docker + Pipeline + OTel)

**Fecha:** 2025-03-24 al 2025-03-28   **Duración:** 1 semana (1 sesión teórica + 2 talleres + certificación)
**Facilitador:** Alberto Arroyo   **Participantes:** Desarrollo, Infraestructura

---

## Propósito de la Sesión

Llevar Q-Track del estado "funciona en mi máquina" a "funciona en cualquier máquina de forma predecible y observable". Al finalizar, el equipo contará con un Dockerfile multi-stage optimizado que reduce el tamaño de la imagen en un 80%, un pipeline CI/CD con 3 etapas automáticas, instrumentación OpenTelemetry activa para trazas y métricas, y las Notas de Lanzamiento v1.0 que certifican formalmente el primer Release Candidate desplegable de Q-Track.

---

## Pre-work Obligatorio

- [x] Docker Desktop instalado y funcionando (verificado en Módulo 4)
- [x] Revisar el RC Sellado del Módulo 4 (es el insumo para las Release Notes)
- [x] Leer Docker multi-stage builds: [https://docs.docker.com/build/building/multi-stage/](https://docs.docker.com/build/building/multi-stage/)
- [x] Leer OpenTelemetry para Node.js: [https://opentelemetry.io/docs/languages/js/](https://opentelemetry.io/docs/languages/js/)

---

## Agenda

| Bloque | Actividad | Duración | Prompt IA |
| :--- | :--- | :--- | :--- |
| 1 | Apertura: "El costo de un despliegue manual fallido" (caso real UNIMAR) | 15 min | — |
| 2 | Docker multi-stage: Stage Build (TypeScript) → Stage Runtime (JS optimizado) | 20 min | [Prompt 1: Explicar Multi-Stage](../prompts/modulo-5-prompts.md#prompt-1-explicar-multi-stage) |
| 3 | Pipelines CI/CD: las 3 etapas clave (lint, test, docker build) | 20 min | — |
| 4 | OpenTelemetry: los 3 pilares de observabilidad (métricas, trazas, logs) | 20 min | — |
| 5 | Release Notes como comunicación ejecutiva, no como changelog técnico | 15 min | — |
| — | BREAK | 10 min | — |
| 6 | Facilitador escribe Dockerfile multi-stage de Q-Track en vivo | 45 min | [Prompt 2: Generar Dockerfile](../prompts/modulo-5-prompts.md#prompt-2-generar-dockerfile) |
| 7 | `docker build -t q-track:v1.0 .` — ver la construcción capa a capa | 20 min | — |
| 8 | `docker run -p 3000:3000 q-track:v1.0` + `curl` para verificar endpoints | 20 min | — |
| — | BREAK 15 min | 15 min | — |
| 9 | Cada participante crea su Dockerfile en su rama feature/ | 45 min | — |
| 10 | Configurar pipeline CI/CD con las 3 etapas | 60 min | [Prompt 3: Generar Pipeline](../prompts/modulo-5-prompts.md#prompt-3-generar-pipeline) |
| 11 | Instalar OpenTelemetry SDK + configurar `tracing.ts` | 40 min | [Prompt 4: Instrumentar OTel](../prompts/modulo-5-prompts.md#prompt-4-instrumentar-otel) |
| 12 | Verificar traza en logs al hacer un request al API | 20 min | — |
| 13 | Redactar Release Notes v1.0 con OpenCode | 40 min | [Prompt 5: Generar Release Notes](../prompts/modulo-5-prompts.md#prompt-5-generar-release-notes) |
| 14 | Commit + PR + Quality Gate final | 20 min | [Prompt 6: Checklist Despliegue](../prompts/modulo-5-prompts.md#prompt-6-checklist-despliegue) |

---

## Entregable de la Sesión (Quality Gate)

- **Qué debe producir el equipo:**
  1. `Dockerfile` multi-stage en la raíz del proyecto Q-Track
  2. Configuración del pipeline CI/CD con 3 etapas
  3. `src/tracing.ts` con instrumentación OpenTelemetry básica
  4. Notas de Lanzamiento en `docs/planning-artifacts/release-notes-q-track-v1.md`
- **Criterios de aceptación (los 5 deben cumplirse):**
  - [x] `docker build -t q-track:v1.0 .` sin errores (log adjunto)
  - [x] `curl http://localhost:3000/turnos` respondiendo 200 desde el contenedor
  - [x] Pipeline con etapas: lint ✓, test + cobertura ✓, docker build ✓
  - [x] Traza OTel visible en logs al hacer un request al API (captura adjunta)
  - [x] Release Notes con: versión, cambios, calidad certificada, instrucciones de despliegue
- **Forma de entrega:** Pull Request: `feature/infraestructura-deploy-q-track` → `develop`
- **Regla de oro:** Una imagen Docker que no pasa el `docker run` no es un entregable. El despliegue debe ser reproducible en cualquier máquina del equipo.

---

## Recursos y Herramientas

| Herramienta | Propósito | Enlace |
| :--- | :--- | :--- |
| Docker Desktop | Motor de contenedores | [docker.com](https://www.docker.com/products/docker-desktop/) |
| OpenTelemetry Node.js SDK | Instrumentación automática | [opentelemetry.io](https://opentelemetry.io/docs/languages/js/) |
| GitHub Actions | CI/CD de UNIMAR | [docs.github.com/actions](https://docs.github.com/en/actions) |
| OpenCode | Generación de Release Notes | Intranet UNIMAR |
| RC Sellado (Módulo 4) | Insumo para las Release Notes | `docs/planning-artifacts/rc-sellado-q-track-v1.md` |

---

## Dockerfile Multi-stage — Q-Track v1.0

```dockerfile
# Stage 1: Build — compila TypeScript a JavaScript
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# Stage 2: Runtime — imagen final optimizada sin devDependencies (~80 MB)
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

---

## Configuración OpenTelemetry — tracing.ts

```typescript
// src/tracing.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';

const sdk = new NodeSDK({
  traceExporter: new ConsoleSpanExporter(), // En prod: OTLPTraceExporter hacia Tempo
  instrumentations: [getNodeAutoInstrumentations()],
  serviceName: 'q-track-api',
});

sdk.start();
// Registrar en el entry point: import './tracing'; (primera línea de index.ts)
```

---

## Notas del Facilitador

- Tener preparado el Dockerfile antes de la sesión y verificar que construye correctamente en la misma versión de Node.js del equipo.
- La diferencia de tamaño entre imagen sin multi-stage (~400 MB) vs. con multi-stage (~80 MB) es el argumento más visual y efectivo para justificar el patrón.
- OpenTelemetry puede ser intimidante. Empezar con `ConsoleSpanExporter` (logs en terminal) para hacer la traza visible sin infraestructura adicional. El objetivo es que el equipo VEA la traza.
- Las Release Notes deben poder leerse por Gerencia sin conocimiento técnico. Si contienen jerga de programación sin explicar, pedir al equipo que las reformule.

---

## Evidencias de Certificación

- [x] Log de `docker build -t q-track:v1.0 .` sin errores
- [x] Captura de `curl http://localhost:3000/turnos` respondiendo 200 desde el contenedor
- [x] Captura de la traza OTel en logs al hacer un request al API
- [x] Release Notes en `docs/planning-artifacts/release-notes-q-track-v1.md` completas
- [x] PR: `feature/infraestructura-deploy-q-track` → `develop`, estado: **Merged**

---

*Documento generado bajo el estándar del corpus arquitectónico de UNIMAR · Idioma: Español · Versión: 1.0*
