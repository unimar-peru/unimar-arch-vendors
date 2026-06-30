# Prompt Library — Módulo 0 (Visión, Gates y Kick-off)

> **Módulo:** Módulo 0 · **Tipo:** Biblioteca de Prompts para IA  
> **Herramientas:** OpenCode, BMAD Method v6.8.0

---

## Propósito

Este documento contiene los prompts exactos para ejecutar cada actividad del Módulo 0 con asistencia de IA. Copia y pega cada prompt en OpenCode o tu asistente de IA preferido.

---

## Agenda con Prompts

| Bloque | Actividad | Duración | Prompt |
| :--- | :--- | :--- | :--- |
| 2 | Presentación del Manifiesto de Ingeniería | 20 min | [Prompt 1: Resumir Manifiesto](#prompt-1-resumir-manifiesto) |
| 3 | Debate socrático: ¿Qué es calidad? | 30 min | [Prompt 2: Facilitar debate](#prompt-2-facilitar-debate) |
| 4 | Presentación de los 5 Quality Gates | 25 min | [Prompt 3: Explicar Quality Gates](#prompt-3-explicar-quality-gates) |
| 6 | OpenCode genera borrador del Acta | 20 min | [Prompt 4: Generar Acta de Kick-off](#prompt-4-generar-acta) |
| 7 | Revisión y aprobación del Acta | 30 min | [Prompt 5: Revisar Acta](#prompt-5-revisar-acta) |
| 8 | Firmas digitales y commit | 20 min | [Prompt 6: Generar comandos Git](#prompt-6-generar-comandos-git) |

---

## Prompt 1: Resumir Manifiesto

**Propósito:** Generar resumen ejecutivo del Manifiesto de Ingeniería para presentación.

**Cuándo usar:** Bloque 2 — 20 min

**Prompt:**

```
Actúa como un Architecture Board de UNIMAR presentando el Manifiesto de Ingeniería a un equipo mixto (gerencia, procesos, desarrollo, QA, infraestructura).

Genera un resumen ejecutivo del Manifiesto de Ingeniería con los siguientes 7 principios:

1. Tecnología Probada para Estabilidad de Producción
2. La Experiencia del Desarrollador es Prioridad Arquitectónica
3. Disciplina Test-First como Especificación Ejecutable
4. Fronteras Explícitas entre Componentes
5. Estándares Compartidos sobre Heroísmo Individual
6. Evidencia Ejecutable sobre Opinión
7. Higiene y Reconocimiento Open Source

Para cada principio, incluye:
- **Título** del principio
- **Propósito** en 1-2 oraciones
- **Ejemplo concreto** de aplicación en UNIMAR
- **Contraejemplo** (qué pasa si no se sigue)

Formato de salida:
- Tabla resumen con los 7 principios
- 1 diapositiva equivalente por principio (título + 3 bullets)
- Analogía cotidiana para cada principio (ej: "es como construir un puente...")

Audiencia: Mixta (técnicos y no técnicos).
Tono: Profesional, inspirador, con ejemplos de la industria logística.
Duración de lectura: 15 minutos máximo.
```

**Salida esperada:** Resumen ejecutivo + análogos visuales para presentación.

---

## Prompt 2: Facilitar Debate

**Propósito:** Generar preguntas socráticas para debate sobre calidad.

**Cuándo usar:** Bloque 3 (Debate socrático) — 30 min

**Prompt:**

```
Actúa como un facilitador experto en metodologías socráticas para equipos de ingeniería.

Genera 10 preguntas socráticas para guiar un debate de 30 minutos sobre "¿Qué es calidad para nosotros?" en el contexto de UNIMAR.

Las preguntas deben:
1. **Empezar abiertas:** "¿Qué significa...?", "¿Cómo sabríamos...?"
2. **Profundizar gradualmente:** De lo general a lo específico
3. **Conectar con experiencia:** "¿Alguna vez han visto...?", "¿Qué pasó cuando...?"
4. **Llevar a los Quality Gates:** Las últimas 3 preguntas deben conectar naturalmente con los 5 Gates

Estructura sugerida:
- **Preguntas 1-3:** Rompehielo, definiciones personales
- **Preguntas 4-7:** Experiencias concretas, dolores actuales
- **Preguntas 8-10:** Soluciones, estándares, Gates

Incluye también:
- **Posibles respuestas** típicas para cada pregunta
- **Contra-preguntas** si la respuesta es muy vaga (ej: "¿Puedes darme un ejemplo específico?")
- **Transiciones** naturales entre preguntas

Formato de salida:
- Lista numerada de preguntas con notas del facilitador
- Diagrama de flujo opcional: "Si responden X, pregunta Y; si responden Z, pregunta W"

Audiencia: Equipo multidisciplinario de UNIMAR.
Tono: Curioso, no confrontacional, que invita a la reflexión.
```

**Salida esperada:** Guía de facilitación con preguntas y posibles desvíos.

---

## Prompt 3: Explicar Quality Gates

**Propósito:** Generar explicación clara de los 5 Quality Gates con ejemplos.

**Cuándo usar:** Bloque 4 — 25 min

**Prompt:**

```
Actúa como un QA Lead con experiencia explicando controles de calidad a equipos de desarrollo y negocio.

Explica los 5 Quality Gates de UNIMAR de manera que tanto un desarrollador junior como un gerente de procesos puedan entender.

Los 5 Gates son:
1. **Fase 1 — Concepción:** Aprobación de Negocio (PRD validado)
2. **Fase 2 — Diseño:** Baseline de Diseño Aprobado (ADRs firmados)
3. **Fase 3 — Construcción:** Build Exitoso (CI en verde, cobertura ≥80%)
4. **Fase 4 — Validación:** RC Sellado (Test Summary Report aprobado)
5. **Fase 5 — Entrega:** Producción Activa (monitoreo nominal, rollback probado)

Para cada Gate, incluye:
- **Nombre** formal y nombre coloquial (ej: "Gate 3" = "Build Exitoso")
- **¿Qué verifica?** en 1 oración
- **¿Qué evidencia requiere?** lista de 3-5 artefactos
- **¿Qué pasa si falla?** consecuencias claras
- **Ejemplo Q-Track:** cómo se aplicó este Gate en el proyecto Q-Track
- **Analogía cotidiana:** (ej: "es como el control de seguridad en el aeropuerto")

Formato de salida:
- Tabla resumen de los 5 Gates
- 1 sección detallada por Gate
- Infografía Mermaid mostrando el flujo de Gates

Audiencia: Mixta (técnicos y no técnicos).
Tono: Claro, con ejemplos concretos, sin jerga innecesaria.
```

**Salida esperada:** Guía visual de los 5 Gates con ejemplos Q-Track.

---

## Prompt 4: Generar Acta

**Propósito:** Generar borrador del Acta de Kick-off basado en la sesión.

**Cuándo usar:** Bloque 6 — 20 min

**Prompt:**

```
Actúa como un secretario técnico de Architecture Board redactando un Acta de Kick-off formal.

Genera un borrador de Acta de Kick-off para el programa de adopción SDLC de Q-Track de UNIMAR con la siguiente información:

**Contexto de la sesión:**
- Fecha: [FECHA]
- Participantes: [LISTA DE PARTICIPANTES CON ROLES]
- Facilitador: [NOMBRE]
- Proyecto: Q-Track (Gestor de Colas de Camiones)

**Secciones requeridas:**
1. **Propósito del Proyecto:** 2-3 oraciones describiendo qué es Q-Track y por qué existe
2. **KPIs de Éxito:** 
   - Reducir tiempo de espera de 87 min a 50 min
   - ≤ 2 incidentes de turno perdido por semana
   - 0 multas por incumplimiento de ventana
3. **Quality Gates Aceptados:** Lista de los 5 Gates con umbrales numéricos
4. **Alcance del Programa:**
   - Incluido: Módulos 0-6, sesiones teóricas + talleres prácticos
   - Excluido: Personalización de herramientas, coaching individual fuera de sesión
5. **Cronograma de Módulos:** Tabla con Módulos 0-6, duración estimada y fechas tentativas
6. **Riesgos Identificados:** 
   - Riesgo 1: Disponibilidad de participantes (mitigador: bloqueo de calendario)
   - Riesgo 2: Curva de aprendizaje de herramientas (mitigador: Módulo Base extendido)
7. **Declaración de Inicio Formal:** Párrafo declarando que el equipo comprende y acepta los Gates

Formato de salida:
- Documento Markdown con secciones numeradas
- Tablas para KPIs, Gates y Cronograma
- Espacios claros para firmas digitales (nombre, rol, commit hash, fecha)

Tono: Formal pero accesible, listo para revisión y firma del equipo.
Longitud: 2-3 páginas máximo.
```

**Salida esperada:** Borrador de Acta listo para revisión colaborativa.

---

## Prompt 5: Revisar Acta

**Propósito:** Facilitar revisión colaborativa del Acta antes de firmar.

**Cuándo usar:** Bloque 7 — 30 min

**Prompt:**

```
Actúa como un revisor de documentos legales y técnicos con experiencia en contratos de proyecto.

Genera una checklist de revisión para el Acta de Kick-off antes de que el equipo la firme.

La checklist debe incluir:

1. **Verificación de Contenido:**
   - [ ] Propósito del proyecto es claro y medible
   - [ ] KPIs tienen línea base y objetivo numérico
   - [ ] Quality Gates listan umbrales específicos (ej: ≥80%, no "alta cobertura")
   - [ ] Alcance incluye/excluye elementos explícitamente
   - [ ] Cronograma tiene fechas realistas y dependencias claras
   - [ ] Riesgos tienen mitigadores accionables

2. **Verificación de Formato:**
   - [ ] No hay campos vacíos o placeholders sin completar
   - [ ] Tablas son legibles y bien formateadas
   - [ ] Enlaces a documentos de referencia funcionan
   - [ ] Ortografía y gramática correctas

3. **Verificación de Compromisos:**
   - [ ] Todos los participantes están listados con roles correctos
   - [ ] Cada rol comprende lo que firma (tiempo, entregables, Gates)
   - [ ] No hay ambigüedad en responsabilidades

4. **Preguntas de Reflexión:**
   - ¿Hay algún compromiso que el equipo no pueda cumplir?
   - ¿Falta algún riesgo importante no identificado?
   - ¿Alguien tiene reservas sobre los umbrales de los Gates?

Formato de salida:
- Checklist imprimible con checkboxes
- Espacio para comentarios y ajustes por cada ítem
- Sección de "Ajustes Requeridos" para cambios antes de firma

Audiencia: Todos los participantes del Kick-off.
Tono: Profesional, que invita a la honestidad sin confrontación.
```

**Salida esperada:** Checklist de revisión con espacio para ajustes.

---

## Prompt 6: Generar Comandos Git

**Propósito:** Generar comandos Git para firmar y commitear el Acta.

**Cuándo usar:** Bloque 8 — 20 min

**Prompt:**

```
Actúa como un experto en Git y GitHub enseñando a un equipo corporativo.

Genera una guía paso a paso de comandos Git para firmar digitalmente y commitear el Acta de Kick-off.

La guía debe incluir:

1. **Preparación:**
   ```bash
   # Verificar usuario Git configurado
   git config user.name
   git config user.email
   
   # Si no está configurado:
   git config --global user.name "Tu Nombre"
   git config --global user.email "tu.email@unimar.com.pe"
   ```

2. **Crear rama para el Acta:**
   ```bash
   git checkout -b feature/kick-off-q-track
   ```

3. **Agregar el archivo del Acta:**
   ```bash
   git add docs/planning-artifacts/actas/acta-kick-off-q-track.md
   ```

4. **Commitear con mensaje estandarizado:**
   ```bash
   git commit -m "feat: Acta de Kick-off Q-Track v1.0
   
   - Propósito: [1 línea]
   - KPIs: [3 métricas]
   - Gates: 5 Gates aceptados
   - Participantes: [N personas]
   - Firmas: [Lista de nombres]"
   ```

5. **Push y Pull Request:**
   ```bash
   git push origin feature/kick-off-q-track
   # Luego crear PR en GitHub con:
   # - Título: "Acta de Kick-off Q-Track v1.0"
   # - Descripción: Resumen del Acta + lista de firmantes
   # - Reviewers: Todos los participantes
   ```

6. **Firma digital en el PR:**
   - Cada participante comenta: "Apruebo y firmo este Acta" + su nombre
   - El commit hash sirve como firma digital inmutable

Incluye también:
- **Solución de problemas:** 3 errores comunes y cómo resolverlos
- **Verificación:** Comandos para confirmar que el commit está en GitHub
- **Alternativa GitHub Desktop:** Pasos equivalentes para interfaz gráfica

Formato de salida:
- Comandos en bloques de código bash
- Comentarios explicativos entre comandos
- Capturas simuladas de salida esperada

Audiencia: Equipos con experiencia variable en Git.
Tono: Instruccional, paso a paso, con validaciones intermedias.
```

**Salida esperada:** Guía de comandos Git con troubleshooting.

---

## Cómo Usar Esta Prompt Library

1. **Antes de la sesión:** El facilitador prueba los prompts y ajusta según contexto
2. **Durante la sesión:** Los participantes copian prompts en OpenCode/IA
3. **Después de la sesión:** Los prompts quedan disponibles para futuros Kick-offs

### Mejores Prácticas

- ✅ **Personaliza:** Ajusta fechas, nombres y KPIs específicos de tu proyecto
- ✅ **Itera:** Refina prompts según calidad de respuestas de la IA
- ✅ **Guarda:** Versiona los prompts que funcionen mejor
- ✅ **Comparte:** Contribuye mejoras a la biblioteca central

---

*Prompt Library del Módulo 0 · Corpus arquitectónico UNIMAR · Versión: 1.0*
