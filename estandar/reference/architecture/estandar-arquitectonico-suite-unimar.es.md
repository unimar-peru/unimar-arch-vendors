# Estándar Arquitectónico Corporativo de la Suite UNIMAR

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Est%C3%A1ndar%20Arquitect%C3%B3nico-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Activo-27ae60?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-1.0.0-042139?style=flat-square" alt="Versión">
</p>

> **Owner:** Architecture Board
> **Aplicabilidad:** Toda la suite UNIMAR y repositorios satélite
> **Fase SDLC:** Transversal
> **Puerta de salida:** Aplica a todos los gates

---

## 1. Propósito

Este estándar consolida la línea base arquitectónica corporativa para construir, integrar, desplegar y operar productos dentro de la Suite UNIMAR. Su objetivo es evitar definiciones aisladas por producto y asegurar que cada sistema nuevo preserve la visión de suite, la trazabilidad de negocio y la evolución técnica progresiva.

Este documento no reemplaza los ADRs, perfiles de runtime ni plantillas SDLC. Los organiza como una jerarquía de autoridad reusable.

---

## 2. Jerarquía de Autoridad

| Nivel | Fuente | Uso obligatorio |
|---|---|---|
| 1 | Visión de la Suite | Define el destino operacional y la obligación de diseñar como suite. |
| 2 | [Directivas Arquitectónicas](../governance/standards/vision/directivas-arquitectonicas.es.md) | Define principios no negociables y restricciones maestras. |
| 3 | [Manifiesto de Ingeniería](../governance/standards/engineering/manifiesto-ingenieria.md) | Define principios de ingeniería que gobiernan todo el código. |
| 4 | [Línea Base Agnóstica](stack-tecnologico-autorizado-agnostico.es.md) | Define reglas universales independientes del runtime. |
| 5 | [Blueprint de Referencia](blueprints/blueprint-referencia.es.md) | Modelo C4 canónico y topología de referencia corporativa. |
| 6 | [Matriz de ADRs](adrs/matriz-adr.es.md) | Define decisiones vigentes, pendientes, supersedidas o deprecadas. |
| 7 | Perfiles de runtime | Concretan herramientas para [.NET](stack-tecnologico-autorizado-dotnet.es.md), [Node.js](stack-tecnologico-autorizado-nodejs.es.md) y [Android](stack-tecnologico-autorizado-android.es.md). |
| 8 | [SDLC + Gates de Calidad](../governance/sdlc/README.md) | Define fases, artefactos, gates, trazabilidad y evidencia. |
| 9 | [Patrones Canónicos](canonical-patterns/README.md) | Define implementaciones reutilizables por runtime. |
| — | [Matriz NFR](matriz-nfr-suite.es.md) (transversal) | Requisitos no funcionales verificables que aplican en todos los niveles. |

Si dos documentos parecen contradecirse, prevalece el nivel superior. Si una decisión no está cubierta, se debe registrar un ADR antes de convertirla en estándar.

> **Leyenda de acrónimos:** PRD = requisitos de producto · FS = historia funcional · US = historia de usuario · TS = historia técnica · ADR = decisión arquitectónica · PR = pull request · TSR = reporte de pruebas · RN = notas de lanzamiento · NFR = requisito no funcional.

---

## 3. Principios Arquitectónicos

| Principio | Norma |
|---|---|
| Suite antes que producto | Todo sistema debe declarar qué capacidad de suite habilita, qué contextos consume y qué eventos o contratos publica. |
| Dominio primero | La capa de dominio no depende de frameworks HTTP, ORMs, SDKs de nube, brokers, cachés ni proveedores externos. |
| Modularidad estricta | Todo producto nuevo inicia como monolito modular salvo ADR aprobado. Los módulos corresponden a contextos acotados. |
| Evolución por evidencia | La extracción a microservicio requiere cumplir criterios medibles de [ADR-0045](adrs/core/0045-criterios-extraccion-microservicios.es.md). |
| Contratos explícitos | Toda integración usa contrato versionado: OpenAPI, Protobuf o AsyncAPI según la matriz de protocolos. |
| Seguridad por diseño | Identidad, autorización, aislamiento por sucursal, secretos y auditoría se diseñan desde Fase 1. |
| Observabilidad obligatoria | Rutas productivas deben emitir logs estructurados, trazas correlacionables y métricas verificables. |
| Documentación trazable | Cada cambio técnico debe mantener la cadena PRD (requisitos) → FS (diseño funcional) → US (especificación) → TS (implementación) + ADR → PR (código) → TSR (validación) → RN (release) cuando aplique. |

---

## 4. SDLC Arquitectónico

