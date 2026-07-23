# ADR-0033: Patrón Transactional Outbox — catálogo del patrón

> **Estado:** Aceptado
> **Fecha:** 2026-06-05
> **Decisores:** Architecture Board

## Contexto

Cuando un servicio debe publicar un evento de dominio de forma confiable, la atomicidad entre el commit de la transacción y la publicación del evento puede garantizarse registrando el evento en una tabla de salida dentro de la misma transacción, que un worker posterior entrega al bus.

## Decisión

Este ADR **cataloga** el patrón Transactional Outbox: describe sus garantías y sus condiciones de aplicación. **No obliga a usarlo en ninguna frontera**; es un patrón disponible que un producto adopta cuando su diseño lo justifica. El detalle de implementación (esquema de la tabla, idempotencia, retry, observabilidad) reside en el estándar vigente y se aplica solo si el patrón se adopta.

## Documentos Relacionados

| Documento | Propósito |
| --- | --- |
| [ADR-0015: Event-Driven Architecture](./0015-arquitectura-eventos-intradominio.es.md) | Línea base de eventos de dominio. |
| [ADR-0011: Patrones de Resiliencia](./0011-patrones-resiliencia-tolerancia-fallos.es.md) | Estrategias de retry y backoff. |
