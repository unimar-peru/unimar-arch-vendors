/**
 * enlaces.mjs — que es un enlace, y cual de ellos se puede juzgar.
 *
 * Tres consumidores necesitan la MISMA respuesta a esa pregunta:
 * `validate-docs.mjs` (la fuente), `validate-paquete.mjs` (el paquete
 * publicado) y `package-plugin.mjs` (que reescribe enlaces al empaquetar). Si
 * cada uno la respondiera por su cuenta, el empaquetado reescribiria un
 * conjunto de enlaces y el validador juzgaria otro: un marcador de plantilla
 * seria «roto» para uno e invisible para el otro, y la puerta y la operacion
 * dejarian de hablar del mismo objeto. Por eso vive aqui una sola vez.
 *
 * No resuelve rutas ni conoce el disco: solo extrae destinos y decide cuales
 * son juzgables. Quien los resuelve decide contra que raiz.
 */

/*
 * El destino admite espacios: Markdown permite `[texto](ruta "titulo")`, y en el
 * corpus hay rutas con espacio final --`[FS-04](../../../../ )`-- que una regex
 * de `[^)\s]+` no captura. Es decir: los enlaces peor escritos eran justo los
 * invisibles al validador. Se captura todo el parentesis y se limpia despues.
 */
export const ENLACE_RE = /(?<!!)\[[^\]]*\]\(([^)]*)\)/g;
export const IMAGEN_RE = /!\[[^\]]*\]\(([^)]*)\)/g;

