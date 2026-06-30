# Análisis Crítico del TO-BE Tecnológico Baufest 2025 (Depósito Temporal)

> **Estado:** Análisis local de input externo
> **Tipo:** Revisión técnica y estratégica
> **Fuente externa analizada:** Baufest, "TO-BE Tecnológico — UNIMAR", Product Discovery Depósito Temporal, diciembre 2025, 23 páginas.
> **Idioma:** Español (exclusivo)
> **Audiencia:** Architecture Board Unimar, Product Owner DT, Tech Lead DT, Oficina de Seguridad, Compliance, Patrocinador Ejecutivo.
>
> **Aviso de autonomía documental.** Este análisis es autosuficiente. No requiere consultar el PDF original para ser comprendido; los hechos del documento externo relevantes para la crítica se describen funcionalmente, no se reproducen ni se transcriben.

---

## 1. Propósito y Alcance

### 1.1 Propósito

El presente documento registra el **análisis crítico** de un _Product Discovery_ contratado por Unimar a la consultora Baufest en diciembre de 2025, enfocado exclusivamente en el **Depósito Temporal (DT)** aduanero. La entrega externa (un informe de 23 páginas) propuso un estado objetivo (TO-BE) tecnológico integral, un roadmap de cinco fases con horizonte de veinticuatro meses, indicadores clave de desempeño y un mapa de cumplimiento normativo.

Este análisis no es un resumen del entregable ni una aprobación. Su propósito es:

1. **Auditar la coherencia** de las recomendaciones externas frente a los marcos arquitectónicos y de gobernanza adoptados por Unimar Arch (taxonomía, ADRs, blueprints, estándares de ingeniería).
2. **Identificar tensiones estructurales** entre las recomendaciones de la consultora y los principios de portabilidad, gradualismo y modularidad que Unimar Arch considera preferibles para un operador aduanero peruano de misión crítica.
3. **Producir un plan de remediación priorizado** que permita a Unimar Arch emitir una respuesta formal al entregable Baufest, ya sea aprobación condicional, adopción selectiva o rechazo parcial.
4. **Generar insumos para ADRs locales** que registren formalmente las decisiones arquitectónicas que Unimar tome al respecto.

### 1.2 Alcance

**Incluye:**

* Revisión crítica del TO-BE propuesto (cloud, runtime, datos, observabilidad, seguridad, continuidad, cumplimiento, ESG).
* Comparación con los marcos vigentes en `reference/architecture/`, `reference/governance/` y `reference/knowledge/`.
* Identificación de brechas, redundancias, riesgos y oportunidades.
* Propuesta de remediación con prioridad alta, media y baja.
* Plan de implementación por fases, con responsables, artefactos y _quality gates_.

**No incluye:**

* La operación logística del DT (tránsitos, levantes, aforo, etc.).
* Negociación contractual con Baufest o con Azure.
* Decisiones financieras (CAPEX/OPEX, ROI).
* Análisis de la situación AS-IS más allá de lo necesario para evaluar el TO-BE.
* Reproducción o cita verbatim del PDF externo (por autonomía documental).

### 1.3 Contexto institucional mínimo

Para evitar dependencia del PDF, se resumen aquí los hechos contextuales que Unimar Arch asume como conocidos y que el entregable externo también trata:

* **Unimar S.A.** opera dos depósitos temporales: uno en **Callao** (aprox. 90 000 m²) y otro en **Paita** (aprox. 10 000 m²), con cerca de 2 000 posiciones operativas. La empresa es operador desde 1978.
* Las certificaciones vigentes declaradas son **BASC** y **BPA**; los marcos regulatorios aplicables incluyen **SUNAT** (operador aduanero), **ISO 27001** (seguridad de la información) e **ISO 22301** (continuidad de negocio) como objetivos.
* La plataforma actual (AS-IS) combina aplicaciones legadas en **.NET Framework** con control de versiones en **Team Foundation Server (TFS)**, integración con **SAP** y un servicio moderno en **Node.js/NestJS** conectado por **Kafka**.
* El DT es **misión crítica regulada** por SUNAT; una indisponibilidad superior a ventanas de tolerancia impacta directamente la cadena de importación/exportación.

---

## 2. Contenido Expuesto por la Consultora

Esta sección describe funcionalmente los elementos del entregable Baufest que son relevantes para el análisis crítico. No es una transcripción: cada punto se ha destilado para enfocarse en su impacto arquitectónico o de gobernanza.

### 2.1 Diagnóstico AS-IS (resumido por la consultora)

La consultora identificó la coexistencia de tres capas tecnológicas con deudas técnicas heterogéneas:

* Capa transaccional aduanera en **.NET Framework** sobre infraestructura on-premise, con despliegue manual y un repositorio de código en **TFS** sin estrategia de branching explícita.
* Capa de integración con **SAP** mediante conectores propietarios y mapeos de campos no documentados en forma de contrato.
* Capa de servicios en **Node.js/NestJS** con bus de eventos **Kafka**, que soporta los flujos modernos de trazabilidad y notificaciones.

El diagnóstico señala fricciones operativas entre las tres capas, duplicación de datos maestros, ausencia de observabilidad unificada y riesgo de continuidad por dependencia de TFS.

