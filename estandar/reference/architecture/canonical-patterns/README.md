# Patrones Canónicos

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Patrones%20Can%C3%B3nicos-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Activo-27ae60?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-0.1.0-042139?style=flat-square" alt="Versión">
</p>

**← [Inicio](../../../README.md) / [Arquitectura](../README.md) / Patrones Canónicos**

Patrones de implementación scoped a un runtime declarado en Unimar Arch.

## ¿Qué es un Patrón Canónico?

Un **Patrón Canónico** es una solución de implementación reutilizable, aprobada por el Architecture Board, que resuelve un problema técnico recurrente (propagación de contexto, logging seguro, control de errores, sincronización offline) para un runtime específico (.NET, Node.js, Android).

A diferencia de un ADR (que documenta *por qué* se tomó una decisión), un Patrón Canónico documenta *cómo* se implementa esa decisión en código: incluye diseño, ejemplos de implementación, reglas de uso y advertencias de anti-patrones.

## ¿Por qué usarlos?

- **Estandarizan** soluciones a problemas transversales que todo equipo enfrenta
- **Evitan** que cada equipo reinvente o implemente de forma distinta la misma funcionalidad
- **Garantizan** que todas las implementaciones cumplan con las políticas de seguridad, observabilidad y calidad
- **Acelerán** el desarrollo proporcionando código de referencia listo para adoptar

## Numeración

Los patrones están numerados secuencialmente (CP-01, CP-02...) sin importar el runtime. Cada uno incluye el problema que resuelve, el diseño, código de implementación y reglas de uso.

## ¿Dónde se mencionan?

Los Patrones Canónicos son referenciados desde los siguientes documentos del corpus:

| Documento | Referencia |
| :-------- | :--------- |
| [Estándar Arquitectónico Corporativo](../estandar-arquitectonico-suite-unimar.es.md) | Los define como implementaciones reutilizables por runtime en la jerarquía de autoridad (N6). |
| [Glosario](../../governance/glosario.md) | Define "Patrón Canónico" como CP-01 a CP-12 en el vocabulario controlado. |
| [MASTER_INDEX](../../navigation/MASTER_INDEX.md) | Los cataloga por runtime en Fase 2 (Diseño) y Fase 3 (Construcción). |
| [Mapeo SDLC–Artefactos](../../governance/sdlc/mapeo-artefactos-sdlc.es.md) | Los incluye como artefacto opcional en las fases de diseño y construcción. |
| [Flujo de Arquitectura de Observabilidad](../flujo-arquitectura-observabilidad.es.md) | Enlaza CP-01, CP-02, CP-04 como implementación del flujo de observabilidad en .NET. |
| [Stack Tecnológico .NET](../stack-tecnologico-autorizado-dotnet.es.md) | Referencia los patrones .NET como guía de implementation. |
| [Stack Tecnológico Node.js](../stack-tecnologico-autorizado-nodejs.es.md) | Referencia los patrones Node.js como guía de implementación. |
| [Stack Tecnológico Android](../stack-tecnologico-autorizado-android.es.md) | Referencia los patrones Android como guía de implementación. |
| [Índice Fase 2](../../navigation/indices/fase-2-diseno-arquitectura.md) | Los lista como opcionales al adoptar patrones de referencia. |
| [Índice Fase 3](../../navigation/indices/fase-3-construccion.md) | Los referencia como implementaciones runtime-specific. |
| [Guías de inicio](../../getting-started/README.md) | Recomendados en las listas de lectura por rol (desarrollador .NET, Node.js, Android). |

## ¿Dónde se encuentran?

```
reference/architecture/canonical-patterns/
├── README.md              ← Este índice general
├── dotnet/                ← Patrones .NET (CP-01 a CP-04)
│   ├── README.md
│   ├── cp-01-*.es.md
│   ├── cp-02-*.es.md
│   ├── cp-03-*.es.md
│   └── cp-04-*.es.md
├── nodejs/                ← Patrones Node.js (CP-05 a CP-08)
│   ├── README.md
│   ├── cp-05-*.es.md
│   ├── cp-06-*.es.md
│   ├── cp-07-*.es.md
│   └── cp-08-*.es.md
└── android/               ← Patrones Android (CP-09 a CP-12)
    ├── README.md
    ├── cp-09-*.es.md
    ├── cp-10-*.es.md
    ├── cp-11-*.es.md
    └── cp-12-*.es.md
```

Cada directorio de runtime tiene su propio README con el índice de patrones y su estado (Aceptado o Pendiente).

---

## Bibliotecas de Referencia por Runtime

Además de los patrones canónicos, existen bibliotecas de código abierto que implementan soluciones reutilizables para los runtimes declarados. Estas bibliotecas no reemplazan los patrones canónicos — los complementan — y son mantenidas por organizaciones externas al Architecture Board.

### Librerías Comunes Recomendadas (.NET)

