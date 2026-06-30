# Guía del Facilitador: Directorio de Sesiones SDLC

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Gu%C3%ADa%20del%20Facilitador-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
</p>

Este documento es el **Manual del Entrenador**. Contiene las plantillas pre-construidas con los propósitos, agendas y enlaces de visualización para *cada una* de las sesiones y talleres definidos en el cronograma. 

> **Facilitador:** Alberto Arroyo
> **Uso:** Antes de iniciar cualquier sesión, revisa la ficha correspondiente en este documento para alinear tu agenda, asegurar que invitas a los roles correctos y abrir el artefacto correcto para proyectar.

---

## 🟢 Módulo Base: Bootcamp Zero (Nivelación)

### 1. Sesión General: Entorno Local y Versionado
* **Propósito:** Configurar VS Code y entender Git/GitHub.
* **Participantes Objetivo:** Todos los involucrados.
* **Quality Gate (Objetivo):** Entorno local configurado y operativo.
* **Opción de Visualización:** [Directorio de Herramientas](./herramientas-referencia.md).
* **Agenda (1h 30m máx):**
  - 15m: Por qué usamos Git y Markdown en lugar de Word.
  - 60m: Instalación en vivo (Node, VS Code, Git, extensiones).
  - 15m: Q&A y comprobación de accesos.

### 2. Taller Práctico: Clonar, GitFlow y hacer PR
* **Propósito:** Perder el miedo a la terminal y adoptar la estrategia de ramas corporativa.
* **Participantes Objetivo:** Todos los involucrados.
* **Quality Gate (Objetivo):** Primer Pull Request exitoso siguiendo el modelo GitFlow.
* **Opción de Visualización:** Editor VS Code (Hands-on).
* **Agenda (3h máx):**
  - 15m: Contexto: El ciclo de vida de un *Commit* y por qué exigimos **GitFlow** (ramas `develop`, `feature/`, `release/`).
  - 75m: Práctica: Clonar el repositorio base, crear una rama `feature/` siguiendo el estándar, y editar un archivo personal.
  - 15m: **BREAK**
  - 60m: Hacer *Push* y crear el Pull Request en GitHub apuntando hacia la rama de desarrollo.
  - 15m: Revisión de PRs cruzados y cierre.

### 3. Sesión General: IA, Método BMAD y Conceptos Base
* **Propósito:** Entender la configuración de BMAD, el uso de OpenCode y el modelado C4.
* **Participantes Objetivo:** Todos los involucrados.
* **Quality Gate (Objetivo):** OpenCode instalado, BMAD configurado y reglas de seguridad claras.
* **Opción de Visualización:** Explicación del Método BMAD y `.opencode/commands`.
* **Agenda (1h 30m máx):**
  - 15m: Riesgos de la IA genérica vs. Agentes de Contexto Local (BMAD).
  - 60m: Tour por Winston, John y Amelia. Configuración en VS Code (`npx bmad-method install`) y comandos clave (`/bmad-help`).
  - 15m: ¿Qué es el C4 Model y cómo Mermaid se integra en este flujo?

### 4. Taller Práctico: Invocación de BMAD y Mermaid
* **Propósito:** Renderizar un diagrama usando agentes IA.
* **Participantes Objetivo:** Todos los involucrados.
* **Quality Gate (Objetivo):** Diagrama C4 en Markdown correctamente generado.
* **Opción de Visualización:** VS Code con extensión OpenCode activa.
* **Agenda (3h máx):**
  - 15m: Formulación del *Prompt* Arquitectónico.
  - 75m: Pedirle a `bmad-agent-architect` que genere un C4 en base a un requerimiento de prueba.
  - 15m: **BREAK**
  - 60m: Copiar código a Markdown y renderizar con Mermaid Preview.
  - 15m: QA de los diagramas producidos por los participantes.

---

## 🔵 Módulo 0: Kick-off

### 5. Sesión General: Visión de la Suite Operativa y Gates de Calidad
* **Propósito:** Presentar la visión corporativa y las reglas inflexibles del Manifiesto de Ingeniería.
* **Participantes Objetivo:** Todos.
* **Quality Gate (Objetivo):** Acta de Kick-off y Visión compartida.
* **Opción de Visualización:** [Gates de Calidad SDLC](../../../reference/governance/sdlc/gates-calidad.es.md) y Diagrama de la Suite Operativa.
* **Agenda (1h 30m máx):**
  - 15m: Presentación del problema actual (Silos).
  - 60m: Visión de la Suite Operativa y explicación de los Gates de Calidad (Por qué no hay *merge* sin pruebas).
  - 15m: Resolución de bloqueos gerenciales.

