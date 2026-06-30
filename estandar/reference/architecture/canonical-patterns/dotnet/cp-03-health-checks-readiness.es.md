# CP-03: Health Checks y Readiness Probes

**Tipo:** Patrón Canónico — .NET (C#)  
**Estado:** Pendiente

> Este patrón está pendiente de documentación. Se implementará siguiendo el estándar de health checks de ASP.NET Core con endpoints de liveness, readiness y startup para entornos Kubernetes/contenedores.

## Problema

Las aplicaciones en contenedores/K8s necesitan exponer endpoints de health check que permitan al orquestador determinar cuándo un servicio está vivo, listo para recibir tráfico y capaz de manejar solicitudes. Sin una implementación estándar, cada equipo expone endpoints inconsistentes.

## Patrón (por definir)

*Health Checks y Readiness Probes con ASP.NET Core Health Checks middleware + publicadores de métricas.*

## ADRs Relacionados

- ADR-0041 (Observabilidad)

## Pendiente

- [ ] Definir endpoints `/health`, `/ready`, `/startup`
- [ ] Integrar con Serilog y métricas de observabilidad
- [ ] Documentar configuración de probes en K8s
