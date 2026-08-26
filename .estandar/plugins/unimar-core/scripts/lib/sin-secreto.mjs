/**
 * sin-secreto.mjs — redacta credenciales de cualquier texto capturado (S-43 D3).
 *
 * POR QUE EXISTE. `git clone` incrusta la URL entera --credencial incluida-- en
 * su mensaje de error, y el 2026-08-25 ese mensaje se guardo literal en un
 * fichero versionado: un token `gho_` vivo llego a `main` sin que ninguna
 * puerta lo notara (G-493, ADR-0235).
 *
 * POR QUE EN EL BORDE Y NO DONDE FALLA. Redactar en el punto que hoy falla
 * arregla un caso; redactar al CAPTURAR arregla la clase. La credencial viaja
 * en toda invocacion contra el remoto, y el proximo `execFileSync` que alguien
 * anada hereda la proteccion sin acordarse de ella.
 *
 * POR QUE UNA LIBRERIA Y NO UNA COPIA POR SCRIPT. Porque este repositorio ya
 * pago esa factura: el fragmento que resuelve el plugin estaba copiado en 17
 * sitios, y arreglar uno no arreglaba ninguno (G-494). Un comportamiento que
 * cinco scripts necesitan se importa.
 *
 * LIMITE DECLARADO: redacta lo que tiene FORMA reconocible, igual que la puerta
 * que lo acompaña. Una contraseña en texto plano dentro de un mensaje de error
 * sigue saliendo, y eso se dice en vez de darlo por cubierto.
 */

const PATRONES = [
  // Credencial embebida en una URL. El ejemplo va con marcadores --`<usuario>`--
  // y no en forma literal: la puerta de S-43 lee este mismo fichero, y documentar
  // un patron escribiendolo entero es como se cuelan los ejemplos que parecen reales.
  // `https://<usuario>:<clave>@host` y `https://<token>@host`.
  [/(\bhttps?:\/\/)[^/@\s]+@/g, '$1***@'],
  // Tokens de GitHub, en cualquiera de sus prefijos.
  [/\bgh[pousr]_[A-Za-z0-9]{16,}/g, '***'],
  [/\bgithub_pat_[A-Za-z0-9_]{20,}/g, '***'],
  // Clave de acceso de AWS.
  [/\bAKIA[0-9A-Z]{16}\b/g, '***'],
  // Cabecera de autorizacion, tal como la imprimen algunos clientes.
  [/\b(Authorization:\s*(?:Bearer|Basic|token))\s+\S+/gi, '$1 ***'],
];

/**
 * @param {unknown} texto Lo capturado: `e.message`, `stdout`, `stderr`, lo que sea.
 * @returns {string} El mismo texto con toda credencial de forma conocida en `***`.
 */
export function sinSecreto(texto) {
  let t = String(texto ?? '');
  for (const [re, por] of PATRONES) t = t.replace(re, por);
  return t;
}