---

## 🟠 Módulo 1: Requisitos (Flujo y Artefactos)

### 6. Sesión General: Teoría de Requisitos SDLC
* **Propósito:** Comprender *Bounded Contexts* y Directivas Arquitectónicas.
* **Participantes Objetivo:** Coord. Procesos, Analistas de Negocio y Sistemas.
* **Quality Gate (Objetivo):** Asimilación de la teoría de fronteras de dominio.
* **Opción de Visualización:** Directivas Arquitectónicas.
* **Agenda (1h 30m máx):**
  - 15m: Por qué fracasan los monolitos de base de datos.
  - 60m: Qué es un *Bounded Context* y cómo redactar requerimientos ágiles (BDD).
  - 15m: Q&A.

### 7. Taller Práctico: PRDs e Historias de Usuario
* **Propósito:** Aprender a usar plantillas de PRD y Backlog Ágil BDD usando "Q-Truck".
* **Participantes Objetivo:** Coord. Procesos, Analista Clave.
* **Quality Gate (Objetivo):** PRD validado y Backlog Ágil inicial estructurado.
* **Opción de Visualización:** [Plantilla PRD](../../../reference/governance/sdlc/04-plantillas-artefactos/plantilla-prd.es.md) y [Plantilla Historia de Usuario](../../../reference/governance/sdlc/04-plantillas-artefactos/plantilla-historia-usuario.es.md).
* **Agenda (3h máx):**
  - 15m: Asignación del caso de estudio: "Q-Truck" (Gestor Rápido de Colas de Garita).
  - 75m: Llenado colaborativo del PRD (Alcance, Personas: Operador de Garita, Restricciones).
  - 15m: **BREAK**
  - 60m: Redacción de la Historia de Usuario Principal (Ingreso de camión) con *Given-When-Then*.
  - 15m: Cierre y pase de Gate.

---

## 🟣 Módulo 2: Diseño y Arquitectura

### 8. Sesión General: Teoría de ADRs y C4
* **Propósito:** Entender por qué se documenta el diseño y evitar decisiones repetidas.
* **Participantes Objetivo:** Analista Clave, Coordinadores de Sistemas.
* **Quality Gate (Objetivo):** Asimilación de los conceptos técnicos y de trazabilidad.
* **Opción de Visualización:** [Matriz ADR](../../../reference/architecture/adrs/matriz-adr.es.md) y Blueprint de Referencia.
* **Agenda (1h 30m máx):**
  - 15m: La deuda arquitectónica de las "decisiones de pasillo".
  - 60m: Estructura de un ADR y niveles del modelo C4.
  - 15m: Q&A.

### 9. Taller Práctico A: Modelado C4 y Redacción ADR
* **Propósito:** Práctica intensiva sobre cómo estructurar el diseño de Q-Truck en una topología distribuida.
* **Participantes Objetivo:** Analista Clave y Equipo de Arquitectura.
* **Quality Gate (Objetivo):** Un ADR redactado y un diagrama C4 Nivel 2.
* **Opción de Visualización:** ADR-0000 (Template) y motor Mermaid.
* **Agenda (3h máx):**
  - 15m: Problema a resolver: Decidir la tecnología de persistencia para la cola de Q-Truck (¿PostgreSQL o Redis?).
  - 45m: **[WOW Factor] Debate de Agentes en Vivo:** El facilitador proyecta VS Code e invoca `/bmad-party-mode`. Instruye a los agentes Winston (Arquitecto) y Amelia (Dev) a debatir la decisión técnica frente al equipo. El equipo observa cómo la IA resuelve conflictos y estructura la decisión a favor de PostgreSQL.
  - 30m: Consolidar el resultado del debate en la plantilla del ADR.
  - 15m: **BREAK**
  - 60m: Modelado C4 Nivel 2 dibujando la topología de **Monolito Progresivo (Fase 1)**: Cliente React comunicándose con un Backend unificado (que internamente modulariza Node y .NET) conectado a DB PostgreSQL.
  - 15m: Revisión de pares.

