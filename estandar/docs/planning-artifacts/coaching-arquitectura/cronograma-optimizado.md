# Cronograma Optimizado — Coaching de Arquitectura SDLC

> **Duración Total del Programa:** 8 semanas · **Formato:** 1 h teoría + 1 h how-to por sesión · **Máx. 2 sesiones/semana + Revisión sábado**

---

## Resumen Ejecutivo

| Dimensión | Valor |
| :--- | :--- |
| **Duración Total** | 8 semanas |
| **Módulos** | 8 (Base + 0 a 6) |
| **Sesiones Facilitadas** | 16 sesiones (2 h c/u) |
| **Horas de Sesión** | 32 h teoría + how-to |
| **Reuniones de Revisión (Sábados)** | 8 sesiones (2 h c/u) = 16 h |
| **Total Horas Facilitadas** | 48 h |
| **Trabajo Asíncrono + Investigación** | 4-6 h/semana (individual) |
| **Carga Semanal Presencial** | 6 h/semana (mar + jue + sáb) |
| **Participantes por Sesión** | 6-10 personas |

---

## Estructura Semanal Tipo

| Día | Actividad | Duración | Formato |
| :--- | :--- | :---: | :--- |
| **Martes** | Sesión Teoría + How-To | 2 h | 1 h exposición + 1 h práctica guiada |
| **Jueves** | Sesión Teoría + How-To | 2 h | 1 h exposición + 1 h práctica guiada |
| *(Resto de semana)* | Trabajo asíncrono + investigación | 4-6 h | Individual con materiales de referencia |
| **Sábado** | Revisión de Avances | 2 h | Demo + Q&A + Desbloqueo + Plan de la siguiente semana |

### Formato de Cada Sesión (2 h)

| Bloque | Duración | Actividad |
| :--- | :---: | :--- |
| **Apertura** | 5 min | Propósito + Agenda del día |
| **Teoría** | 55 min | Exposición conceptual + Demo + Referencias |
| **Break** | 5 min | Transición |
| **How-To** | 50 min | Práctica guiada / Ejercicio en pares |
| **Cierre** | 5 min | Recap + Material de investigación + Tareas |

### Formato de Revisión de Sábado (2 h)

| Bloque | Duración | Actividad |
| :--- | :---: | :--- |
| **Check-in** | 10 min | ¿Qué avances tuviste esta semana? |
| **Demo Voluntaria** | 30 min | 1-2 participantes muestran su trabajo |
| **Q&A Técnico** | 30 min | Resolución de dudas y bloqueos |
| **Code Review Grupal** | 30 min | Revisión de PRs / artefactos de la semana |
| **Plan Sgte. Semana** | 20 min | Objetivos + Material de pre-lectura |

---

## Principios del Enfoque Optimizado

| Principio | Descripción |
| :--- | :--- |
| **Sesiones Cortas y Enfocadas** | 1 h teoría + 1 h how-to. Sin relleno. Cada minuto cuenta. |
| **Auto-aprendizaje Guiado** | Se proveen materiales, referencias y prompts de IA para que los equipos profundicen por su cuenta. |
| **Máximo 2 Sesiones/Semana** | Libera tiempo para aplicar lo aprendido en la práctica real. |
| **Sábado de Revisión** | Punto de control semanal para desbloquear, compartir y realinear. |
| **Investigación Autónoma** | Cada participante investiga y experimenta fuera de las sesiones. El facilitador guía, no dicta. |
| **Contenido Intacto** | No se elimina contenido. Se reorganiza en sesiones más densas y enfocadas. |

---

## Timeline por Módulo

### Módulo Base: Instalación y Configuración

| Sesión | Teoría (1 h) | How-To (1 h) | Semana |
| :--- | :--- | :--- | :---: |
| **Sesión 1** | Casos de Caos Técnico + GitFlow | Configuración de repositorio y ramas | 1 |
| **Sesión 2** | Demo BMAD + OpenCode + Herramientas | Instalación de herramientas + Primer PR exitoso | 1 |

