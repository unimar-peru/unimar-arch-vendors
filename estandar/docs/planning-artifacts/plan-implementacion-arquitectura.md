# Plan Ejecutivo de Capacitación: Adopción del SDLC y Arquitectura

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Plan%20Ejecutivo-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
</p>

## 1. Sentido, Propósito y Resumen Ejecutivo

Este plan estratégico no es una capacitación tradicional; es un **programa de transformación cultural** para la ingeniería de UNIMAR. 

**El Fin Último:** Evolucionar de un modelo de desarrollo en silos, propenso a deuda técnica y entregas impredecibles, hacia una **cultura de ingeniería predecible, altamente gobernada y asistida por Inteligencia Artificial**. Buscamos que las reglas del negocio, el diseño técnico y el código vivan bajo un estándar único y auditable (El Método BMAD).

**El Sentido (El "Cómo"):** Para lograrlo, los equipos de Procesos, Arquitectura, Desarrollo, QA e Infraestructura trabajarán en conjunto para construir un producto logístico real desde cero: **[Q-Truck (El Gestor Rápido de Colas de Camiones)](./coaching-arquitectura/q-truck-baseline.md)**. 
A través de este caso transversal, demostraremos que es posible pasar de una idea abstracta a una API funcional en producción, obligando a los participantes a superar los **Quality Gates** matemáticos de la organización en cada etapa. Todo esto, respaldados continuamente por **OpenCode**, nuestra IA que automatiza la revisión de código y el modelado de diagramas.

> **Meta Organizacional:** Acelerar el *Time-to-Market* y reducir la tasa de fallos en producción, logrando que el equipo asimile el estándar corporativo (SDLC) construyendo software real en lugar de leer diapositivas.

---

## 2. Visión Arquitectónica: La Suite Operativa

<div align="center">
  <img src="../../reference/assets/unimar-arch-model.png" alt="Modelo conceptual de la arquitectura Unimar" width="85%" />
  <br/>
  <sub><strong>Figura 1:</strong> Modelo conceptual de la arquitectura corporativa UNIMAR.</sub>
</div>
<br/>

La meta de la adopción metodológica es dominar la construcción de ecosistemas como la **Suite Operativa**. Esta suite descentraliza la lógica monolítica legacy en dominios claros (UMS, MMS, SIL) interoperados mediante un bróker de alta disponibilidad (XMS). El equipo de sistemas, infraestructura y procesos debe comprender que **no hay silos funcionales**, sino contratos de integración (APIs y Eventos) que dictan cómo los componentes dialogan entre sí.

---

## 3. Modelo Operativo del Coaching

Para garantizar que el conocimiento se vuelva accionable, el programa huye de las capacitaciones monolíticas. Cada **Módulo SDLC** está estructurado bajo un modelo de dos etapas y gobernado por una plantilla oficial:

1. **La Sesión General (Teoría):** Máximo **1 hora y 30 minutos** por sesión. Un bloque ejecutivo enfocado puramente en comprender el flujo del SDLC, el propósito del artefacto a construir y su impacto en el negocio.
2. **El Taller Práctico (Hands-on):** Máximo **3 horas** por sesión, con un **break obligatorio de 15 minutos** al llegar a la hora y media. En esta ventana extendida, los equipos operan, abren la plantilla y construyen en vivo el entregable, superando el *Quality Gate*.
*(Nota: Si en el cronograma el taller tiene una duración de "4 días", indica el lapso de calendario en el cual se agendarán estas sesiones de 3 horas, no una dedicación de 8 horas diarias).*

### La Plantilla de Sesión

Cada módulo tiene su propia plantilla específica con el propósito, agenda y entregable certificable correspondiente. Las plantillas están disponibles en la carpeta `templates/` de cada módulo.

---

## 4. Roadmap de Adopción y Certificación

El cronograma detalla la hoja de ruta que inicia en los requerimientos y termina en la operación de soporte. Cada etapa está anclada a un **Entregable Certificado**.

### Opciones de Cronograma

