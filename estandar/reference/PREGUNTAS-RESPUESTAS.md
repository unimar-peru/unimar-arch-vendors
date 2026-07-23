# Estandar para Proveedores — Preguntas y Respuestas

> **Estado:** Referencia Activa
> **Responsable:** Unimar Architecture Board
> **Creado:** 2026-07-23
> **Ultima Actualizacion:** 2026-07-23

Este documento responde las preguntas mas comunes que un proveedor externo tiene al incorporarse al estandar de Unimar. Las categorias son expandibles — haz clic para expandir.

---

<details open>
<summary><h2>Categoria 1: General — ¿Que es esto?</h2></summary>

<details>
<summary><b>¿Que es este repositorio y a quien le pertenece?</b></summary>

**Respuesta:** Es el corpus arquitectonico corporativo de Unimar S.A. — define los estandares, artefactos y requerimientos minimos que los proveedores externos deben cumplir durante el SDLC. Es mantenido por el Architecture Board de Unimar.

**Evidencia:** [README](../../../README.md)
</details>

<details>
<summary><b>¿Es un repositorio de codigo o de documentacion?</b></summary>

**Respuesta:** Es un repositorio de **documentacion pura**. No contiene codigo de producto. El producto aplicado de referencia (UMS) vive en un repositorio satelite separado.

**Evidencia:** [Master Index](../../../MASTER_INDEX.md)
</details>

<details>
<summary><b>Para que audiencia esta dirigido?</b></summary>

**Respuesta:** Arquitectos, desarrolladores (.NET/Node.js/Android), QA, DevOps, Product Owners, Revisores de Seguridad, y proveedores externos. Cada rol tiene una ruta de lectura en [Getting Started](../getting-started/README.md).

**Evidencia:** [Getting Started by Role](../getting-started/README.md)
</details>

<details>
<summary><b>¿Como me oriento en menos de 30 minutos?</b></summary>

**Respuesta:** Sigue la ruta de tu rol en [Getting Started](../getting-started/README.md). Si eres proveedor externo, empieza por este documento, luego lee el README principal, y finalmente consulta la matriz de artefactos obligatorios.

**Evidencia:** [Getting Started](../getting-started/README.md), [Quick Access](../quick-access/)
</details>

<details>
<summary><b>¿Por que toda la documentacion es en español?</b></summary>

**Respuesta:** Regla corporativa (R-04): todo el contenido es en español. Solo se permiten acronimos, identificadores de codigo y nombres de herramientas en ingles.

**Evidencia:** [AGENTS.md](../../../AGENTS.md), Regla R-04
</details>

<details>
<summary><b>¿Que rol tienen los agentes de IA (BMAD)?</b></summary>

**Respuesta:** BMAD v6.8.0 provee 59 skills en `.opencode/commands/` que augmentan el SDLC (produccion mas rapida de artefactos), pero NO reemplazan el proceso. Los agentes siguen las mismas reglas que los humanos.

**Evidencia:** [AGENTS.md](../../../AGENTS.md)
</details>

</details>

---

<details>
<summary><h2>Categoria 2: Las 5 Fases del SDLC y sus Gates</h2></summary>

<details>
<summary><b>¿Cuales son las 5 fases del SDLC?</b></summary>

| Fase | Nombre | Que se hace |
|------|--------|-------------|
| **F1** | Concepcion y Descubrimiento | Definir que se construye (PRD, historias, backlog) |
| **F2** | Diseno y Arquitectura | Definir como se construye (ADRs, blueprints, stack) |
| **F3** | Construccion | Construir el producto (codigo, tests, CI/CD) |
| **F4** | Validacion y QA | Verificar que funciona (pruebas, reportes) |
| **F5** | Entrega y Operaciones | Desplegar y operar (release, monitoreo) |

**Evidencia:** [Gates de Calidad](../governance/sdlc/gates-calidad.es.md)
</details>

<details>
<summary><b>¿Que es un gate y que revisa?</b></summary>

**Respuesta:** Un gate es un checkpoint al final de cada fase que verifica que los artefactos obligatorios existan y cumplan criterios de calidad. Si el gate falla, la fase no se cierra y no se puede avanzar.

**Ejemplo:** El gate de F3 verifica: CI verde, coverage >= 80%, zero CVEs high/critical, DoD cumplido.

**Evidencia:** [Gates de Calidad](../governance/sdlc/gates-calidad.es.md)
</details>

<details>
<summary><b>¿Que revisa cada gate especificamente?</b></summary>