### 2.2 Estado Objetivo (TO-BE) propuesto

La propuesta central es una **plataforma nativa en Microsoft Azure**, organizada en seis bloques:

1. **Compute y orquestación:** combinación de **Azure Functions** (eventos), **Azure Container Apps** (servicios HTTP) y **Azure Kubernetes Service (AKS)** (cargas con estado y procesamiento pesado).
2. **Datos:** **Azure Data Lake Storage** como lago crudo, **Azure Synapse Analytics** como motor analítico, **Azure Cosmos DB** para estado distribuido y **Azure SQL** para el modelo relacional core aduanero.
3. **Mensajería y eventos:** reutilización de **Apache Kafka** migrado a **Confluent Cloud sobre Azure** o **Event Hubs** (con reemplazo de la librería cliente).
4. **Internet de las Cosas y analítica avanzada:** **Azure IoT Hub** para sensores (temperatura de reefers, puertas, balanzas), **Azure Machine Learning** para modelos predictivos, **Azure Digital Twins** para el gemelo digital de la bodega.
5. **Seguridad y cumplimiento:** **Microsoft Sentinel** como SIEM, **Microsoft Defender for Cloud** para protección de cargas, **Key Vault** para secretos, **Entra ID** como IdP, **Microsoft Purview** para catálogo y gobierno de datos.
6. **Observabilidad:** **Azure Monitor**, **Application Insights** y **Log Analytics** como trío principal.

### 2.3 Roadmap propuesto (cinco fases, 0–24 meses)

* **Fase 0 — Assessment y migración de TFS a Azure DevOps (ADO).** Duración: 0–2 meses. Entregables: inventario de aplicaciones, mapeo de capacidades, configuración de ADO.
* **Fase 1 — Rehost y replatformación a .NET 8.** Migración de la capa transaccional desde .NET Framework a .NET 8 sobre Azure, sin cambio de arquitectura interna en esta fase.
* **Fase 2 — Lago de datos y APIs.** Implementación de Azure Data Lake, Synapse y un primer set de APIs REST para integración con SAP y servicios NestJS.
* **Fase 3 — IoT, Machine Learning y Digital Twins.** Conexión de sensores, despliegue de modelos para predicción de abandono y dwell time, gemelo digital del depósito.
* **Fase 4 — Multi-región, ESG y consolidación.** Replicación multi-región en Azure (con sugerencia de pareo de regiones fuera del Perú), tableros ESG y cierre del programa.

### 2.4 Indicadores clave de desempeño propuestos

* Reducción de _dwell time_ entre 15 % y 25 %.
* Cobertura de alertas de abandono ≥ 95 % dentro de 48 horas.
* Reducción de _cost-to-serve_ entre 8 % y 12 %.
* Reducción de consumo energético de reefers entre 10 % y 15 %.
* Cumplimiento de levante a tiempo ≥ 92 %.

### 2.5 Cumplimiento y marcos regulatorios

El entregable mapea controles contra **ISO 27001** e **ISO 22301**, menciona explícitamente los compromisos **BASC** y **BPA**, y referencia el marco regulatorio de **SUNAT** para operadores de depósito temporal. Indica que la elección de Azure responde también a la cobertura regional y certificaciones heredadas del proveedor (_inherited controls_).

### 2.6 Aspectos no cubiertos por la consultora

Para evitar inferencias erróneas, se enumeran los temas que la consultora **no abordó** y que son materiales para la decisión:

* Comparación con proveedores de nube alternativos (AWS, GCP, Oracle Cloud) o con estrategias on-premise.
* Análisis de costo total de propiedad (TCO) a 3–5 años.
* Estrategia de salida (exit plan) si Azure deja de ser viable.
* Alineación con **UNILOG** (sociedad relacionada de Unimar con políticas de datos separadas).
* Estrategia de pruebas de carga, caos y contract testing.
* Política de datos personales y cumplimiento de la Ley N.° 29733 (Perú).
* Modelo de gobierno de APIs.
* Capacidades internas de SRE y operación 24x7 (se presume subcontratación con Microsoft Premier Support).

---

## 3. Fortalezas

Las siguientes son las contribuciones positivas del entregable que Unimar Arch reconoce como adoptables sin discusión:

1. **Diagnóstico AS-IS veraz.** La descripción de las tres capas (legada, SAP, NestJS/Kafka) y sus fricciones coincide con la comprensión interna. Esto dota al documento de credibilidad factual.
2. **Roadmap por fases, no big-bang.** La división en cinco fases con entregables discretos reduce el riesgo de ejecución y permite _gating_ entre etapas.
3. **Reconocimiento explícito de TFS como riesgo.** La Fase 0 (migración a ADO) es una medida razonable e independiente del proveedor cloud.
4. **Inclusión de ESG.** La Fase 4 integra objetivos ambientales, sociales y de gobernanza (energía de reefers, huella de carbono) que Unimar puede apalancar para diferenciación reputacional.
5. **Cobertura de seguridad por diseño.** La inclusión de Sentinel, Defender for Cloud, Key Vault y Entra ID cubre los controles comunes de un marco de seguridad empresarial.
6. **Mapeo inicial contra ISO 27001 e ISO 22301.** El ejercicio de mapeo es un insumo válido, aunque la profundidad del análisis de brechas no se evalúa en este documento.
7. **KPIs cuantificables y ambiciosos.** Los indicadores propuestos son concretos y ofrecen una línea base para medición.
8. **Reconocimiento del gemelo digital como herramienta operativa.** La propuesta de Digital Twins es coherente con la necesidad de visibilidad de la bodega.