> Repositorio: [github.com/orgs/beyondnetcode/repositories?q=Shell](https://github.com/orgs/beyondnetcode/repositories?q=Shell)  
> Propósito: Librerías .NET modulares para bootstrapping, AOP, Factory Pattern y DDD.

| Librería | ¿Qué hace? | ¿Por qué usarla? | ¿Cuándo usarla? | ¿Dónde se aplica? |
| :------- | :--------- | :---------------- | :--------------- | :---------------- |
| [Shell.Factory](https://github.com/beyondnetcode/Shell.Factory) | Factory pattern configurable con DI, interceptores y creación type-safe. | Evita escribir fábricas manuales; centraliza la creación de objetos con validación y logging. | Cuando un servicio necesita crear múltiples implementaciones de una interfaz según configuración. | Capa de infraestructura — creación de handlers, repositorios, adaptadores. |
| [Shell.Bootstrapper](https://github.com/beyondnetcode/Shell.Bootstrapper) | Orquestación de startup asíncrona con DI, AutoMapper y observabilidad. | Reemplaza el `Program.cs` monolítico por una secuencia de pasos declarativa y testeable. | Toda aplicación .NET que requiera un startup modular con telemetría. | Capa de aplicación — pipeline de inicio. |
| [Shell.Aop](https://github.com/beyondnetcode/Shell.Aop) | AOP con DispatchProxy: logging, retries, caching, aspectos reutilizables. | Centraliza cross-cutting concerns sin modificar la lógica de negocio. | Cuando se necesita logging, reintentos o caché en múltiples puntos sin código repetitivo. | Capa de aplicación — decoradores de casos de uso, handlers CQRS. |
| [Shell.ddd](https://github.com/beyondnetcode/Shell.ddd) | DDD: entidades, aggregate roots, value objects, domain events, reglas de negocio. | Proporciona la infraestructura DDD base sin que cada equipo la reinvente. | Todo proyecto .NET que adopte Domain-Driven Design. | Capa de dominio — entidades, agregados, eventos. |

### NESTJS Latam — Node.js

> Repositorio: [github.com/nestjslatam](https://github.com/nestjslatam)  
> Propósito: Librerías y ejemplos de referencia para el ecosistema NestJS en español.

| Librería | ¿Qué hace? | ¿Por qué usarla? | ¿Cuándo usarla? | ¿Dónde se aplica? |
| :------- | :--------- | :---------------- | :--------------- | :---------------- |
| [ddd](https://github.com/nestjslatam/ddd) | DDD para NestJS: entidades, value objects, aggregate roots, domain events. | Aplica DDD con decoradores y módulos NestJS sin configuración manual. | Todo proyecto NestJS que adopte Domain-Driven Design. | Capa de dominio — módulos DDD con integración NestJS. |
| [ddd-valueobjects](https://github.com/nestjslatam/ddd-valueobjects) | Extensiones de Value Objects para la librería DDD. | Provee VO predefinidos (Email, Phone, RUC, DNI, etc.) listos para usar. | Cuando se necesitan value objects tipados con validación incorporada. | Capa de dominio — value objects reutilizables. |

### Referencias No Normativas

| Repositorio | ¿Qué es? | ¿Por qué consultarlo? | ¿Cuándo usarlo? |
| :---------- | :------- | :-------------------- | :--------------- |
| [Evolith Arch](https://github.com/beyondnetcode/evolith_arch32) | Repositorio de arquitectura de software que inspiró Unimar Arch. Define estándares, ADRs, patrones y gobernanza para un ecosistema de productos satélite. | Es la fuente original de los conceptos de baseline agnóstica, taxonomía de repositorio y topología C4 que Unimar Arch hereda y adapta. | Como material de consulta opcional para entender el origen de patrones o decisiones arquitectónicas. No es normativo para Unimar. |

---

## .NET / C&#35;

<details>
<summary><strong>4 patrones: contexto request, logging PII-safe, health checks, AOP logging</strong></summary>

| Patrón | Propósito |
| :----- | :-------- |
| [CP-01: Request Scope Context Propagation](dotnet/cp-01-propagacion-contexto-scope-request.es.md) | Propagación de contexto en el scope de request |
| [CP-02: PII-Safe Serilog Logging](dotnet/cp-02-logging-serilog-seguro-pii.es.md) | Pipeline de logging seguro para datos PII |
| CP-03: Health Checks y Readiness Probes *(pendiente de documentación)* | Implementación de endpoints de health check y readiness para Kubernetes/contenedores |
| [CP-04: AOP Logging Decorator](dotnet/cp-04-decorador-logging-aop.es.md) | Decorador de logging mediante programación orientada a aspectos |

</details>

## Node.js / TypeScript

<details>
<summary><strong>4 patrones: contexto CLS, logging Pino, health checks, Result pattern</strong></summary>

| Patrón | Propósito |
| :----- | :-------- |
| [CP-05: Propagación del Contexto con CLS](nodejs/cp-05-propagacion-contexto-cls.es.md) | Propagación de CorrelationId y trazas vía `AsyncLocalStorage`/CLS en NestJS |
| [CP-06: Logging PII-Safe con Pino](nodejs/cp-06-logging-pino-seguro-pii.es.md) | Pipeline de logging seguro para datos PII con Pino y redactores |
| CP-07: Health Checks y Readiness en NestJS *(pendiente de documentación)* | Endpoints de health check y readiness para contenedores/K8s |
| [CP-08: Result Pattern con neverthrow](nodejs/cp-08-result-pattern-neverthrow.es.md) | Control de errores funcional sin excepciones mediante `Result<T, E>` |

</details>

## Android / Kotlin

<details>
<summary><strong>4 patrones: offline-first, tokens seguros, manejo de errores, data fetching</strong></summary>

| Patrón | Propósito |
| :----- | :-------- |
| [CP-09: Repositorio Offline-First con Room](android/cp-09-repositorio-offline-first-room.es.md) | Sincronización offline con Room como fuente de verdad local |
| [CP-10: Almacenamiento Seguro de Tokens](android/cp-10-almacenamiento-seguro-tokens.es.md) | Gestión de tokens JWT con EncryptedSharedPreferences y Android Keystore |
| CP-11: Manejo de Errores con Result Sealed Class *(pendiente de documentación)* | Patrón monolítico para errores de red/BD/dominio en capa de datos |
| CP-12: Data Fetching Resiliente con Connectivity-Aware Repository *(pendiente de documentación)* | Estrategia cache-first con fallback offline y cola de reintentos |

</details>

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-06-08
</p>