| Gate | Fase | Que verifica |
|------|------|-------------|
| **Aprobacion de Negocio** | F1 | PRD aprobado, alcance congelado, stakeholders identificados |
| **Baseline de Diseno** | F2 | ADRs documentados, blueprints alineados, diagramas C4 completos |
| **Build Exitoso** | F3 | CI verde, coverage >= 80%, zero CVEs high/critical |
| **RC Sellado** | F4 | Test Summary Report sellado, criterios de aceptacion cumplidos |
| **Produccion Activa** | F5 | Release Notes aprobado, rollback probado, observabilidad verificada |

**Evidencia:** [Gates de Calidad](../governance/sdlc/gates-calidad.es.md)
</details>

<details>
<summary><b>¿Se puede saltar un gate?</b></summary>

**Respuesta:** Solo con un **Waiver** formal que incluya: owner, fecha de expiracion, declaracion de riesgo, plan de mitigacion, y autoridad que aprueba. Los CVEs high/critical **NUNCA** se pueden eximir.

**Evidencia:** [Gates de Calidad](../governance/sdlc/gates-calidad.es.md)
</details>

<details>
<summary><b>¿Cuales son los umbrales numericos de calidad?</b></summary>

| Metrica | Umbral |
|---------|--------|
| Code coverage | >= 80% |
| Complejidad ciclomatica | <= 15/metodo |
| CVEs high/critical | 0 (zero) |
| Tech debt ratio | < 5% |
| Testing pyramid | 70% unit / 20% integration / 10% E2E |

**Evidencia:** [Estrategia de Pruebas](../governance/sdlc/estrategia-pruebas.es.md), [ADR-0018](../architecture/adrs/core/0018-testing-pyramid-quality-gates.es.md)
</details>

</details>

---

<details>
<summary><h2>Categoria 3: Artefactos Obligatorios</h2></summary>

<details>
<summary><b>¿Que artefactos son obligatorios en F1?</b></summary>

| Artefacto | Que es |
|-----------|--------|
| **PRD** | Definicion de producto |
| **Historia de Usuario (US)** | Descripcion de tarea funcional |
| **Backlog Agil** | Lista priorizada por MVP y fases |
| **Plan de Proyecto** | Estimacion, equipos, fases, roadmap |

**Evidencia:** [Plantilla PRD](../governance/sdlc/04-plantillas-artefactos/plantilla-prd.es.md), [Plantilla US](../governance/sdlc/04-plantillas-artefactos/plantilla-historia-usuario.es.md)
</details>

<details>
<summary><b>¿Que artefactos son obligatorios en F2?</b></summary>

| Artefacto | Que es |
|-----------|--------|
| **Blueprint de Referencia** | Idea conceptual y sustento tecnico |
| **ADR** | Decision arquitectonica documentada |
| **Stack Autorizado** | Verificacion contra stacks aprobados |
| **Checklist de Simplicidad** | Validacion de complejidad |

**Evidencia:** [Plantilla Blueprint](../governance/sdlc/04-plantillas-artefactos/plantilla-blueprint-arquitectura.es.md), [Plantilla ADR](../governance/sdlc/04-plantillas-artefactos/plantilla-adr.es.md)
</details>

<details>
<summary><b>¿Que artefactos son obligatorios en F3?</b></summary>

| Artefacto | Que es |
|-----------|--------|
| **Historia Tecnica (TS)** | Tareas tecnicas que componen una US |
| **Gates / cobertura** | Evidencia de cumplimiento de quality gates |
| **Pipeline CI/CD** | Resultados de lint, test, build, seguridad |

**Evidencia:** [Plantilla TS](../governance/sdlc/04-plantillas-artefactos/plantilla-historia-tecnica.es.md)
</details>

<details>
<summary><b>¿Que artefactos son obligatorios en F4?</b></summary>

| Artefacto | Que es |
|-----------|--------|
| **Reporte Resumen de Pruebas** | Resultado de control de pruebas |

**Evidencia:** [Plantilla Reporte](../governance/sdlc/04-plantillas-artefactos/plantilla-reporte-resumen-pruebas.es.md)
</details>

<details>
<summary><b>¿Que artefactos son obligatorios en F5?</b></summary>

| Artefacto | Que es |
|-----------|--------|
| **Notas de Lanzamiento (RN)** | Plan de despliegue documentado |

**Evidencia:** [Plantilla RN](../governance/sdlc/04-plantillas-artefactos/plantilla-notas-lanzamiento.es.md)
</details>