/** Normaliza el destino: quita el titulo opcional y los angulos de `<ruta>`. */
export function limpiarDestino(d) {
  let s = d.trim();
  const conTitulo = s.match(/^(\S+)\s+["'(]/);
  if (conTitulo) s = conTitulo[1];
  return s.replace(/^<+|>+$/g, "").trim();
}

export const esExterno = (d) => /^(https?:|mailto:|tel:|ftp:|data:)/i.test(d);

/*
 * Las plantillas canonicas ensenan a rellenar rutas con marcadores: `<ruta>`,
 * `{{destino}}`, `test-summary-report-v[VERSION].md`, o un `...` que significa
 * "y asi con las demas". No son enlaces rotos: son el hueco que el autor debe
 * rellenar. Marcarlos convertiria el validador en ruido y la gente aprenderia a
 * ignorarlo -- que es como muere un gate.
 *
 * Una interpolacion de variable --`${CLAUDE_PLUGIN_ROOT}/rules/x.md`-- es un
 * caso aparte: no es un hueco por rellenar, es una ruta que se resuelve en
 * tiempo de ejecucion (aqui, contra el cache del plugin). No existe en el disco
 * del satelite y no puede comprobarse estaticamente; marcarla como rota es un
 * falso positivo que golpea a todo satelite recien dado de alta, porque su
 * `CLAUDE.md` enlaza asi las reglas del plugin.
 */
export const esMarcador = (d) =>
  /^[<{]/.test(d) || /\[[A-Z_]{2,}\]/.test(d) || /\.\.\.$/.test(d) || /\{\{/.test(d) || /\$\{/.test(d);

/**
 * Destinos enlazados de un documento, ya filtrados: fuera los externos, los
 * marcadores y el codigo cercado. Devuelve el destino CRUDO (ruta + ancla).
 */
export function* destinosDe(content) {
  const cuerpo = content.replace(/```[\s\S]*?```/g, " ");
  for (const re of [ENLACE_RE, IMAGEN_RE]) {
    re.lastIndex = 0;
    for (const m of cuerpo.matchAll(re)) {
      // El marcador se juzga sobre el destino CRUDO: `limpiarDestino` quita los
      // angulos, y `<ruta-al-prd>` limpio se confunde con una ruta de verdad.
      if (esMarcador(m[1].trim())) continue;
      const crudo = limpiarDestino(m[1]);
      if (!crudo || esExterno(crudo) || esMarcador(crudo)) continue;
      yield crudo;
    }
  }
}

/**
 * Igual que `destinosDe`, pero conserva el texto EXACTO que aparecia entre
 * parentesis. Reescribir un enlace exige poder localizarlo tal cual se escribio
 * -- con su titulo, sus angulos o su espacio final --, no en su forma limpia.
 */
export function* enlacesDe(content) {
  const cuerpo = content.replace(/```[\s\S]*?```/g, " ");
  for (const re of [ENLACE_RE, IMAGEN_RE]) {
    re.lastIndex = 0;
    for (const m of cuerpo.matchAll(re)) {
      const dentro = m[1];
      if (esMarcador(dentro.trim())) continue;
      const crudo = limpiarDestino(dentro);
      if (!crudo || esExterno(crudo) || esMarcador(crudo)) continue;
      yield { dentro, crudo };
    }
  }
}

/** Parte un destino crudo en `[ruta, ancla]`. La ruta puede venir vacia. */
export function partirDestino(crudo) {
  const i = crudo.indexOf("#");
  return i === -1 ? [crudo, null] : [crudo.slice(0, i), crudo.slice(i + 1)];
}

/*
 * --- Lo absoluto tambien es un enlace (G-335) ---
 *
 * `destinosDe` y `enlacesDe` SALTAN toda URL absoluta, y esa omision era total:
 * ni la fuente ni el paquete abrian un solo `blob/main/`. El resultado medido:
 * de las 86 URL distintas al propio repositorio que publica el paquete, una
 * llevaba rota desde el 2026-07-27 --`templates/CONTRIBUTING.md` cita
 * `reference/governance/standards/taxonomia-repositorio-satelite.md`, que se
 * mudo a `taxonomy/`--, y todo satelite que materializo su `CONTRIBUTING.md`
 * arrastra el enlace muerto.
 *
 * Saltarlas tenia una razon legitima --no se pueden resolver contra el disco--
 * pero solo vale para las URL AJENAS. Una URL al propio repositorio describe una
 * ruta de un arbol que quien valida tiene delante, y es juzgable sin red. Aqui
 * vive la parte pura: extraerlas y partirlas. Resolverlas contra una referencia
 * git es de `lib/urls-fuente.mjs`, porque este modulo no conoce el disco.
 */

/** URLs absolutas enlazadas en un documento, en orden de aparicion. */
export function* urlsDe(content) {
  const cuerpo = content.replace(/```[\s\S]*?```/g, " ");
  for (const re of [ENLACE_RE, IMAGEN_RE]) {
    re.lastIndex = 0;
    for (const m of cuerpo.matchAll(re)) {
      const dentro = m[1];
      if (esMarcador(dentro.trim())) continue;
      const crudo = limpiarDestino(dentro);
      // El marcador se vuelve a mirar ya limpio: `<https://…/${VAR}/x>` solo se
      // delata cuando se le han quitado los angulos.
      if (!crudo || !esExterno(crudo) || esMarcador(crudo)) continue;
      yield crudo;
    }
  }
}

/**
 * Parte una URL que describe un archivo de un repositorio GitHub:
 * `https://github.com/<duenio>/<repo>/(blob|tree|raw)/<ref>/<ruta>`.
 *
 * Devuelve `null` para cualquier otra forma --un issue, un release, la portada
 * del repositorio, otro dominio--: no nombran una ruta del arbol y no hay nada
 * que resolver. Decir «no la se juzgar» es la respuesta correcta; inventarle una
 * ruta seria peor que no mirarla.
 */
export function partirUrlDeRepo(url) {
  const m = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/(blob|tree|raw)\/([^/]+)\/(.+)$/i.exec(url.trim());
  if (!m) return null;
  const [, duenio, repo, , ref, resto] = m;
  const ruta = resto.split("#")[0].split("?")[0].replace(/\/+$/, "");
  if (!ruta) return null;
  let decodificada;
  try { decodificada = decodeURIComponent(ruta); } catch { decodificada = ruta; }
  return { duenio, repo, ref, ruta: decodificada };
}