---

## 4. Debilidades y Brechas

Se identifican las siguientes debilidades, organizadas por dimensión.

### 4.1 Arquitectura y estrategia de plataforma

* **Vendor lock-in total hacia Microsoft Azure.** La propuesta no contempla ningún componente portable, ningún plan de salida, ni siquiera una justificación de costo comparativo. Cualquier reversión implicaría un proyecto plurianual con costo de reescritura no estimado.
* **Adopción prematura de microservicios y serverless.** Azure Functions y Container Apps como _default_ contradice el principio de **monolito modular progresivo** promovido en `reference/architecture/` de Unimar Arch. Para un DT con tres dominios funcionales (aduana, operaciones, analítica), la justificación de granularidad fina no aparece.
* **Ausencia de arquitectura de referencia delgada.** El TO-BE lista productos pero no define el _runtime reference architecture_ (cómo se enlazan, cómo se comunican, qué patrones se aplican). No hay ADRs que motiven las elecciones.
* **Migración a .NET 8 tratada como "replatform" sin refactor.** Rehostar .NET Framework a .NET 8 preservando el diseño interno arrastra la deuda técnica. No se propone modularización interna, separación de bounded contexts ni event sourcing.
* **Complejidad de la cadena de datos.** Cinco productos de datos distintos (Data Lake, Synapse, Cosmos, SQL Azure, Event Hubs) sin modelo canónico compartido introduce redundancia y aumenta la superficie de gobierno de datos.

### 4.2 Observabilidad y operación

* **Observabilidad monolítica del proveedor.** Azure Monitor + Application Insights + Log Analytics son adecuadas como _producto_, pero su adopción como única fuente de observabilidad impide la portabilidad y limita la elección futura de proveedores. El stack **LGTM** (Loki, Grafana, Tempo, Mimir) con **OpenTelemetry** mencionado en el `playbook-observabilidad.es.md` de Unimar Arch queda descartado.
* **Ausencia de SRE y métricas SLO/SLI.** No se definen objetivos de nivel de servicio, presupuestos de error ni prácticas de _chaos engineering_.
* **Cobertura parcial de logs no estructurados.** La consultora no aborda la captura de logs de la capa SAP ni la normalización con los logs de .NET 8 y NestJS.

### 4.3 Seguridad y cumplimiento

* **Dependencia de _inherited controls_ sin auditoría propia.** La afirmación de que Azure cumple ISO 27001 e ISO 22301 es válida a nivel de certificación del proveedor, pero Unimar sigue siendo responsable de los controles que opera sobre Azure. La consultora no entrega un _gap analysis_ propio.
* **Cumplimiento de la Ley N.° 29733 (Perú) no mencionado.** El tratamiento de datos personales en el DT (consignatarios, representantes) requiere medidas específicas que el informe no aborda.
* **Plan de recuperación ante desastre (DRP) parcial.** Multi-región Azure cubre disponibilidad de la nube, pero no escenarios de indisponibilidad local prolongados (corte de fibra, desastres naturales en Callao/Paita) ni pruebas de DR documentadas.
* **Seguridad física del DT no abordada.** Sensores IoT, controles de acceso, CCTV y su integración con Sentinel no se detallan.
* **Ausencia de threat model explícito.** No se documenta un modelo STRIDE ni un análisis de riesgos cuantitativo.

### 4.4 Estrategia de datos y gobierno

* **Sin modelo de datos canónico.** Cinco productos de datos sin un diagrama entidad-relación de referencia ni un _data contract framework_ introducen riesgo de inconsistencia.
* **Sin política de retención ni residencia.** Para datos aduaneros, la retención mínima y la residencia de datos tienen implicaciones regulatorias y fiscales que el informe no trata.
* **Catálogo de datos propuesto (Purview) es razonable, pero no se acompaña de stewards ni de un diccionario de datos activo.**

### 4.5 Estrategia de continuidad y DR

* **Multi-región cloud como única estrategia de DR.** La propuesta asume que la redundancia geográfica Azure es suficiente. Para un operador aduanero peruano, debe considerarse explícitamente un sitio alterno fuera de la nube (on-premise o co-location) como contingencia de tercer nivel.
* **RTO/RPO no cuantificados.** La consultora no entrega objetivos de tiempo y punto de recuperación concretos por servicio crítico.

### 4.6 Estrategia organizacional y de talento

* **Brecha de capacidades internas no abordada.** La operación 24x7, FinOps, SRE y seguridad cloud son disciplinas que Unimar deberá cultivar o subcontratar. El informe no entrega un plan de _upskilling_ ni un _managed services_ detallado.
* **Relación con UNILOG no mencionada.** Unimar y UNILOG comparten operación logística; el TO-BE no alinea con la estrategia de datos ni con la arquitectura de UNILOG, lo que puede generar re-trabajo futuro.

### 4.7 Estrategia financiera

