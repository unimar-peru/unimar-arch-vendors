# GAPS.md — unimar-arch-vendors

> **Estado:** Activo | **Propietario:** Unimar S.A. | **Regla:** S-20
> **Pendientes:** 10 · **En curso:** 0 · **Cerrados:** 0 · **Total:** 10

Registro único de gaps y oportunidades de este satélite. Los contadores de arriba los recalcula el validador; no se editan a mano.

Se ordena y recalcula en cada commit, mediante el validador que provee el plugin `unimar-core`:

```bash
UNIMAR_CORE=$(ls -d "$HOME"/.claude/plugins/cache/unimar/unimar-core/*/ | sort -V | tail -1)
node "$UNIMAR_CORE/scripts/validate-gaps.mjs" --fix
```

## Orden canónico

Los **pendientes van siempre primero**. Después: criticidad, luego complejidad — para que a igual criticidad se ataque antes lo barato.

## Reglas duras

* IDs únicos con formato `G-NNN`.
* La **dimensión** debe ser una casilla de [MADUREZ.md](./MADUREZ.md): el validador las deriva de su columna `Dim.`.
* Un gap **`Cerrado` exige evidencia**: commit, PR o ADR. El validador rechaza un cierre sin respaldo.
* Cada gap declara su **`Apertura`** en formato `AAAA-MM-DD`. Sin fecha no hay antigüedad, y sin antigüedad un gap envejece invisible.
* Cada casilla de madurez con nivel < 5 necesita **al menos un gap en su dimensión**. Lo comprueba `validate-correspondencia.mjs`.

## Registro

| ID | Gap u Oportunidad | Criticidad | Complejidad | Estado | Dimensión | Evidencia | Apertura |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G-001 | Documentar los controles de seguridad local-first (ADR-0106) como guía exigible al proveedor de software. | Media | Media | Pendiente | Arq-Seguridad | — | 2026-07-24 |
| G-002 | Incluir una matriz de criterios de rendimiento (NFR) exigibles al proveedor en sus entregables. | Media | Media | Pendiente | Arq-Rendimiento | — | 2026-07-24 |
| G-003 | Documentar los requisitos de resiliencia y recuperación ante desastres (ADR-0011/0013) para el proveedor. | Media | Media | Pendiente | Arq-Confiabilidad | — | 2026-07-24 |
| G-004 | Añadir la guía operativa y de despliegue (Deployment Hub) que el proveedor debe cumplir. | Media | Media | Pendiente | Arq-Operacion | — | 2026-07-24 |
| G-005 | Documentar los estándares de código limpio y mantenibilidad (ADR-0056) exigibles al proveedor. | Media | Media | Pendiente | Arq-Mantenibilidad | — | 2026-07-24 |
| G-006 | Completar las plantillas de descubrimiento (PRD, historias de usuario, backlog) con ejemplos para el proveedor. | Media | Media | Pendiente | SDLC-Concepcion | — | 2026-07-24 |
| G-007 | Consolidar la referencia de arquitectura y los ADRs aplicables que el proveedor debe respetar en el diseño. | Media | Media | Pendiente | SDLC-Diseno | — | 2026-07-24 |
| G-008 | Documentar los gates de construcción y CI/CD (ADR-0106) exigibles en la fase de construcción del proveedor. | Media | Media | Pendiente | SDLC-Construccion | — | 2026-07-24 |
| G-009 | Definir los criterios de aceptación y la Definition of Release (ADR-0105) para la validación del entregable. | Media | Media | Pendiente | SDLC-Validacion | — | 2026-07-24 |
| G-010 | Documentar el proceso de entrega, cotización y seguimiento del proyecto con el proveedor. | Media | Media | Pendiente | SDLC-Entrega | — | 2026-07-24 |

---

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978
</p>