<details>
<summary><b>¿Cual es la diferencia entre Obligatorio (R) y Opcional (O)?</b></summary>

**Respuesta:** **Obligatorio (R)** = bloquea el gate si falta. **Opcional (O)** = mejor practica recomendada, situacional. Los artefactos R estan en la tabla del README principal.

**Evidencia:** [README](../../../README.md)
</details>

<details>
<summary><b>¿Que es "Delta Documental"?</b></summary>

**Respuesta:** Documentacion que DEBE actualizarse cuando el codigo cambia comportamiento, arquitectura, API u operaciones. Si modificas una API, debes actualizar el OpenAPI spec, la documentacion de integracion, y las historias tecnicas afectadas.

**Evidencia:** [Documentacion](../governance/sdlc/03-documentacion/)
</details>

</details>

---

<details>
<summary><h2>Categoria 4: Arquitectura</h2></summary>

<details>
<summary><b>¿Cual es la jerarquia de autoridad arquitectonica?</b></summary>

| Nivel | Que define |
|-------|-----------|
| 1 | Suite Vision (direccion estrategica) |
| 2 | Architectural Directives (reglas binding) |
| 3 | Engineering Manifesto (principios) |
| 4 | Agnostic Baseline (tecnologias agnosticas) |
| 5 | Blueprint (guia tecnica por topologia) |
| 6 | ADR Matrix (decisiones documentadas) |
| 7 | Runtime Profiles (.NET, Node.js, Android) |
| 8 | SDLC + Gates (proceso) |
| 9 | Canonical Patterns (implementacion) |

**Evidencia:** [Estandar Arquitectonico](../architecture/estandar-arquitectonico-suite-unimar.es.md)
</details>

<details>
<summary><b>¿Cuantos ADRs existen?</b></summary>

**Respuesta:** 57+ ADRs: 40+ Core (agnosticos), 13 Node.js, 3 .NET, 1 Android. Todos catalogados en la [Matriz ADR](../architecture/adrs/matriz-adr.es.md).

**Evidencia:** [Matriz ADR](../architecture/adrs/matriz-adr.es.md)
</details>

<details>
<summary><b>¿Que es un ADR y cuando necesito crear uno?</b></summary>

**Respuesta:** Architecture Decision Record — documenta una decision arquitectonica significativa con contexto, decision y consecuencias. Debes crear uno cuando: introduces una nueva tecnologia, cambias un patron existente, o defines una estrategia que afecta multiples equipos.

**Ejemplo:** Si quieres usar MongoDB en lugar de PostgreSQL, necesitas un ADR que justifique la excepcion.

**Evidencia:** [Plantilla ADR](../governance/sdlc/04-plantillas-artefactos/plantilla-adr.es.md), [DECISIONS.md](../../../DECISIONS.md)
</details>

<details>
<summary><b>¿Puedo usar una tecnologia no autorizada?</b></summary>

**Respuesta:** No. Cualquier tecnologia no listada en el [Stack Autorizado](../architecture/stack-tecnologico-autorizado-agnostico.es.md) requiere un ADR que justifique la excepcion. El stack aprobado es: .NET/C#, Node.js/TypeScript, Android/Kotlin.

**Evidencia:** [Stack Autorizado](../architecture/stack-tecnologico-autorizado-agnostico.es.md)
</details>

<details>
<summary><b>¿Que topologia debe seguir mi proyecto?</b></summary>

**Respuesta:** Todo producto nuevo comienza como **Monolito Modular** (F1) a menos que cumpla los criterios de extraccion (ADR-0045). Evolucionar a modulos distribuidos o microservicios requiere evidencia.

**Evidencia:** [ADR-0045](../architecture/adrs/core/0045-microservice-extraction-readiness-criteria.es.md)
</details>

<details>
<summary><b>¿Que son los Canonical Patterns?</b></summary>

**Respuesta:** 12 patrones (CP-01 a CP-12) que documentan COMO implementar un patron en codigo para un runtime especifico. Los ADRs documentan POR QUE; los Canonical Patterns documentan COMO.

**Evidencia:** [Canonical Patterns](../architecture/canonical-patterns/README.md)
</details>

</details>

---

<details>
<summary><h2>Categoria 5: Eststandares de Ingenieria</h2></summary>

<details>
<summary><b>¿Que es el Manifiesto de Ingenieria?</b></summary>

**Respuesta:** 7 principios: Tecnologia Probada, Developer Experience, Test-First, Boundaries Explicitos, Estandares sobre Heroismo, Evidencia sobre Opinion, Open Source Hygiene.

