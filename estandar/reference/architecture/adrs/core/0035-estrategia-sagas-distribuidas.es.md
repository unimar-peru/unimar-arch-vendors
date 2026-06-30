# ADR-0035: Estrategia de Sagas Distribuidas

> **Estado:** Pendiente de Importación
> **Fecha:** 2026-06-05
> **Decisores:** Architecture Board

## Contexto

En arquitecturas distribuidas, una transacción de negocio puede requerir pasos en múltiples servicios. El patrón Saga coordina los pasos mediante compensaciones cuando alguno falla.

## Decisión Pendiente

* Definir coreografía vs orquestación.
* Establecer el catálogo de compensaciones estándar.
* Definir las precondiciones operativas (observabilidad, idempotencia).

## Documentos Relacionados

| Documento | Propósito |
| --- | --- |
| [ADR-0011: Patrones de Resiliencia](./0011-patrones-resiliencia-tolerancia-fallos.es.md) | Resiliencia aplicada. |
| [ADR-0033: Transactional Outbox](./0033-patron-transactional-outbox.es.md) | Publicación atómica de eventos. |
