# Ejemplo Q-Track — Backlog Ágil BDD

> **Módulo:** [1. Requisitos y Producto](../../artefactos/modulo-1.md) · **Tipo:** Backlog de Historias de Usuario

Ejemplo completamente diligenciado del Backlog BDD para el proyecto **Q-Track (Gestor de Colas de Camiones)**.

---

# Backlog Ágil — Q-Track v1.0

**Versión:** 1.0   **Fecha:** 2025-01-31   **Autor(es):** Alberto Arroyo, Jorge Salas, Patricia Ruiz
**Referencia:** [PRD Q-Track](./prd-ejemplo-q-track.md)

---

## Priorización MoSCoW

| Símbolo | Significado |
| :--- | :--- |
| 🔴 **Must Have** | Imprescindible para el lanzamiento de Q-Track v1.0 |
| 🟡 **Should Have** | Importante pero no bloquea el MVP |
| 🟢 **Could Have** | Para versiones posteriores |
| ⚪ **Won't Have** | Descartado para v1.0 |

---

## Épica 1: Gestión de Turnos de Camiones

**Historia 1.1 — Asignación automática de turno al registrar ingreso** | 🔴 Must Have

> **Dado que** el Operador de Patio tiene sesión iniciada en Q-Track
> **Y** existe una cola activa para el patio Norte o Sur
> **Cuando** el Operador registra el ingreso del camión con su placa y número de declaración aduanera
> **Entonces** el sistema asigna automáticamente el número de turno correlativo
> **Y** el Conductor recibe una notificación con su número de turno vía XMS
> **Y** el turno queda en estado PENDIENTE en la cola del patio

**Criterios de aceptación adicionales:**
- [ ] El turno se asigna en menos de 2 segundos desde el registro
- [ ] El número de turno es único dentro de la sesión del patio activo
- [ ] La notificación al Conductor incluye: número de turno, patio asignado y tiempo estimado de espera

---

**Historia 1.2 — Avance de turno por el Operador** | 🔴 Must Have

> **Dado que** el Operador tiene sesión iniciada
> **Y** existe un turno en estado PENDIENTE o EN_PROCESO en la cola
> **Cuando** el Operador ejecuta la acción de avanzar el turno
> **Entonces** el turno cambia al siguiente estado (PENDIENTE → EN_PROCESO → COMPLETADO)
> **Y** el sistema registra la marca de tiempo del cambio de estado

---

**Historia 1.3 — Rechazo de avance de turno en estado CERRADO** | 🔴 Must Have

> **Dado que** el turno T-042 está en estado CERRADO
> **Cuando** el Operador intenta avanzar el turno T-042
> **Entonces** el sistema rechaza la operación con el mensaje "Turno cerrado, no se puede modificar"
> **Y** el turno permanece en estado CERRADO sin ningún cambio

---

**Historia 1.4 — Consulta de estado de turno por el Conductor** | 🔴 Must Have

> **Dado que** el Conductor conoce su número de turno
> **Cuando** el Conductor consulta el estado de su turno en Q-Track
> **Entonces** el sistema devuelve el estado actual (PENDIENTE / EN_PROCESO / COMPLETADO / CERRADO)
> **Y** el tiempo estimado de espera basado en los turnos anteriores en la misma cola

---

**Historia 1.5 — Cierre de turno por incumplimiento** | 🔴 Must Have

> **Dado que** el Operador ha llamado al turno T-038 y el Conductor no se presentó en 30 minutos
> **Cuando** el Operador ejecuta el cierre forzado del turno T-038
> **Entonces** el sistema marca el turno como CERRADO con motivo "No presentado"
> **Y** el sistema avanza automáticamente al siguiente turno de la cola

---

## Épica 2: Gestión de Colas de Patio

**Historia 2.1 — Visualización del estado de la cola en tiempo real** | 🔴 Must Have

> **Dado que** el Supervisor Aduanero tiene sesión iniciada
> **Cuando** el Supervisor consulta el estado de la cola del patio Norte
> **Entonces** el sistema muestra la lista de turnos activos con su estado, placa del camión y tiempo en espera
> **Y** los turnos se ordenan por número de turno ascendente

---

**Historia 2.2 — Apertura de nueva sesión de patio** | 🔴 Must Have