**Evidencia:** [Manifiesto de Ingenieria](../governance/standards/engineering/manifiesto-ingenieria.md)
</details>

<details>
<summary><b>¿Que estandar de API se requiere?</b></summary>

**Respuesta:** REST-first con: formato de respuesta estandar, manejo de errores, paginacion, versionado, idempotencia, y spec OpenAPI.

**Evidencia:** [Eststandares de Ingenieria](../governance/standards/engineering/)
</details>

<details>
<summary><b>¿Que stack frontend esta autorizado?</b></summary>

**Respuesta:** React + Vite + TypeScript, Atomic Design, con tests obligatorios.

**Evidencia:** [Stack Autorizado](../architecture/stack-tecnologico-autorizado-agnostico.es.md)
</details>

<details>
<summary><b>¿Que stack de monitoreo se requiere?</b></summary>

**Respuesta:** LGTM (Loki, Grafana, Tempo, Mimir) + Prometheus. Metricas RED/USE. SLIs/SLOs obligatorios.

**Evidencia:** [Estrategia de Monitoreo](../architecture/flujo-arquitectura-observabilidad.es.md)
</details>

<details>
<summary><b>¿Que base de datos debo usar?</b></summary>

**Respuesta:** SQL Server para .NET, PostgreSQL para Node.js, MongoDB solo con ADR aprobado. Normalizacion 3NF.

**Evidencia:** [Eststandares de Ingenieria](../governance/standards/engineering/)
</details>

</details>

---

<details>
<summary><h2>Categoria 6: Testing y Calidad</h2></summary>

<details>
<summary><b>¿Cual es la proporcion de testing obligatoria?</b></summary>

**Respuesta:** 70% unit / 20% integration / 10% E2E (ADR-0018).

**Evidencia:** [Estrategia de Pruebas](../governance/sdlc/estrategia-pruebas.es.md), [ADR-0018](../architecture/adrs/core/0018-testing-pyramid-quality-gates.es.md)
</details>

<details>
<summary><b>¿Que frameworks de testing debo usar?</b></summary>

| Stack | Frameworks |
|-------|-----------|
| .NET | xUnit + Moq + FluentAssertions |
| Node.js | Jest |
| Android | JUnit5 + MockK + Turbine |

**Evidencia:** [Estrategia de Pruebas](../governance/sdlc/estrategia-pruebas.es.md)
</details>

<details>
<summary><b>¿Que estrategia de seguridad debo seguir?</b></summary>

| Fase | Actividad |
|------|-----------|
| F2 | Threat Modeling |
| Pre-commit | Secret Scanning |
| F3 | SAST (CodeQL) + SCA (Snyk) |
| F4 | DAST (OWASP ZAP) |
| Anual | Penetration Testing |

**Evidencia:** [Estrategia de Seguridad](../governance/sdlc/estrategia-seguridad.es.md)
</details>

<details>
<summary><b>¿Que estandares OWASP aplican?</b></summary>

| Estandar | Aplica a |
|----------|---------|
| ASVS L2 | Aplicaciones web |
| MASVS L2 | Aplicaciones moviles |
| API Top 10 | APIs |
| CIS Benchmarks | Bases de datos |

**Evidencia:** [Estrategia de Seguridad](../governance/sdlc/estrategia-seguridad.es.md)
</details>

<details>
<summary><b>Cual es la tasa minima de aprobacion para pruebas funcionales?</b></summary>

**Respuesta:** >= 90% de aprobacion funcional para sellar el RC (Release Candidate).

**Evidencia:** [Gates de Calidad](../governance/sdlc/gates-calidad.es.md)
</details>

</details>

---

<details>
<summary><h2>Categoria 7: Ramificacion y CI/CD</h2></summary>

<details>
<summary><b>¿Que modelo de ramificacion se requiere?</b></summary>