### 10. Taller Práctico B: Historias Funcionales y Arq. Hexagonal
* **Propósito:** Redactar historias según estándar y definir puertos/adaptadores para Q-Truck.
* **Participantes Objetivo:** Analista Clave, Equipo de Arquitectura.
* **Quality Gate (Objetivo):** Historias Funcionales alineadas al ADR-0002.
* **Opción de Visualización:** [ADR-0002 Arquitectura Limpia](../../../reference/architecture/adrs/nodejs/0002-arquitectura-limpia-nestjs.es.md) y [Plantilla Historia Funcional](../../../reference/governance/sdlc/04-plantillas-artefactos/plantilla-historia-funcional.es.md).
* **Agenda (3h máx):**
  - 15m: Teoría rápida: Qué es un puerto de persistencia (Postgres) y un adaptador de web (Controlador REST).
  - 75m: Traducir la HU de Q-Truck a Historias Funcionales: `POST /api/queue` aislando la Base de Datos de la lógica de cola FIFO.
  - 15m: **BREAK**
  - 60m: Validación del diseño hexagonal cruzado.
  - 15m: Cierre de fase.

---

## 🔴 Módulo 3: Desarrollo y Code Review

### 11. Sesión General: Estándares de Código
* **Propósito:** Explicar Historias Técnicas y el Manifiesto de Ingeniería.
* **Participantes Objetivo:** Analista Clave, Desarrolladores.
* **Quality Gate (Objetivo):** Adopción de estándares teóricos (SOLID, DRY).
* **Opción de Visualización:** Manifiesto de Ingeniería.
* **Agenda (1h 30m máx):**
  - 15m: Por qué somos estrictos (Complejidad ciclomática < 15).
  - 60m: Lectura guiada del Manifiesto de Ingeniería y reglas de PRs.
  - 15m: Dudas técnicas.

### 12. Taller Práctico: Pair Programming y PRs
* **Propósito:** Codificar los componentes de Q-Truck cumpliendo Gates de Complejidad (<15).
* **Participantes Objetivo:** Analista Clave, Desarrolladores (.NET, Node, Frontend).
* **Quality Gate (Objetivo):** Pull Request evaluado y aprobado en vivo.
* **Opción de Visualización:** VS Code Live Share y GitHub PR View.
* **Agenda (3h máx):**
  - 15m: Dividir al equipo en Escuadrones: **React, Node.js y .NET**.
  - 75m: *Pair Programming* en paralelo:
    - *Team .NET:* Desarrolla la Core API usando Arquitectura Hexagonal y **Shells Transversales**.
    - *Team Node:* Desarrolla los endpoints del API Gateway (BFF).
    - *Team React:* Desarrolla la SPA del Dashboard.
  - 15m: **BREAK**
  - 60m: Ejecución del agente `bmad-code-review` contra el código desarrollado.
  - 15m: Merge a las ramas de desarrollo (Aprobación formal).

---

## 🟡 Módulo 4: Calidad e Integración

### 13. Sesión General: Pirámide de Testing y E2E
* **Propósito:** Teoría sobre distribución 70/20/10 y certificación de RC.
* **Participantes Objetivo:** QA, Sistemas, Desarrollo.
* **Quality Gate (Objetivo):** Conceptos de testing de integración claros.
* **Opción de Visualización:** [ADR-0018 Pirámide de Pruebas](../../../reference/architecture/adrs/core/0018-piramide-pruebas-gates-calidad.es.md).
* **Agenda (1h 30m máx):**
  - 15m: El engaño del 100% de cobertura sin integración.
  - 60m: Distribución 70/20/10 y concepto de *Release Candidate* inmutable.
  - 15m: Uso de Testcontainers.

### 14. Taller Práctico: Unit Testing, Mocks y Reportes
* **Propósito:** Alcanzar la cobertura >80% inyectando Mocks y sellar el RC.
* **Participantes Objetivo:** QA, Sistemas, Desarrolladores.
* **Quality Gate (Objetivo):** Test Summary Report aprobado (RC Sellado con métricas).
* **Opción de Visualización:** [Plantilla de Reporte de Pruebas](../../../reference/governance/sdlc/04-plantillas-artefactos/plantilla-reporte-resumen-pruebas.es.md).
* **Agenda (3h máx):**
  - 15m: Teoría en vivo: Inversión de Dependencias y el uso correcto de **Mocks** (Moq, Jest) vs Bases de Datos reales.
  - 45m: Escritura intensiva de Pruebas Unitarias para la lógica de cola FIFO aislando la persistencia de infraestructura.
  - 15m: **BREAK**
  - 30m: **Revisión de Cobertura (Coverage):** Enseñar cómo generar y visualizar el reporte HTML (vía `lcov` en Node o `ReportGenerator` en .NET) y cómo los Quality Gates de Unimar Arch bloquean PRs si esto baja del 80%.
  - 30m: Llenado oficial del *Test Summary Report* evidenciando la cobertura y sellando el Release Candidate v1.0.0.
  - 15m: Firma de pase a producción.

