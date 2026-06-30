# Artefactos — Módulo 4: Calidad e Integración

> **Ruta:** [Plan de Implementación](../../plan-implementacion-arquitectura.md) → [Plantilla](../templates/modulo-4-template.md) → Artefactos

---

## Plantillas y Ejemplos de Referencia

| Tipo | Artefacto | Enlace |
| :--- | :--- | :--- |
| 📄 **Plantilla vacía** | Test Summary Report (Release Candidate) | [test-summary-report-plantilla.md](../templates/artefactos/test-summary-report-plantilla.md) |
| ✅ **Ejemplo Q-Track** | Test Summary Report RC v1.0.0 (llenado) | [test-summary-report-ejemplo-q-track.md](../templates/artefactos/test-summary-report-ejemplo-q-track.md) |

> **Instrucción:** Copia la plantilla vacía, usa el ejemplo como guía de llenado y adapta a tu proyecto.

---

## Artefactos Entregables

| Artefacto | Descripción | Ruta en el repositorio | Estado |
| :--- | :--- | :--- | :--- |
| **Suite de Tests de Integración** | 5 escenarios críticos ejecutándose contra PostgreSQL real con Testcontainers. | `tests/integration/` en el repositorio Q-Track | ⬜ Pendiente |
| **Test Summary Report (RC Sellado)** | Documento formal con estado SELLADO, detalle de 5 escenarios y cobertura del adaptador de BD. | `docs/planning-artifacts/rc-sellado-q-track-v1.md` | ⬜ Pendiente |
| **Log del Pipeline CI con Integración** | Evidencia de la etapa de tests de integración en verde en el historial de GitHub Actions. | GitHub Actions — repositorio Q-Track | ⬜ Pendiente |

---

## Criterios de Certificación del Módulo

- [ ] `npm run test:integration` en verde (5/5 escenarios)
- [ ] RC Sellado con estado SELLADO commiteado en el repositorio
- [ ] Pipeline CI configurado con etapa de integración automática en cada push a `develop`
- [ ] Pull Request: `feature/tests-integracion-q-track` → `develop`, estado: Merged

---

*Artefactos del Módulo 4 · Corpus arquitectónico UNIMAR · Versión: 1.0*

---

## Prompts Recomendados para este Módulo

| Prompt | Propósito | Enlace |
| :--- | :--- | :--- |
| **Explicar Pirámide** | Generar explicación de Pirámide de Testing | [modulo-4-prompts.md#prompt-1-explicar-pirámide](../prompts/modulo-4-prompts.md#prompt-1-explicar-pirámide) |
| **Configurar Testcontainers** | Generar configuración de Testcontainers para PostgreSQL | [modulo-4-prompts.md#prompt-2-configurar-testcontainers](../prompts/modulo-4-prompts.md#prompt-2-configurar-testcontainers) |
| **Generar Tests Integración** | Generar 5 escenarios de tests contra BD real | [modulo-4-prompts.md#prompt-3-generar-tests-integración](../prompts/modulo-4-prompts.md#prompt-3-generar-tests-integración) |
| **Generar Tests E2E** | Generar tests E2E de flujos completos | [modulo-4-prompts.md#prompt-4-generar-tests-e2e](../prompts/modulo-4-prompts.md#prompt-4-generar-tests-e2e) |
| **Generar Reporte** | Generar Test Summary Report para RC | [modulo-4-prompts.md#prompt-5-generar-reporte](../prompts/modulo-4-prompts.md#prompt-5-generar-reporte) |
| **Validar RC** | Checklist de validación final antes de sellar RC | [modulo-4-prompts.md#prompt-6-validar-rc](../prompts/modulo-4-prompts.md#prompt-6-validar-rc) |

> **Tip:** Usa estos prompts en OpenCode o tu asistente de IA preferido.
