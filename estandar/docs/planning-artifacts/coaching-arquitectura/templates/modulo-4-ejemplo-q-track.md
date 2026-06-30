# Ejemplo Q-Track — Módulo 4: Calidad e Integración

> **Ruta:** [Plan de Implementación](../../plan-implementacion-arquitectura.md) → [Hub Módulo 4](../hubs/modulo-4.md) → [Plantilla](./modulo-4-template.md) → Ejemplo Q-Track

Sesión real completamente diligenciada usando el proyecto **Q-Track (Gestor de Colas de Camiones)** como caso de referencia.

---

# Sesión: Módulo 4 — Calidad e Integración (Testcontainers + RC Sellado)

**Fecha:** 2025-03-10 al 2025-03-20   **Duración:** 2 semanas (1 sesión teórica + 3 talleres + certificación)
**Facilitador:** Alberto Arroyo   **Participantes:** Desarrollo, QA

---

## Propósito de la Sesión

Cerrar el ciclo de construcción de Q-Track con pruebas de integración sobre infraestructura real mediante Testcontainers. A diferencia de los tests unitarios con mocks, aquí el API de Q-Track se ejecuta contra PostgreSQL real, detectando bugs que los mocks ocultan. Al finalizar, el equipo contará con una suite de 5 escenarios críticos ejecutándose en verde y el Test Summary Report (RC Sellado) que certifica formalmente que Q-Track está listo para ser empaquetado y desplegado en el Módulo 5.

---

## Pre-work Obligatorio