* **TCO a 3–5 años ausente.** Sin un análisis comparativo (Azure, AWS, GCP, on-premise, híbrido) y un TCO proyectado, la decisión es financieramente ciega.
* **Modelo de licenciamiento SAP no tratado.** SAP sobre Azure puede requerir _raise_ de licencia; no se evalúa.

### 4.8 Estrategia de salida

* **Exit plan inexistente.** Si en 5–7 años Unimar decide migrar a otro proveedor, la portabilidad del diseño debe estar garantizada. El TO-BE no la facilita.

### 4.9 Documentación y artefactos

* **Inconsistencias menores en el PDF fuente** (typos en numeraciones de página, "Técnido" en el nombre de archivo) que sugieren control de calidad editorial insuficiente. Esto no es técnico, pero es señal de proceso.
* **Falta de glosario de términos aduaneros y de la nomenclatura Baufest vs. nomenclatura interna de Unimar.**

---

## 5. Aspectos que Deben Atacarse

A partir de las debilidades, se priorizan los aspectos que requieren acción explícita. La numeración se mantiene en este documento para facilitar la trazabilidad con la §6 y la §7.

| ID  | Aspecto                                                           | Severidad | Dimensión                |
| :-- | :---------------------------------------------------------------- | :-------- | :----------------------- |
| A1  | Lock-in total hacia Azure sin estrategia de salida                | Crítica   | Arquitectura             |
| A2  | Adopción prematura de microservicios y serverless como default    | Crítica   | Arquitectura             |
| A3  | Migración a .NET 8 sin refactor ni modularización                 | Alta      | Arquitectura             |
| A4  | Complejidad innecesaria de la cadena de datos                     | Alta      | Datos                    |
| A5  | Observabilidad monopolizada por Azure Monitor                     | Alta      | Operación                |
| A6  | Ausencia de SRE, SLO/SLI y chaos engineering                      | Alta      | Operación                |
| A7  | Falta de TCO comparativo a 3–5 años                               | Alta      | Finanzas                 |
| A8  | Ausencia de threat model y gap analysis propio de ISO 27001/22301 | Alta      | Seguridad                |
| A9  | Cumplimiento de la Ley N.° 29733 no tratado                       | Alta      | Cumplimiento             |
| A10 | DR multi-región cloud como única contingencia                     | Media     | Continuidad              |
| A11 | RTO/RPO no cuantificados                                          | Media     | Continuidad              |
| A12 | Ausencia de plan de upskilling / managed services                 | Media     | Organización             |
| A13 | Desalineación con UNILOG                                          | Media     | Organización             |
| A14 | Sin modelo de datos canónico ni data contracts                    | Media     | Datos                    |
| A15 | Sin exit plan portable                                            | Media     | Arquitectura             |
| A16 | Estrategia de seguridad física del DT no abordada                 | Media     | Seguridad                |
| A17 | Sin estrategia de pruebas (carga, contract, caos)                 | Media     | Calidad                  |
| A18 | Sin diccionario de datos ni stewards                              | Baja      | Gobierno de datos        |
| A19 | Sin glosario de términos compartido Baufest–Unimar                | Baja      | Comunicación             |
| A20 | Inconsistencias editoriales menores en el PDF fuente              | Baja      | Calidad de documentación |

---

## 6. Propuesta de Resolución

Cada aspecto crítico y de alta severidad recibe una propuesta concreta. Las prioridades son:

* **Alta (A):** debe resolverse antes de iniciar la Fase 1 del roadmap.
* **Media (M):** debe resolverse antes de iniciar la Fase 2.
* **Baja (B):** debe resolverse durante la Fase 4 o como parte del plan de calidad.

### 6.1 A1 — Lock-in total hacia Azure (Prioridad: A)

* **Decisión:** aceptar Azure como nube primaria, pero **imponer un patrón de abstracción de runtime** inspirado en el principio de portabilidad de Unimar Arch.
* **Acciones concretas:**
  * Adoptar **Open Application Model (OAM)** o al menos **Dockerfiles y manifiestos Kubernetes agnósticos** en todos los servicios contenedores.
  * Mantener los datos transaccionales en **PostgreSQL sobre Azure Database** (motor portable) en lugar de SQL Azure propietario siempre que sea factible.
  * Sustituir **Cosmos DB** por **PostgreSQL + Citus** o por una opción equivalente portable, salvo justificación de negocio explícita.
  * Mantener **Apache Kafka** autoadministrado (no Confluent Cloud) para preservar la opción de cambio futuro.
  * Exigir un **exit plan documentado** (estimación de esfuerzo de portabilidad a AWS/GCP/on-premise) como entregable de la Fase 0.

### 6.2 A2 — Microservicios y serverless prematuros (Prioridad: A)

* **Decisión:** invertir la propuesta por defecto.
* **Acciones concretas:**
  * Para la Fase 1 y Fase 2, **monolito modular NestJS + .NET 8** organizado por _bounded contexts_ aduaneros.
  * Adoptar **Azure Container Apps** solo como _runtime_ del monolito; reservar AKS para la Fase 3 cuando exista carga con estado real.
  * Reservar **Azure Functions** exclusivamente para eventos de IoT y _webhooks_ externos; nunca para flujos transaccionales aduaneros.
  * Documentar la decisión en un **ADR local** que motive por qué el monolito modular precede a la descomposición.

