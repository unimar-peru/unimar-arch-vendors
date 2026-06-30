# Ejemplo Q-Track — Auditoría de Simulacro E2E

> **Módulo:** [6. Soporte y Retrospectiva](../../artefactos/modulo-6.md) · **Tipo:** Registro de Simulacro de Incidente

Ejemplo completamente diligenciado de la Auditoría de Simulacro para **Q-Track v1.0.0**.

---

# Auditoría de Simulacro E2E — Q-Track: Gestor de Colas de Camiones

**Versión:** 1.0   **Fecha del simulacro:** 2025-05-10 10:00   **Auditor:** Alberto Arroyo
**Sistema:** Q-Track   **Escenario simulado:** API no responde (HTTP 500)

---

## 1. Información del Simulacro

| Campo | Valor |
| :--- | :--- |
| **Sistema** | Q-Track v1.0.0 |
| **Versión** | v1.0.0 |
| **Fecha y Hora** | 2025-05-10 10:00 - 10:32 |
| **Duración** | 32 minutos |
| **Escenario Simulado** | Escenario 1: API no responde (HTTP 500 o timeout) |
| **Auditor** | Alberto Arroyo |
| **Equipo en Simulacro** | María Rodríguez (QA), Carlos Ruiz (Infraestructura), Jorge Salas (Operador) |

---

## 2. Objetivo del Simulacro

Validar la capacidad del equipo para detectar, diagnosticar y resolver un incidente de indisponibilidad total de la API, siguiendo el runbook de operaciones y manteniendo comunicación efectiva con stakeholders.

---

## 3. Cronología del Simulacro

| Tiempo | Evento |
| :--- | :--- |
| **T+0 min** (10:00) | **Incidente inyectado:** Auditor ejecuta `docker stop q-track` en entorno de staging |
| **T+3 min** (10:03) | Operador (Jorge Salas) reporta: "El sistema no carga, pantalla en blanco" |
| **T+5 min** (10:05) | QA (María Rodríguez) recibe alerta y abre runbook, Escenario 1 |
| **T+8 min** (10:08) | QA ejecuta Paso 1: `curl http://localhost:3000/health` → Connection refused |
| **T+10 min** (10:10) | QA ejecuta Paso 2: `docker ps \| grep q-track` → Contenedor no existe |
| **T+12 min** (10:12) | QA diagnostica: "Contenedor detenido, causa raíz desconocida" |
| **T+15 min** (10:15) | Infraestructura (Carlos Ruiz) ejecuta Paso 1: `docker restart q-track` |
| **T+18 min** (10:18) | QA verifica: `curl http://localhost:3000/health` → {"status":"ok","version":"1.0.0"} |
| **T+22 min** (10:22) | Operador valida en navegador: "El sistema carga, puedo ver la cola de camiones" |
| **T+25 min** (10:25) | QA registra incidente en Jira: QTRACK-INC-001 |
| **T+30 min** (10:30) | Auditor revisa logs: confirma que fue stop manual (simulacro) |
| **T+32 min** (10:32) | **Auditor declara simulacro completado** |

---

## 4. Evaluación de Desempeño

| Criterio | Umbral | Resultado | Estado |
| :--- | :--- | :--- | :--- |
| **Tiempo de Detección** | ≤ 5 min | 3 min | ☑ Pass |
| **Tiempo de Diagnóstico** | ≤ 15 min | 12 min | ☑ Pass |
| **Tiempo de Resolución** | ≤ 20 min | 15 min | ☑ Pass |
| **Uso Correcto del Runbook** | 100% pasos seguidos | 100% (5/5 pasos) | ☑ Pass |
| **Comunicación Efectiva** | Stakeholders notificados | ☑ Sí (Jorge informado en T+5) | ☑ Pass |
| **Validación con Usuario** | Operador confirma recuperación | ☑ Sí (T+22) | ☑ Pass |

---

## 5. Observaciones del Auditor

### Fortalezas Observadas

- ✅ **QA siguió el runbook al pie de la letra:** No se saltó ningún paso de diagnóstico
- ✅ **Comunicación clara:** QA informó a operador en cada cambio de estado
- ✅ **Infraestructura actuó rápido:** Carlos estuvo disponible en <5 minutos

### Oportunidades de Mejora

- 🔧 **Falta de automatización:** La detección fue manual (operador reportó). El health check de Prometheus debería haber alertado automáticamente
- 🔧 **Registro en Jira tardío:** El incidente se registró en T+25, debería ser en T+10 (después de diagnóstico)

### Desviaciones del Runbook

| Paso del Runbook | Fue seguido | Si no, ¿por qué? |
| :--- | :--- | :--- |
| Paso 1: Verificar salud del servicio | ☑ Sí | — |
| Paso 2: Verificar estado del contenedor | ☑ Sí | — |
| Paso 3: Revisar logs recientes | ☐ No | QA saltó este paso porque el diagnóstico ya era claro (contenedor no existe) |
| Paso 4: Consulta en Loki | ☐ No | No fue necesario, causa raíz ya identificada |
| Paso 5: Restart del contenedor | ☑ Sí | — |

**Justificación de desviaciones:** El equipo diagnosticó rápidamente que el contenedor no existía, haciendo innecesarios los pasos 3 y 4. **Decisión aceptada** por el auditor: el runbook es una guía, no un script ciego.

---

## 6. Resultado del Simulacro

- ☑ **APROBADO** — El equipo resolvió el incidente dentro de los umbrales aceptables

**Puntuación Total:** 6/6 puntos (100%)

**Tiempo Total de Resolución:** 15 minutos (Umbral: ≤ 20 minutos)

---

## 7. Acciones de Mejora

| Acción | Responsable | Fecha límite | Cómo se medirá el éxito |
| :--- | :--- | :--- | :--- |
| **Configurar alerta automática de health check en Prometheus** | Carlos Ruiz | 2025-05-17 | Alerta se dispara automáticamente cuando health check falla |
| **Actualizar runbook: Registrar incidente en Jira después de diagnóstico (T+10)** | Alberto Arroyo | 2025-05-15 | Runbook v1.1 incluye paso explícito de registro en Jira |
| **Simular escenario de base de datos en próximo sprint** | María Rodríguez | 2025-05-24 | Segundo simulacro ejecutado y aprobado |

---

## 8. Firmas

**Auditor:** Alberto Arroyo   **Fecha:** 2025-05-10

**Responsable Técnico:** Alberto Arroyo   **Fecha:** 2025-05-10

**Representante del Equipo:** Jorge Salas   **Fecha:** 2025-05-10

---

*Ejemplo Q-Track generado bajo el estándar del corpus arquitectónico de UNIMAR · Idioma: Español · Versión: 1.0*