| Fase | Decisión arquitectónica esperada | Artefactos mínimos | Gate |
|---|---|---|---|
| 1. Concepción y Descubrimiento | Confirmar valor de suite, alcance, actores, no-objetivos y restricciones. | PRD, Backlog, Directivas, Línea Base Agnóstica, ADR-0047. | Aprobación de Negocio |
| 2. Diseño y Arquitectura | Definir contextos, contratos, NFRs, datos, seguridad, observabilidad y runtime. | Blueprint, ADRs, Matriz NFR, Historias Funcionales, Context Map. | Baseline de Diseño Aprobado |
| 3. Construcción | Implementar módulos, puertos, adaptadores, pruebas y delta documental. | Historias Técnicas, patrones canónicos, CI, DoD. | Build Exitoso |
| 4. Validación y QA | Verificar comportamiento, calidad, seguridad, contratos y operación. | Test Summary Report, evidencia de aceptación, escaneos, métricas. | RC Sellado |
| 5. Entrega y Operaciones | Activar despliegue, rollback, monitoreo, runbooks y soporte. | Release Notes, plan de rollback, checklist de observabilidad. | Producción Activa |

La trazabilidad canónica está definida en [Modelo de Trazabilidad](../governance/sdlc/modelo-trazabilidad.es.md). Los gates están definidos en [Gates de Calidad SDLC](../governance/sdlc/gates-calidad.es.md).

---

## 5. Modelo de Suite y Contextos

Cada producto debe declararse dentro del mapa de capacidades de la Suite UNIMAR:

1. **Núcleo Operativo:** Depósito Temporal, Contenedores Vacíos, Transportes, Almacenes y Facturación.
2. **Apoyo al Negocio:** Data Maestra, Gestión Comercial, Patios y Servicios Logísticos.
3. **Servicios Transversales:** Usuarios, Notificaciones e Integraciones.
4. **Data y Analítica:** ingesta, gobierno, procesamiento, consumo y observabilidad de datos.

El mapa de contextos acotados es la fuente para nombres de módulos, esquemas, contratos y ownership de datos. Todo contexto debe declarar:

- Tipo: Core, Supporting o Generic.
- Lenguaje ubicuo.
- Responsabilidades y no-responsabilidades.
- Contratos publicados y consumidos.
- Schema o almacenamiento propietario.
- Equipo responsable.
- ADRs aplicables.

---

## 6. Stacks Tecnológicos y Selección

La selección tecnológica se hace en dos pasos:

1. Verificar que la decisión respeta la [Línea Base Agnóstica](stack-tecnologico-autorizado-agnostico.es.md).
2. Elegir el perfil de runtime aprobado según la carga de trabajo.

| Runtime | Uso canónico | Criterio de selección |
|---|---|---|
| Node.js / TypeScript | APIs web, BFF, frontend SSR, orquestación de canales. | Alta productividad web, equipos full-stack TypeScript, APIs transaccionales. |
| .NET / C# | Backend enterprise, batch, ETL, interoperabilidad legada, cómputo pesado. | Integración corporativa, workloads de alto rendimiento gestionado o dependencia de ecosistema Microsoft. |
| Android / Kotlin | Aplicaciones móviles nativas operativas. | Captura offline, hardware móvil, operación en campo, GPS o escaneo. |

Cualquier reemplazo de herramienta aprobada requiere ADR antes de escribir código productivo.

---

## 7. Patrones de Arquitectura y Diseño

| Patrón | Aplicabilidad | Regla |
|---|---|---|
| Arquitectura Hexagonal | Todos los backends y clientes con dominio no trivial. | Dominio puro; infraestructura detrás de puertos. |
| Monolito Modular | Punto de partida de productos nuevos. | Un proceso, límites de módulo estrictos, schema por contexto. |
| Microservicios | Solo cuando [ADR-0045](adrs/core/0045-criterios-extraccion-microservicios.es.md) lo habilite. | Servicio por contexto, datos propios, contratos versionados. |
| BFF | Canales con necesidades divergentes. | La lógica específica del canal vive en BFF, no en el dominio. |
| Transactional Outbox | Publicación asíncrona confiable. | No es un estándar obligatorio. ADR-0033 está `Aceptado` como catálogo del patrón: lo describe y no obliga a usarlo. |
| CQRS | Lecturas complejas o modelos divergentes. | No aplicar por defecto; requiere criterio explícito mientras ADR-0034 siga pendiente. |
| Sagas | Transacciones distribuidas con compensaciones. | Permitido solo con observabilidad, idempotencia y compensaciones documentadas; ADR-0035 pendiente. |
| ACL | Integración con legados o modelos externos. | Traduce al lenguaje del dominio; no filtra lógica externa al dominio. |

---

## 8. Integración

| Tipo | Estándar |
|---|---|
| APIs públicas o B2B | REST con OpenAPI versionado. |
| Comunicación interna remota de baja latencia | gRPC con Protobuf versionado. |
| Agregación de lectura para UI | GraphQL solo en BFF cuando la complejidad de consulta lo justifique. |
| Eventos | CloudEvents y AsyncAPI cuando el contrato asíncrono sea externo al módulo. |
| Sistemas legados | Adaptadores de infraestructura con ACL, contratos versionados y trazabilidad. |

La guía de contract testing sigue pendiente. Hasta completarla, ningún contrato externo debe considerarse completamente gobernado sin revisión del Architecture Board.

