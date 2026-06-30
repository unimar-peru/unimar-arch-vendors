# Prompt Library — Módulo 5 (Infraestructura y Despliegue)

> **Módulo:** Módulo 5 · **Tipo:** Biblioteca de Prompts para IA  
> **Herramientas:** OpenCode, BMAD Method v6.8.0, Docker, GitHub Actions, OpenTelemetry

---

## Propósito

Este documento contiene los prompts exactos para ejecutar cada actividad del Módulo 5 con asistencia de IA.

---

## Agenda con Prompts

| Bloque | Actividad | Duración | Prompt |
| :--- | :--- | :--- | :--- |
| 2 | Docker multi-stage: teoría | 20 min | [Prompt 1: Explicar Multi-Stage](#prompt-1-explicar-multi-stage) |
| 3 | Creación de Dockerfile optimizado | 45 min | [Prompt 2: Generar Dockerfile](#prompt-2-generar-dockerfile) |
| 4 | Configuración de pipeline CI/CD | 60 min | [Prompt 3: Generar Pipeline](#prompt-3-generar-pipeline) |
| 6 | Instrumentación OpenTelemetry | 45 min | [Prompt 4: Instrumentar OTel](#prompt-4-instrumentar-otel) |
| 8 | Generación de Release Notes | 45 min | [Prompt 5: Generar Release Notes](#prompt-5-generar-release-notes) |
| 10 | Checklist de despliegue | 30 min | [Prompt 6: Checklist Despliegue](#prompt-6-checklist-despliegue) |

---

## Prompt 1: Explicar Multi-Stage

**Propósito:** Generar explicación de Docker multi-stage builds.

**Cuándo usar:** Bloque 2 — 20 min

**Prompt:**

```
Actúa como un DevOps Engineer experto en Docker y optimización de imágenes.

Explica Docker multi-stage builds y por qué es importante para Q-Track.

Incluye:

1. **Problema sin multi-stage:**
   - Imagen con todo: Node.js, TypeScript, node_modules, código fuente
   - Tamaño: ~800 MB
   - Vulnerabilidades: muchas dependencias de desarrollo expuestas

2. **Solución con multi-stage:**
   - **Stage 1 (Build):** Compila TypeScript a JavaScript
   - **Stage 2 (Runtime):** Solo JavaScript compilado + dependencias de producción
   - Tamaño final: ~80 MB (90% más pequeño)

3. **Diagrama Mermaid:**
   - Muestra los 2 stages como cajas separadas
   - Flecha mostrando qué se copia del Stage 1 al Stage 2
   - Comparación de tamaños (800 MB vs 80 MB)

4. **Beneficios:**
   - **Seguridad:** Menos superficie de ataque (sin dev dependencies)
   - **Performance:** Imagen más pequeña = pull más rápido en producción
   - **Costo:** Menos almacenamiento en registry, menos tiempo de deploy

5. **Ejemplo Q-Track:**
   - Stage 1: Node 20 (build) + TypeScript + `npm run build`
   - Stage 2: Node 20 (slim) + solo `node_modules` de producción + `dist/`

6. **Errores comunes:**
   - Copiar todo el directorio en lugar de solo `dist/`
   - Olvidar `.dockerignore` (incluye archivos innecesarios)
   - No usar imagen `slim` o `alpine` en stage runtime

Formato de salida:
- Explicación del problema y solución
- Diagrama Mermaid visual
- Lista de beneficios
- Ejemplo de Dockerfile
- Lista de errores comunes

Audiencia: Desarrolladores aprendiendo Docker multi-stage.
Tono: Didáctico, con comparaciones de tamaño.
```

**Salida esperada:** Explicación visual + ejemplo de Dockerfile.

---

## Prompt 2: Generar Dockerfile

**Propósito:** Generar Dockerfile multi-stage optimizado para Q-Track.

**Cuándo usar:** Bloque 3 — 45 min

**Prompt:**

```
Actúa como un DevOps Engineer experto en Docker y Node.js.

Genera un Dockerfile multi-stage optimizado para Q-Track (API NestJS + TypeScript).

**Requisitos:**

1. **Stage 1: Build**
   - Base: `node:20-alpine`
   - Instalar dependencias de build (TypeScript, etc.)
   - Copiar `package.json` y `package-lock.json`
   - Ejecutar `npm ci` (instalación limpia)
   - Copiar código fuente
   - Ejecutar `npm run build` (TypeScript → JavaScript)

2. **Stage 2: Runtime**
   - Base: `node:20-alpine` (nueva instancia, sin código fuente)
   - Instalar solo dependencias de producción (`npm ci --only=production`)
   - Copiar `dist/` del Stage 1
   - Copiar `package.json` y `package-lock.json`
   - Exponer puerto 3000
   - Comando: `node dist/main.js`

3. **Optimizaciones:**
   - `.dockerignore` para excluir `node_modules`, `dist/`, `.git`, etc.
   - Usar `npm ci` en lugar de `npm install` (más rápido, determinista)
   - Ejecutar como usuario no-root (seguridad)
   - Labels con metadata (versión, maintainer)

4. **Verificación:**
   - Comando para build: `docker build -t q-track:v1.0 .`
   - Comando para test: `docker run -p 3000:3000 q-track:v1.0`
   - Comando para verificar tamaño: `docker images q-track`

5. **Comparación esperada:**
   - Sin multi-stage: ~800 MB
   - Con multi-stage: ~80 MB

Formato de salida:
- Dockerfile completo con comentarios
- `.dockerignore` recomendado
- Comandos de build, test y verificación
- Explicación de cada sección

Audiencia: Desarrolladores creando Dockerfile por primera vez.
Tono: Instruccional, con explicación de decisiones.
```

**Salida esperada:** Dockerfile completo listo para usar + comandos de verificación.

---

## Prompt 3: Generar Pipeline

**Propósito:** Generar pipeline CI/CD con GitHub Actions.

**Cuándo usar:** Bloque 4 — 60 min

**Prompt:**

```
Actúa como un DevOps Engineer experto en GitHub Actions y CI/CD.

Genera un pipeline CI/CD completo para Q-Track con GitHub Actions.

**Requisitos:**

1. **Estructura del pipeline:**
   - Trigger: push a `develop` o `main`, pull requests
   - 3 etapas: lint ✓, test + cobertura ✓, docker build ✓

2. **Stage 1: Lint**
   - Ejecutar `npm run lint`
   - Fallar si hay errores de ESLint
   - Duración esperada: < 1 min

3. **Stage 2: Test + Cobertura**
   - Ejecutar `npm run test:coverage`
   - Verificar cobertura ≥ 80% en `src/domain/`
   - Subir reporte a GitHub Actions artifacts
   - Duración esperada: 5-10 min

4. **Stage 3: Docker Build**
   - Build de imagen: `docker build -t q-track:${{ github.sha }} .`
   - Test de la imagen: `docker run q-track:${{ github.sha }} npm run test`
   - Push a registry (si es `main`): `docker push registry.unimar.com.pe/q-track:${{ github.sha }}`
   - Duración esperada: 3-5 min

5. **Configuración de secrets:**
   - `REGISTRY_URL`: registry.unimar.com.pe
   - `REGISTRY_USER`: usuario de registry
   - `REGISTRY_PASSWORD`: password de registry

6. **Notificaciones:**
   - Slack/Teams si el pipeline falla en `main`
   - Comment en PR con resultado de tests

7. **Ejemplo de workflow:**
   ```yaml
   name: CI/CD Pipeline
   
   on:
     push:
       branches: [develop, main]
     pull_request:
       branches: [develop]
   
   jobs:
     lint:
       # ...
     test:
       # ...
     docker:
       # ...
   ```

Formato de salida:
- Archivo `.github/workflows/ci-cd.yml` completo
- Explicación de cada job
- Configuración de secrets requeridos
- Instrucciones para configurar notificaciones

Audiencia: Desarrolladores configurando CI/CD por primera vez.
Tono: Instruccional, paso a paso.
```

**Salida esperada:** Pipeline CI/CD completo listo para commitear.

---

## Prompt 4: Instrumentar OTel

**Propósito:** Generar configuración de OpenTelemetry para Q-Track.

**Cuándo usar:** Bloque 6 — 45 min

**Prompt:**

```
Actúa como un SRE experto en OpenTelemetry y observabilidad.

Genera configuración de OpenTelemetry para Q-Track (Node.js + NestJS).

**Requisitos:**

1. **Instalación:**
   ```bash
   npm install @opentelemetry/api @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node
   ```

2. **Configuración de tracing:**
   - Crear archivo `src/tracing.ts`
   - Configurar OTel con exportador HTTP (para Loki/Tempo o Jaeger)
   - Auto-instrumentación para HTTP, PostgreSQL, Redis
   - Propagación de contextos (traceparent header)

3. **Configuración de logs:**
   - Logs estructurados en formato JSON
   - Incluir `trace_id` y `span_id` en cada log
   - Integración con Loki o ELK

4. **Configuración de métricas:**
   - Métricas automáticas: HTTP latency, DB query time
   - Métricas custom: turnos_por_patio, tiempo_espera_promedio
   - Exportador Prometheus o OTLP

5. **Ejemplo de uso en código:**
   ```typescript
   import { trace } from '@opentelemetry/api';
   
   const tracer = trace.getTracer('q-track');
   
   async function asignarTurno(placa: string) {
     return tracer.startActiveSpan('asignarTurno', async (span) => {
       span.setAttribute('placa', placa);
       // ... lógica
       span.end();
     });
   }
   ```

6. **Verificación:**
   - Hacer request a API: `curl http://localhost:3000/turnos`
   - Verificar traces en Jaeger/Tempo UI
   - Verificar logs con `trace_id` en Loki

Formato de salida:
- Comandos de instalación
- Archivo `src/tracing.ts` completo
- Ejemplo de uso en código
- Instrucciones de verificación

Audiencia: Desarrolladores instrumentando observabilidad.
Tono: Técnico, con ejemplos de código.
```

**Salida esperada:** Configuración OTel completa + ejemplos de uso.

---

## Prompt 5: Generar Release Notes

**Propósito:** Generar Release Notes completas para Q-Track v1.0.0.

**Cuándo usar:** Bloque 8 — 45 min

**Prompt:**

```
Actúa como un Tech Lead redactando Release Notes formales para Q-Track v1.0.0.

Genera Release Notes completas siguiendo esta estructura:

# Release Notes — Q-Track v1.0.0

**Versión:** 1.0.0   **Fecha de lanzamiento:** [FECHA]
**Autor(es):** [NOMBRES]   **Estado:** ☐ BORRADOR · ☐ APROBADO · ☐ PUBLICADO

## 1. Resumen del Release

[2-4 oraciones describiendo qué incluye esta versión y su propósito principal.]

## 2. Cambios Incluidos

### 🚀 Nuevas Funcionalidades

- [FEATURE-001] Implementación de API REST para gestión de turnos — [Autor]
- [FEATURE-002] Frontend web para operadores y supervisores — [Autor]
- [FEATURE-003] Integración con sistema UMS para autenticación SSO — [Autor]
- [FEATURE-004] Publicación de eventos a XMS para sistemas downstream — [Autor]

### 🐛 Corrección de Bugs

- [BUG-012] Validación de formato de placa no aceptaba camiones con remolque — [Autor]
- [BUG-015] Timeout en consulta de turnos cuando BD tenía >1000 registros — [Autor]

### Mejoras de Performance

- Optimización de queries de consulta de turno: de 350ms a 142ms (p95) — [Autor]
- Implementación de caché de sesiones en Redis: reducción de 40% en latencia de autenticación — [Autor]

### 📚 Documentación

- README con instrucciones de instalación y configuración — [Autor]
- Runbook de operaciones con 5 escenarios de incidente — [Autor]

## 3. Calidad Certificada

| Métrica | Resultado | Umbral | Estado |
| :--- | :--- | :--- | :--- |
| **Tests Unitarios** | [X]% pass rate | ≥ 95% | ☐ Pass ☐ Fail |
| **Cobertura de Código** | [X]% | ≥ 80% | ☐ Pass ☐ Fail |
| **Tests de Integración** | [X]/[Y] pass | 100% | ☐ Pass ☐ Fail |
| **Performance (p95)** | [X]ms | ≤ [Y]ms | ☐ Pass ☐ Fail |
| **Security Scan** | [X] vulnerabilidades | 0 críticas | ☐ Pass ☐ Fail |

**Test Summary Report:** [Enlace al RC sellado]

## 4. Instrucciones de Despliegue

### Pre-requisitos

- [ ] [Requisito 1, ej: PostgreSQL 15 disponible]
- [ ] [Requisito 2, ej: Variables de entorno configuradas]
- [ ] [Requisito 3, ej: Backup de base de datos realizado]

### Pasos de Despliegue

```bash
# 1. Pull de la nueva imagen
docker pull [registry]/[nombre-sistema]:v[VERSION]

# 2. Detener contenedor actual
docker stop [nombre-sistema]

# 3. Iniciar nueva versión
docker-compose up -d [nombre-sistema]

# 4. Verificar salud
curl http://localhost:[puerto]/health
```

### Rollback (si es necesario)

```bash
# Revertir a versión anterior
docker pull [registry]/[nombre-sistema]:v[VERSION_ANTERIOR]
docker stop [nombre-sistema]
docker-compose up -d [nombre-sistema]
```

## 5. Variables de Entorno

| Variable | Valor | Descripción |
| :--- | :--- | :--- |
| `[NOMBRE_VARIABLE]` | `[valor]` | [Descripción] |

## 6. Breaking Changes

☐ **Sí** — Hay cambios incompatibles hacia atrás
☐ **No** — Compatible con versiones anteriores

[Si hay breaking changes, describirlos aquí con instrucciones de migración]

## 7. Aprobaciones

| Rol | Nombre | Firma (commit hash) | Fecha |
| :--- | :--- | :--- | :--- |
| **Product Owner** | | | |
| **Tech Lead** | | | |
| **QA Lead** | | | |

Formato: Markdown con tablas completas.
Tono: Profesional, listo para publicación.
Longitud: 3-5 páginas.
```

**Salida esperada:** Release Notes completas listas para publicar.

---

## Prompt 6: Checklist Despliegue

**Propósito:** Generar checklist de despliegue a producción.

**Cuándo usar:** Bloque 10 — 30 min

**Prompt:**

```
Actúa como un SRE experto en despliegues a producción.

Genera una checklist de despliegue a producción para Q-Track v1.0.0.

## 1. Pre-Despliegue (D-1)

- [ ] Release Notes aprobadas por Product Owner y Tech Lead
- [ ] Test Summary Report en estado SELLADO
- [ ] Runbook de operaciones disponible y revisado
- [ ] Plan de rollback documentado y probado en staging
- [ ] Variables de entorno de producción validadas
- [ ] Backup de base de datos realizado (si es actualización)
- [ ] Equipo de soporte notificado del despliegue

## 2. Durante Despliegue (D-Day)

- [ ] Pipeline CI/CD en verde (último commit en `main`)
- [ ] Imagen Docker publicada en registry
- [ ] Health check de staging OK antes de producción
- [ ] Ventana de mantenimiento comunicada (si aplica)
- [ ] Equipo completo disponible (Dev, QA, Infra, Soporte)

## 3. Despliegue a Producción

- [ ] Pull de nueva imagen en servidor de producción
- [ ] Stop de contenedor actual
- [ ] Start de nueva versión
- [ ] Health check verificado: `curl http://localhost:3000/health`
- [ ] Logs verificados: no hay errores de inicio
- [ ] Monitoreo verificado: métricas fluyendo a Grafana/Loki

## 4. Post-Despliegue (D+1)

- [ ] Smoke tests ejecutados en producción (2-3 flujos críticos)
- [ ] Usuarios piloto validando funcionalidad (si aplica)
- [ ] Monitoreo de KPIs: error rate, latency, throughput
- [ ] Equipo de soporte capacitado en nuevo funcionalidad
- [ ] Documentación actualizada en wiki interna

## 5. Criterios de Éxito

**Despliegue exitoso si:**
- ✅ Health check OK por 30 minutos consecutivos
- ✅ Error rate < 1% en primera hora
- ✅ P95 latency dentro de SLA acordado
- ✅ Cero incidentes críticos reportados

**Rollback si:**
- ❌ Health check falla por 5+ minutos
- ❌ Error rate > 5% en primera hora
- ❌ Incidente crítico sin workaround

Formato de salida:
- Checklist completa con checkboxes
- Espacio para firma/responsable por ítem
- Sección de "Observaciones" y "Acciones Correctivas"

Audiencia: Equipo de despliegue (Dev, Infra, QA, Soporte).
Tono: Instruccional, sin ambigüedad.
```

**Salida esperada:** Checklist de despliegue lista para usar.

---

## Cómo Usar Esta Prompt Library

1. **Antes de la sesión:** El facilitador configura Docker y GitHub Actions
2. **Durante la sesión:** Los participantes generan Dockerfile, pipeline y Release Notes
3. **Después de la sesión:** Los prompts quedan disponibles para futuros deploy

### Mejores Prácticas

- ✅ **Multi-stage:** Siempre usa al menos 2 stages (build + runtime)
- ✅ **CI/CD:** No merges sin pipeline en verde
- ✅ **Observabilidad:** No deploy sin OTel instrumentado
- ✅ **Rollback:** Siempre prueba rollback antes de deploy

---

*Prompt Library del Módulo 5 · Corpus arquitectónico UNIMAR · Versión: 1.0*
