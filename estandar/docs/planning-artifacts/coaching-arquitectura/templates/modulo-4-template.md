# Plantilla de Sesión — Módulo 4: Calidad e Integración

> **Ruta:** [Plan de Implementación](../../plan-implementacion-arquitectura.md) → [Hub Módulo 4](../hubs/modulo-4.md) → Plantilla

---

## Acerca de esta Plantilla

Este módulo cierra el ciclo de construcción con pruebas de integración sobre infraestructura real mediante Testcontainers. A diferencia de los tests unitarios con mocks, aquí el API de Q-Track se ejecuta contra PostgreSQL real. El Test Summary Report (RC Sellado) que se produce es la evidencia formal de que Q-Track está listo para ser empaquetado y desplegado en el Módulo 5.

---

## Recursos del Módulo

| Recurso | Tipo | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| 📄 **Formato Base** | Plantilla vacía | Estructura oficial vacía para que el facilitador complete los datos de cada sesión antes de ejecutarla. Incluye la estructura estándar del Test Summary Report (RC Sellado). | [Abrir formato base](./modulo-4-formato-base.md) |
| ✅ **Ejemplo Q-Track** | Ejemplo diligenciado | Sesión completa de 2 semanas: configuración de Testcontainers, suite de 5 escenarios críticos de Q-Track contra PostgreSQL real, pipeline CI con integración automática y RC Sellado v1.0 completo. | [Abrir ejemplo Q-Track](./modulo-4-ejemplo-q-track.md) |

---

## Entregable Certificado

Al completar este módulo, el equipo debe haber producido:
- Suite de 5 tests de integración con Testcontainers ejecutándose en verde
- Pipeline CI configurado para ejecutar integración en cada push a `develop`
- Test Summary Report (RC Sellado) con estado SELLADO commiteado en el repositorio

---

*Documento generado bajo el estándar del corpus arquitectónico de UNIMAR · Idioma: Español · Versión: 1.0*

---

## Prompts Recomendados para esta Sesión

| Bloque | Prompt | Propósito |
| :--- | :--- | :--- |
| 2 | [Explicar Pirámide](../prompts/modulo-4-prompts.md#prompt-1-explicar-pirámide) | Generar explicación de Pirámide de Testing |
| 5 | [Configurar Testcontainers](../prompts/modulo-4-prompts.md#prompt-2-configurar-testcontainers) | Generar configuración de Testcontainers |
| 8 | [Generar Tests Integración](../prompts/modulo-4-prompts.md#prompt-3-generar-tests-integración) | Generar 5 escenarios de tests |
| 12 | [Generar Reporte](../prompts/modulo-4-prompts.md#prompt-5-generar-reporte) | Generar Test Summary Report |
| 13 | [Validar RC](../prompts/modulo-4-prompts.md#prompt-6-validar-rc) | Checklist de validación final |

> **Tip:** Copia y pega cada prompt en OpenCode durante la sesión correspondiente.