---

## ⚪ Módulo 5: Infraestructura, Operaciones y Despliegue

### 15. Sesión General: Modelado de Despliegue Abstracto
* **Propósito:** Definir cómo el código agnóstico se adapta al entorno de hospedaje final.
* **Participantes Objetivo:** Infraestructura, Operaciones, Arquitectura.
* **Quality Gate (Objetivo):** Estrategia de despliegue definida para Q-Truck.
* **Opción de Visualización:** Esquemas de Arquitectura de Infraestructura (C4 Nivel 3).
* **Agenda (1h 30m máx):**
  - 15m: Concepto del artefacto inmutable (El Docker Image es el mismo en todos los entornos).
  - 60m: Debate técnico: **Kubernetes (K8s)** para orquestación compleja, **On-Premise (Máquinas Virtuales)** para sistemas legacy, o directo a la nube (**Cloud App Services**). ¿Cuál encaja para Q-Truck?
  - 15m: Decisión y trazado del pipeline conceptual.

### 16. Taller Práctico: Pipelines y Notas de Lanzamiento
* **Propósito:** Construir el pipeline de Q-Truck y formalizar el Release.
* **Participantes Objetivo:** Infraestructura, QA, Desarrollo.
* **Quality Gate (Objetivo):** Notas de Lanzamiento firmadas y Pipeline verificado.
* **Opción de Visualización:** [Plantilla Notas de Lanzamiento](../../../reference/governance/sdlc/04-plantillas-artefactos/plantilla-notas-lanzamiento.es.md).
* **Agenda (3h máx):**
  - 15m: Por qué automatizamos los despliegues (Cultura DevOps).
  - 75m: Configuración básica de un pipeline YAML (GitHub Actions / Azure DevOps) que construya los 3 contenedores de Q-Truck.
  - 15m: **BREAK**
  - 60m: Redacción colaborativa de las **Release Notes** de Q-Truck (Instrucciones de rollback, variables de entorno necesarias).
  - 15m: Simulación de Despliegue y pase de Gate final antes de Producción.

---

## ⚫ Módulo 6: Soporte y Retrospectiva Final

### 17. Taller Práctico: Troubleshooting de APIs y Gobernanza
* **Propósito:** Enseñar al soporte L1/L2 cómo diagnosticar fallas en Q-Truck sin romperlo.
* **Participantes Objetivo:** Soporte Legacy, Sistemas, Arquitectura.
* **Quality Gate (Objetivo):** Plantilla de Runbook de APIs dominada.
* **Opción de Visualización:** Documentación de Logs y Runbooks.
* **Agenda (3h máx):**
  - 15m: Regla de Oro: "Nadie toca la base de datos en producción para desencolar un camión".
  - 75m: Ejercicio: "Q-Truck no responde". Búsqueda de trazas en Grafana Loki basadas en eventos OTel.
  - 15m: **BREAK**
  - 60m: Llenado de un *Runbook* documentando los pasos exactos para reiniciar o reportar la caída de Q-Truck.
  - 15m: Cierre y pase del Gate.

### 18. Sesión General: Retrospectiva y Matriz de Madurez
* **Propósito:** Evaluar con data dura la madurez del equipo tras aplicar el nuevo SDLC.
* **Participantes Objetivo:** Todos los involucrados.
* **Quality Gate (Objetivo):** Informe de madurez y plan de mejora continua.
* **Opción de Visualización:** Gráfico de Radar de Madurez SDLC (Mermaid).
* **Agenda (1h 30m máx):**
  - 15m: Reflexión de dolor: ¿Qué hicimos bien? ¿Qué dolió más?
  - 45m: **[WOW Factor] Generación del Radar de Madurez:** El facilitador ejecuta el script `.harness/scripts/generate-maturity-radar.mjs` en la terminal. Se proyecta la gráfica interactiva comparando el "Antes vs Después" en los 5 ejes (Requisitos, Diseño, Pruebas, Código, DevOps).
  - 30m: Firma de adopción del estándar corporativo.
