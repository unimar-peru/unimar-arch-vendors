# Plantilla Vacía — Auditoría de Simulacro E2E

> **Módulo:** [6. Soporte y Retrospectiva](../../artefactos/modulo-6.md) · **Tipo:** Registro de Simulacro de Incidente

Copia esta plantilla, completa los detalles del simulacro y commitéala después de ejecutar el simulacro E2E.

---

# Auditoría de Simulacro E2E — [Nombre del Sistema]

**Versión:** ___   **Fecha del simulacro:** ___________   **Auditor:** ___________
**Sistema:** [Nombre del sistema]   **Escenario simulado:** [Nombre del incidente]

---

## 1. Información del Simulacro

| Campo | Valor |
| :--- | :--- |
| **Sistema** | [Nombre del sistema] |
| **Versión** | [vMAJOR.MINOR.PATCH] |
| **Fecha y Hora** | [YYYY-MM-DD HH:MM] |
| **Duración** | [X] minutos |
| **Escenario Simulado** | [Nombre del incidente del runbook] |
| **Auditor** | [Nombre del facilitador o auditor] |
| **Equipo en Simulacro** | [Lista de participantes] |

---

## 2. Objetivo del Simulacro

[Describir qué se está validando: capacidad de detección, diagnóstico, resolución, escalamiento, uso del runbook]

---

## 3. Cronología del Simulacro

| Tiempo | Evento |
| :--- | :--- |
| **T+0 min** | [Describir incidente inyectado: ej: "API deja de responder"] |
| **T+[X] min** | [ej: "Operador reporta incidente a soporte"] |
| **T+[X] min** | [ej: "Soporte inicia diagnóstico con runbook"] |
| **T+[X] min** | [ej: "Se identifica causa raíz: base de datos no responde"] |
| **T+[X] min** | [ej: "Se ejecuta resolución: restart de contenedor"] |
| **T+[X] min** | [ej: "Sistema se recupera, health check OK"] |
| **T+[X] min** | [ej: "Se valida con operador que el sistema funciona"] |
| **T+[X] min** | [ej: "Auditor declara simulacro completado"] |

---

## 4. Evaluación de Desempeño

| Criterio | Umbral | Resultado | Estado |
| :--- | :--- | :--- | :--- |
| **Tiempo de Detección** | ≤ [X] min | [X] min | ☐ Pass ☐ Fail |
| **Tiempo de Diagnóstico** | ≤ [X] min | [X] min | ☐ Pass ☐ Fail |
| **Tiempo de Resolución** | ≤ [X] min | [X] min | ☐ Pass ☐ Fail |
| **Uso Correcto del Runbook** | 100% pasos seguidos | [X]% | ☐ Pass ☐ Fail |
| **Comunicación Efectiva** | Stakeholders notificados | ☐ Sí ☐ No | ☐ Pass ☐ Fail |
| **Validación con Usuario** | Operador confirma recuperación | ☐ Sí ☐ No | ☐ Pass ☐ Fail |

---

## 5. Observaciones del Auditor

### Fortalezas Observadas

- ✅ [Observación positiva 1]
- ✅ [Observación positiva 2]

### Oportunidades de Mejora

- 🔧 [Área de mejora 1]
- 🔧 [Área de mejora 2]

### Desviaciones del Runbook

| Paso del Runbook | Fue seguido | Si no, ¿por qué? |
| :--- | :--- | :--- |
| [Paso 1] | ☐ Sí ☐ No | [Razón si no fue seguido] |
| [Paso 2] | ☐ Sí ☐ No | |

---

## 6. Resultado del Simulacro

- ☐ **APROBADO** — El equipo resolvió el incidente dentro de los umbrales aceptables
- ☐ **APROBADO CON OBSERVACIONES** — El equipo resolvió el incidente pero hay áreas de mejora
- ☐ **REPROBADO** — El equipo no resolvió el incidente dentro de los umbrales, requiere re-entrenamiento

**Puntuación Total:** [X]/[Y] puntos ([Z]%)

**Tiempo Total de Resolución:** [X] minutos (Umbral: ≤ [Y] minutos)

---

## 7. Acciones de Mejora

| Acción | Responsable | Fecha límite | Cómo se medirá el éxito |
| :--- | :--- | :--- | :--- |
| [Acción 1] | [Nombre] | [Fecha] | [Métrica] |
| [Acción 2] | [Nombre] | [Fecha] | [Métrica] |

---

## 8. Firmas

**Auditor:** ___________   **Fecha:** ___________

**Responsable Técnico:** ___________   **Fecha:** ___________

**Representante del Equipo:** ___________   **Fecha:** ___________

---

*Plantilla generada bajo el estándar del corpus arquitectónico de UNIMAR · Idioma: Español · Versión: 1.0*
