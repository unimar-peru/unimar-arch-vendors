# Plantilla de Sesión — Módulo 3: Desarrollo y Code Review

> **Ruta:** [Plan de Implementación](../../plan-implementacion-arquitectura.md) → [Hub Módulo 3](../hubs/modulo-3.md) → Plantilla

---

## Acerca de esta Plantilla

Este módulo convierte los contratos documentales en software ejecutable. El equipo construye el API REST de Q-Track bajo el estándar corporativo completo: Arquitectura Hexagonal, TDD con cobertura ≥ 80%, GitFlow y Code Review obligatorio. Ningún código llega a `develop` sin pasar por los ojos de otro desarrollador y por el pipeline de CI.

---

## Recursos del Módulo

| Recurso | Tipo | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| 📄 **Formato Base** | Plantilla vacía | Estructura oficial vacía para que el facilitador complete los datos de cada sesión antes de ejecutarla. Incluye la Checklist de Code Review estándar. | [Abrir formato base](./modulo-3-formato-base.md) |
| ✅ **Ejemplo Q-Track** | Ejemplo diligenciado | Sesión completa de 3 semanas para Q-Track: Mob Programming para la estructura hexagonal, implementación de 3 endpoints con TDD, reporte de cobertura y Code Review cruzado documentado. | [Abrir ejemplo Q-Track](./modulo-3-ejemplo-q-track.md) |

---

## Entregable Certificado

Al completar este módulo, el equipo debe haber producido:
- API Q-Track con 3 endpoints operativos respetando Arquitectura Hexagonal
- Cobertura de tests unitarios ≥ 80% en la capa de dominio (reporte adjunto)
- Pull Request aprobado con al menos 2 comentarios de Code Review resueltos
- Pipeline CI local en verde (log adjunto)

---

*Documento generado bajo el estándar del corpus arquitectónico de UNIMAR · Idioma: Español · Versión: 1.0*

---

## Prompts Recomendados para esta Sesión

| Bloque | Prompt | Propósito |
| :--- | :--- | :--- |
| 2 | [Repasar Hexagonal](../prompts/modulo-3-prompts.md#prompt-1-repasar-hexagonal) | Generar repaso de Arquitectura Hexagonal |
| 6 | [Generar Estructura](../prompts/modulo-3-prompts.md#prompt-2-generar-estructura) | Generar estructura NestJS hexagonal |
| 7 | [Generar Tests](../prompts/modulo-3-prompts.md#prompt-5-generar-tests) | Generar tests unitarios con Jest |
| 10 | [Generar Entidad](../prompts/modulo-3-prompts.md#prompt-3-generar-entidad) | Generar entidad de dominio pura |
| 10 | [Generar Caso de Uso](../prompts/modulo-3-prompts.md#prompt-4-generar-caso-de-uso) | Generar caso de uso con inyección |
| 13 | [Revisar Código](../prompts/modulo-3-prompts.md#prompt-6-revisar-código) | Generar code review con checklist |
| 11 | [Mejorar Cobertura](../prompts/modulo-3-prompts.md#prompt-7-mejorar-cobertura) | Identificar código sin tests |

> **Tip:** Copia y pega cada prompt en OpenCode durante la sesión correspondiente.
