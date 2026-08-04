# Procedencia de este paquete

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Paquete-v1.0.0-042139?style=flat-square" alt="Versión">
  <img src="https://img.shields.io/badge/Comparado-2026--08--03-0f3e67?style=flat-square" alt="Fecha">
</p>

> **Si eres un proveedor de Unimar, esta es la página que responde «¿esto que estoy leyendo es lo
> que Unimar me exige de verdad, y de cuándo es?».**

## 1. Qué es este material

Es el **paquete de estándar SDLC que Unimar entrega a sus proveedores externos**, publicado en
`unimar-arch-vendors`, versión **1.0.0**.

Es una **obra derivada curada**. No es una copia del repositorio de arquitectura de Unimar, ni
pretende serlo.

## 2. Qué NO es, dicho sin rodeos

**No es un espejo del estándar interno.** Se midió el 2026-08-03, byte a byte, contra
`unimar_arch@1102323`:

| | ficheros |
| :--- | ---: |
| Idénticos a la fuente | **24** |
| Difieren de la fuente | **300** |
| Existen solo aquí | **6** |
| **Total del paquete** | **330** |

300 de 330 difieren. Este paquete **no corresponde a ninguna versión** del estándar interno:
se curó y evolucionó por separado. Decir «deriva de la versión X» sería falso, y por eso no se dice.

## 3. Por qué falta material

La fuente interna tiene alrededor de **1481 documentos** bajo `reference/` y `docs/` que aquí no
están.

No es un descuido. **La fuente es privada y este repositorio es público.** Sincronizar el árbol
entero publicaría material interno de Unimar. Lo que se entrega es un subconjunto elegido, y esa
elección es una frontera de confidencialidad, no una omisión.

## 4. Qué existe solo aquí

Seis ficheros no tienen equivalente en la fuente actual. El caso más ilustrativo es
`0030-api-gateway-ingress-vs-nestjs.es.md`: la fuente lo renombró a `…-kong-…`, y aquí sobrevive
con el nombre anterior. Es lo que ocurre cuando dos árboles evolucionan sin un mecanismo que los
compare.

## 5. Qué garantiza esta declaración, y qué no

**Garantiza** que el 2026-08-03 alguien con acceso a los dos árboles los comparó y escribió el
resultado, con su huella criptográfica en [`procedencia.json`](./procedencia.json).

**No garantiza** que siga siendo cierto mañana. Comprobarlo exige acceso a la fuente privada, que
este repositorio no tiene. La huella `sha256` sí detecta si este paquete se editó después de la
fecha declarada.

Un dato sobre el estándar escrito a mano y no comprobado se pudre. Esta página nace declarando su
propio límite para que nadie la lea como una garantía viva.

## 6. Qué hacer si dependes de esto

Si estás construyendo software para Unimar bajo estas reglas, **confirma con tu contacto de
Arquitectura que la versión 1.0.0 sigue vigente** antes de un hito contractual. Esta página te
dice de cuándo es el material; no te dice si Unimar cambió de opinión después.
