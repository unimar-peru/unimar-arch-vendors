# Prompt Library — Módulo 6 (Soporte y Retrospectiva)

> **Módulo:** Módulo 6 · **Tipo:** Biblioteca de Prompts para IA  
> **Herramientas:** OpenCode, BMAD Method v6.8.0, Loki, Grafana, Promtail

---

## Propósito

Este documento contiene los prompts exactos para ejecutar cada actividad del Módulo 6 con asistencia de IA.

---

## Agenda con Prompts

| Bloque | Actividad | Duración | Prompt |
| :--- | :--- | :--- | :--- |
| 2 | Observabilidad: Loki + Grafana | 25 min | [Prompt 1: Explicar Stack](#prompt-1-explicar-stack) |
| 3 | Configuración de Promtail | 45 min | [Prompt 2: Configurar Promtail](#prompt-2-configurar-promtail) |
| 4 | Consultas LogQL para troubleshooting | 60 min | [Prompt 3: Generar LogQL](#prompt-3-generar-logql) |
| 6 | Creación de Runbook de Operaciones | 60 min | [Prompt 4: Generar Runbook](#prompt-4-generar-runbook) |
| 8 | Simulacro de Incidente E2E | 60 min | [Prompt 5: Facilitar Simulacro](#prompt-5-facilitar-simulacro) |
| 10 | Retrospectiva del Programa | 60 min | [Prompt 6: Facilitar Retrospectiva](#prompt-6-facilitar-retrospectiva) |
| 12 | Radar de Madurez SDLC | 45 min | [Prompt 7: Generar Radar](#prompt-7-generar-radar) |

---

## Prompt 1: Explicar Stack

**Propósito:** Generar explicación del stack de observabilidad (Loki + Grafana + Promtail).

**Cuándo usar:** Bloque 2 — 25 min

**Prompt:**

```
Actúa como un SRE experto en observabilidad explicando el stack Loki + Grafana + Promtail.

Explica el stack de observabilidad para Q-Track.

Incluye:

1. **Los 3 componentes:**
   - **Loki:** Base de datos de logs (como Prometheus pero para logs)
   - **Grafana:** UI para visualizar logs, métricas y traces
   - **Promtail:** Agente que recoge logs y los envía a Loki

2. **Diagrama Mermaid del flujo:**
   ```
   Aplicación Q-Track → Promtail → Loki → Grafana → Usuario
   ```

3. **¿Por qué Loki?**
   - Ligero: no indexa logs completos, solo labels
   - Económico: almacenamiento más barato que ELK
   - Integrado: funciona nativamente con Grafana y Prometheus

4. **Ejemplo de arquitectura Q-Track:**
   - Q-Track escribe logs en stdout (Docker)
   - Promtail lee stdout de contenedores
   - Promtail envía logs a Loki con labels (`app=q-track`, `env=prod`)
   - Usuario consulta en Grafana con LogQL

5. **Labels recomendados:**
   - `app`: nombre de la aplicación (q-track)
   - `env`: entorno (dev, staging, prod)
   - `level`: nivel de log (info, warn, error)
   - `trace_id`: ID de traza para correlacionar con traces

6. **Errores comunes:**
   - Demasiados labels (Loki crea series temporales por combinación de labels)
   - Logs sin estructura (no se puede filtrar eficientemente)
   - No incluir `trace_id` (imposible correlacionar con traces)

Formato de salida:
- Lista de los 3 componentes
- Diagrama Mermaid del flujo
- Tabla comparativa (Loki vs ELK)
- Ejemplo de arquitectura Q-Track
- Lista de labels recomendados
- Lista de errores comunes

Audiencia: Desarrolladores y operadores aprendiendo observabilidad.
Tono: Didáctico, con ejemplos prácticos.
```

**Salida esperada:** Explicación visual + arquitectura de referencia.

---

## Prompt 2: Configurar Promtail

**Propósito:** Generar configuración de Promtail para Q-Track.

**Cuándo usar:** Bloque 3 — 45 min

**Prompt:**

```
Actúa como un SRE experto en configuración de Promtail.

Genera configuración completa de Promtail para Q-Track.

**Requisitos:**

1. **Instalación:**
   - Docker Compose con Loki + Grafana + Promtail
   - Volúmenes para persistencia de logs

2. **Configuración de Promtail (`promtail.yml`):**
   - `server`: puerto 9080 para health check
   - `clients`: URL de Loki (http://loki:3100/loki/api/v1/push)
   - `scrape_configs`:
     - Job para contenedores Docker (`docker_sd_configs`)
     - Job para logs de archivos (`static_configs`)
     - Labels: `app`, `env`, `job`

3. **Configuración de Loki (`loki.yml`):**
   - Retención de logs: 30 días
   - Schema: v13 (último estable)
   - Compactor habilitado para optimización

4. **Configuración de Grafana:**
   - Datasource Loki pre-configurado
   - Dashboard de ejemplo para Q-Track
   - Alertas básicas (error rate > 5%)

5. **Docker Compose completo:**
   ```yaml
   version: '3.8'
   services:
     loki:
       image: grafana/loki:2.9.0
       ports:
         - "3100:3100"
       volumes:
         - ./loki.yml:/etc/loki/config.yml
     promtail:
       image: grafana/promtail:2.9.0
       volumes:
         - ./promtail.yml:/etc/promtail/config.yml
         - /var/run/docker.sock:/var/run/docker.sock
     grafana:
       image: grafana/grafana:10.0.0
       ports:
         - "3000:3000"
       environment:
         - GF_INSTALL_PLUGINS=grafana-lokiexplore-app
   ```

6. **Verificación:**
   - Comando para verificar que Promtail está scrapeando: `curl http://localhost:9080/ready`
   - Query LogQL de prueba en Grafana: `{app="q-track"} |~ "ERROR"`

Formato de salida:
- Docker Compose completo
- Configuración de Promtail
- Configuración de Loki
- Configuración de datasource Grafana
- Comandos de verificación

Audiencia: Desarrolladores configurando observabilidad.
Tono: Instruccional, paso a paso.
```

**Salida esperada:** Docker Compose completo + configuraciones listas para usar.

---

## Prompt 3: Generar LogQL

**Propósito:** Generar consultas LogQL para troubleshooting de incidentes.

**Cuándo usar:** Bloque 4 — 60 min

**Prompt:**

```
Actúa como un SRE experto en LogQL (Loki Query Language).

Genera 10 consultas LogQL para troubleshooting de incidentes en Q-Track.

**Escenarios cubiertos:**

1. **Ver todos los logs de Q-Track en los últimos 15 minutos:**
   ```logql
   {app="q-track"} [15m]
   ```

2. **Filtrar solo errores:**
   ```logql
   {app="q-track", level="error"} [15m]
   ```

3. **Buscar logs que mencionan "timeout":**
   ```logql
   {app="q-track"} |~ "timeout" [15m]
   ```

4. **Contar errores por minuto:**
   ```logql
   sum(rate({app="q-track", level="error"} [1m]))
   ```

5. **Encontrar el trace_id de un request específico:**
   ```logql
   {app="q-track"} |~ "placa=ABC-123" | trace_id
   ```

6. **Correlacionar logs con el mismo trace_id:**
   ```logql
   {app="q-track", trace_id="abc123xyz"} [15m]
   ```

7. **Top 5 endpoints con más errores:**
   ```logql
   topk(5, sum by (endpoint) (rate({app="q-track", level="error"} [15m])))
   ```

8. **Latencia p95 por endpoint:**
   ```logql
   histogram_quantile(0.95, sum by (le, endpoint) (rate({app="q-track"} | unwrap duration_ms [15m])))
   ```

9. **Errores después de un deploy:**
   ```logql
   {app="q-track", level="error"} |~ "deploy" [1h]
   ```

10. **Logs de un usuario específico:**
    ```logql
    {app="q-track"} |~ "usuario=jorge.salas" [1h]
    ```

**Para cada consulta, incluye:**
- Query LogQL completa
- Explicación de qué hace
- Cuándo usarla (escenario de incidente)
- Ejemplo de resultado esperado

Formato de salida:
- Lista de 10 consultas con explicación
- Tabla resumen (consulta | propósito | cuándo usar)
- Tips de optimización (evitar regex costosos, usar labels)

Audiencia: Desarrolladores y operadores haciendo troubleshooting.
Tono: Práctico, con ejemplos de queries copy-paste.
```

**Salida esperada:** 10 consultas LogQL listas para usar en incidentes.

---

## Prompt 4: Generar Runbook

**Propósito:** Generar Runbook de Operaciones para Q-Track.

**Cuándo usar:** Bloque 6 — 60 min

**Prompt:**

```
Actúa como un SRE experto en runbooks de operaciones.

Genera un Runbook de Operaciones para Q-Track con 5 escenarios de incidente.

**Estructura del Runbook:**

# Runbook de Operaciones — Q-Track

**Versión:** 1.0   **Fecha:** [FECHA]   **Autor(es):** [NOMBRES]
**Sistema:** Q-Track   **Entorno:** Producción

## 1. Información del Sistema

| Campo | Valor |
| :--- | :--- |
| **Nombre del Sistema** | Q-Track |
| **Versión en Producción** | v1.0.0 |
| **Responsable Técnico** | [Nombre, email, teléfono] |
| **Responsable de Negocio** | [Nombre, email, teléfono] |
| **Horario de Soporte** | Lunes-Viernes 6am-8pm |
| **SLA de Respuesta** | 30 minutos para incidentes críticos |

## 2. Escenarios de Incidente

### Escenario 1: API no responde (HTTP 500 o timeout)

**Síntoma:**
[¿Qué ve el usuario o el operador?]

**Impacto:**
[¿Qué funcionalidad está afectada? ¿Cuántos usuarios impacta?]

**Severidad:** 🔴 Alta / 🟡 Media / 🟢 Baja

**Diagnóstico:**

```bash
# Paso 1: [Comando o consulta para diagnosticar]
# Paso 2: [Comando o consulta adicional]
# Paso 3: [Consulta en Loki para logs específicos]
```

**Diagnóstico Positivo Si:**
[¿Qué condición confirma que este es el incidente?]

**Resolución:**

```bash
# Paso 1: [Acción correctiva]
# Paso 2: [Verificación de recuperación]
# Paso 3: [Validación con usuario]
```

**Escalamiento:**

| Condición | Escalar a | Contacto |
| :--- | :--- | :--- |
| [Si no se resuelve en X minutos] | [Rol/Persona] | [email/teléfono] |

[Repetir estructura para Escenario 2-5]

## 3. Contactos de Emergencia

| Rol | Nombre | Email | Teléfono | Disponible |
| :--- | :--- | :--- | :--- | :--- |
| **On-Call Técnico** | [Nombre] | [email] | [teléfono] | 24/7 |
| **Product Owner** | [Nombre] | [email] | [teléfono] | Horario laboral |
| **Tech Lead** | [Nombre] | [email] | [teléfono] | Horario laboral |
| **Infraestructura** | [Nombre] | [email] | [teléfono] | 24/7 |

## 4. Procedimiento de Escalamiento

1. **Detección:** El operador o sistema de monitoreo detecta el incidente
2. **Clasificación:** Determinar severidad (Alta/Media/Baja) según impacto
3. **Diagnóstico:** Seguir los pasos del escenario correspondiente en este runbook
4. **Resolución:** Ejecutar acciones correctivas
5. **Validación:** Confirmar con usuarios que el sistema funciona
6. **Documentación:** Registrar incidente en [sistema de tickets] con causa raíz
7. **Post-Mortem:** Si es severidad Alta, agendar post-mortem en 48 horas

**Escenarios a incluir:**
1. API no responde (HTTP 500 o timeout)
2. Base de datos no responde (timeout en consultas)
3. Sistema XMS (Message Broker) no recibe eventos
4. Frontend no carga (pantalla en blanco)
5. Lentitud extrema en consultas de turno

Formato: Markdown con secciones claras, tablas y bloques de código.
Tono: Instruccional, sin ambigüedad, listo para usar en incidente real.
Longitud: 5-10 páginas (dependiendo de complejidad de escenarios).
```

**Salida esperada:** Runbook completo con 5 escenarios detallados.

---

## Prompt 5: Facilitar Simulacro

**Propósito:** Generar guía para facilitar simulacro de incidente E2E.

**Cuándo usar:** Bloque 8 — 60 min

**Prompt:**

```
Actúa como un SRE experto en simulacros de incidentes.

Genera una guía para facilitar un simulacro de incidente E2E para Q-Track.

**Estructura de la guía:**

# Guía de Simulacro de Incidente E2E — Q-Track

## 1. Información del Simulacro

| Campo | Valor |
| :--- | :--- |
| **Escenario Simulado** | [ej: API no responde] |
| **Fecha y Hora** | [FECHA HORA] |
| **Duración Estimada** | 60 minutos |
| **Auditor** | [Nombre del facilitador] |
| **Equipo en Simulacro** | [Lista de participantes] |

## 2. Objetivo del Simulacro

[Describir qué se está validando: capacidad de detección, diagnóstico, resolución, escalamiento, uso del runbook]

## 3. Inyección de Incidente

**Descripción:** [Describir el incidente que se inyectará, ej: "A las 10:00, el auditor ejecutará `docker stop q-track` en entorno de staging"]

**Señales esperadas:**
- Health check falla con HTTP 500 o timeout
- Alertas de Prometheus/Grafana se disparan
- Operadores reportan "sistema no carga"

## 4. Cronología Esperada

| Tiempo | Evento Esperado |
| :--- | :--- |
| **T+0 min** | Incidente inyectado |
| **T+3 min** | Operador reporta incidente |
| **T+5 min** | Equipo recibe alerta y abre runbook |
| **T+10 min** | Equipo ejecuta pasos de diagnóstico |
| **T+15 min** | Equipo identifica causa raíz |
| **T+20 min** | Equipo ejecuta resolución |
| **T+25 min** | Sistema se recupera, health check OK |
| **T+30 min** | Equipo valida con operador |
| **T+35 min** | Auditor declara simulacro completado |

## 5. Criterios de Evaluación

| Criterio | Umbral | Resultado | Estado |
| :--- | :--- | :--- | :--- |
| **Tiempo de Detección** | ≤ 5 min | [X] min | ☐ Pass ☐ Fail |
| **Tiempo de Diagnóstico** | ≤ 15 min | [X] min | ☐ Pass ☐ Fail |
| **Tiempo de Resolución** | ≤ 20 min | [X] min | ☐ Pass ☐ Fail |
| **Uso Correcto del Runbook** | 100% pasos seguidos | [X]% | ☐ Pass ☐ Fail |
| **Comunicación Efectiva** | Stakeholders notificados | ☐ Sí ☐ No | ☐ Pass ☐ Fail |
| **Validación con Usuario** | Operador confirma recuperación | ☐ Sí ☐ No | ☐ Pass ☐ Fail |

## 6. Observaciones del Auditor

### Fortalezas Observadas

- ✅ [Observación positiva 1]
- ✅ [Observación positiva 2]

### Oportunidades de Mejora

- 🔧 [Área de mejora 1]
- 🔧 [Área de mejora 2]

### Desviaciones del Runbook

| Paso del Runbook | Fue seguido | Si no, ¿por qué? |
| :--- | :--- | :--- |
| [Paso 1] | ☐ Sí ☐ No | [Razón si no fue seguido] |

## 7. Resultado del Simulacro

- ☐ **APROBADO** — El equipo resolvió el incidente dentro de los umbrales aceptables
- ☐ **APROBADO CON OBSERVACIONES** — El equipo resolvió el incidente pero hay áreas de mejora
- ☐ **REPROBADO** — El equipo no resolvió el incidente dentro de los umbrales, requiere re-entrenamiento

**Puntuación Total:** [X]/[Y] puntos ([Z]%)

**Tiempo Total de Resolución:** [X] minutos (Umbral: ≤ [Y] minutos)

## 8. Acciones de Mejora

| Acción | Responsable | Fecha límite | Cómo se medirá el éxito |
| :--- | :--- | :--- | :--- |
| [Acción 1] | [Nombre] | [Fecha] | [Métrica] |

Formato: Markdown con tablas completas.
Tono: Profesional, objetivo, enfocado en aprendizaje.
```

**Salida esperada:** Guía completa de simulacro lista para usar.

---

## Prompt 6: Facilitar Retrospectiva

**Propósito:** Generar guía para facilitar retrospectiva del programa.

**Cuándo usar:** Bloque 10 — 60 min

**Prompt:**

```
Actúa como un Agile Coach experto en retrospectivas de programas.

Genera una guía para facilitar una retrospectiva del programa de adopción SDLC de UNIMAR.

**Estructura de la guía:**

# Guía de Retrospectiva — Programa de Adopción SDLC UNIMAR

## 1. Información de la Retrospectiva

| Campo | Valor |
| :--- | :--- |
| **Programa** | Adopción SDLC + Arquitectura |
| **Duración** | [Fecha inicio] a [Fecha cierre] ([X] semanas) |
| **Proyecto** | Q-Track (Gestor de Colas de Camiones) |
| **Facilitador** | [Nombre] |
| **Participantes** | [Lista de participantes o equipo] |

## 2. Agenda de la Sesión (90 minutos)

| Tiempo | Actividad | Descripción |
| :--- | :--- | :--- |
| 0-10 min | **Apertura** | Propósito de la retrospectiva, reglas de participación |
| 10-30 min | **¿Qué salió bien?** | Lluvia de ideas individual, consolidación en grupo |
| 30-50 min | **¿Qué no salió bien?** | Lluvia de ideas individual, consolidación en grupo |
| 50-70 min | **¿Qué haremos diferente?** | Compromisos accionables con responsable y fecha |
| 70-85 min | **Lecciones aprendidas** | 3 lecciones clave con contexto, aprendizaje y aplicación |
| 85-90 min | **Cierre** | Agradecimientos, firma de compromisos |

## 3. Dinámicas por Actividad

### ¿Qué salió bien? (Keep)

**Instrucciones:**
- Cada participante escribe en post-its (físicos o Miro) lo que salió bien
- 1 idea por post-it
- 5 minutos en silencio
- Consolidar ideas similares en grupos
- Votación para top 3-5 fortalezas

**Preguntas guía:**
- ¿Qué prácticas queremos mantener en futuros proyectos?
- ¿Qué nos hizo más eficientes?
- ¿Qué nos sorprendió positivamente?

### ¿Qué no salió bien? (Problem)

**Instrucciones:**
- Cada participante escribe lo que no salió bien
- Enfocarse en procesos, no en personas
- 5 minutos en silencio
- Consolidar ideas similares
- Votación para top 3-5 problemas

**Preguntas guía:**
- ¿Qué nos frenó o generó fricción?
- ¿Qué prometimos y no cumplimos?
- ¿Qué queremos dejar de hacer?

### ¿Qué haremos diferente? (Try)

**Instrucciones:**
- Para cada problema del top 3, generar 1-2 acciones concretas
- Cada acción debe tener: responsable, fecha límite, métrica de éxito
- Compromisos realistas y accionables

**Formato de acción:**
| Acción | Responsable | Fecha límite | Cómo se medirá el éxito |
| :--- | :--- | :--- | :--- |
| [Acción] | [Nombre] | [Fecha] | [Métrica] |

## 4. Lecciones Aprendidas

Para cada lección (mínimo 3):

### Lección N: [Título]

**Contexto:** [Describir la situación que generó el aprendizaje]

**Aprendizaje:** [¿Qué aprendimos? ¿Qué insight tuvimos?]

**Aplicación Futura:** [¿Cómo aplicaremos esto en el futuro?]

## 5. Métricas del Programa

| Métrica | Objetivo | Resultado | Estado |
| :--- | :--- | :--- | :--- |
| **Módulos Completados** | [X] módulos | [X] módulos | ☐ Cumplido ☐ No cumplido |
| **Quality Gates Aprobados** | [X]/[X] gates | [X]/[X] gates | ☐ Cumplido ☐ No cumplido |
| **Cobertura de Tests** | ≥ 80% | [X]% | ☐ Cumplido ☐ No cumplido |
| **Incidentes en Producción** | ≤ [X] | [X] | ☐ Cumplido ☐ No cumplido |
| **Satisfacción del Equipo** | ≥ [X]/5 | [X]/5 | ☐ Cumplido ☐ No cumplido |

## 6. Agradecimientos

[Reconocer contribuciones destacadas de participantes, facilitadores o stakeholders]

- 🙏 [Nombre] por [contribución específica]
- 🙏 [Nombre] por [contribución específica]

## 7. Firma de Cierre

**Facilitador:** ___________   **Fecha:** ___________

**Representante del Equipo:** ___________   **Fecha:** ___________

Formato: Markdown con tablas completas.
Tono: Reflexivo, constructivo, enfocado en aprendizaje.
```

**Salida esperada:** Guía completa de retrospectiva lista para facilitar.

---

## Prompt 7: Generar Radar

**Propósito:** Generar Radar de Madurez SDLC del equipo.

**Cuándo usar:** Bloque 12 — 45 min

**Prompt:**

```
Actúa como un Architecture Board evaluando la madurez SDLC de un equipo.

Genera un Radar de Madurez SDLC para el equipo de Q-Track.

**Ejes del Radar (8 ejes):**

1. **Requisitos y Producto:** Calidad del PRD, backlog BDD, trazabilidad
2. **Diseño y Arquitectura:** ADRs documentados, C4 diagrams, hexagonal
3. **Desarrollo:** Code quality, tests unitarios, cobertura
4. **Calidad e Integración:** Tests integración, E2E, pipeline CI
5. **Infraestructura:** Docker, CI/CD, observabilidad
6. **Operaciones:** Runbooks, simulacros, tiempo de resolución
7. **Gobernanza:** Gates cumplidos, waivers, documentación
8. **Cultura:** Colaboración, aprendizaje continuo, blameless

**Escala de madurez (1-5):**

1. **Inicial:** Ad-hoc, sin estándares, depende de héroes
2. **Repeatable:** Algunos procesos, pero inconsistente
3. **Defined:** Estándares documentados, el equipo los sigue
4. **Managed:** Métricas objetivas, mejora continua
5. **Optimizing:** Automatizado, el equipo enseña a otros

**Estructura del Radar:**

# Radar de Madurez SDLC — Equipo Q-Track

**Fecha:** [FECHA]   **Evaluadores:** [NOMBRES]

## 1. Diagrama del Radar

[Diagrama Mermaid o tabla con los 8 ejes y puntuación]

## 2. Puntuación por Eje

| Eje | Puntuación | Evidencia | Brecha vs. Objetivo |
| :--- | :--- | :--- | :--- |
| **Requisitos y Producto** | [1-5] | [PRD aprobado, backlog BDD] | [Objetivo - Actual] |
| **Diseño y Arquitectura** | [1-5] | [ADRs, C4, hexagonal] | |
| **Desarrollo** | [1-5] | [Cobertura 87%, CI en verde] | |
| **Calidad e Integración** | [1-5] | [Tests integración, E2E] | |
| **Infraestructura** | [1-5] | [Docker, CI/CD, OTel] | |
| **Operaciones** | [1-5] | [Runbook, simulacro aprobado] | |
| **Gobernanza** | [1-5] | [Gates cumplidos, 0 waivers] | |
| **Cultura** | [1-5] | [Retrospectiva, acciones cerradas] | |

## 3. Plan de Mejora

Para ejes con brecha > 2:

| Eje | Brecha | Acción de Mejora | Responsable | Fecha |
| :--- | :--- | :--- | :--- | :--- |
| [Eje] | [X] | [Acción concreta] | [Nombre] | [Fecha] |

## 4. Fortalezas del Equipo

- ✅ [Fortaleza 1 con evidencia]
- ✅ [Fortaleza 2 con evidencia]
- ✅ [Fortaleza 3 con evidencia]

## 5. Oportunidades de Mejora

- 🔧 [Oportunidad 1 con plan]
- 🔧 [Oportunidad 2 con plan]
- 🔧 [Oportunidad 3 con plan]

Formato: Markdown con tablas y diagrama Mermaid si es posible.
Tono: Objetivo, basado en evidencia, enfocado en mejora.
```

**Salida esperada:** Radar completo con plan de mejora para ejes con brecha.

---

## Cómo Usar Esta Prompt Library

1. **Antes de la sesión:** El facilitador configura stack de observabilidad (Loki + Grafana)
2. **Durante la sesión:** Los participantes generan runbook, hacen simulacro y retrospectiva
3. **Después de la sesión:** Los prompts quedan disponibles para futuros incidentes y retrospectivas

### Mejores Prácticas

- ✅ **Runbook:** 5 escenarios mínimos, probados en staging
- ✅ **Simulacro:** Inyectar incidente realista, cronometrar tiempos
- ✅ **Retrospectiva:** Acciones con responsable y fecha, no solo intenciones
- ✅ **Radar:** Re-evaluar cada 3 meses para medir mejora

---

*Prompt Library del Módulo 6 · Corpus arquitectónico UNIMAR · Versión: 1.0*