---

## 9. Seguridad y Cumplimiento

Cada producto debe cubrir:

- Autenticación federada o integración con el Sistema de Usuarios de la suite.
- Autorización RBAC/ABAC según criticidad del dominio.
- Acceso por sucursal gestionado por la autorización en la capa de aplicación (RBAC/ABAC) mediante el claim `sucursales_autorizadas`; no se implementa RLS de base de datos (ADR-0010).
- Gestión de secretos fuera de Git, ConfigMaps y artefactos estáticos.
- Auditoría inmutable para acciones de negocio relevantes.
- Clasificación y protección de datos sensibles.
- Cero CVEs High/Critical en gates de release salvo aceptación ejecutiva explícita.

---

## 10. Observabilidad, Operación y Despliegue

| Área | Línea base |
|---|---|
| Logs | JSON estructurado, correlacionado por `trace_id` o equivalente. |
| Trazas | OpenTelemetry con W3C Trace Context. |
| Métricas | RED para servicios, USE para infraestructura y métricas de negocio críticas. |
| Health | Readiness y liveness obligatorios en despliegues contenedorizados. |
| Despliegue | OCI containers; Fase 1 admite VM, App Service, Container Apps o Docker Compose; K8s desde Fase 3+. |
| Rollback | Obligatorio antes de producción. |
| DR | RTO/RPO definidos por criticidad del sistema. |

Los hubs de [Operaciones](../operations/README.md) e [Infraestructura](../infrastructure/README.md) deben evolucionar hacia runbooks, SLOs, diagramas de red y procedimientos específicos por producto.

---

## 11. Datos

Todo producto debe definir:

- Contexto propietario de cada entidad.
- Schema por contexto cuando exista persistencia relacional.
- Prohibición de joins cross-context como mecanismo de integración.
- Modelo de publicación de cambios: API, evento o batch.
- Reglas de retención, auditoría y clasificación.
- Estrategia de migración y rollback de datos.

La Data Maestra actúa como fuente de verdad para catálogos, clientes, proveedores, ubicaciones, tarifas y datos de referencia transversales.

---

## 12. Requisitos No Funcionales

Los NFRs no se infieren del stack. Deben declararse por producto y por release usando la [Matriz NFR de la Suite](matriz-nfr-suite.es.md). Como mínimo:

- Disponibilidad y continuidad.
- Rendimiento y latencia.
- Seguridad y privacidad.
- Auditabilidad.
- Observabilidad.
- Mantenibilidad.
- Escalabilidad.
- Interoperabilidad.
- Portabilidad.
- Recuperación ante desastres.

---

## 13. Gobernanza y Trazabilidad

Antes de aprobar una Baseline de Diseño, el Architecture Board debe verificar:

- El producto está ubicado dentro de la visión de suite.
- Los contextos acotados y contratos están declarados.
- Las ADRs relevantes existen y tienen estado correcto.
- Las tecnologías pertenecen a la baseline o tienen ADR de excepción.
- Los NFRs están definidos y son medibles.
- Los artefactos SDLC cumplen la cadena de trazabilidad.
- Las brechas aceptadas tienen waiver con owner, expiración y mitigación.

---

## 14. Brechas Conocidas del Corpus

Estas brechas no bloquean el uso del estándar, pero deben resolverse antes de elevar el corpus a una versión 1.0:

| Brecha | Impacto | Acción requerida |
|---|---|---|
| ADRs pendientes referenciadas por gates o índices. | Autoridad documental ambigua. | Aprobarlas, supersederlas o marcarlas como pendientes en todos los índices. |
| Guía de contract testing pendiente. | Contratos externos sin reglas CI completas. | Completar OpenAPI, Protobuf, AsyncAPI y Pact. |
| Hubs de Operaciones e Infraestructura aún preparatorios. | Runbooks y SLOs no estandarizados. | Crear estándares operativos mínimos. |
| Perfil Android incompleto. | Gobernanza móvil desigual. | Completar seguridad, pruebas, telemetría, sincronización y distribución. |
| Objetivos de producto placeholder. | Trade-offs de negocio no medibles. | Completar visión, métricas, no-objetivos y trade-offs aceptados. |

---

## 15. Documentos Relacionados

| Documento | Relación |
|---|---|
| Visión de la Suite | Fuente de alineamiento producto-arquitectura. |
| Hoja de Ruta de la Suite | Secuencia de construcción por dependencias. |
| [Línea Base Agnóstica](stack-tecnologico-autorizado-agnostico.es.md) | Estándares técnicos universales. |
| [Matriz NFR de la Suite](matriz-nfr-suite.es.md) | Requisitos no funcionales verificables. |
| [Matriz de ADRs](adrs/matriz-adr.es.md) | Estado de decisiones arquitectónicas. |
| [Mapeo SDLC-Artefactos](../governance/sdlc/mapeo-artefactos-sdlc.es.md) | Artefactos requeridos por fase. |

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-06-09
</p>
