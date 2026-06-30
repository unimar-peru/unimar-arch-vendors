# Artefactos — Módulo 3: Desarrollo y Code Review

> **Ruta:** [Plan de Implementación](../../plan-implementacion-arquitectura.md) → [Plantilla](../templates/modulo-3-template.md) → Artefactos

---

## Plantillas y Ejemplos de Referencia

| Tipo | Artefacto | Enlace |
| :--- | :--- | :--- |
| 📄 **Plantilla vacía** | Code Review Checklist | [code-review-checklist-plantilla.md](../templates/artefactos/code-review-checklist-plantilla.md) |
| ✅ **Ejemplo Q-Track** | Code Review Checklist (llenado) | [code-review-checklist-ejemplo-q-track.md](../templates/artefactos/code-review-checklist-ejemplo-q-track.md) |

> **Instrucción:** Copia la plantilla vacía, usa el ejemplo como guía de llenado y adapta a tu proyecto.

---

## Prompts Recomendados para este Módulo

| Prompt | Propósito | Enlace |
| :--- | :--- | :--- |
| **Repasar Hexagonal** | Generar repaso de Arquitectura Hexagonal aplicado a tu proyecto | [modulo-3-prompts.md#prompt-1-repasar-hexagonal](../prompts/modulo-3-prompts.md#prompt-1-repasar-hexagonal) |
| **Generar Estructura** | Generar estructura de proyecto NestJS hexagonal | [modulo-3-prompts.md#prompt-2-generar-estructura](../prompts/modulo-3-prompts.md#prompt-2-generar-estructura) |
| **Generar Entidad** | Generar entidad de dominio sin dependencias de framework | [modulo-3-prompts.md#prompt-3-generar-entidad](../prompts/modulo-3-prompts.md#prompt-3-generar-entidad) |
| **Generar Caso de Uso** | Generar caso de uso con inyección de dependencias | [modulo-3-prompts.md#prompt-4-generar-caso-de-uso](../prompts/modulo-3-prompts.md#prompt-4-generar-caso-de-uso) |
| **Generar Tests** | Generar tests unitarios con Jest (patrón AAA) | [modulo-3-prompts.md#prompt-5-generar-tests](../prompts/modulo-3-prompts.md#prompt-5-generar-tests) |
| **Revisar Código** | Generar code review con checklist estructurada | [modulo-3-prompts.md#prompt-6-revisar-código](../prompts/modulo-3-prompts.md#prompt-6-revisar-código) |
| **Mejorar Cobertura** | Identificar código sin tests y generar tests faltantes | [modulo-3-prompts.md#prompt-7-mejorar-cobertura](../prompts/modulo-3-prompts.md#prompt-7-mejorar-cobertura) |

> **Tip:** Usa estos prompts en OpenCode o tu asistente de IA preferido. Copia y pega el prompt exacto desde el enlace.

---

## Artefactos Entregables

| Artefacto | Descripción | Ruta en el repositorio | Estado |
| :--- | :--- | :--- | :--- |
| **Código del API Q-Track** | Implementación de 3 endpoints REST bajo Arquitectura Hexagonal con TypeScript. | Repositorio del proyecto Q-Track | ⬜ Pendiente |
| **Reporte de Cobertura** | Salida de `npm run test:coverage` con cobertura ≥ 80% en `src/domain/`. | Adjunto en el PR como comentario | ⬜ Pendiente |
| **Log del Pipeline CI** | Evidencia de lint ✓, test ✓ y cobertura ✓ en verde. | Adjunto en el PR como comentario | ⬜ Pendiente |
| **Pull Request Revisado** | PR con al menos 2 comentarios de Code Review resueltos y aprobado por el facilitador. | GitHub — repositorio Q-Track | ⬜ Pendiente |

---

## Criterios de Certificación del Módulo

- [ ] Endpoints: `POST /turnos`, `GET /turnos/{id}`, `PATCH /turnos/{id}/avanzar` operativos
- [ ] Arquitectura Hexagonal respetada (entidades sin imports de framework)
- [ ] Cobertura ≥ 80% en `src/domain/` (reporte adjunto al PR)
- [ ] PR con 2+ comentarios de Code Review resueltos, estado: Merged

---

*Artefactos del Módulo 3 · Corpus arquitectónico UNIMAR · Versión: 1.0*
