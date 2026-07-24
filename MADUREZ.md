# MADUREZ.md — unimar-arch-vendors

> **Estado:** Activo | **Propietario:** Unimar S.A. | **Regla:** S-19
> **Arquitectónica:** 1.0 / 5.0 · **SDLC:** 1.0 / 5.0 · **Global:** 1.0 / 5.0 — Inicial (Ad-Hoc)

Medición de madurez de este satélite, en la escala TOGAF ACMM heredada de [unimar_arch](https://github.com/unimar-peru/unimar_arch). Se valida y repuntúa en cada commit. El validador lo provee el plugin `unimar-core`:

```bash
UNIMAR_CORE=$(ls -d "$HOME"/.claude/plugins/cache/unimar/unimar-core/*/ | sort -V | tail -1)
node "$UNIMAR_CORE/scripts/validate-madurez.mjs" --fix
node "$UNIMAR_CORE/scripts/validate-madurez.mjs" --render
```

Un nivel ≥ 2 exige evidencia enlazada. Un nivel < 5 exige declarar el camino al siguiente. Cada casilla por debajo de 5 tiene su gap en [GAPS.md](./GAPS.md), en la dimensión homónima — y eso no es una buena intención: lo comprueba `validate-correspondencia.mjs`, y falla si alguna casilla se queda sin gap.

La columna **`Dim.`** es el token con el que cada casilla se enlaza a sus gaps. De ella deriva `validate-gaps.mjs` las dimensiones válidas: añadir un pilar o una fase aquí lo reconoce el validador sin tocar código.

> **Un repositorio nuevo empieza abajo.** Un 1.0 no es un fracaso: es el punto de partida honesto. Inflarlo es exactamente lo que SD-05 prohíbe. La evidencia precede a la afirmación.

## 1. Madurez Arquitectónica — Pilares Well-Architected

| Pilar | Nivel | Evidencia | Camino al siguiente nivel | Dim. |
| :--- | ---: | :--- | :--- | :--- |
| Seguridad y Cumplimiento | 1 | — | Documentar los controles de seguridad local-first (ADR-0106) como guía para el proveedor. | `Arq-Seguridad` |
| Eficiencia de Rendimiento | 1 | — | Incluir criterios de rendimiento (matriz NFR) exigibles al proveedor. | `Arq-Rendimiento` |
| Confiabilidad y Resiliencia | 1 | — | Documentar requisitos de resiliencia/DR (ADR-0011/0013) para el proveedor. | `Arq-Confiabilidad` |
| Excelencia Operacional | 1 | — | Añadir guía operativa y de despliegue (Deployment Hub) para el proveedor. | `Arq-Operacion` |
| Mantenibilidad y Extensibilidad | 1 | — | Documentar estándares de código limpio (ADR-0056) exigibles. | `Arq-Mantenibilidad` |

## 2. Madurez SDLC — Adopción por Fase

| Fase | Nivel | Evidencia | Camino al siguiente nivel | Dim. |
| :--- | ---: | :--- | :--- | :--- |
| 1. Concepción y Descubrimiento | 1 | — | Completar plantillas de descubrimiento (PRD, US, backlog) con ejemplos. | `SDLC-Concepcion` |
| 2. Diseño y Arquitectura | 1 | — | Consolidar la referencia de arquitectura y ADRs aplicables al proveedor. | `SDLC-Diseno` |
| 3. Construcción | 1 | — | Documentar gates de construcción y CI/CD (ADR-0106) exigibles. | `SDLC-Construccion` |
| 4. Validación y QA | 1 | — | Definir criterios de aceptación y Definition of Release (ADR-0105). | `SDLC-Validacion` |
| 5. Entrega y Operaciones | 1 | — | Documentar el proceso de entrega/cotización y seguimiento de proyecto. | `SDLC-Entrega` |

---

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978
</p>
