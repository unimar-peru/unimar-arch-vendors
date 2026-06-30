# Formato Base — Plantilla Vacía de Sesión

> **Ruta:** [Plan de Implementación](../../plan-implementacion-arquitectura.md) → [Hub Módulo 4](../hubs/modulo-4.md) → [Plantilla](./modulo-4-template.md) → Formato Base

Copia esta plantilla y completa cada campo antes de ejecutar la sesión.

---

# Sesión: [Nombre del módulo]

**Fecha:** ___________   **Hora:** ___________   **Duración:** ___________
**Facilitador:** ___________   **Participantes:** ___________

---

## Propósito de la Sesión

[Describir en 2-3 oraciones qué se logrará al final de esta sesión y su valor de negocio para UNIMAR.]

---

## Pre-work Obligatorio

- [ ] Docker Desktop instalado y funcionando (`docker ps` sin errores)
- [ ] Código del módulo anterior funcionando (endpoints operativos)
- [ ] [Referencia de Testcontainers y Pirámide de Testing que deben revisar]

---

## Agenda

| Bloque | Actividad | Duración |
| :--- | :--- | :--- |
| 1 | [Apertura: "El bug que solo el test de integración habría encontrado"] | [X min] |
| 2 | [Pirámide de Testing mapeada al producto] | [X min] |
| 3 | [¿Por qué los mocks nos mienten? Demostración en vivo] | [X min] |
| 4 | [Testcontainers: qué es, cómo funciona, qué requiere] | [X min] |
| — | BREAK | 15 min |
| 5 | [Facilitador instala Testcontainers y escribe el primer test en vivo] | [X min] |
| 6 | [Práctica guiada: cada participante replica el primer test] | [X min] |
| 7 | [Escribir los [N] escenarios críticos del producto] | [X min] |
| 8 | [Integrar al pipeline CI + generar cobertura] | [X min] |
| 9 | [Redactar Test Summary Report (RC Sellado) + commit + PR] | [X min] |

---

## Entregable de la Sesión (Quality Gate)

- **Qué debe producir el equipo:**
  1. Suite de [N] tests de integración en `tests/integration/` ejecutándose en verde
  2. Test Summary Report (RC Sellado) commiteado en el repositorio
- **Criterios de aceptación:**
  - [ ] `npm run test:integration` en verde sin errores
  - [ ] Mínimo [N] escenarios críticos cubiertos
  - [ ] Cobertura del adaptador de BD documentada
  - [ ] RC Sellado con todos los campos completos y estado SELLADO
  - [ ] Pipeline CI configurado para ejecutar integración en cada push a `develop`
- **Forma de entrega:** Pull Request: `feature/tests-integracion-[producto]` → `develop`
- **Regla de oro:** Un RC Sellado con tests en rojo no existe. Si hay tests rojos, el RC no se emite.

---

## Test Summary Report (RC Sellado) — Estructura

| Campo | Valor |
| :--- | :--- |
| Producto | [Nombre del producto] |
| Versión | [v X.X] |
| Fecha de emisión | [YYYY-MM-DD] |
| Total de escenarios | [N] |
| Escenarios en verde | [N] |
| Escenarios en rojo | [N] |
| Cobertura del adaptador de BD | [X%] |
| Responsable técnico | [Nombre] |
| Estado del RC | [SELLADO / OBSERVADO / RECHAZADO] |

---

## Recursos y Herramientas

| Herramienta | Propósito | Enlace |
| :--- | :--- | :--- |
| Testcontainers | Contenedores efímeros para integración | [testcontainers.com](https://testcontainers.com/) |
| Docker Desktop | Motor de contenedores requerido | [docker.com](https://www.docker.com/products/docker-desktop/) |
| Jest | Runner de tests con soporte integración | [jestjs.io](https://jestjs.io/) |
| Pirámide de Testing | Referencia conceptual | [martinfowler.com](https://martinfowler.com/articles/practical-test-pyramid.html) |

---

## Notas del Facilitador

[Notas privadas, advertencias o puntos críticos. No visible para participantes.]

---

## Evidencias de Certificación

- [ ] Log de `npm run test:integration`: todos los escenarios en verde
- [ ] RC Sellado con estado SELLADO commiteado en el repositorio
- [ ] Pipeline CI con etapa de integración en el historial de ejecuciones
- [ ] PR aprobado + merge a `develop` exitoso

---

*Formato base generado bajo el estándar del corpus arquitectónico de UNIMAR · Idioma: Español · Versión: 1.0*

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
