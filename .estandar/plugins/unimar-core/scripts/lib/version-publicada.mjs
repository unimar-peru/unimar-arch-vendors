/**
 * version-publicada.mjs — cual es la version del estandar que hay publicada, y
 * como se decide la relacion de un satelite con ella.
 *
 * Se extrae de `check-upstream.mjs` por una razon concreta: ese script hace red,
 * y lo que hace red no se prueba. G-359 nacio de una linea --ordenar todas las
 * etiquetas y devolver la mayor-- que nadie pudo comprobar nunca, y que
 * respondia `5.2.0` mientras el marketplace publicaba la linea `1.x`. Aqui
 * dentro no hay `fetch`: quien llama inyecta como leer, y por eso este juicio
 * SI se puede probar.
 *
 * La identidad del estandar es `plugin.json` **y** su etiqueta, en el mismo
 * commit (ADR-0158 §2.1). Ni el campo solo ni la etiqueta sola: si divergen,
 * eso ES el hallazgo y se reporta. Elegir en silencio --el maximo, el mas
 * reciente, el que sea-- es exactamente como nacio el defecto.
 */

/* SemVer minimo pero real: comparar como cadenas miente, «0.9.0» saldria mayor
 * que «0.10.0». Un prerelease es menor que su version final. */
export function parseSemver(s) {
  const m = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/.exec(String(s).trim());
  if (!m) return null;
  return { major: +m[1], minor: +m[2], patch: +m[3], pre: m[4] ?? null, raw: String(s).trim() };
}

export function compararSemver(a, b) {
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  if (a.patch !== b.patch) return a.patch - b.patch;
  if (a.pre && !b.pre) return -1;
  if (!a.pre && b.pre) return 1;
  return 0;
}

/**
 * La version publicada, leida del contrato y no adivinada del conjunto.
 *
 * @param leerPluginJson  () => string|null — el `plugin.json` de `main` del marketplace.
 * @param existeTag       (tag) => boolean  — si la etiqueta existe en el remoto.
 * @param avisar          (mensaje) => void — canal de avisos; no lanza.
 * @returns {major,minor,patch,raw,tag,etiquetada} o null si no se pudo leer.
 */
export async function versionPublicada({ leerPluginJson, existeTag, avisar, prefijoTag = 'unimar-core-' }) {
  const crudo = await leerPluginJson();
  if (crudo == null) return null;

  let declarada;
  try { declarada = JSON.parse(String(crudo)).version; }
  catch { avisar('el `plugin.json` del marketplace no es JSON legible'); return null; }

  const sv = parseSemver(String(declarada ?? ''));
  if (!sv) { avisar(`\`plugin.json\` declara «${declarada}», que no es un SemVer`); return null; }

  const tag = `${prefijoTag}${sv.raw}`;
  const etiquetada = Boolean(await existeTag(tag));
  if (!etiquetada) {
    avisar(
      `el marketplace declara \`${sv.raw}\` en plugin.json y no existe la etiqueta \`${tag}\`. ` +
      'La identidad son las dos cosas (ADR-0158 §2.1): lo publicado no es citable.',
    );
  }
  return { ...sv, tag, etiquetada };
}

/**
 * Como esta el `STANDARD_REF` del satelite respecto a lo publicado.
 *
 * Tres veredictos, no dos. «Atrasado» solo significa algo DENTRO de la linea
 * vigente: un satelite fijado en `3.8.2` cuando se publica la `1.x` no esta
 * atrasado ni adelantado --esta en otra linea-- y mandarlo a subir de version lo
 * manda al lado equivocado. La migracion entre lineas la ordena el ADR que
 * declaro el cambio (ADR-0169 §2.7), no este aviso.
 */
export function veredictoDelRef(refSv, publicada) {
  if (!refSv || !publicada) return { fueraDeLinea: false, atrasado: false };
  const fueraDeLinea = refSv.major !== publicada.major;
  return {
    fueraDeLinea,
    atrasado: !fueraDeLinea && compararSemver(refSv, publicada) < 0,
  };
}