**Material de Investigación:**
- [GitFlow — Estrategia de ramificación](./prompts/modulo-base-prompts.md)
- [BMAD Method v6.8.0 — Guía de inicio](https://bmadmethod.com/)
- [OpenCode — Configuración en VS Code](https://opencode.ai)
- Video: "Cómo instalar y verificar el entorno BMAD en 30 minutos"

**Trabajo Asíncrono:** Configuración local completa + verificación de entorno + PR de prueba.

---

### Módulo 0: Visión, Gates y Kick-off

| Sesión | Teoría (1 h) | How-To (1 h) | Semana |
| :--- | :--- | :--- | :---: |
| **Sesión 1** | Manifiesto de Ingeniería + Debate Socrático + Quality Gates | Definición de Quality Gates del proyecto | 2 |
| **Sesión 2** | Acta de Kick-off + Gobernanza del programa | Redacción del Acta + Firma digital + Commiteo | 2 |

**Material de Investigación:**
- [Manifiesto de Ingeniería — Referencia](./prompts/modulo-0-prompts.md)
- [Quality Gates — Estrategia corporativa](../../../reference/governance/sdlc/gates-calidad.es.md)
- Video: "Cómo redactar un Acta de Kick-off efectiva"
- Ejemplo: Acta de Kick-off de Q-Track

**Trabajo Asíncrono:** Lectura del Manifiesto + Ajustes finales del Acta.

---

### Módulo 1: PRD y Bounded Contexts

| Sesión | Teoría (1 h) | How-To (1 h) | Semana |
| :--- | :--- | :--- | :---: |
| **Sesión 1** | DDD + Bounded Contexts + Event Storming | Identificación de Bounded Contexts del proyecto | 3 |
| **Sesión 2** | Generación de PRD con IA + Historias BDD | Redacción de PRD asistido por IA + Primeras historias | 3 |

**Material de Investigación:**
- [DDD y Bounded Contexts — Guía práctica](./prompts/modulo-1-prompts.md)
- PRD — Plantilla y ejemplos
- Historias BDD — Formato Gherkin
- Video: "De Bounded Context a PRD en 1 hora con IA"

**Trabajo Asíncrono:** Refinamiento de contextos + Priorización MoSCoW + Validación con stakeholders.

---

### Módulo 2: ADRs y C4

| Sesión | Teoría (1 h) | How-To (1 h) | Semana |
| :--- | :--- | :--- | :---: |
| **Sesión 1** | ADRs + Modelo C4 Niveles 1-2 | Primer ADR + Diagrama C4 Nivel 1 (Contexto) | 4 |
| **Sesión 2** | Arquitectura Hexagonal + Propuesta (Winston) + Crítica (Amelia) | Diagrama C4 Nivel 2 (Contenedores) + ADR técnico | 4 |

**Material de Investigación:**
- [ADRs — Guía de redacción](../../../reference/architecture/adrs/README.md)
- [Modelo C4 — Especificación de topología](../../../reference/architecture/blueprints/especificacion-topologia-c4.es.md)
- [Arquitectura Hexagonal — Patrones canónicos](../../../reference/architecture/canonical-patterns/README.md)
- Video: "ADRs y C4: El lenguaje común de la arquitectura"

**Trabajo Asíncrono:** Redacción de ADRs adicionales + Refinamiento de diagramas C4 + Investigación de patrones.

---

### Módulo 3: Hexagonal y Código

| Sesión | Teoría (1 h) | How-To (1 h) | Semana |
| :--- | :--- | :--- | :---: |
| **Sesión 1** | Repaso Hexagonal + Estructura NestJS + Entidad de Dominio | Creación de entidad de dominio pura + Caso de uso con DI | 5 |
| **Sesión 2** | Tests Unitarios con Jest + Checklist de Code Review | Escritura de tests + Code Review en pares | 5 |

**Material de Investigación:**
- [NestJS — Stack tecnológico autorizado](../../../reference/architecture/stack-tecnologico-autorizado-nodejs.es.md)
- [Patrón Hexagonal — Implementación práctica](./prompts/modulo-3-prompts.md)
- [Jest — Documentación oficial](https://jestjs.io/)
- Video: "Arquitectura Hexagonal en NestJS: Paso a paso"

**Trabajo Asíncrono:** Implementación de casos de uso adicionales + Mejora de cobertura de tests + PRs.

---

### Módulo 4: Testing e Integración

| Sesión | Teoría (1 h) | How-To (1 h) | Semana |
| :--- | :--- | :--- | :---: |
| **Sesión 1** | Pirámide de Testing + Testcontainers | Configuración de Testcontainers + Tests de integración | 6 |
| **Sesión 2** | Tests E2E + Reporte de Tests + Validación RC | Generación de Test Summary Report + Selle de RC | 6 |

**Material de Investigación:**
- [Pirámide de Testing — Estrategia corporativa](../../../reference/governance/sdlc/estrategia-pruebas.es.md)
- [Testcontainers — Documentación](https://testcontainers.com/)
- Test Summary Report — Plantilla
- Video: "De tests unitarios a E2E: La pirámide completa"

**Trabajo Asíncrono:** Ejecución completa de suite de tests + Refinamiento de reportes.

---

### Módulo 5: Docker y CI/CD

| Sesión | Teoría (1 h) | How-To (1 h) | Semana |
| :--- | :--- | :--- | :---: |
| **Sesión 1** | Docker Multi-Stage Builds + Dockerfile | Generación de Dockerfile optimizado + Build local | 7 |
| **Sesión 2** | Pipeline CI/CD + OpenTelemetry + Release Notes | Pipeline funcional + Instrumentación OTel + Checklist de despliegue | 7 |

**Material de Investigación:**
- [Docker — Stack tecnológico autorizado](../../../reference/architecture/stack-tecnologico-autorizado.es.md)
- [CI/CD — Estrategia de ramificación](../../../reference/governance/sdlc/estrategia-ramificacion.es.md)
- [OpenTelemetry — Documentación](https://opentelemetry.io/)
- Video: "De Dockerfile a Pipeline CI/CD en producción"

**Trabajo Asíncrono:** Configuración del pipeline en el repositorio del equipo + Pruebas de despliegue.

---

### Módulo 6: Observabilidad y Cierre

| Sesión | Teoría (1 h) | How-To (1 h) | Semana |
| :--- | :--- | :--- | :---: |
| **Sesión 1** | Stack de Observabilidad (Grafana/Loki/Promtail) + LogQL | Configuración de Promtail + Consultas LogQL + Runbook | 8 |
| **Sesión 2** | Simulacro de Incidente + Retrospectiva + Radar de Madurez | Simulacro guiado + Retrospectiva + Radar + Ceremonia de Cierre | 8 |

**Material de Investigación:**
- [Stack de Observabilidad — Flujo de arquitectura](../../../reference/architecture/flujo-arquitectura-observabilidad.es.md)
- Runbook — Plantilla
- [Radar de Madurez — Guía de medición](./prompts/modulo-6-prompts.md)
- Video: "Observabilidad en acción: De logs a dashboards en 1 hora"

**Trabajo Asíncrono:** Documentación de lecciones aprendidas + Refinamiento de dashboards.

---

## Consolidado por Semana

| Semana | Módulo | Sesiones | Horas Facilitadas | Sábado | Total Semanal |
| :---: | :--- | :---: | :---: | :---: | :---: |
| **1** | Base | 2 | 4 h | Revisión + Configuración | 6 h |
| **2** | Módulo 0 | 2 | 4 h | Revisión + Firma Acta | 6 h |
| **3** | Módulo 1 | 2 | 4 h | Revisión + Validación PRD | 6 h |
| **4** | Módulo 2 | 2 | 4 h | Revisión + ADRs | 6 h |
| **5** | Módulo 3 | 2 | 4 h | Revisión + Code Review | 6 h |
| **6** | Módulo 4 | 2 | 4 h | Revisión + RC | 6 h |
| **7** | Módulo 5 | 2 | 4 h | Revisión + Pipeline | 6 h |
| **8** | Módulo 6 | 2 | 4 h | Revisión + Ceremonia Cierre | 6 h |
| **TOTAL** | **8 módulos** | **16 sesiones** | **32 h** | **8 sábados (16 h)** | **48 h** |

---

## Hitos Críticos

| Hito | Semana | Entregable | Criterio de Aceptación |
| :--- | :---: | :--- | :--- |
| **H1:** Entorno Configurado | 1 | README de rama feature | Todos tienen BMAD instalado y primer PR exitoso |
| **H2:** Kick-off Formalizado | 2 | Acta de Kick-off firmada | Acta commiteada en `develop` |
| **H3:** PRD Aprobado | 3 | PRD + Backlog BDD | PRD validado por stakeholders |
| **H4:** Arquitectura Decidida | 4 | ADRs + C4 N1/N2 | ADRs mergeados a `develop` |
| **H5:** Código Hexagonal | 5 | Entidad + Caso de Uso + Tests | Cobertura > 80% |
| **H6:** Release Candidate | 6 | RC + Test Summary Report | Todos los tests pasan |
| **H7:** Pipeline CI/CD | 7 | Pipeline funcional + OTel | Deploy automático en staging |
| **H8:** Cierre del Programa | 8 | Radar de Madurez + Lecciones | Retrospectiva completada |

---

## Perfiles Participantes — Detalle

### Roles Core

| Rol | Cantidad | Horas Totales | Responsabilidades |
| :--- | :---: | :---: | :--- |
| **Facilitador Principal** | 1 | 48 h | Conducción de sesiones + Revisión sabatina |
| **Co-Facilitador** | 1 | 48 h | Soporte en hands-on labs + Materiales de investigación |
| **Tech Lead** | 1 | 40 h | Guía técnica, code reviews, validación en sábados |
| **Developers** | 3-5 | 40 h | Implementación, tests, investigación autónoma |
| **QA Lead** | 1 | 24 h | Validación de tests, sellado RC |
| **DevOps Lead** | 1 | 16 h | Pipeline, Docker, observabilidad |

### Roles Parciales

| Rol | Módulos | Horas Totales | Responsabilidades |
| :--- | :--- | :---: | :--- |
| **Product Owner** | 0, 1, 4, 5, 6 | 16 h | Validación PRD, backlog, criterios |
| **Business Analyst** | 0, 1 | 8 h | Actas, debate, historias BDD |
| **Arquitecto Líder** | 2, 3 | 12 h | ADRs, C4, arquitectura hexagonal |
| **Architecture Board** | 0, 2, 6 | 6 h | Aprobación de ADRs, cierre |
| **Stakeholders de Negocio** | 1, 6 | 4 h | Validación PRD, retrospectiva |

### Resumen de Participación

| Perfil | Módulos | Semanas Requeridas | Horas Totales | % Dedicación |
| :--- | :--- | :---: | :---: | :---: |
| Facilitador Principal | Todos | 8 | 48 h | 100% |
| Co-Facilitador | Todos | 8 | 48 h | 100% |
| Tech Lead | Todos | 7 | 40 h | 88% |
| Developers | Todos | 7 | 40 h | 88% |
| QA Lead | 3, 4, 6 | 4 | 24 h | 50% |
| DevOps Lead | 5, 6 | 3 | 16 h | 38% |
| Product Owner | 0, 1, 4, 5, 6 | 4 | 16 h | 50% |
| Arquitecto Líder | 2, 3 | 3 | 12 h | 38% |
| Business Analyst | 0, 1 | 2 | 8 h | 25% |
| Architecture Board | 0, 2, 6 | 1.5 | 6 h | 19% |
| Stakeholders | 1, 6 | 1 | 4 h | 13% |

---

## Materiales de Investigación por Módulo

Cada módulo incluye una biblioteca de recursos para auto-aprendizaje:

| Tipo | Descripción | Ejemplos |
| :--- | :--- | :--- |
| **📚 Lecturas Obligatorias** | Artículos cortos (< 10 min) | Prompts, guías rápidas, entradas de blog |
| **📖 Lecturas Complementarias** | Documentación oficial | Stack tecnológico, ADRs, estándares |
| **🎥 Videos Grabados** | Sesiones asíncronas | Demos, walkthroughs, tutoriales |
| **🛠️ Ejercicios Prácticos** | Labs auto-guiados | Repos con ejercicios, katas de código |
| **🤖 Prompts de IA** | Asistentes para cada módulo | Ver Prompt Libraries |
| **📋 Checklists** | Listas de verificación | Quality Gates, pre-requisitos, entregables |

### Estrategia de Auto-aprendizaje

1. **Pre-lectura** (antes de la sesión): Material obligatorio (15-20 min)
2. **Durante la sesión**: Teoría + práctica guiada (2 h)
3. **Post-sesión** (resto de semana): Investigación + experimentación + ejercicios (4-6 h)
4. **Sábado**: Demo de avances + desbloqueo + realineación (2 h)

---

## Comparativa: Enfoques Anteriores vs Optimizado

| Dimensión | Estándar (12 sem) | Agresivo (6 sem) | Optimizado (8 sem) |
| :--- | :---: | :---: | :---: |
| **Duración** | 12 semanas | 6 semanas | **8 semanas** |
| **Horas Sesión** | 96 h | 120 h | **48 h** |
| **Carga Semanal** | 8-10 h/semana | 20-24 h/semana | **6 h/semana** |
| **Carga Diaria** | 2 h/día | 4 h/día | **2 h (máx 2 días/sem)** |
| **Formato Sesión** | 2-3 h | 4 h | **1 h teoría + 1 h how-to** |
| **Frecuencia** | 3-5 sesiones/sem | 5 sesiones/sem | **2 sesiones/sem + sábado** |
| **Auto-aprendizaje** | Limitado | Mínimo | **Guiado con materiales** |
| **Riesgo de Burnout** | Bajo | Medio-Alto | **Muy Bajo** |
| **Time-to-Productivity** | 12 semanas | 6 semanas | **8 semanas** |
| **Contenido** | Completo | Completo | **Completo (intacto)** |

---

## Reglas del Formato Optimizado

| Regla | Descripción |
| :--- | :--- |
| **Puntualidad** | Sesiones inician a la hora exacta. 5 min de gracia. |
| **Pre-lectura Obligatoria** | Sin pre-lectura, no se aprovecha la sesión. |
| **Cámaras On** | Video obligatorio para engagement (al menos en sesiones). |
| **Sin Multitasking** | Prohibido revisar correo/celular durante la sesión. |
| **Parking Lot** | Dudas fuera de scope → Parking Lot para el sábado. |
| **Sábado Obligatorio** | La revisión de avances es parte del programa. |
| **Material de Referencia** | Todo el material de investigación se comparte al inicio de cada módulo. |
| **Auto-gestión** | Cada participante es responsable de su aprendizaje autónomo. |

---

## Supuestos y Dependencias

### Supuestos Críticos

| # | Supuesto | Impacto si no se cumple | Mitigador |
| :--- | :--- | :--- | :--- |
| **S1** | Participantes dedican 4-6 h/semana a investigación autónoma | Progreso lento | Material guiado + checkpoints semanales |
| **S2** | Decisores disponibles para validaciones | Cuellos de botella | Delegados con autoridad en sábados |
| **S3** | Entorno técnico pre-configurado (Módulo Base) | Pérdida de tiempo en sesiones | Checklist pre-módulo + soporte asíncrono |
| **S4** | Participantes completan pre-lectura | Sesión menos productiva | Resumen ejecutivo de 5 min al inicio |
| **S5** | Acceso a IA (OpenCode/BMAD) | Menor velocidad de ejecución | Prompts offline + guías alternativas |

### Dependencias

| # | Dependencia | Módulo Afectado | Owner |
| :--- | :--- | :--- | :--- |
| **D1** | Manifiesto de Ingeniería aprobado | Módulo 0 | Architecture Board |
| **D2** | Stakeholders disponibles para validar PRD | Módulo 1 | Product Owner |
| **D3** | Patrones arquitectónicos corporativos definidos | Módulo 2 | Arquitecto Líder |
| **D4** | NestJS aprobado como framework backend | Módulo 3 | Tech Lead |
| **D5** | Docker Hub corporativo configurado | Módulo 5 | DevOps Lead |
| **D6** | Grafana/Loki desplegados | Módulo 6 | DevOps Lead |

---

## Gobernanza del Programa

### Comité de Gobernanza

| Comité | Miembros | Frecuencia | Propósito |
| :--- | :--- | :--- | :--- |
| **Steering Committee** | Facilitador, PO, Arquitecto, Tech Lead | Semanal (post-sábado) | Decisiones estratégicas, remover bloqueos |
| **Architecture Board** | Arquitecto Líder, Tech Lead, Senior Devs | Por demanda | Aprobación de ADRs, waivers de Quality Gates |

### Ritmo de Gobernanza

| Ceremonia | Frecuencia | Duración | Participantes |
| :--- | :--- | :---: | :--- |
| **Sesiones Teoría + How-To** | Mar y Jue | 2 h | Todos los participantes |
| **Revisión de Avances** | Sábado | 2 h | Todos los participantes |
| **Steering Committee** | Semanal (post-sábado) | 30 min | Facilitador + PO + Arquitecto |
| **Retrospectiva de Programa** | Semana 8 | 2 h | Todos los participantes |

---

## Métricas de Seguimiento

### Métricas de Progreso

| Métrica | Objetivo | Frecuencia de Medición |
| :--- | :--- | :--- |
| **Asistencia a Sesiones** | > 90% | Por sesión |
| **Artefactos Completados** | 100% | Por módulo |
| **Avance de Investigación** | > 80% | Revisión sabatina |
| **Pre-lectura Completada** | > 80% | Check-in de sesión |
| **PRs Mergeados por Semana** | ≥ 2 por developer | Revisión sabatina |

### Métricas de Calidad

| Métrica | Objetivo | Medición |
| :--- | :--- | :--- |
| **Satisfacción de Participantes** | > 4/5 | Encuesta por módulo |
| **Calidad de Artefactos** | > 8/10 | Rúbrica de evaluación |
| **Adopción de Estándares** | 100% | Auditoría post-programa |
| **Cobertura de Tests** | ≥ 80% | Módulos 3-6 |

---

## Documentos Relacionados

- [Plan de Implementación](../../plan-implementacion-arquitectura.md) — Roadmap ejecutivo
- [README del Programa](./README.md) — Portal de navegación
- [Guía del Facilitador](./guia-facilitador.md) — Manual del entrenador
- Hubs de Módulo — Secuencia didáctica por módulo
- Prompt Libraries — Prompts para IA (46 prompts)
- Plantillas — Templates de sesiones y artefactos
- [Glosario](./glosario-capacitacion.md) — Términos y acrónimos
- [Herramientas](./herramientas-referencia.md) — Stack tecnológico

---

## Historial de Revisiones

| Versión | Fecha | Cambios Principales | Autor |
| :--- | :--- | :--- | :--- |
| **1.2** | 2026-06-17 | Nuevo cronograma optimizado (8 semanas, 2 h/sesión, 2 sesiones/sem + sábado). Reemplaza versiones estándar y agresiva. | Architecture Board |
| **1.1** | 2026-06-16 | Cronograma Agresivo (6 semanas) + Perfiles participantes detallados | Architecture Board |
| **1.0** | 2026-06-16 | Creación del portal de navegación + Cronograma (12 semanas) | Architecture Board |

---

*Documento generado bajo el estándar del corpus arquitectónico de UNIMAR · Idioma: Español · Versión: 1.2*
