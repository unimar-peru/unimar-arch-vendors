# Plantilla Vacía — Test Summary Report (Release Candidate)

> **Módulo:** [4. Calidad e Integración](../../artefactos/modulo-4.md) · **Tipo:** Reporte de Resumen de Pruebas

Copia esta plantilla, completa los resultados de pruebas y commitéala con estado SELLADO cuando el RC esté listo para producción.

---

# Test Summary Report — [Nombre del Sistema] Release Candidate v[VERSIÓN]

**Versión:** ___   **Fecha:** ___________   **Autor(es):** ___________
**Estado:** ☐ BORRADOR · ☐ EN EJECUCIÓN · ☐ SELLADO

---

## 1. Información del Release Candidate

| Campo | Valor |
| :--- | :--- |
| **RC Versión** | v[MAJOR.MINOR.PATCH] |
| **Commit Hash** | [git commit hash] |
| **Rama** | `release/v[VERSIÓN]` |
| **Fecha de corte** | [YYYY-MM-DD] |
| **Responsable de QA** | [Nombre] |

---

## 2. Resumen Ejecutivo

[Describir en 2-3 oraciones el estado general de calidad del RC. ¿Está listo para producción? ¿Hay riesgos conocidos?]

---

## 3. Cobertura de Pruebas

| Tipo de Prueba | Total | Ejecutadas | Aprobadas | Fallidas | Cobertura |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Unitarias** | | | | | |
| **Integración** | | | | | |
| **E2E** | | | | | |
| **TOTAL** | | | | | |

---

## 4. Escenarios Críticos Probados

| # | Escenario | Resultado | Evidencia |
| :--- | :--- | :--- | :--- |
| 1 | [Descripción del escenario crítico 1] | ☐ Pass ☐ Fail | [Screenshot/log/link] |
| 2 | [Descripción del escenario crítico 2] | ☐ Pass ☐ Fail | |
| 3 | [Descripción del escenario crítico 3] | ☐ Pass ☐ Fail | |
| 4 | [Descripción del escenario crítico 4] | ☐ Pass ☐ Fail | |
| 5 | [Descripción del escenario crítico 5] | ☐ Pass ☐ Fail | |

---

## 5. Defectos Conocidos

| ID | Severidad | Descripción | Impacto | Workaround | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| [BUG-001] | 🔴 Alta 🟡 Media 🟢 Baja | [Descripción del defecto] | [Impacto en negocio] | [Solución temporal] | ☐ Abierto ☐ Cerrado |

---

## 6. Criterios de Aceptación del RC

| Criterio | Cumple |
| :--- | :--- |
| Todos los tests unitarios en verde (≥ 80% cobertura en dominio) | ☐ Sí ☐ No |
| Todos los tests de integración en verde (100% escenarios críticos) | ☐ Sí ☐ No |
| Cero defectos de severidad Alta abiertos | ☐ Sí ☐ No |
| Performance dentro de umbrales aceptables (≤ [X]ms p95) | ☐ Sí ☐ No |
| Documentación de release notes completa | ☐ Sí ☐ No |

---

## 7. Decisión de Release

- ☐ **APROBADO PARA PRODUCCIÓN** — El RC cumple todos los criterios de calidad
- ☐ **APROBADO CON RIESGOS CONOCIDOS** — Puede ir a producción con defectos de baja severidad documentados
- ☐ **RECHAZADO** — Requiere corrección de defectos críticos y nuevo RC

**Firma del Responsable de QA:**

Nombre: ___________   Fecha: ___________   Commit hash: ___________

---

## 8. Historial de Estados

| Versión | Estado | Fecha | Responsable | Cambios |
| :--- | :--- | :--- | :--- | :--- |
| v[VERSIÓN] | BORRADOR | [YYYY-MM-DD] | [Nombre] | Creación inicial |
| v[VERSIÓN] | EN EJECUCIÓN | [YYYY-MM-DD] | [Nombre] | Inicio de ejecución de pruebas |
| v[VERSIÓN] | SELLADO | [YYYY-MM-DD] | [Nombre] | Cierre y aprobación para producción |

---

*Plantilla generada bajo el estándar del corpus arquitectónico de UNIMAR · Idioma: Español · Versión: 1.0*
