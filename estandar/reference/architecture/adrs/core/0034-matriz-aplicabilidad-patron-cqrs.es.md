# ADR-0034: Matriz de Aplicabilidad del Patrón CQRS

> **Estado:** Pendiente de Importación
> **Fecha:** 2026-06-05
> **Decisores:** Architecture Board

## Contexto

CQRS (Command Query Responsibility Segregation) separa los modelos de escritura y lectura. No siempre es apropiado aplicarlo; una matriz de aplicabilidad evita la sobre-ingeniería.

## Decisión Pendiente

* Definir la matriz de aplicabilidad (cuándo SÍ, cuándo NO).
* Documentar las señales que indican su necesidad.
* Vincular con la Estrategia de Proyecciones del ADR-0022.

## Documentos Relacionados

| Documento | Propósito |
| --- | --- |
| [ADR-0022: Proyecciones Enchufables](../nodejs/0022-auth-contextual-proyecciones-plugables.es.md) | Proyecciones específicas por contexto. |
