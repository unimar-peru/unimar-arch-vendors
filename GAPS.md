# GAPS.md — unimar-arch-vendors

> **Estado:** Activo | **Propietario:** Unimar S.A. | **Regla:** S-20
> **Pendientes:** 10 · **En curso:** 0 · **Cerrados:** 1 · **Total:** 11

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
| G-011 | El corpus documental del vendor arrastra deuda de markdownlint pre-existente. El hook lintea solo archivos staged, así que un cambio transversal (p. ej. el bump a v1.0.0) la aflora y bloquea el commit. Requiere una normalización dedicada (auto-`--fix` de MD004/MD049/MD022/MD032 y decisión de diseño para los badges `[...]()` con enlace vacío). | Media | Media | Cerrado | Arq-Mantenibilidad | **Cerrado el 2026-08-03, y la cifra que traía esta ficha estaba corta.** Medido hoy sobre todo el repositorio: **4584 violaciones**, no ~908. Pero al separarlas aparece lo que importa: **4577 están dentro de `estandar/`** —el paquete que se entrega a proveedores— y **solo 7 son propias** del repositorio: 3 MD042 (badges envueltos en enlace vacío), 3 MD022 y 1 MD041. Se saldan las 7, que es lo que bloqueaba trabajar. La decisión de diseño que esta ficha pedía se toma copiando lo que ya hace `unimar-ums`, cuyo README pasa con esta MISMA configuración: el encabezado `#` va **antes** del `<div align="center">` (resuelve MD041) y los badges van sin envolver, con enlace real solo donde lo hay (resuelve MD042). No se inventa estilo: se adopta el de la casa. **`estandar/` se deja intacto a propósito**, y no por pereza: es material publicado a terceros del que [[G-013]] declara una huella `sha256` en `procedencia.json`; reformatear 300 ficheros la invalidaría el mismo día y churnearía el paquete del proveedor a cambio de nada. Su normalización, si algún día se hace, va con una nueva declaración de procedencia. **Efecto inmediato:** el README ya puede enlazar `PROCEDENCIA.md`, que era lo que quedaba pendiente de unimar_arch#G-308. | 2026-07-24 |

---

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978
</p>
