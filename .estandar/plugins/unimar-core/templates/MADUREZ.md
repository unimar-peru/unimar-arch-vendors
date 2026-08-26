# MADUREZ.md — NOMBRE_DEL_SATELITE

<!--madurez-mide:real-->

> **Estado:** Activo | **Propietario:** Unimar S.A. | **Regla:** S-19
> **Arquitectónica:** 0.0 / 5.0 · **SDLC:** 0.0 / 5.0 · **Global:** 0.0 / 5.0 — Inicial

Medición de madurez de este satélite, en la escala TOGAF ACMM heredada de [unimar_arch](https://github.com/unimar-peru/unimar_arch). Se valida y repuntúa en cada commit. El validador lo provee el plugin `unimar-core`:

```bash
# La copia instalada la declara el cliente en installed_plugins.json: se lee
# de ahí, no del número mayor del caché, que nunca se recoge (ADR-0169 §2.6).
UNIMAR_CORE=$(node -e '
  const { resolve } = require("path");
  const registro = process.env.HOME + "/.claude/plugins/installed_plugins.json";
  let entradas = [];
  try { entradas = require(registro).plugins?.["unimar-core@unimar"] ?? []; } catch {}
  const aqui = process.cwd();
  const entrada = entradas.find((e) => e.projectPath && resolve(e.projectPath) === aqui)
    ?? entradas.find((e) => e.scope === "user")
    ?? entradas[0];
  if (!entrada?.installPath) {
    console.error("unimar-core no está instalado; ejecuta: claude plugin enable unimar-core@unimar");
    process.exit(1);
  }
  console.log(entrada.installPath);
')
node "$UNIMAR_CORE/scripts/validate-madurez.mjs" --fix
node "$UNIMAR_CORE/scripts/validate-madurez.mjs" --render
```

Un nivel ≥ 2 exige evidencia enlazada. Un nivel < 5 exige declarar el camino al siguiente. Cada casilla por debajo de 5 tiene su gap en [GAPS.md](./GAPS.md), en la dimensión homónima — y eso no es una buena intención: lo comprueba `validate-correspondencia.mjs`, y falla si alguna casilla se queda sin gap.

La columna **`Dim.`** es el token con el que cada casilla se enlaza a sus gaps. De ella deriva `validate-gaps.mjs` las dimensiones válidas: añadir un pilar o una fase aquí lo reconoce el validador sin tocar código.

**Esta tabla mide lo construido en este satélite, no a dónde quiere llegar.** Son dos métricas distintas y confundirlas ya costó una puntuación entera en el núcleo (G-169): la evidencia de una casilla no puede ser un documento que puntúe una arquitectura objetivo. El marcador `<!--madurez-mide:real-->` de arriba lo declara, y `validate-madurez.mjs` abre cada enlace de la columna Evidencia para negarse si mide otra cosa ([ADR-0179](https://github.com/unimar-peru/unimar_arch/blob/main/reference/architecture/adrs/core/0179-toda-puntuacion-de-madurez-declara-que-objeto-mide.es.md)).

> **Un repositorio nuevo empieza abajo.** Un 1.0 no es un fracaso: es el punto de partida honesto. Inflarlo es exactamente lo que SD-05 prohíbe. La evidencia precede a la afirmación.

## 1. Madurez Arquitectónica — Pilares Well-Architected

| Pilar | Nivel | Evidencia | Camino al siguiente nivel | Dim. |
| :--- | ---: | :--- | :--- | :--- |
| Seguridad y Cumplimiento | 1 | — | DECLARAR_EL_CAMINO | `Arq-Seguridad` |
| Eficiencia de Rendimiento | 1 | — | DECLARAR_EL_CAMINO | `Arq-Rendimiento` |
| Confiabilidad y Resiliencia | 1 | — | DECLARAR_EL_CAMINO | `Arq-Confiabilidad` |
| Excelencia Operacional | 1 | — | DECLARAR_EL_CAMINO | `Arq-Operacion` |
| Mantenibilidad y Extensibilidad | 1 | — | DECLARAR_EL_CAMINO | `Arq-Mantenibilidad` |

## 2. Madurez SDLC — Adopción por Fase

| Fase | Nivel | Evidencia | Camino al siguiente nivel | Dim. |
| :--- | ---: | :--- | :--- | :--- |
| 1. Concepción y Descubrimiento | 1 | — | DECLARAR_EL_CAMINO | `SDLC-Concepcion` |
| 2. Diseño y Arquitectura | 1 | — | DECLARAR_EL_CAMINO | `SDLC-Diseno` |
| 3. Construcción | 1 | — | DECLARAR_EL_CAMINO | `SDLC-Construccion` |
| 4. Validación y QA | 1 | — | DECLARAR_EL_CAMINO | `SDLC-Validacion` |
| 5. Entrega y Operaciones | 1 | — | DECLARAR_EL_CAMINO | `SDLC-Entrega` |

---

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978
</p>
