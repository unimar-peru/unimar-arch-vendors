# Prompt Library — Coaching de Arquitectura SDLC

> **Índice Central de Prompts** · Todos los prompts accionables para facilitación con IA

---

## Prompt Libraries por Modulo

| Módulo | Tema | Prompts | Archivo |
| :--- | :--- | :--- | :--- |
| **Base** | Instalación y Configuración | 6 | [modulo-base-prompts.md](./modulo-base-prompts.md) |
| **0** | Visión, Gates y Kick-off | 6 | [modulo-0-prompts.md](./modulo-0-prompts.md) |
| **1** | PRD y Bounded Contexts | 6 | [modulo-1-prompts.md](./modulo-1-prompts.md) |
| **2** | ADRs y C4 | 8 | [modulo-2-prompts.md](./modulo-2-prompts.md) |
| **3** | Hexagonal y Código | 7 | [modulo-3-prompts.md](./modulo-3-prompts.md) |
| **4** | Testing e Integración | 6 | [modulo-4-prompts.md](./modulo-4-prompts.md) |
| **5** | Docker y CI/CD | 6 | [modulo-5-prompts.md](./modulo-5-prompts.md) |
| **6** | Observabilidad y Cierre | 7 | [modulo-6-prompts.md](./modulo-6-prompts.md) |

**TOTAL:** 52 prompts accionables en 8 librerías

---

## Como Usar estos Prompts

### Durante la Sesión

1. **Abrir el hub del módulo** en curso (ej: `hubs/modulo-2.md`)
2. **Copiar el prompt** de la tabla "Prompts Recomendados"
3. **Pegar en OpenCode** y ejecutar
4. **Revisar输出** y ajustar si es necesario
5. **Guardar el resultado** en el artefacto correspondiente

### Formato de los Prompts

Cada prompt incluye:
- **Rol del Agente:** Quién debe ejecutar (John, Winston, Amelia, etc.)
- **Contexto:** Información necesaria para la tarea
- **Tarea:** Instrucción clara y accionable
- **Formato de Salida:** Estructura esperada del resultado
- **Criterios de Calidad:** Qué hace que el output sea bueno

---

## Metricas de la Prompt Library

| Métrica | Valor |
| :--- | :--- |
| **Total de Prompts** | 52 |
| **Módulos Cubiertos** | 8 (100%) |
| **Agentes BMAD Usados** | 5 (John, Winston, Amelia, Paige, Mary) |
| **Prompts por Módulo** | 5-8 (promedio: 6.5) |
| **Longitud Promedio** | ~50 líneas por prompt |
| **Copy-Paste Ready** | Si, 100% |

---

## Navegacion Rapida

### Por Tipo de Artefacto

| Artefacto | Módulo | Prompt |
| :--- | :--- | :--- |
| **Manifiesto** | 0 | [Resumir Manifiesto](./modulo-0-prompts.md#prompt-1-resumir-manifiesto) |
| **Acta de Kick-off** | 0 | [Generar Acta](./modulo-0-prompts.md#prompt-4-generar-acta) |
| **PRD** | 1 | [Generar PRD](./modulo-1-prompts.md#prompt-3-generar-prd) |
| **Historias BDD** | 1 | [Generar Historias](./modulo-1-prompts.md#prompt-4-generar-historias-bdd) |
| **ADR** | 2 | [Generar ADR](./modulo-2-prompts.md#prompt-6-generar-adr) |
| **C4 Nivel 1** | 2 | [Generar C4 N1](./modulo-2-prompts.md#prompt-7-generar-c4-n1) |
| **C4 Nivel 2** | 2 | [Generar C4 N2](./modulo-2-prompts.md#prompt-8-generar-c4-n2) |
| **Entidad de Dominio** | 3 | [Generar Entidad](./modulo-3-prompts.md#prompt-3-generar-entidad) |
| **Caso de Uso** | 3 | [Generar Caso de Uso](./modulo-3-prompts.md#prompt-4-generar-caso-de-uso) |
| **Tests Unitarios** | 3 | [Generar Tests](./modulo-3-prompts.md#prompt-5-generar-tests) |
| **Tests Integración** | 4 | [Generar Tests Integración](./modulo-4-prompts.md#prompt-3-generar-tests-integración) |
| **Dockerfile** | 5 | [Generar Dockerfile](./modulo-5-prompts.md#prompt-2-generar-dockerfile) |
| **Pipeline CI/CD** | 5 | [Generar Pipeline](./modulo-5-prompts.md#prompt-3-generar-pipeline) |
| **Consultas LogQL** | 6 | [Generar LogQL](./modulo-6-prompts.md#prompt-3-generar-logql) |
| **Runbook** | 6 | [Generar Runbook](./modulo-6-prompts.md#prompt-4-generar-runbook) |
| **Radar de Madurez** | 6 | [Generar Radar](./modulo-6-prompts.md#prompt-7-generar-radar) |

### Por Agente BMAD

| Agente | Rol | Prompts |
| :--- | :--- | :--- |
| **John** | Product Manager | PRD, Historias, MoSCoW, Validación |
| **Winston** | Arquitecto | ADRs, C4, Hexagonal, Propuestas |
| **Amelia** | Desarrolladora | Código, Tests, Estructura, Reviews |
| **Paige** | Tech Writer | Documentación, Runbooks, Release Notes |
| **Mary** | Business Analyst | Debate, Actas, Calidad, Retrospectivas |

---

## Validacion

Todos los prompts han sido validados para:
- **Copy-Paste Ready:** Se pueden ejecutar directamente en OpenCode
- **Contexto Completo:** Incluyen toda la información necesaria
- **Formato Claro:** Especifican estructura de salida esperada
- **Criterios de Calidad:** Definen qué hace un buen output
- **Enlaces Válidos:** Todos los enlaces desde hubs/templates funcionan

---

*Documento generado bajo el estándar del corpus arquitectónico de UNIMAR · Idioma: Español · Versión: 1.0*
