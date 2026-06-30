# Ejemplo Q-Track — Test Summary Report (Release Candidate)

> **Módulo:** [4. Calidad e Integración](../../artefactos/modulo-4.md) · **Tipo:** Reporte de Resumen de Pruebas

Ejemplo completamente diligenciado del Test Summary Report para **Q-Track v1.0.0**.

---

# Test Summary Report — Q-Track Release Candidate v1.0.0

**Versión:** 1.0.0   **Fecha:** 2025-04-15   **Autor(es):** María Rodríguez (QA Lead)
**Estado:** ☑ SELLADO

---

## 1. Información del Release Candidate

| Campo | Valor |
| :--- | :--- |
| **RC Versión** | v1.0.0 |
| **Commit Hash** | `a3f7b2c` |
| **Rama** | `release/v1.0.0` |
| **Fecha de corte** | 2025-04-15 |
| **Responsable de QA** | María Rodríguez |

---

## 2. Resumen Ejecutivo

Q-Track v1.0.0 ha superado todas las pruebas de integración y E2E con 100% de éxito. Los 5 escenarios críticos (creación de turno, avance de cola, consulta de turno, notificación a conductor y reporte de incidencias) fueron validados contra PostgreSQL real usando Testcontainers. **El RC está APROBADO PARA PRODUCCIÓN** con cero defectos de severidad Alta.

---

## 3. Cobertura de Pruebas

| Tipo de Prueba | Total | Ejecutadas | Aprobadas | Fallidas | Cobertura |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Unitarias** | 47 | 47 | 47 | 0 | 87% (dominio) |
| **Integración** | 12 | 12 | 12 | 0 | 94% (adaptadores) |
| **E2E** | 5 | 5 | 5 | 0 | Flujo completo |
| **TOTAL** | 64 | 64 | 64 | 0 | 89% (global) |

---

## 4. Escenarios Críticos Probados

| # | Escenario | Resultado | Evidencia |
| :--- | :--- | :--- | :--- |
| 1 | Crear turno para camión con placa válida | ☑ Pass | [test-001.md](../tests/logs/test-001.md) |
| 2 | Rechazar turno duplicado para misma placa | ☑ Pass | [test-002.md](../tests/logs/test-002.md) |
| 3 | Avanzar turno y publicar evento a XMS | ☑ Pass | [test-003.md](../tests/logs/test-003.md) |
| 4 | Consultar turno por placa (≤ 200ms) | ☑ Pass | [test-004.md](../tests/logs/test-004.md) - p95: 142ms |
| 5 | Generar reporte de incidencias del día | ☑ Pass | [test-005.md](../tests/logs/test-005.md) |

---

## 5. Defectos Conocidos

| ID | Severidad | Descripción | Impacto | Workaround | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| [BUG-003] | 🟢 Baja | El orden de turnos en el dashboard no se actualiza en tiempo real sin refresh manual | Operador debe presionar F5 para ver cambios | Impacto menor en operación | ☐ Cerrado |

---

## 6. Criterios de Aceptación del RC

| Criterio | Cumple |
| :--- | :--- |
| Todos los tests unitarios en verde (≥ 80% cobertura en dominio) | ☑ Sí (87%) |
| Todos los tests de integración en verde (100% escenarios críticos) | ☑ Sí (12/12) |
| Cero defectos de severidad Alta abiertos | ☑ Sí |
| Performance dentro de umbrales aceptables (≤ 300ms p95) | ☑ Sí (142ms p95) |
| Documentación de release notes completa | ☑ Sí |

---

## 7. Decisión de Release

- ☑ **APROBADO PARA PRODUCCIÓN** — El RC cumple todos los criterios de calidad

**Firma del Responsable de QA:**

Nombre: María Rodríguez   Fecha: 2025-04-15   Commit hash: `a3f7b2c`

---

## 8. Historial de Estados

| Versión | Estado | Fecha | Responsable | Cambios |
| :--- | :--- | :--- | :--- | :--- |
| v1.0.0 | BORRADOR | 2025-04-10 | María Rodríguez | Creación inicial |
| v1.0.0 | EN EJECUCIÓN | 2025-04-12 | María Rodríguez | Inicio de ejecución de pruebas |
| v1.0.0 | SELLADO | 2025-04-15 | María Rodríguez | Cierre y aprobación para producción |

---

*Ejemplo Q-Track generado bajo el estándar del corpus arquitectónico de UNIMAR · Idioma: Español · Versión: 1.0*
