# [ADR 0025](0025-abstraccion-proveedor-feature-flags.es.md): Estrategia de Abstracción de Proveedor de Feature Flags

## Estado
Aprobado

## Fecha
2026-05-09

## Contexto
Incorporar Feature Flags introduce riesgos de bloqueo de proveedor. Codificar rígidamente la lógica del SDK directamente desde plataformas propietarias (Unleash, ConfigCat, LaunchDarkly) viola principios core al incrustar comportamientos no estándar directamente dentro de los casos de uso de negocio. Requerimos intercambiabilidad total de proveedores en caliente.

## Decisión
Subsumir la invocación de selectores de características (feature toggles) bajo los principios clásicos de Puerto Hexagonal:

1. **Puerto Canónico**: El repositorio central define `IFeatureFlagPort`, detallando contratos de ejecución universales (`evaluate()`, `isHealthy()`) enteramente aislados de la sintaxis de librerías comerciales.
2. **Infraestructura Enchufable**: Confinar todos los SDKs concretos de terceros en capas de Adaptador externas explícitas. Soportamos estrategias de respaldo internas de Postgres junto con módulos nativos de LaunchDarkly, ConfigCat o Azure simultáneamente.
3. **Resolución Dinámica**: Instanciar el adaptador del proveedor correcto vía inyectores de dependencia NestJS en tiempo de ejecución que miren claves de configuración activas específicas.

## Consecuencias

### Positivas
- Inmunidad completa a picos de precios externos o problemas de estabilidad de la plataforma (respaldo local inmediato).
- Alta compatibilidad futura con respecto a la eventual estandarización en los esquemas openFeature de la CNCF.

### Negativas
- Costo de mantenimiento asociado al sostenimiento de múltiples clases de adaptadores especializados orientados a diversos formatos de proveedores.

> **Nota:** Este ADR describe la **abstracción hexagonal**. La especificación completa de implementación (contratos, adaptadores, despliegue) se consolida en ADR 0060.

## Referencias
- ADR 0060: Feature Flags — Gestión Centralizada en UMS (especificación autoritativa)
- [ADR 0024: Plataforma de Configuración](0024-plataforma-gestion-configuracion-features.es.md)
- [ADR 0002: Arquitectura Hexagonal](../nodejs/0002-arquitectura-limpia-nestjs.es.md)

---
[Volver al Índice](../README.md)
