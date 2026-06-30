# ADR-0033: Patrón Transactional Outbox

> **Estado:** Pendiente de Importación
> **Fecha:** 2026-06-05
> **Decisores:** Architecture Board

## Contexto

Cuando un servicio debe publicar un evento de dominio de forma confiable, la atomicidad entre el commit de la transacción y la publicación del evento debe garantizarse. El patrón Transactional Outbox resuelve esta necesidad registrando el evento en una tabla de salida dentro de la misma transacción, y un worker posterior lo entrega al bus.

## Decisión Pendiente

El detalle (esquema de la tabla outbox, idempotencia, retry, observabilidad) se consolidará en el corpus local cuando se concrete la primera necesidad asíncrona en UMS.

## Documentos Relacionados

| Documento | Propósito |
| --- | --- |
| [ADR-0015: Event-Driven Architecture](./0015-arquitectura-eventos-intradominio.es.md) | Línea base de eventos de dominio. |
| [ADR-0011: Patrones de Resiliencia](./0011-patrones-resiliencia-tolerancia-fallos.es.md) | Estrategias de retry y backoff. |