| Modalidad | Duración | Carga Horaria | Perfil Recomendado |
| :--- | :--- | :--- | :--- |
| **Optimizado** 🏆<br/><sub>Formato ligero con 2 sesiones/semana (1 h teoría + 1 h how-to) + revisión sabatina. Investigación autónoma guiada con materiales de referencia. Contenido intacto, reorganizado en sesiones más densas.</sub> | 8 semanas | 6 h/semana<br/>(mar 2h + jue 2h + sáb 2h) | Equipos en producción con espacio para auto-aprendizaje guiado |

**Documentación Detallada:**
- [**Cronograma Optimizado (8 semanas)**](./coaching-arquitectura/cronograma-optimizado.md) — Timeline con 1 h teoría + 1 h how-to, máx. 2 sesiones/semana + revisión sábado

El cronograma incluye:
- Desglose de sesiones por módulo (Base + 0 a 6)
- Formato de 1 h teoría + 1 h how-to por sesión (2 h total)
- Revisión de avances los sábados (2 h)
- Materiales de investigación para auto-aprendizaje por módulo
- Perfiles participantes requeridos (Facilitador, Tech Lead, Developers, QA, DevOps, etc.)
- Hitos críticos y entregables
- Supuestos, dependencias y métricas de seguimiento

| Módulo SDLC | Propósito Ejecutivo | Duración (Estándar) | Entregable Certificado (Quality Gate) | Plantilla de sesión | Artefactos Entregables |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Módulo Base (Bootcamp)** | Nivelación en herramientas (VS Code, GitHub) e Inteligencia Artificial (Método BMAD / OpenCode). | 1 semana | Entorno local configurado y 1er PR exitoso. | [Plantilla](coaching-arquitectura/templates/modulo-base-template.md) | Artefactos |
| **0. Visión, Gates y Kick‑off** | Alinear a la organización bajo el Manifiesto de Ingeniería y explicar los Gates de Calidad corporativos. | 1 semana | Acta de Kick‑off y Visión Asimilada. | [Plantilla](coaching-arquitectura/templates/modulo-0-template.md) | Artefactos |
| **1. Requisitos y Producto** | Trazar Bounded Contexts y acotar el alcance de Q‑Track usando Backlogs Ágiles (BDD). | 2 semanas | PRD y Backlog Ágil de Q‑Track validados. | [Plantilla](coaching-arquitectura/templates/modulo-1-template.md) | Artefactos |
| **2. Diseño y Arquitectura** | Modelar técnica y funcionalmente a Q‑Track, usando el debate de Agentes (Winston/Amelia). | 2 semanas | ADR de Persistencia y C4 de Q‑Track en repositorio. | [Plantilla](coaching-arquitectura/templates/modulo-2-template.md) | Artefactos |
| **3. Desarrollo y Code Review** | Programar el API de Q‑Track respetando la Arquitectura Hexagonal y los Gates (cobertura >80%). | 2 semanas | Código de Q‑Track operativo y Pull Requests Aprobados. | [Plantilla](coaching-arquitectura/templates/modulo-3-template.md) | Artefactos |
| **4. Calidad e Integración** | Aplicar la Pirámide de Testing levantando contenedores reales (Testcontainers) contra el API. | 2 semanas | Test Summary Report (RC Sellado) de Q‑Track. | [Plantilla](coaching-arquitectura/templates/modulo-4-template.md) | Artefactos |
| **5. Infraestructura y Despliegue** | Crear el Dockerfile de Q‑Track y configurar pipelines asegurando telemetría (OTel). | 2 semanas | Notas de Lanzamiento (Release Notes) operativas. | [Plantilla](coaching-arquitectura/templates/modulo-5-template.md) | Artefactos |
| **6. Soporte y Retrospectiva** | Troubleshooting de Q‑Track en Loki, Simulación final E2E y Radar de Madurez SDLC. | 2 semanas | Runbook, Auditoría de Simulacro y Radar de Madurez. | [Plantilla](coaching-arquitectura/templates/modulo-6-template.md) | Artefactos |

