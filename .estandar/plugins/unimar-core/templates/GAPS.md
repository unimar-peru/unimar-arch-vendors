# GAPS.md — NOMBRE_DEL_SATELITE

> **Estado:** Activo | **Propietario:** Unimar S.A. | **Regla:** S-20
> **Pendientes:** 0 · **En curso:** 0 · **Cerrados:** 0 · **Total:** 0

Registro único de gaps y oportunidades de este satélite. Los contadores de arriba los recalcula el validador; no se editan a mano.

Se ordena y recalcula en cada commit, mediante el validador que provee el plugin `unimar-core`:

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
node "$UNIMAR_CORE/scripts/validate-gaps.mjs" --fix
```

## Orden canónico

Los **pendientes van siempre primero**. Después: criticidad, luego complejidad — para que a igual criticidad se ataque antes lo barato.

## Reglas duras

- IDs únicos con formato `G-NNN`.
- La **dimensión** debe ser una casilla de [MADUREZ.md](./MADUREZ.md): el validador las deriva de su columna `Dim.`.
- Un gap **`Cerrado` exige evidencia**: commit, PR o ADR. El validador rechaza un cierre sin respaldo.
- Cada gap declara su **`Apertura`** en formato `AAAA-MM-DD`. Sin fecha no hay antigüedad, y sin antigüedad un gap envejece invisible.
- Cada casilla de madurez con nivel < 5 necesita **al menos un gap en su dimensión**. Lo comprueba `validate-correspondencia.mjs`.

## Registro

> **Plantilla.** Las diez filas de abajo son el mínimo que exige la correspondencia con `MADUREZ.md`: una por dimensión. Sustituya `DESCRIBIR_EL_GAP` por el camino real al siguiente nivel, y `FECHA_DE_HOY` por la fecha en formato `AAAA-MM-DD`. El validador falla mientras queden marcadores: un registro que no se ha llenado no debe pasar por lleno.

| ID | Gap u Oportunidad | Criticidad | Complejidad | Estado | Dimensión | Evidencia | Apertura |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| G-001 | DESCRIBIR_EL_GAP | Media | Media | Pendiente | Arq-Seguridad | — | FECHA_DE_HOY |
| G-002 | DESCRIBIR_EL_GAP | Media | Media | Pendiente | Arq-Rendimiento | — | FECHA_DE_HOY |
| G-003 | DESCRIBIR_EL_GAP | Media | Media | Pendiente | Arq-Confiabilidad | — | FECHA_DE_HOY |
| G-004 | DESCRIBIR_EL_GAP | Media | Media | Pendiente | Arq-Operacion | — | FECHA_DE_HOY |
| G-005 | DESCRIBIR_EL_GAP | Media | Media | Pendiente | Arq-Mantenibilidad | — | FECHA_DE_HOY |
| G-006 | DESCRIBIR_EL_GAP | Media | Media | Pendiente | SDLC-Concepcion | — | FECHA_DE_HOY |
| G-007 | DESCRIBIR_EL_GAP | Media | Media | Pendiente | SDLC-Diseno | — | FECHA_DE_HOY |
| G-008 | DESCRIBIR_EL_GAP | Media | Media | Pendiente | SDLC-Construccion | — | FECHA_DE_HOY |
| G-009 | DESCRIBIR_EL_GAP | Media | Media | Pendiente | SDLC-Validacion | — | FECHA_DE_HOY |
| G-010 | DESCRIBIR_EL_GAP | Media | Media | Pendiente | SDLC-Entrega | — | FECHA_DE_HOY |

---

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978
</p>