### 6.3 A3 — Migración a .NET 8 sin refactor (Prioridad: A)

* **Decisión:** la migración a .NET 8 debe acompañarse de **modularización mínima**.
* **Acciones concretas:**
  * Identificar los tres _bounded contexts_ primarios (Aduana, Operación de Patio, Almacenamiento) y extraerlos en proyectos independientes dentro de una solución .NET 8.
  * Adoptar **arquitectura limpia** dentro de cada _bounded context_ (Dominio, Aplicación, Infraestructura, API).
  * Prohibir la migración literal 1:1 (Strangler Pattern con cuidado).
  * Aplicar los **patrones canónicos** disponibles en `reference/architecture/canonical-patterns/dotnet/` (request scope context propagation, PII-safe Serilog, AOP logging decorator) desde la primera semana.

### 6.4 A4 — Complejidad de la cadena de datos (Prioridad: A)

* **Decisión:** reducir a tres productos de datos: **PostgreSQL relacional**, **Kafka para eventos**, **Data Lakehouse (Delta Lake/Iceberg) sobre Azure Data Lake Storage** para analítica.
* **Acciones concretas:**
  * Eliminar Cosmos DB salvo demostración explícita de necesidad (latencia sub-milisegundo en alguna ruta justificada).
  * Reemplazar Synapse por **Trino o Apache Spark sobre el Lakehouse** (motor portable, menor costo de licencia).
  * Mantener el Data Lake como _bronze/silver/gold_ con versionado y catálogo (Purview es aceptable, pero también opciones open source como DataHub o Amundsen).

### 6.5 A5 — Observabilidad monopolizada por Azure Monitor (Prioridad: A)

* **Decisión:** adoptar el **stack LGTM con OpenTelemetry** como contrato universal; Azure Monitor queda como _sink secundario_ opcional.
* **Acciones concretas:**
  * Instrumentar todas las aplicaciones con **OpenTelemetry SDK** exportando a un colector local (OTel Collector) dentro de la suscripción Azure.
  * Implementar **Loki, Tempo y Mimir** autoadministrados o administrados por un partner local.
  * Mantener Azure Monitor solo para servicios Azure-nativos que ya lo emiten (Key Vault, Entra ID, etc.).
  * Aplicar el **`playbook-observabilidad.es.md`** de Unimar Arch como guía.

### 6.6 A6 — SRE, SLO/SLI y chaos engineering (Prioridad: A)

* **Decisión:** constituir un **núcleo SRE** desde la Fase 0.
* **Acciones concretas:**
  * Definir **SLI** para los flujos críticos (ingreso de carga, levante, aforo, consulta de posición) y **SLO** con _error budget_ por flujo.
  * Adoptar **chaos engineering** con herramientas como LitmusChaos o Gremlin desde la Fase 2.
  * Establecer _game days_ trimestrales.
  * Crear el `sre-playbook.es.md` correspondiente en `reference/governance/standards/engineering/`.

### 6.7 A7 — TCO comparativo ausente (Prioridad: A)

* **Decisión:** contratar un **estudio TCO a 5 años** que compare al menos tres escenarios: Azure puro, Azure + on-premise híbrido, multi-cloud.
* **Acciones concretas:**
  * El TCO debe incluir licencias SAP, costos de transferencia de datos, soporte 24x7, _managed services_, FinOps y costo de oportunidad.
  * El TCO debe ser un entregable condicionante para la aprobación de la Fase 1.

### 6.8 A8 — Threat model y gap analysis de cumplimiento (Prioridad: A)

* **Acciones concretas:**
  * Realizar un **threat model STRIDE** por servicio crítico antes de la Fase 1.
  * Elaborar un **gap analysis de ISO 27001 e ISO 22301 propio** (no delegado a controles heredados).
  * Elaborar un **BIA** (Business Impact Analysis) por proceso aduanero.
  * Publicar los resultados en `reference/architecture/adrs/` como ADRs locales.

### 6.9 A9 — Cumplimiento de la Ley N.° 29733 (Prioridad: A)

* **Acciones concretas:**
  * Realizar un **registro de actividades de tratamiento** (RAT) antes de la Fase 1.
  * Clasificar los datos personales tratados (consignatarios, representantes, transportistas) y aplicar bases legales.
  * Implementar **PII-safe logging** con el patrón `0065-pipeline-serilog-seguro-pii-dotnet.es.md`.
  * Documentar el flujo transfronterizo (si se usan servicios Azure fuera del Perú) y obtener consentimientos o cláusulas contractuales.

### 6.10 A10–A11 — DR y RTO/RPO (Prioridad: M)

* **Acciones concretas:**
  * Cuantificar **RTO** (minutos) y **RPO** (segundos) por servicio crítico.
  * Implementar un **sitio alterno local** (Callao o Paita) con datos replicados asíncronamente para continuidad de negocio cuando la nube no esté disponible.
  * Programar **simulacros de DR** trimestrales.

### 6.11 A12 — Upskilling y managed services (Prioridad: M)

* **Acciones concretas:**
  * Contratar un partner local para _managed services_ durante los primeros 12 meses.
  * Plan de _upskilling_ interno: certificar al menos dos ingenieros en cada pilar (Azure, Kubernetes, SRE, seguridad).
  * Definir un _runbook_ de escalamiento con el partner.