**Duración Total del Programa:** 8 semanas · Ver [Cronograma Detallado](#4-roadmap-de-adopción-y-certificación)

---

## 5. Prerrequisitos y Reglas de Participación

Para garantizar el retorno de inversión del tiempo asignado a este plan de coaching, la participación está sujeta a requisitos estrictos de hardware, software y disponibilidad.

### Disponibilidad y Compromiso
- **Dedicación Exclusiva (100% Focus):** Durante las sesiones y talleres, los participantes deben estar liberados de la operación de soporte L1 (incidencias menores). No se aceptan distracciones operativas durante el taller.
- **Preparación Previa (Pre-work):** Ningún participante debe llegar a la sesión en blanco. La lectura de los estándares asignados en el repositorio `unimar_arch` es obligatoria antes de iniciar.
- **Participación Activa:** En modalidades remotas, las cámaras deben estar encendidas para garantizar la asimilación durante las sesiones prácticas (hands-on).
- **Base de Conocimiento (Grabación Opcional/Recomendada):** Se requiere que las sesiones (particularmente las teóricas) sean grabadas vía Microsoft Teams o plataforma equivalente. Estas grabaciones quedarán vinculadas al repositorio como material de *onboarding* pasivo para futuros ingresos.

### Requisitos de Hardware
El ecosistema de la Suite Operativa es distribuido y consume recursos. Se requiere el siguiente hardware local para los talleres prácticos:

- **Hardware Mínimo Requerido (Para roles de Gerencia, Procesos, QA):**
  - Procesador i7 (o equivalente) y **16GB de RAM**. Necesario para ejecutar VS Code, OpenCode y visualizar las herramientas web y de trazabilidad sin cuelgues.
- **Hardware Ideal / Recomendado (Para Desarrolladores y Analistas Claves):**
  - Procesador i7 (o equivalente) y **32GB de RAM**. Esto es estrictamente necesario para el equipo técnico que deba levantar bases de datos, *Message Brokers* locales y contenedores Docker (Testcontainers) en simultáneo sin sufrir degradación del sistema.

### Requisitos de Software y Herramientas
- **Editor y Versionado:** Visual Studio Code, Git instalado a nivel sistema operativo, y GitHub Desktop.
- **Estrategia de Ramas (GitFlow):** Es mandatorio el entendimiento y aplicación de **GitFlow**. Todos los repositorios que se construyan durante los talleres fluirán a través de ramas `develop`, `feature/` y `release/` utilizando Pull Requests controlados por los Quality Gates.
- **Entorno de Ejecución:** Node.js instalado (indispensable para ejecutar herramientas de linting de arquitectura y scripts de compilación de documentación).
- **Asistencia IA Continua (Obligatoria):** Extensión **OpenCode** instalada en VS Code. El aprendizaje y uso de BMAD no se limita a la sesión inicial; la IA debe utilizarse activamente en el 100% de los talleres posteriores para generar PRDs, debatir ADRs, revisar código y escribir pruebas.
- **Accesos:** Todo participante debe tener permisos de acceso (y escritura si aplica) previamente verificados sobre el repositorio corporativo `unimar_arch` y los de la Suite Operativa.

---

## 6. Documentos de Soporte

Se han generado documentos obligatorios que los participantes y el moderador deben utilizar como base de conocimiento durante todo el programa:

### Cronograma
1. [**Cronograma Optimizado (8 semanas)**](./coaching-arquitectura/cronograma-optimizado.md) — Timeline con 2 sesiones/semana de 2h (1 h teoría + 1 h how-to) + revisión sábado, carga ligera (6 h/semana). Enfoque de auto-aprendizaje guiado con materiales de referencia.

### Guías y Referencias
3. [**Glosario de Capacitación**](./coaching-arquitectura/glosario-capacitacion.md): Diccionario rápido de acrónimos (SDLC, PRD, BDD, IaC) y conceptos de UNIMAR.
4. [**Directorio de Herramientas y Conceptos Clave**](./coaching-arquitectura/herramientas-referencia.md): Lista de las tecnologías a usar (VS Code, BMAD, Mermaid, Loki), su propósito y enlaces externos para investigación obligatoria.
5. [**Guía del Facilitador (Directorio de Sesiones)**](./coaching-arquitectura/guia-facilitador.md): Manual exclusivo para el entrenador (Alberto Arroyo). Contiene los propósitos pre-armados, agendas detalladas por minutos y los enlaces exactos a los artefactos que deben visualizarse en cada uno de los 18 talleres y sesiones.

### Prompt Libraries (IA)
6. [**Prompt Library Central**](./coaching-arquitectura/prompts/README.md): 52 prompts accionables organizados por módulo (Base + 0 a 6) para facilitar la generación de artefactos con IA.