**Respuesta:** GitFlow Extendido (ADR-0050): 4 ramas permanentes (main, develop, qa, uat) + 3 temporales (feature/*, release/*, hotfix/*).

**Evidencia:** [Estrategia de Ramificacion](../governance/sdlc/estrategia-ramificacion.es.md), [ADR-0050](../architecture/adrs/core/0050-estrategia-ramificacion-gitflow.es.md)
</details>

<details>
<summary><b>¿Cual es el flujo de promocion?</b></summary>

```
feature/* -> develop (squash) -> qa -> uat -> main (--no-ff)
```

**Evidencia:** [Estrategia de Ramificacion](../governance/sdlc/estrategia-ramificacion.es.md)
</details>

<details>
<summary><b>¿Que controles CI/CD son obligatorios?</b></summary>

**Respuesta:** ADR-0005: lint, test, build, y CodeQL security scan deben pasar antes del merge.

**Evidencia:** [ADR-0005](../architecture/adrs/core/0005-ci-cd-calidad-codeql.es.md)
</details>

<details>
<summary><b>¿Que estandar de commits se requiere?</b></summary>

**Respuesta:** Conventional Commits v1.0.0 (feat:, fix:, docs:, etc.)

**Evidencia:** [ADR-0050](../architecture/adrs/core/0050-estrategia-ramificacion-gitflow.es.md)
</details>

</details>

---

<details>
<summary><h2>Categoria 8: Infraestructura</h2></summary>

<details>
<summary><b>¿Cual es la topologia de referencia?</b></summary>

**Respuesta:** Multi-AZ: Kubernetes, Ingress Gateway, Redis, RabbitMQ, HashiCorp Vault, MinIO, SQL Server/PostgreSQL, Prometheus+Grafana+Loki.

**Evidencia:** [Infraestructura Hub](../infrastructure/README.md)
</details>

<details>
<summary><b>¿Que escenarios de DR existen?</b></summary>

| Escenario | Tiempo objetivo |
|-----------|----------------|
| Perdida de pod | < 1 min |
| Perdida de nodo | < 5 min |
| Fallo de AZ | < 15 min |
| Corrupcion de datos | < 60 min |
| Desastre regional | < 4 horas |

**Evidencia:** [Escenarios de Despliegue](../architecture/escenarios-despliegue-multinube.es.md)
</details>

<details>
<summary><b>¿Cuales son los requerimientos de backup?</b></summary>

| Componente | Frecuencia | Retencion |
|------------|-----------|-----------|
| SQL Server | Full diario + logs cada 15min | 30 dias |
| PostgreSQL | Diario + WAL streaming | Configurable |
| Redis | Snapshots cada 5min | 2 dias |
| MinIO | Replicacion continua | Configurable |

**Evidencia:** [Infraestructura Hub](../infrastructure/README.md)
</details>

</details>

---

<details>
<summary><h2>Categoria 9: Trazabilidad</h2></summary>

<details>
<summary><b>¿Cual es la cadena de trazabilidad?</b></summary>

**Respuesta:** PRD -> FS -> US -> TS + ADR -> PR -> TSR -> RN. Cada artefacto referencia a su padre.

**Ejemplo:** Una Historia Tecnica (TS) referencia la Historia Funcional (US) que a su vez referencia el PRD.

**Evidencia:** [Modelo de Trazabilidad](../governance/sdlc/modelo-trazabilidad.es.md)
</details>

<details>
<summary><b>¿Que formatos de ID se requieren?</b></summary>

| Artefacto | Formato |
|-----------|---------|
| PRD | PRD-Producto-NNN |
| Functional Story | FS-Producto-NNN |
| User Story | US-Producto-NNN |
| Technical Story | TS-Producto-NNN |
| ADR | ADR-NNN |

**Evidencia:** [Modelo de Trazabilidad](../governance/sdlc/modelo-trazabilidad.es.md)
</details>

<details>
<summary><b>¿Como se verifica la trazabilidad en cada gate?</b></summary>

**Respuesta:** Cada gate verifica que la cadena este completa para esa fase. Gaps bloquean el avance.

**Evidencia:** [Gates de Calidad](../governance/sdlc/gates-calidad.es.md)
</details>

</details>

---

<details>
<summary><h2>Categoria 10: Contribucion y Gobernanza</h2></summary>

<details>
<summary><b>Quien puede contribuir a este repositorio?</b></summary>

**Respuesta:** Cualquier rol: desarrolladores, analistas, arquitectos, QA, DevOps, product owners. Niveles de contribucion:
- **Mayor:** Architecture Board (decisiones estrategicas)
- **Medio:** Tech Leads (estandares de area)
- **Menor:** Cualquier maintainer (correcciones, mejoras)

**Evidencia:** [Contribucion](../contribucion/README.md)
</details>

<details>
<summary><b>¿Cual es el proceso de aprobacion?</b></summary>

| Nivel | Tiempo |
|-------|--------|
| Menor | < 24 horas |
| Medio | 2-5 dias habiles |
| Mayor | 5-10 dias habiles + reunion semanal |

**Evidencia:** [Contribucion](../contribucion/README.md)
</details>

<details>
<summary><b>¿Que scripts de validacion son obligatorios?</b></summary>

**Respuesta:** `validate-docs.mjs` valida links, anchors, encoding y Mermaid. El pre-commit hook ejecuta lint-staged + validate-docs automaticamente.

**Evidencia:** [AGENTS.md](../../../AGENTS.md)
</details>

<details>
<summary><b>¿Cual es la taxonomia del repositorio?</b></summary>

**Respuesta:** Archivos en kebab-case, directorios con scope, separacion estricta entre `reference/` (corpus) y `docs/` (artefactos de planificacion).

**Evidencia:** [Taxonomia](../governance/standards/taxonomia-repositorio.md)
</details>

</details>

---

<details>
<summary><h2>Categoria 11: Dominio de Negocio</h2></summary>

<details>
<summary><b>¿Cual es el dominio de negocio?</b></summary>

**Respuesta:** Logistica aduanera: Despacho, DUA, Sucursal, Operador, Patios, Contenedores, Transportes. Unimar es Operador Logistico Aduanero desde 1978.

**Evidencia:** [Knowledge/Dominio](../knowledge/dominio/)
</details>

<details>
<summary><b>¿Cual es el alcance del glosario?</b></summary>

**Respuesta:** 550+ terminos controlados cubriendo SDLC, testing, seguridad, infraestructura y dominio de negocio.

**Evidencia:** [Glosario](../governance/glosario.md)
</details>

</details>

---

<details>
<summary><h2>Categoria 12: Preguntas Frecuentes de Proveedor</h2></summary>

<details>
<summary><b>¿Que pasa si no cumplo un gate?</b></summary>

**Respuesta:** La fase no se cierra. No puedes avanzar a la siguiente. Opciones: arreglar las violaciones, solicitar un Waiver formal, o escalar al Architecture Board.

**Evidencia:** [Gates de Calidad](../governance/sdlc/gates-calidad.es.md)
</details>

<details>
<summary><b>¿Puedo usar una base de datos NoSQL?</b></summary>

**Respuesta:** Solo con un ADR aprobado que justifique la excepcion. El default es SQL Server (.NET) o PostgreSQL (Node.js).

**Evidencia:** [Stack Autorizado](../architecture/stack-tecnologico-autorizado-agnostico.es.md)
</details>

<details>
<summary><b>¿Necesito documentacion en ingles?</b></summary>

**Respuesta:** No. Todo el contenido es en español (R-04). Solo acronimos, identificadores de codigo y nombres de herramientas van en ingles.

**Evidencia:** [AGENTS.md](../../../AGENTS.md)
</details>

<details>
<summary><b>¿Donde encuentro las plantillas?</b></summary>

**Respuesta:** Todas las plantillas estan en `estandar/reference/governance/sdlc/04-plantillas-artefactos/` con versiones fuente (copiables) y renderizadas (ejemplos).

**Evidencia:** [Plantillas](../governance/sdlc/04-plantillas-artefactos/)
</details>

<details>
<summary><b>¿Que hago si una tecnologia que necesito no esta autorizada?</b></summary>

**Respuesta:** Crea un ADR que justifique la excepcion con: contexto, opciones evaluadas, decision, y consecuencias. Registralo en DECISIONS.md y sometelo al Architecture Board.

**Evidencia:** [Plantilla ADR](../governance/sdlc/04-plantillas-artefactos/plantilla-adr.es.md), [DECISIONS.md](../../../DECISIONS.md)
</details>

<details>
<summary><b>¿Cada cuanto se actualiza el estandar?</b></summary>

**Respuesta:** El repositorio esta en constante evolucion. Las actualizaciones mayores pasan por el Architecture Board (reunion semanal). Los cambios menores se aprueban en < 24h.

**Evidencia:** [Contribucion](../contribucion/README.md)
</details>

</details>

---

## Documentos Relacionados

| Documento | Proposto |
|---|---|
| [README Principal](../../../README.md) | Tabla de artefactos obligatorios |
| [Gates de Calidad](../governance/sdlc/gates-calidad.es.md) | Criterios por gate |
| [Glosario](../governance/glosario.md) | 550+ terminos controlados |
| [Matriz ADR](../architecture/adrs/matriz-adr.es.md) | Todas las decisiones |
| [Getting Started](../getting-started/README.md) | Rutas por rol |
| [Contribucion](../contribucion/README.md) | Como contribuir |

---

*Este Q&A es un documento vivo. Actualizalo cuando surjan nuevas preguntas.*

---
[Volver al Hub de Referencia](../README.md)