### 6.12 A13 — Alineación con UNILOG (Prioridad: M)

* **Acciones concretas:**
  * Crear un **Architecture Board inter-sociedad** Unimar-UNILOG.
  * Evaluar qué componentes del TO-BE Unimar son reusables por UNILOG.
  * Documentar las decisiones en un ADR conjunto.

### 6.13 A14 — Modelo de datos canónico y data contracts (Prioridad: M)

* **Acciones concretas:**
  * Crear un **data contract framework** (JSON Schema, OpenAPI + AsyncAPI).
  * Versionado semántico de contratos.
  * Validación automática en CI.
  * Documentar el _bounded context_ aduanero en un **modelo C4 nivel 3** publicado en `reference/architecture/`.

### 6.14 A15 — Exit plan portable (Prioridad: M)

* **Acciones concretas:**
  * Exigir a cada servicio un **scorecard de portabilidad** (cumple/no cumple criterios agnósticos).
  * El scorecard se revisa en cada release.

### 6.15 A16 — Seguridad física del DT (Prioridad: M)

* **Acciones concretas:**
  * Integrar sensores IoT de puertas, CCTV, balanzas y reefers con Sentinel.
  * Crear un **modelo de correlación** entre eventos físicos y eventos lógicos.
  * Documentar en un ADR específico.

### 6.16 A17 — Estrategia de pruebas (Prioridad: M)

* **Acciones concretas:**
  * **Contract testing** con Pact entre NestJS, .NET 8 y SAP.
  * **Pruebas de carga** automatizadas en pipeline con umbrales.
  * **Chaos engineering** (ver A6).
  * **Smoke tests de DR** en el runbook de despliegue.

### 6.17 A18–A20 (Prioridad: B)

* **A18:** Publicar el diccionario de datos en `reference/knowledge/dominio/`.
* **A19:** Publicar un glosario Baufest–Unimar en `reference/governance/glosario.md`.
* **A20:** Exigir control de calidad editorial (revisión ortográfica y de versionado) en todos los entregables externos subsecuentes.

---

## 7. Plan de Implementación

El plan siguiente se superpone al roadmap Baufest original, modificándolo para incorporar las remediaciones. Cada fase tiene **responsables**, **artefactos** esperables y **quality gates** explícitos.

### 7.1 Fase 0 — Assessment, alineación y cimentación (0–2 meses)

**Objetivo:** producir el inventario, la justificación de la elección cloud con TCO, y los marcos de gobernanza mínimos.

**Responsables:**

* _Sponsor:_ Gerencia General.
* _Arquitecto líder:_ Arquitectura Unimar.
* _Tech Lead DT:_ equipo DT.
* _Compliance Lead:_ Oficina de Cumplimiento.
* _Security Lead:_ Oficina de Seguridad de la Información.
* _Product Owner:_ PO DT.
* _FinOps:_ cuando se conforme.

**Artefactos:**

* Inventario de aplicaciones y dependencias.
* BIA por proceso aduanero.
* TCO comparativo (3 escenarios, 5 años).
* ADR-0070 _Elección de nube con criterio de portabilidad_.
* ADR-0071 _Patrón de monolito modular como default_.
* ADR-0072 _Stack de observabilidad LGTM + OTel como contrato universal_.
* RAT inicial.
* Catálogo inicial de datos en `reference/knowledge/dominio/`.
* _Scorecard de portabilidad_ v1.

**Quality gates:**

* Revisión de arquitectura con checklist de Unimar Arch.
* Revisión de seguridad con checklist ISO 27001.
* Validación del TCO con el sponsor.
* Validación del BIA con SUNAT si aplica.
* DRP inicial revisado y aceptado.

### 7.2 Fase 1 — ADO, .NET 8 modular, NestJS consolidado (2–6 meses)

**Objetivo:** salir de TFS, modernizar la capa transaccional con modularización y estabilizar NestJS.

**Responsables:**

* _Tech Lead .NET:_ equipo .NET.
* _Tech Lead NestJS:_ equipo Node.js.
* _SRE Lead:_ núcleo SRE.
* _DevSecOps:_ equipo de seguridad.

**Artefactos:**

* Migración completa a ADO con pipelines declarativos.
* Solución .NET 8 con tres _bounded contexts_ (Aduana, Operación de Patio, Almacenamiento).
* Patrones canónicos aplicados (request scope context propagation, PII-safe Serilog, AOP logging).
* OpenTelemetry instrumentado en .NET 8 y NestJS.
* _Runbooks_ de despliegue y rollback.
* ADR-0073 _Migración .NET Framework → .NET 8 con modularización simultánea_.
* ADR-0074 _Contratos API + AsyncAPI para integración SAP/NestJS_.
* ADR-0075 _Data contracts v1_.

**Quality gates:**

* _Code review_ con checklist de seguridad.
* SAST y SCA automatizados en pipeline (umbrales definidos).
* DAST trimestral.
* _Pen test_ externo al cierre de la fase.
* _Smoke test_ de DR mensual.
* Revisión de SLO y _error budget_ definidos.

### 7.3 Fase 2 — Lago de datos agnóstico, APIs REST, observabilidad LGTM (6–12 meses)

