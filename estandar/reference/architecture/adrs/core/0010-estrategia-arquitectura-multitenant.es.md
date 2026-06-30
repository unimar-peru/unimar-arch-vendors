# [ADR-0010](0010-estrategia-arquitectura-multitenant.es.md): Sucursal como Dimensión de Negocio y Contexto de Autorización

## Estado
Aprobado (revisado: 2026-06-08 — modelo de aislamiento multi-tenant desestimado)

## Fecha
2026-05-08 (revisión fundamental: 2026-06-08)

## Contexto

UNIMAR opera desde múltiples sucursales y locales (depósitos, patios, almacenes). Inicialmente se modeló la sucursal como un *tenant* con aislamiento técnico de doble capa (filtros de aplicación + Row-Level Security de base de datos), bloqueando el acceso de una sucursal a los datos de otra.

Esta decisión resultó incorrecta para el modelo de negocio real de UNIMAR:

* Un contenedor puede **transferirse físicamente de Paita a Callao**. Un operador de Callao necesita ver el historial completo de ese contenedor, incluyendo sus datos de origen en Paita.
* Un supervisor de operaciones puede tener **autorización sobre múltiples sucursales** simultáneamente.
* La **data maestra** (clientes, tarifas, contratos, catálogos arancelarios) es corporativa y no tiene sucursal propietaria.
* Un gerente regional puede consolidar **reportes cross-sucursal** como operación de negocio legítima.

El aislamiento técnico estricto (modelo multi-tenant) **impide operaciones de negocio válidas** y contradice la naturaleza de UNIMAR como empresa única con operaciones distribuidas. El acceso a datos de otras sucursales no es una violación de seguridad: es una operación controlada por autorización.

## Decisión

Desestimar el modelo de aislamiento multi-tenant. Adoptar **Sucursal como Dimensión de Negocio** con control de acceso contextual gestionado por el sistema de autorización RBAC/ABAC ([ADR-0012](../nodejs/0012-autorizacion-avanzada-rbac-abac.es.md)).

### 1. Sucursal como atributo de dato

`sucursal_id` es un **atributo de negocio** en las entidades operativas (contenedor, manifiesto, despacho, inventario). Identifica dónde ocurrió o pertenece la operación. No es un discriminador de tenant.

* Toda entidad operativa DEBE registrar `sucursal_id` como parte de su estado de negocio.
* La data maestra corporativa (clientes, tarifas, contratos, aranceles) NO lleva `sucursal_id` — es global a UNIMAR.
* Las transferencias entre sucursales son operaciones de negocio que actualizan `sucursal_id` y registran el evento en la pista de auditoría.

### 2. Autorización contextual por sucursal

El acceso a los datos de una sucursal se controla mediante el sistema de autorización, no mediante barreras técnicas de datos:

* El JWT del operador incluye el claim `sucursales_autorizadas: [string[]]` — lista de sucursales a las que tiene acceso.
* Los casos de uso aplican la validación de autorización: si el operador no tiene `sucursal_id_destino` en su claim, la operación es rechazada con error `403 Forbidden`.
* Un operador con autorización sobre múltiples sucursales **puede consultar y operar sobre todas ellas** sin restricción técnica.
* Los permisos de sucursal son gestionados por el módulo de gestión de usuarios — se otorgan, revocan y auditan como cualquier otro permiso del sistema.

### 3. Supresión de Row-Level Security (RLS)

PostgreSQL RLS y SQL Server RLS **no se implementan** como mecanismo de aislamiento de sucursal. Razones:

* RLS impone aislamiento estricto que impide operaciones cross-sucursal legítimas.
* La autorización ya se verifica en la capa de aplicación mediante RBAC/ABAC.
* RLS añade complejidad operacional (políticas por tabla, contexto de sesión) sin beneficio de seguridad incremental dado que la validación existe en la capa correcta.

La validación de autorización en la capa de aplicación es el único mecanismo de control de acceso por sucursal.

### 4. Filtrado operacional por defecto (usabilidad, no seguridad)

Los adaptadores de repositorio PUEDEN aplicar un filtro `sucursal_id = :contextoActual` como **comportamiento por defecto de usabilidad**: el operador ve los datos de su sucursal habitual sin tener que especificarla en cada consulta. Este filtro:

* Es **anulable explícitamente** por casos de uso que requieren visibilidad cross-sucursal.
* No es un mecanismo de seguridad — no previene el acceso a otras sucursales autorizadas.
* Se documenta en la Historia Técnica del caso de uso que lo anula.

## Consecuencias

### Positivas

* **Operaciones de negocio sin fricción**: transferencias, consolidaciones y reportes cross-sucursal son ciudadanos de primera clase.
* **Autorización centralizada**: un único punto de control en RBAC/ABAC ([ADR-0012](../nodejs/0012-autorizacion-avanzada-rbac-abac.es.md)) gobierna el acceso. Sin políticas RLS dispersas por tablas.
* **Trazabilidad operativa**: `sucursal_id` en cada entidad permite reportería, auditoría y análisis por sucursal sin imponer barreras de acceso.
* **Modelo mental correcto para el equipo**: el desarrollador piensa en "¿está el usuario autorizado para esta sucursal?" en lugar de "¿cómo evito que vea datos de otra sucursal?".

### Negativas / Riesgos asumidos

* **Sin failsafe de base de datos**: si la capa de autorización falla, no hay segunda línea de defensa técnica. Mitigación: cobertura de pruebas sobre los casos de uso de autorización cross-sucursal (ADR-0018, ADR-0052), revisión de código en PR de casos de uso que anulan el filtro por defecto.
* **Consultas sin filtro accidentales**: un desarrollador que omita el filtro y no tenga el caso de uso cubierto por tests puede devolver datos de todas las sucursales. Mitigación: el filtro por defecto en el repositorio base actúa como guardia de usabilidad; los tests de integración validan el comportamiento correcto.

## Referencias

* [ADR-0012: Autorización Avanzada RBAC/ABAC](../nodejs/0012-autorizacion-avanzada-rbac-abac.es.md) — sistema de autorización que gobierna el acceso por sucursal.
* [ADR-0031: Esquema por Contexto](0031-esquema-por-contexto-catalogo-eventos-dominio.es.md) — los bounded contexts tienen sus propios schemas; `sucursal_id` es un atributo transversal dentro de cada schema.
* [ADR-0016: Pista de Auditoría Inmutable](0016-pista-auditoria-inmutable-negocio.es.md) — las transferencias entre sucursales se registran en auditoría con `sucursal_origen` y `sucursal_destino`.

---
[Volver al Índice](../README.md)
