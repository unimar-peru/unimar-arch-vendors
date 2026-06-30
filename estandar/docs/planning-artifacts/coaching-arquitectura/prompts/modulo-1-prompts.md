# Prompt Library — Módulo 1 (Requisitos y Producto)

> **Módulo:** Módulo 1 · **Tipo:** Biblioteca de Prompts para IA  
> **Herramientas:** OpenCode, BMAD Method v6.8.0

---

## Propósito

Este documento contiene los prompts exactos para ejecutar cada actividad del Módulo 1 con asistencia de IA. Copia y pega cada prompt en OpenCode o tu asistente de IA preferido.

---

## Agenda con Prompts

| Bloque | Actividad | Duración | Prompt |
| :--- | :--- | :--- | :--- |
| 2 | Introducción a Bounded Contexts (DDD) | 25 min | [Prompt 1: Explicar Bounded Contexts](#prompt-1-explicar-bounded-contexts) |
| 3 | Identificación de Contextos para Q-Track | 40 min | [Prompt 2: Identificar Contextos](#prompt-2-identificar-contextos) |
| 4 | Generación del PRD con IA | 45 min | [Prompt 3: Generar PRD](#prompt-3-generar-prd) |
| 6 | Backlog Ágil con Historias BDD | 60 min | [Prompt 4: Generar Historias BDD](#prompt-4-generar-historias-bdd) |
| 8 | Priorización MoSCoW | 30 min | [Prompt 5: Priorizar MoSCoW](#prompt-5-priorizar-moscow) |
| 10 | Revisión y Validación del PRD | 30 min | [Prompt 6: Validar PRD](#prompt-6-validar-prd) |

---

## Prompt 1: Explicar Bounded Contexts

**Propósito:** Generar explicación clara de Bounded Contexts (DDD) para equipo mixto.

**Cuándo usar:** Bloque 2 — 25 min

**Prompt:**

```
Actúa como un experto en Domain-Driven Design (DDD) enseñando a un equipo mixto (negocio + técnico) de una empresa logística.

Explica el concepto de "Bounded Context" (Contexto Delimitado) de manera que tanto un gerente de operaciones como un desarrollador junior puedan entender.

Incluye:

1. **Definición simple:** ¿Qué es un Bounded Context en 1 oración?
2. **Analogía cotidiana:** Usa una analogía de la vida real (ej: departamentos de una empresa, zonas de un aeropuerto)
3. **Ejemplo logístico:** Muestra 3-4 Bounded Contexts típicos de UNIMAR:
   - Gestión de Colas de Camiones (Q-Track)
   - Almacenamiento (SIL)
   - Manifiesto de Carga (MMS)
   - Integración con Aduanas
4. **Diagrama Mermaid:** Muestra los contextos como cajas separadas con eventos que los conectan
5. **Señales de alerta:** 3 señales de que los límites están mal definidos (ej: "la misma palabra significa cosas distintas en dos equipos")
6. **Beneficios:** ¿Por qué nos importa definir bien los contextos? (ej: equipos autónomos, lenguaje ubicuo claro)

Formato de salida:
- Definición en negrita al inicio
- Analogía con viñetas
- Diagrama Mermaid
- Lista de señales de alerta
- Tabla de beneficios

Audiencia: Mixta (50% negocio, 50% técnico).
Tono: Didáctico, con ejemplos de la industria logística aduanera.
Duración de lectura: 15 minutos máximo.
```

**Salida esperada:** Explicación visual con analogías y ejemplos UNIMAR.

---

## Prompt 2: Identificar Contextos

**Propósito:** Identificar Bounded Contexts específicos para Q-Track.

**Cuándo usar:** Bloque 3 — 40 min

**Prompt:**

```
Actúa como un arquitecto de software experto en Domain-Driven Design trabajando en el diseño de Q-Track (Gestor de Colas de Camiones de UNIMAR).

Identifica los Bounded Contexts del dominio de Q-Track siguiendo estos pasos:

1. **Analiza el PRD de Q-Track** (proporcionado abajo) y extrae:
   - Actores principales (Conductor, Operador, Supervisor)
   - Procesos de negocio (registro de camión, asignación de turno, avance de cola)
   - Entidades clave (Turno, Patio, Ventana de Atención)

2. **Propón 4-6 Bounded Contexts** que cubran todo el dominio:
   - Nombre claro en español (ej: "Gestión de Turnos", no "TurnManagement")
   - Responsabilidad única de cada contexto
   - Entidades que pertenecen a cada contexto
   - Eventos que publica cada contexto

3. **Genera diagrama Mermaid** mostrando:
   - Cada contexto como un `subgraph`
   - Entidades dentro de cada contexto
   - Eventos que conectan los contextos (ej: `TurnoAsignado`, `ColaActualizada`)

4. **Define el Lenguaje Ubicuo** de cada contexto:
   - 5-7 términos clave que tienen significado específico en ese contexto
   - Ejemplo: "Turno" en Gestión de Turnos significa X, pero en Reportes significa Y

5. **Identifica Contextos Externos** con los que Q-Track se integra:
   - UMS (Autenticación)
   - XMS (Message Broker)
   - Sistema de Aduanas

Formato de salida:
- Lista de Bounded Contexts con descripción
- Diagrama Mermaid completo
- Tabla de Lenguaje Ubicuo por contexto
- Lista de integraciones externas

PRD de referencia:
[PEGAR PRD AQUÍ O REFERENCIAR DOCUMENTO]

Audiencia: Equipo de diseño de Q-Track (arquitectos, desarrolladores, analistas de negocio).
Tono: Técnico pero accesible, enfocado en aplicación práctica.
```

**Salida esperada:** Diagrama de Contextos + Lenguaje Ubicuo + Integraciones.

---

## Prompt 3: Generar PRD

**Propósito:** Generar borrador de PRD (Product Requirements Document) para Q-Track.

**Cuándo usar:** Bloque 4 — 45 min

**Prompt:**

```
Actúa como un Product Manager senior con experiencia en productos logísticos y aduaneros.

Genera un PRD (Product Requirements Document) completo para Q-Track (Gestor de Colas de Camiones de UNIMAR) siguiendo esta estructura:

## 1. Visión del Producto
[2-4 oraciones: qué es, a quién sirve, resultado transformador]

## 2. Problema que Resuelve
[Describir dolor concreto con datos cuantitativos: tiempo de espera actual, incidentes semanales, multas]

## 3. Objetivos del Producto
| Objetivo | Métrica de éxito | Plazo |
| :--- | :--- | :--- |
| [Objetivo 1 con número] | [Cómo se mide] | [Fecha] |

## 4. Usuarios y Roles
| Rol | Descripción | Necesidad principal |
| :--- | :--- | :--- |
| Conductor / Chofer | [Quién es] | [Qué necesita] |
| Operador de Patio | [Quién es] | [Qué necesita] |
| Supervisor Aduanero | [Quién es] | [Qué necesita] |

## 5. Bounded Contexts del Dominio
[Insertar diagrama Mermaid con 4-6 contextos identificados]

## 6. Alcance del Producto
**Incluido (Must Have):**
- [Funcionalidad 1]
- [Funcionalidad 2]
- [Funcionalidad 3]

**Fuera de Alcance:**
- [Funcionalidad excluida 1 — razón]
- [Funcionalidad excluida 2 — razón]

## 7. Restricciones y Supuestos
| Tipo | Descripción |
| :--- | :--- |
| Restricción técnica | [Tecnología obligatoria / prohibida] |
| Supuesto de negocio | [Condición que se asume verdadera] |
| Dependencia externa | [Sistema o equipo del que depende] |

## 8. Criterios de Aceptación del PRD
- [ ] Todas las secciones completadas sin campos vacíos
- [ ] Al menos 4 Bounded Contexts identificados con diagrama Mermaid
- [ ] Objetivos con métrica medible y plazo definido
- [ ] Revisado y aprobado por el facilitador

Datos de entrada:
- Baseline de Q-Track: [REFERENCIA]
- KPIs objetivo: Reducir tiempo de espera de 87 min a 50 min, ≤ 2 incidentes/semana, 0 multas
- Fecha límite: 2025-06-30

Formato: Markdown con tablas, diagramas y secciones claras.
Tono: Profesional, orientado a negocio pero técnicamente preciso.
Longitud: 3-5 páginas.
```

**Salida esperada:** PRD completo listo para revisión del equipo.

---

## Prompt 4: Generar Historias BDD

**Propósito:** Generar backlog de historias de usuario en formato BDD (Given/When/Then).

**Cuándo usar:** Bloque 6 — 60 min

**Prompt:**

```
Actúa como un Agile Coach experto en BDD (Behavior-Driven Development) y formato Gherkin.

Genera un backlog de 10-15 historias de usuario para Q-Track en formato BDD siguiendo estas reglas:

**Formato de cada historia:**

> **Dado que** [contexto inicial — estado del sistema o del usuario]
> **Cuando** [acción que realiza el usuario]
> **Entonces** [resultado observable y verificable]
> **Y** [resultado adicional si aplica]

**Criterios de aceptación adicionales:**
- [ ] [Criterio 1 verificable]
- [ ] [Criterio 2 verificable]

**Requisitos:**

1. **Cubre todos los Bounded Contexts** identificados en el PRD
2. **Priorización MoSCoW:** Cada historia debe tener etiqueta 🔴 Must Have, 🟡 Should Have, 🟢 Could Have, o ⚪ Won't Have
3. **Épicas:** Agrupa las historias en 4-6 épicas coherentes
4. **Formato BDD estricto:** Todas las historias deben usar Dado que / Cuando / Entonces
5. **Criterios verificables:** Los criterios de aceptación deben ser binarios (sí/no)

**Estructura de salida:**

### Épica 1: [Nombre de la épica]

**Historia 1.1 — [Nombre descriptivo]** | 🔴 Must Have

> **Dado que** [contexto]
> **Cuando** [acción]
> **Entonces** [resultado]
> **Y** [resultado adicional]

**Criterios de aceptación adicionales:**
- [ ] [Criterio 1]
- [ ] [Criterio 2]

[Repetir para 2-3 historias por épica]

## Resumen de Priorización

| Historia | Prioridad | Estimación (Story Points) | Sprint objetivo |
| :--- | :--- | :--- | :--- |
| [Historia 1.1] | 🔴 Must Have | [X] | [Sprint N] |

**Distribución objetivo:**
- Must Have: 60-70% (imprescindible para lanzamiento)
- Should Have: 20-30% (importante pero no crítico)
- Could Have: 10-15% (deseable)
- Won't Have: 0-5% (descartado esta versión)

Contexto: Q-Track es un sistema de gestión de colas de camiones para patios aduaneros.
Audiencia: Equipo de desarrollo, QA y Product Owner.
Tono: Claro, accionable, sin ambigüedad.
```

**Salida esperada:** Backlog completo con 10-15 historias BDD priorizadas.

---

## Prompt 5: Priorizar MoSCoW

**Propósito:** Facilitar sesión de priorización MoSCoW con el equipo.

**Cuándo usar:** Bloque 8 — 30 min

**Prompt:**

```
Actúa como un facilitador experto en priorización de productos usando el método MoSCoW.

Genera una guía para facilitar una sesión de priorización MoSCoW de 30 minutos con el equipo de Q-Track.

Incluye:

1. **Explicación del método MoSCoW:**
   - 🔴 **Must Have:** Imprescindible para el lanzamiento. Sin esto, el producto no funciona.
   - 🟡 **Should Have:** Importante pero no crítico. Se incluye si el tiempo lo permite.
   - 🟢 **Could Have:** Deseable. Se implementa en versiones posteriores.
   - ⚪ **Won't Have:** Descartado para esta versión. Documentado para no repetir el debate.

2. **Reglas de oro:**
   - Los Must Have no deben superar 60-70% del total (si no, todo es prioritario)
   - Cada Must Have debe responder: "¿El producto puede lanzarse SIN esto?"
   - Los Won't Have no son "nunca", son "no en esta versión"

3. **Dinámica de sesión:**
   - Paso 1: Presentar todas las historias (5 min)
   - Paso 2: Votación individual silenciosa (5 min)
   - Paso 3: Discusión de discrepancias (15 min)
   - Paso 4: Validación de distribución (5 min)

4. **Preguntas guía para cada historia:**
   - "¿Qué pasa si esta funcionalidad NO está en v1.0?"
   - "¿Podemos lanzar sin esto y añadirlo en v1.1?"
   - "¿Esta funcionalidad depende de otra que es Must Have?"

5. **Tabla de priorización:**
   | Historia | Votación inicial | Discusión | Prioridad final | Justificación |
   | :--- | :--- | :--- | :--- | :--- |
   | [Historia 1.1] | 🔴 | [Resumen] | 🔴 | [Razón] |

6. **Señales de alerta:**
   - Más del 70% de historias son Must Have (no hay priorización real)
   - Discusiones circulares sin criterio de negocio
   - Stakeholders ausentes en la decisión

Formato de salida:
- Guía paso a paso con tiempos
- Tabla de votación
- Lista de preguntas guía
- Señales de alerta con mitigadores

Audiencia: Product Owner, equipo de desarrollo, stakeholders de negocio.
Tono: Facilitador, neutral, enfocado en consenso.
```

**Salida esperada:** Guía de facilitación + tabla de priorización lista para usar.

---

## Prompt 6: Validar PRD

**Propósito:** Checklist de validación del PRD antes de aprobar.

**Cuándo usar:** Bloque 10 — 30 min

**Prompt:**

```
Actúa como un Architecture Board revisando un PRD antes de aprobarlo para pasar a la fase de Diseño.

Genera una checklist de validación para el PRD de Q-Track que cubra los siguientes aspectos:

## 1. Completitud de Secciones

- [ ] Visión del producto en 2-4 oraciones claras
- [ ] Problema cuantificado con datos (tiempo, incidentes, costos)
- [ ] Objetivos con métrica medible y plazo definido
- [ ] Usuarios y roles identificados (mínimo 3)
- [ ] Bounded Contexts con diagrama Mermaid (mínimo 4 contextos)
- [ ] Alcance con Incluido y Fuera de Alcance explícitos
- [ ] Restricciones y supuestos documentados
- [ ] Criterios de aceptación del PRD completados

## 2. Calidad de Contenido

- [ ] La visión es inspiradora pero realista
- [ ] El problema tiene datos de línea base (ej: "87 minutos")
- [ ] Los objetivos son SMART (Specific, Measurable, Achievable, Relevant, Time-bound)
- [ ] Los roles tienen necesidades claras y distintas
- [ ] Los contextos no se solapan (responsabilidad única)
- [ ] El fuera de alcance tiene justificación de negocio

## 3. Trazabilidad

- [ ] Cada funcionalidad del Alcance se mapea a al menos 1 historia del Backlog
- [ ] Cada historia del Backlog se mapea a un Bounded Context
- [ ] Los KPIs del PRD se alinean con los KPIs del Acta de Kick-off

## 4. Preguntas de Reflexión

- ¿Hay alguna ambigüedad que cause interpretación distinta?
- ¿Falta algún actor o rol importante?
- ¿Alguna restricción técnica contradice un objetivo de negocio?
- ¿El alcance es realista para la fecha límite?

## 5. Criterio de Aprobación

**Aprobar si:**
- ✅ Todas las secciones completas
- ✅ Máximo 2 observaciones menores
- ✅ Stakeholders clave están de acuerdo

**No aprobar si:**
- ❌ Faltan secciones obligatorias
- ❌ Hay ambigüedad en visión o alcance
- ❌ Stakeholders no están alineados

Formato de salida:
- Checklist imprimible con checkboxes
- Espacio para comentarios por cada ítem
- Sección de "Observaciones" y "Acciones Requeridas"

Audiencia: Product Owner, Architecture Board, stakeholders.
Tono: Profesional, constructivo, enfocado en calidad.
```

**Salida esperada:** Checklist de validación lista para usar en sesión de revisión.

---

## Cómo Usar Esta Prompt Library

1. **Antes de la sesión:** El facilitador revisa los prompts y los adapta al contexto de Q-Track
2. **Durante la sesión:** Los participantes copian prompts en OpenCode/IA y generan artefactos
3. **Después de la sesión:** Los prompts quedan disponibles para futuros productos

### Mejores Prácticas

- ✅ **Contextualiza:** Agrega datos específicos de tu producto (KPIs, fechas, stakeholders)
- ✅ **Itera:** Refina prompts según calidad de respuestas (ej: "hazlo más específico", "agrega ejemplos")
- ✅ **Valida:** La IA genera borradores, el equipo valida y ajusta
- ✅ **Versiona:** Guarda los prompts que funcionen mejor en tu biblioteca local

---

*Prompt Library del Módulo 1 · Corpus arquitectónico UNIMAR · Versión: 1.0*
