# Referencia de Herramientas y Conceptos Clave

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Herramientas%20y%20Referencia-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
</p>

Este documento actúa como directorio oficial de las herramientas tecnológicas y los marcos conceptuales que serán enseñados y requeridos durante el programa de capacitación.

---

## 1. Herramientas de Desarrollo y Modelado

| Herramienta | Propósito en el Taller | Enlace de Investigación / Descarga |
| :--- | :--- | :--- |
| **Visual Studio Code (VS Code)** | Editor de código principal. Única herramienta aprobada para la redacción de documentación Markdown y desarrollo local. | [Descargar VS Code](https://code.visualstudio.com/) |
| **Git & GitHub Desktop** | Gestión de versiones. Todos los talleres requieren clonar, modificar y hacer Push a ramas usando Git local o el cliente gráfico de GitHub. | [Descargar GitHub Desktop](https://desktop.github.com/) |
| **Node.js** | Entorno de ejecución local requerido para que funcionen los linters de arquitectura y los scripts de validación de Markdown. | [Descargar Node.js LTS](https://nodejs.org/) |
| **Markdown** | Lenguaje de marcado de texto plano con el cual se redactan el 100% de los documentos (PRDs, ADRs, Historias) en Unimar Arch. | [Guía de Sintaxis Markdown](https://www.markdownguide.org/basic-syntax/) |
| **Mermaid.js** | Motor primario de renderizado integrado en GitHub que convierte bloques de texto en diagramas de flujo y secuencias. | [Documentación Mermaid](https://mermaid.js.org/) |
| **PlantUML** | Motor alternativo de diagramación soportado para modelado avanzado (C4, UML de clases). Muy útil para dependencias complejas. | [Guía Rápida de PlantUML](https://plantuml.com/es/) |

## 2. Herramientas de IA y Método BMAD

| Herramienta / Concepto | Propósito en el Taller | Enlace de Investigación / Descarga |
| :--- | :--- | :--- |
| **OpenCode** | Extensión de VS Code que actúa como el motor de IA corporativo, permitiendo interactuar con los 59 agentes del Método BMAD directo en el editor. | Instalable vía extensiones de VS Code. |
| **Método BMAD** | Metodología orquestada en este repositorio que asigna un agente de IA experto a cada fase del SDLC (Ej. `bmad-agent-architect`, `bmad-code-review`). | Investigar localmente la carpeta `.opencode/commands` |
| **Modelos Fundacionales** | Los LLMs subyacentes que dan vida a OpenCode (Claude 3.5 Sonnet, Gemini Pro). Se discutirán sus fortalezas en código vs. redacción técnica. | [Anthropic Claude](https://www.anthropic.com/claude) / [Google Gemini](https://gemini.google.com/) |

## 3. Marcos de Trabajo y Ecosistema Operativo

| Marco / Estándar | Propósito en el Taller | Enlace de Investigación / Descarga |
| :--- | :--- | :--- |
| **Modelo C4** | Estándar visual utilizado para que los diagramas de arquitectura pasen de ser de "cajas borrosas" a un mapa navegable y rastreable al código. | [C4 Model Oficial](https://c4model.com/) |
| **Arquitectura Hexagonal** | Patrón dictado por el ADR-0002. Enseña a los equipos a aislar el core del negocio de la base de datos y los frameworks. | [Puertos y Adaptadores (Alistair Cockburn)](https://alistair.cockburn.us/hexagonal-architecture/) |
| **OpenTelemetry (OTel)** | Estándar corporativo obligatorio para trazas, métricas y logs. Su comprensión es requisito para pasar al gate de Producción. | [OpenTelemetry Oficial](https://opentelemetry.io/) |
| **Grafana Loki** | Sistema de agregación de logs que se usará como caso de estudio en el Módulo de Despliegue y Observabilidad. | [Grafana Loki](https://grafana.com/oss/loki/) |

## 4. Herramientas CLI, Automatización y Librerías

| Herramienta / Script | Propósito en el Taller | Enlace de Investigación / Referencia |
| :--- | :--- | :--- |
| **Husky & lint-staged** | Gatillos automáticos (*pre-commit hooks*) que validan el código y el formato de la documentación antes de permitir un commit en Git. | [Documentación de Husky](https://typicode.github.io/husky/) |
| **Markdownlint** | Herramienta CLI obligatoria (`npx markdownlint .`) para asegurar que todo documento cumpla reglas estrictas de legibilidad. | [Markdownlint CLI](https://github.com/igorshubovych/markdownlint-cli) |
| **Script Validate-Docs** | Script interno de Unimar (`node .harness/scripts/validate-docs.mjs`) que verifica enlaces rotos, anclas y Mermaid antes del *Push*. | Revisar `.harness/scripts/` localmente |
| **Testcontainers** | Librería requerida por el ADR-0053 para ejecutar pruebas de integración levantando contenedores Docker efímeros (ej. PostgreSQL, Redis). | [Testcontainers Oficial](https://testcontainers.com/) |
| **Dapr** | *Distributed Application Runtime*. Patrón de sidecar evaluado para simplificar observabilidad unificada y comunicación en la Suite (ADR-0046). | [Dapr.io](https://dapr.io/) |
