# ADR-0037: Estrategia de Performance, Concurrencia y Chaos

> **Estado:** Pendiente de Importación
> **Fecha:** 2026-06-05
> **Decisores:** Architecture Board

## Contexto

La resiliencia operativa se valida inyectando carga, fallas y concurrencia en condiciones controladas. La estrategia K6 + Pact + Chaos garantiza que la arquitectura no degrada silenciosamente.

## Decisión Pendiente

* Catálogo de escenarios K6 (carga, estrés, spike, soak).
* Política de Pact JS (provider, consumer, versionado).
* Plan de Chaos Engineering (qué fallas, qué blast radius, qué cadence).

## Documentos Relacionados

| Documento | Propósito |
| --- | --- |
| [ADR-0018: Pirámide de Testing](./0018-piramide-pruebas-gates-calidad.es.md) | Distribución de tipos de prueba. |
| [ADR-0011: Patrones de Resiliencia](./0011-patrones-resiliencia-tolerancia-fallos.es.md) | Circuit breakers. |