**Objetivo:** construir la capa de datos moderna y la observabilidad agnóstica.

**Responsables:**

* _Data Lead:_ equipo de datos.
* _SRE Lead:_ núcleo SRE.
* _API Platform Lead:_ cuando se conforme.

**Artefactos:**

* Data Lakehouse con Delta Lake/Iceberg sobre Azure Data Lake Storage.
* _Pipelines_ de bronce, plata y oro con linaje.
* Trino o Spark como motor de consulta.
* Catálogo de datos (Purview o DataHub).
* Stack LGTM autoadministrado o co-administrado.
* _Data contracts_ v1 firmados por los _bounded contexts_.
* API Gateway agnóstico (Ingress, Apigee o KrakenD, decisión por ADR).
* ADR-0076 _Arquitectura de datos v1_.
* ADR-0077 _API Gateway_.
* ADR-0078 _Observabilidad v1_.

**Quality gates:**

* _Data quality tests_ automatizados.
* _Contract tests_ Pact en CI.
* SLO definidos para flujos críticos.
* _Game day_ de SRE ejecutado.
* Auditoría de cumplimiento contra ISO 27001.

### 7.4 Fase 3 — IoT, Machine Learning, Digital Twins (12–18 meses)

**Objetivo:** sensorización, analítica avanzada y gemelo digital.

**Responsables:**

* _IoT Lead:_ equipo de campo.
* _ML Lead:_ equipo de datos.
* _SRE Lead:_ núcleo SRE.
* _Compliance Lead:_ Oficina de Cumplimiento.

**Artefactos:**

* Azure IoT Hub integrado con sensores de reefers, puertas, balanzas.
* _Pipelines_ de ML para predicción de abandono y _dwell time_.
* Gemelo digital de la bodega con Digital Twins.
* Modelos de ML con _model card_ y _drift monitoring_.
* ADR-0079 _Estrategia IoT y seguridad física_.
* ADR-0080 _Gobierno de modelos ML_.

**Quality gates:**

* Validación de sesgos en modelos de ML.
* _Pen test_ específico de superficie IoT.
* _Drift monitoring_ activo.
* DR drill que incluya sensores.

### 7.5 Fase 4 — Multi-región opcional, ESG, consolidación (18–24 meses)

**Objetivo:** cerrar el programa y validar continuidad con ESG.

**Responsables:**

* _Sponsor:_ Gerencia General.
* _Arquitecto líder:_ Arquitectura Unimar.
* _Compliance Lead:_ Oficina de Cumplimiento.

**Artefactos:**

* Replicación multi-región Azure (si se justifica con BIA).
* Tableros ESG: consumo energético de reefers, huella de carbono.
* Cierre del programa con _lessons learned_.
* ADR-0081 _Multi-región justificada_ (si aplica).
* ADR-0082 _Política de cierre de programa_.

**Quality gates:**

* Auditoría externa de cumplimiento.
* DR drill multi-región.
* Revisión de _scorecard_ de portabilidad.
* Revisión final con sponsor.

### 7.6 Riesgos transversales del plan

| Riesgo                                        | Mitigación                                                    |
| :-------------------------------------------- | :------------------------------------------------------------ |
| Resistencia al cambio del equipo AS-IS        | Programa de _upskilling_ paralelo; _buddies_ con el partner.  |
| Sobrecosto de la nube por uso ineficiente     | FinOps desde Fase 0; _showback_ mensual al equipo.            |
| Pérdida de conocimiento durante migraciones   | Documentación obligatoria en ADO; revisiones trimestrales.    |
| Cambio regulatorio SUNAT durante el programa  | Revisión trimestral con Compliance Lead; BIA actualizado.     |
| Indisponibilidad prolongada durante el cambio | _Strangler pattern_; cutover incremental; _rollback_ probado. |

---

## 8. Conclusiones

### 8.1 Valoración global del entregable Baufest

El documento de Baufest es un **insumo valioso y profesional**, pero **no constituye una verdad arquitectónica**. Su principal fortaleza es el diagnóstico AS-IS y la división por fases. Su principal debilidad es la asunción acrítica de un _stack_ total Azure sin justificación comparativa y la adopción prematura de microservicios.

### 8.2 Adopción recomendada: **aprobación condicional con 8 condiciones**

Unimar Arch recomienda la **aprobación condicional** del TO-BE sujeto a las siguientes condiciones, todas ellas con prioridad alta y bloqueantes para la Fase 1:

1. **TCO comparativo a 5 años** antes del inicio de la Fase 1.
2. **Exit plan y scorecard de portabilidad** documentados desde la Fase 0.
3. **Arquitectura de monolito modular** como default; serverless y microservicios solo donde exista justificación documentada.
4. **Stack de observabilidad LGTM + OpenTelemetry** como contrato universal; Azure Monitor queda como _sink_ opcional.
5. **Threat model y gap analysis propio** de ISO 27001/22301; no delegación en _inherited controls_ sin auditoría.
6. **Cumplimiento de la Ley N.° 29733** con RAT firmado y PII-safe logging obligatorio.
7. **RTO/RPO cuantificados** y sitio alterno local documentado.
8. **Alineación con UNILOG** vía Architecture Board inter-sociedad.