> **Dado que** el Operador tiene permisos de gestión de patios
> **Cuando** el Operador abre una nueva sesión para el patio Sur con fecha y capacidad
> **Entonces** el sistema crea una cola vacía para el patio Sur en la fecha indicada
> **Y** el contador de turnos se reinicia en 1

---

## Épica 3: Notificaciones y Alertas

**Historia 3.1 — Notificación automática cuando el turno llega al tope de espera** | 🟡 Should Have

> **Dado que** el turno T-035 lleva más de 45 minutos en estado PENDIENTE
> **Cuando** el sistema detecta que se superó el umbral de espera configurado
> **Entonces** el sistema envía una alerta al Supervisor con el detalle del turno demorado
> **Y** registra el evento en el historial de auditoría

---

**Historia 3.2 — Confirmación de recepción de notificación por el Conductor** | 🟢 Could Have

> **Dado que** el Conductor recibió la notificación de su turno vía XMS
> **Cuando** el Conductor confirma recepción en la aplicación
> **Entonces** el sistema actualiza el campo "notificación_confirmada" del turno a verdadero
> **Y** el Operador puede ver la confirmación en la vista de cola

---

## Épica 4: Reportes y KPIs

**Historia 4.1 — Dashboard de KPIs del turno del día** | 🟡 Should Have

> **Dado que** el Supervisor tiene sesión iniciada
> **Cuando** el Supervisor accede al dashboard de KPIs del día
> **Entonces** el sistema muestra: total de camiones atendidos, tiempo promedio de espera, % de turnos completados vs. cerrados por incumplimiento
> **Y** los datos se actualizan automáticamente cada 5 minutos

---

**Historia 4.2 — Exportación del historial de turnos por rango de fechas** | 🟢 Could Have

> **Dado que** el Supervisor requiere analizar el histórico de la semana anterior
> **Cuando** el Supervisor solicita la exportación del historial entre dos fechas
> **Entonces** el sistema genera un archivo CSV con todos los turnos del período
> **Y** el archivo incluye: número de turno, placa, patio, estados con marca de tiempo, y tiempo total de espera

---

## Resumen de Priorización

| Historia | Épica | Prioridad | Est. (SP) | Sprint objetivo |
| :--- | :--- | :--- | :--- | :--- |
| 1.1 Asignación automática de turno | Gestión de Turnos | 🔴 Must Have | 8 | Sprint 1 |
| 1.2 Avance de turno | Gestión de Turnos | 🔴 Must Have | 5 | Sprint 1 |
| 1.3 Rechazo de avance CERRADO | Gestión de Turnos | 🔴 Must Have | 3 | Sprint 1 |
| 1.4 Consulta de estado por Conductor | Gestión de Turnos | 🔴 Must Have | 5 | Sprint 1 |
| 1.5 Cierre de turno por incumplimiento | Gestión de Turnos | 🔴 Must Have | 5 | Sprint 2 |
| 2.1 Visualización de cola en tiempo real | Gestión de Colas | 🔴 Must Have | 8 | Sprint 2 |
| 2.2 Apertura de sesión de patio | Gestión de Colas | 🔴 Must Have | 5 | Sprint 1 |
| 3.1 Alerta por umbral de espera | Notificaciones | 🟡 Should Have | 5 | Sprint 3 |
| 4.1 Dashboard de KPIs del día | Reportes | 🟡 Should Have | 8 | Sprint 3 |
| 3.2 Confirmación de notificación | Notificaciones | 🟢 Could Have | 3 | Post v1.0 |
| 4.2 Exportación CSV histórico | Reportes | 🟢 Could Have | 5 | Post v1.0 |

---

## Criterios de Aceptación del Backlog

- [x] 11 historias en formato `Given / When / Then` (supera el mínimo de 10)
- [x] Todas las historias priorizadas con MoSCoW y justificación documentada
- [x] Los 7 Must Have cubren el Quality Gate del Módulo 3 (endpoints `POST /turnos`, `GET /turnos/{id}`, `PATCH /turnos/{id}/avanzar`)
- [x] Revisado y aprobado por el facilitador el 2025-01-31

---

*Ejemplo Q-Track generado bajo el estándar del corpus arquitectónico de UNIMAR · Idioma: Español · Versión: 1.0*
