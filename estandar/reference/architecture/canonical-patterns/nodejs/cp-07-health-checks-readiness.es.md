# CP-07: Health Checks y Readiness en NestJS

**Tipo:** Patrón Canónico — Node.js (TypeScript)  
**Estado:** Pendiente

> Este patrón está pendiente de documentación. Se implementará siguiendo el módulo `@nestjs/terminus` con checks de base de datos, caché, API externas y endpoints de liveness/readiness.

## Problema

Las aplicaciones NestJS en contenedores/K8s necesitan exponer endpoints de health check estandarizados. Sin un patrón común, cada equipo implementa checks ad-hoc con distinto formato y cobertura.

## Patrón (por definir)

*Health Checks con NestJS Terminus + checks personalizados para caché, BD y dependencias externas.*

## ADRs Relacionados

- ADR-0064 (Observabilidad Node.js)
- ADR-0041 (Observabilidad)

## Pendiente

- [ ] Definir endpoints `/health`, `/ready`, `/startup` con Terminus
- [ ] Implementar checks de BD, Redis y dependencias externas
- [ ] Integrar con Pino logging y métricas