### 8.3 Lo que Unimar Arch gana al analizar críticamente este entregable

* **Trazabilidad:** cada decisión queda respaldada por un ADR local verificable.
* **Independencia tecnológica:** los principios de portabilidad reducen el riesgo de _lock-in_ futuro.
* **Alineación regulatoria:** el programa queda explícitamente anclado a ISO 27001, ISO 22301, SUNAT, BASC, BPA y Ley N.° 29733.
* **Métricas claras:** los KPIs propuestos por Baufest se complementan con SLO/SLI internos.
* **Gobernanza operativa:** SRE, FinOps y Security se constituyen como funciones desde la Fase 0.

### 8.4 Próximos pasos sugeridos

1. **Sesión de cierre** con el Architecture Board Unimar para presentar este análisis y obtener _go/no-go_ condicional.
2. **Apertura formal de los ADRs 0070 a 0082** en `reference/architecture/adrs/`.
3. **Comunicación a Baufest** con el conjunto de condiciones y solicitud de ajuste del entregable.
4. **Inicio de Fase 0** con TCO comparativo y BIA como primeros entregables.
5. **Publicación de este análisis** en `reference/governance/standards/engineering/` con revisión trimestral.

### 8.5 Declaración de cierre

Este documento es una pieza de **trabajo interno** de Unimar Arch. No es una auditoría formal del proveedor, ni una opinión legal ni financiera. Su propósito es informar la toma de decisiones arquitectónicas y debe ser leído en conjunto con los ADRs locales, los blueprints de `reference/architecture/` y los estándares de `reference/governance/`. La referencia a estándares abiertos sigue siendo **no vinculante y voluntaria**; las decisiones aquí descritas son **decisiones Unimar** propias, no como mandato.

---

## Apéndice A. Mapeo de Issues a ADRs Propuestos

| ID Issue | ADR propuesto                                                                       | Estado    |
| :------- | :---------------------------------------------------------------------------------- | :-------- |
| A1       | `adrs/core/0070-eleccion-nube-con-criterio-portabilidad.es.md`                      | Pendiente |
| A2       | `adrs/core/0071-monolito-modular-como-default.es.md`                                | Pendiente |
| A3       | `adrs/dotnet/0073-migracion-dotnet-framework-8-con-modularizacion.es.md`            | Pendiente |
| A4, A14  | `adrs/core/0076-arquitectura-datos-v1.es.md`                                        | Pendiente |
| A5, A6   | `adrs/core/0072-stack-observabilidad-lgtm-otel.es.md`                               | Pendiente |
| A8       | `adrs/core/0083-threat-model-y-gap-analysis-iso27001-22301.es.md`                   | Pendiente |
| A9       | `adrs/dotnet/0065-pipeline-serilog-seguro-pii-dotnet.es.md` _(ya existe, reutilizar)_ | Existente |
| A13      | `adrs/core/0084-arquitectura-board-inter-sociedad-unimar-unilog.es.md`              | Pendiente |
| A15      | `adrs/core/0085-exit-plan-y-scorecard-portabilidad.es.md`                           | Pendiente |
| A16      | `adrs/core/0079-estrategia-iot-y-seguridad-fisica.es.md`                            | Pendiente |
| A17      | `adrs/core/0074-contratos-api-asyncapi-integracion-sap-nestjs.es.md`                | Pendiente |
| A7       | TCO comparativo: entregable no-ADR, con artefacto asociado.                         | N/A       |

## Apéndice B. Referencias Internas Aplicables

* `reference/architecture/flujo-arquitectura-observabilidad.es.md` — flujo de observabilidad.
* `reference/architecture/blueprints/stack-tecnologico-autorizado-agnostico.es.md` — línea base agnóstica.
* `reference/architecture/analisis-estrategico-cap.es.md` — análisis CAP.
* `reference/architecture/canonical-patterns/dotnet/cp-01-propagacion-contexto-scope-request.es.md`.
* `reference/architecture/canonical-patterns/dotnet/cp-02-logging-serilog-seguro-pii.es.md`.
* `reference/architecture/canonical-patterns/dotnet/cp-04-decorador-logging-aop.es.md`.
* `reference/architecture/adrs/dotnet/0065-pipeline-serilog-seguro-pii-dotnet.es.md`.
* `reference/governance/standards/engineering/manifiesto-ingenieria.md`.
* `reference/governance/standards/engineering/playbook-observabilidad.es.md`.
* `reference/governance/standards/vision/evaluacion-madurez.es.md`.
* `reference/governance/glosario.md`.
* `license/NOTICE.md` — atribuciones.
* `license/DISCLAIMER.md` § Modelo de Referencia.

## Apéndice C. Bitácora de Revisión

| Revisión | Fecha            | Autor                | Cambio                                           |
| :------- | :--------------- | :------------------- | :----------------------------------------------- |
| 1.0      | (fecha de alta)  | Unimar Arch agent    | Emisión inicial.                                 |

> **Aviso de mantenimiento.** Este documento se revisará trimestralmente o cuando: (a) cambie el TO-BE Baufest, (b) se emita un ADR nuevo de los listados en el Apéndice A, o (c) cambien marcos regulatorios (SUNAT, BASC, BPA, Ley N.° 29733, ISO 27001/22301).
