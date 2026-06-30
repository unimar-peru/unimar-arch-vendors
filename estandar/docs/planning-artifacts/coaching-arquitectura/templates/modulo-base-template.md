# Plantilla de Sesión — Módulo Base: Bootcamp SDLC

> **Ruta:** [Plan de Implementación](../../plan-implementacion-arquitectura.md) → [Hub Módulo Base](../hubs/modulo-base.md) → Plantilla

---

## Acerca de esta Plantilla

Este módulo es el punto de partida del programa. Su objetivo es nivelar a todos los integrantes del equipo desde un entorno técnico estandarizado: VS Code con extensiones corporativas, Git configurado con GitFlow y la IA corporativa (OpenCode / BMAD) activa. Sin este baseline común, toda capacitación posterior es frágil.

---

## Recursos del Módulo

| Recurso | Tipo | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| 📄 **Formato Base** | Plantilla vacía | Estructura oficial vacía para que el facilitador complete los datos de cada sesión antes de ejecutarla. | [Abrir formato base](./modulo-base-formato-base.md) |
| ✅ **Ejemplo Q-Track** | Ejemplo diligenciado | Sesión completamente documentada usando como caso el proyecto Q-Track (Gestor de Colas de Camiones). Incluye agenda, criterios de Quality Gate, checklist y notas del facilitador. | [Abrir ejemplo Q-Track](./modulo-base-ejemplo-q-track.md) |

---

## Entregable Certificado

Al completar este módulo, cada participante debe haber mergeado un Pull Request a `develop` con:
- Checklist de Configuración de Entorno completada
- `git config --list` con datos corporativos verificados
- Extensiones VS Code activas (OpenCode, GitLens, Markdownlint)

---

*Documento generado bajo el estándar del corpus arquitectónico de UNIMAR · Idioma: Español · Versión: 1.0*

---

## Prompts Recomendados para esta Sesión

| Bloque | Prompt | Propósito |
| :--- | :--- | :--- |
| 1 | [Casos de Caos Técnico](../prompts/modulo-base-prompts.md#prompt-1-casos-de-caos-técnico) | Generar casos reales de problemas sin estándares |
| 2 | [Explicar GitFlow](../prompts/modulo-base-prompts.md#prompt-2-explicar-gitflow) | Generar explicación visual de GitFlow |
| 3 | [Demo BMAD](../prompts/modulo-base-prompts.md#prompt-3-demo-bmad) | Demostrar generación de README con IA |
| 5 | [Checklist de Instalación](../prompts/modulo-base-prompts.md#prompt-4-checklist-de-instalación) | Generar checklist de herramientas |
| 7 | [Generar README](../prompts/modulo-base-prompts.md#prompt-5-generar-readme) | Generar README de rama feature |
| 9 | [Verificar Configuración](../prompts/modulo-base-prompts.md#prompt-6-verificar-configuración) | Validar configuración del entorno |

> **Tip:** Copia y pega cada prompt en OpenCode durante la sesión correspondiente.
