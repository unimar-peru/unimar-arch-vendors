# Guía de Herencia del Repositorio Hijo (Adaptación Local)

> **Estado:** Estándar local de herencia de repositorio

Este documento establece cómo Unimar Arch gestiona la herencia de patrones arquitectónicos mediante cuatro operaciones (Adoptar / Extender / Sobrescribir / N/A) como una **convención de registro** para anotar qué patrones corporativos se aplican, adaptan o descartan.


## 1. Las Cuatro Operaciones Locales de Herencia

| Operación | Significado | Cuándo usarla |
| :--- | :--- | :--- |
| **Adopt** | Unimar Arch sigue el patrón de referencia tal cual. Sin copia local. | El patrón aplica a Unimar sin divergencia. |
| **Extend** | Unimar Arch construye sobre el patrón de referencia con adiciones locales. El ADR local referencia `Extends: ADR-NNNN`. | El patrón es correcto en principio pero insuficientemente especificado para Unimar. |
| **Override** | Unimar Arch diverge del patrón de referencia. El ADR local referencia `Overrides: ADR-NNNN` e incluye `Divergence Justification`. | El contexto de Unimar hace que la decisión de referencia no aplique. |
| **N/A** | El patrón no aplica a Unimar. Solo se registra en `DECISIONS.md`. | El patrón es irrelevante al contexto de Unimar. |

## 2. Convención de Triage

Cada patrón que Unimar considere registrar va en [`../../../DECISIONS.md`](../../../../DECISIONS.md) con la operación elegida. El triage es registro local. Unimar es libre de cambiar, ignorar o revisitar cualquier entrada en cualquier momento.

## 3. Formato Local de ADR

Los ADRs locales en Unimar Arch siguen el formato estándar corporativo, con dos campos adicionales en la cabecera:

### Ejemplo de Cabecera — Extensión

```markdown
# ADR-0001 — Topología de Event Bus específica de Unimar

> **Status:** Accepted
> **Date:** 2026-06-XX
> **Extends:** ADR-0015 — Event-Driven Architecture Intra-Domain

## Context

El ADR de referencia establece el patrón injectable event bus. Este ADR local especifica la topología RabbitMQ concreta de Unimar para el dominio de pagos, no cubierta por la decisión de referencia.

## Decision

[...]

## Consequences
[...]
```

### Ejemplo de Cabecera — Override

```markdown
# ADR-0002 — AWS ALB como Edge Proxy (Override)

> **Status:** Accepted
> **Date:** 2026-06-XX
> **Overrides:** ADR-0030 — API Gateway: Ingress vs NestJS

## Divergence Justification

Unimar opera en un entorno gestionado por AWS donde el equipo de plataforma exige ALB como único punto de ingress. Operar un Ingress auto-hospedado junto a ALB introduce capas de ruteo redundantes y terminación TLS conflictiva.

## Decision

[...]

## Consequences
[...]
```

## 4. Límites