- [x] Docker Desktop instalado y funcionando (`docker ps` sin errores)
- [x] Revisar el código del Módulo 3 (3 endpoints con Arquitectura Hexagonal)
- [x] Leer introducción a Testcontainers: [https://testcontainers.com/](https://testcontainers.com/)
- [x] Leer Pirámide de Testing: [https://martinfowler.com/articles/practical-test-pyramid.html](https://martinfowler.com/articles/practical-test-pyramid.html)

---

## Agenda

| Bloque | Actividad | Duración | Prompt IA |
| :--- | :--- | :--- | :--- |
| 1 | Apertura: "El bug que solo el test de integración habría encontrado" (demo viva) | 15 min | — |
| 2 | Pirámide de Testing mapeada a Q-Track: unitarios vs. integración vs. E2E | 20 min | [Prompt 1: Explicar Pirámide](../prompts/modulo-4-prompts.md#prompt-1-explicar-pirámide) |
| 3 | ¿Por qué los mocks nos mienten? Mock de repo oculta incompatibilidad de tipos | 15 min | — |
| 4 | Testcontainers en 10 minutos: arquitectura, Docker efímero, lifecycle del test | 10 min | — |
| — | BREAK | 10 min | — |
| 5 | Facilitador instala Testcontainers + configura primer test en vivo | 60 min | [Prompt 2: Configurar Testcontainers](../prompts/modulo-4-prompts.md#prompt-2-configurar-testcontainers) |
| 6 | `docker ps` durante y después del test: ver el contenedor nacer y morir | 10 min | — |
| — | BREAK 15 min | 15 min | — |
| 7 | Cada participante replica el primer test en su proyecto | 45 min | — |
| 8 | Escribir los 5 escenarios críticos de Q-Track (asignados por facilitador) | 90 min | [Prompt 3: Generar Tests Integración](../prompts/modulo-4-prompts.md#prompt-3-generar-tests-integración) |
| 9 | Ejecutar la suite completa y verificar que todos estén en verde | 20 min | — |
| 10 | Integrar tests de integración al pipeline CI | 60 min | — |
| 11 | Generar reporte de cobertura del adaptador de base de datos | 30 min | — |
| 12 | Redactar Test Summary Report (RC Sellado) con OpenCode | 60 min | [Prompt 5: Generar Reporte](../prompts/modulo-4-prompts.md#prompt-5-generar-reporte) |
| 13 | Commit + PR + Quality Gate final | 20 min | [Prompt 6: Validar RC](../prompts/modulo-4-prompts.md#prompt-6-validar-rc) |

---

## Entregable de la Sesión (Quality Gate)

- **Qué debe producir el equipo:**
  1. Suite de 5 tests de integración en `tests/integration/` ejecutándose contra PostgreSQL real
  2. Test Summary Report (RC Sellado) en `docs/planning-artifacts/rc-sellado-q-track-v1.md`
- **Criterios de aceptación (los 5 deben cumplirse):**
  - [x] `npm run test:integration` en verde sin errores (5/5 escenarios)
  - [x] Escenarios cubiertos: crear turno, avanzar, cerrar, consultar, cola completa
  - [x] Cobertura del adaptador `PostgresTurnoRepo` documentada (objetivo ≥ 80%)
  - [x] RC Sellado con todos los campos completos y estado **SELLADO**
  - [x] Pipeline CI configurado para ejecutar integración en cada push a `develop`
- **Forma de entrega:** Pull Request: `feature/tests-integracion-q-track` → `develop`
- **Regla de oro:** Un RC Sellado con tests en rojo no existe. Si hay tests rojos, el RC no se emite y el equipo continúa en el taller.

---

## Recursos y Herramientas

| Herramienta | Propósito | Enlace |
| :--- | :--- | :--- |
| Testcontainers | Contenedores efímeros para tests reales | [testcontainers.com](https://testcontainers.com/) |
| Docker Desktop | Motor de contenedores requerido | [docker.com](https://www.docker.com/products/docker-desktop/) |
| Testcontainers PostgreSQL (Node) | Módulo de PostgreSQL efímero | [node.testcontainers.org](https://node.testcontainers.org/modules/postgresql/) |
| Jest | Runner de tests con cobertura | [jestjs.io](https://jestjs.io/) |
| OpenCode | Generación del RC Sellado | Intranet UNIMAR |
| Pirámide de Testing | Marco conceptual de referencia | [martinfowler.com](https://martinfowler.com/articles/practical-test-pyramid.html) |

---

## Test Summary Report (RC Sellado) — Q-Track v1.0

| Campo | Valor |
| :--- | :--- |
| Producto | Q-Track — Gestor de Colas de Camiones |
| Versión | v1.0 |
| Fecha de emisión | 2025-03-19 |
| Total de escenarios de integración | 5 |
| Escenarios en verde | 5 |
| Escenarios en rojo | 0 |
| Cobertura del adaptador `PostgresTurnoRepo` | 87% |
| Responsable técnico | Alberto Arroyo |
| Estado del RC | **SELLADO** ✅ |

### Detalle de Escenarios

| # | Escenario | Estado | Tiempo |
| :--- | :--- | :--- | :--- |
| 1 | `POST /turnos` — Crear turno en PostgreSQL real | ✅ Verde | 1.2 s |
| 2 | `GET /turnos/{id}` — Consultar turno persistido | ✅ Verde | 0.8 s |
| 3 | `PATCH /turnos/{id}/avanzar` — PENDIENTE → EN_PROCESO | ✅ Verde | 0.9 s |
| 4 | `PATCH /turnos/{id}/avanzar` — Rechaza turno CERRADO | ✅ Verde | 0.7 s |
| 5 | Cola completa — Flujo secuencial de 3 camiones | ✅ Verde | 2.1 s |

---

## Notas del Facilitador

- Verificar que todos tienen Docker Desktop corriendo ANTES de la sesión. Dedicar 10 minutos al inicio para verificar. Si alguien no tiene Docker, no puede seguir con los tests de integración.
- El "bug que los mocks no detectan" es el gancho pedagógico más poderoso del módulo. Tener preparado un ejemplo concreto de Q-Track donde un mock oculta una incompatibilidad de tipo de dato entre TypeScript y PostgreSQL.
- El RC Sellado es un documento ejecutivo. Mostrarlo a Gerencia como evidencia formal de que el equipo no solo "cree que funciona" sino que tiene pruebas verificables.
- Si la suite de integración tarda más de 30 segundos, investigar. Tests lentos no se ejecutan con regularidad y pierden su valor de guardianes del sistema.

---

## Evidencias de Certificación

- [x] Log de `npm run test:integration`: 5/5 escenarios en verde
- [x] RC Sellado en `docs/planning-artifacts/rc-sellado-q-track-v1.md` con estado **SELLADO**
- [x] Pipeline CI con etapa de integración en el historial de GitHub Actions
- [x] PR: `feature/tests-integracion-q-track` → `develop`, estado: **Merged**

---

*Documento generado bajo el estándar del corpus arquitectónico de UNIMAR · Idioma: Español · Versión: 1.0*
