# DECISIONS.md — NOMBRE_DEL_SATELITE

> **Estado:** Activo | **Propietario:** Unimar S.A. | **Reglas:** S-15, R-21
> **Tipo de repositorio:** producto

Decisiones locales de este satélite y **triaje de las reglas de herencia** (S-01 … S-36). Una decisión local nunca contradice un ADR de `unimar_arch`.

> La tabla de abajo debe cubrir **todas** las reglas que declara [`satellite-repo-rules.md`](../rules/satellite-repo-rules.md), que es de donde `validate-triaje.mjs` deriva la lista canónica. Cuando el estándar añada una regla, esta plantilla se amplía con ella: un triaje al que le falta una fila no es un triaje incompleto, es un satélite que no arranca.

El **tipo de repositorio** (ADR-0069) es `producto` o `libreria`. El defecto es `producto`; cámbielo a `libreria` si este satélite publica un paquete que otros consumen en vez de un sistema que se despliega. El tipo condiciona las ramas (ADR-0050), los artefactos SDLC (S-01 … S-05), el README y la lectura de la madurez. Un satélite `libreria` triaja S-01 … S-05 como `N/A` por su tipo.

## Operaciones

| Operación | Significado |
| :--- | :--- |
| `Adopt` | Se toma la regla tal cual, sin modificaciones. |
| `Extend` | Se toma y se añaden extensiones locales que no la contradicen. |
| `Override` | Se reemplaza localmente. Solo donde está permitido, y **exige ADR local** que lo justifique. |
| `N/A` | No aplica por contexto. **Se declara por qué**, no se deja en blanco. |

> `N/A` por decisión y `N/A` por ausencia no son lo mismo. Si la regla no se cumple porque el artefacto todavía no existe, eso es un **gap**, no una exención: regístrelo en [GAPS.md](./GAPS.md).

## Triaje de las reglas de herencia

| Regla | Operación | Justificación |
| :--- | :--- | :--- |
| S-01 Plantillas Base | TRIAJE | JUSTIFICAR |
| S-02 Formato Canónico | TRIAJE | JUSTIFICAR |
| S-03 Diagramas Mermaid | TRIAJE | JUSTIFICAR |
| S-04 Requisitos Técnicos Aislados | TRIAJE | JUSTIFICAR |
| S-05 Actores y Stakeholders | TRIAJE | JUSTIFICAR |
| S-06 Trazabilidad a ADRs | TRIAJE | JUSTIFICAR |
| S-07 Stack Tecnológico Autorizado | TRIAJE | JUSTIFICAR |
| S-08 Versión SemVer en Plantillas | TRIAJE | JUSTIFICAR |
| S-09 Idioma Único | TRIAJE | JUSTIFICAR |
| S-10 Referencias Relativas | TRIAJE | JUSTIFICAR |
| S-11 Badges Uniformados | TRIAJE | JUSTIFICAR |
| S-12 Validación Pre-Commit | TRIAJE | JUSTIFICAR |
| S-13 Historial de Cambios | TRIAJE | JUSTIFICAR |
| S-14 Guía de Estilo | TRIAJE | JUSTIFICAR |
| S-15 Decisiones Locales | TRIAJE | JUSTIFICAR |
| S-16 Estándar Provisto, no Copiado | Adopt | El estándar lo provee el plugin `unimar-core`. Este repositorio no contiene `.harness/`. La versión se fija en `STANDARD_REF`. |
| S-17 Agentes BMAD | TRIAJE | JUSTIFICAR |
| S-18 Taxonomía y Configuración Base | TRIAJE | JUSTIFICAR |
| S-19 Medición de Madurez | Adopt | [MADUREZ.md](./MADUREZ.md) |
| S-20 Registro Único de Gaps | Adopt | [GAPS.md](./GAPS.md) |
| S-21 Rulesets de Agentes | Adopt | Los subagentes los provee el plugin. `.claude/agents/` es zona protegida. |
| S-22 Reglas Spec-Driven | TRIAJE | JUSTIFICAR |
| S-23 Gates de Calidad y Seguridad Local-First | TRIAJE | JUSTIFICAR |
| S-24 Fase 1 Define, el Tablero Planifica | TRIAJE | JUSTIFICAR |
| S-25 Índice de Iniciativas Publicado | TRIAJE | JUSTIFICAR |
| S-26 Numeración de Identificadores entre Ramas | TRIAJE | JUSTIFICAR |
| S-27 Aceptación de un ADR | TRIAJE | JUSTIFICAR |
| S-28 Vinculación al Estándar Declarada | TRIAJE | JUSTIFICAR |
| S-29 Reciprocidad de la Supersesión | TRIAJE | JUSTIFICAR |
| S-30 Una Ruta de Lectura no Encamina a una Decisión Retirada | TRIAJE | JUSTIFICAR |
| S-31 La Retirada de un ADR Consta con su Razón | TRIAJE | JUSTIFICAR |
| S-32 Un Contrato Aceptado Nombra lo que Aún no lo Sostiene | TRIAJE | JUSTIFICAR |
| S-33 Una Regla Vigente se Funda en una Decisión Vigente | TRIAJE | JUSTIFICAR |
| S-34 El Dato Personal no Llega al Log | TRIAJE | JUSTIFICAR |
| S-35 La Vigencia se Declara Donde Puede Sostenerse Verdadera | TRIAJE | JUSTIFICAR |
| S-36 La Señal Declara Cuánto Dura y Quién Puede Alterarla | TRIAJE | JUSTIFICAR |
| S-37 El Analizador Estático se Declara por Runtime y su Invocación está Cableada | TRIAJE | JUSTIFICAR |
| S-38 El Ámbito de Runtime de un ADR se Declara | TRIAJE | JUSTIFICAR |
| S-39 El PRD y la Historia Técnica Declaran las Secciones de su Plantilla Canónica | TRIAJE | JUSTIFICAR |
| S-40 El Censo Desmiente al Sujeto no Observado | TRIAJE | JUSTIFICAR |
| S-42 El Consumidor Declara Qué Hace Cuando su Dependencia No Responde | TRIAJE | JUSTIFICAR |
| S-43 Ningún Artefacto del Estándar Sale con una Credencial Dentro | TRIAJE | JUSTIFICAR |

## Retención y protección de las señales de observabilidad

[ADR-0096](https://github.com/unimar-peru/unimar_arch/blob/main/reference/architecture/adrs/core/0096-contrato-trazabilidad-funcional-narrativa.es.md) §2.7.4 exige a **cada producto** declarar **retención por señal** y **protección contra manipulación** (ISO/IEC 27001:2022 A.8.15, NIST SP 800-92). [ADR-0197](https://github.com/unimar-peru/unimar_arch/blob/main/reference/architecture/adrs/core/0197-la-senal-declara-cuanto-dura-y-quien-puede-alterarla.es.md) fija las cuatro clases sobre las que «por señal» significa algo, el piso de cada una y este domicilio. La regla es **S-36** y el ejecutor, `validate-retencion-senal.mjs`, que el plugin provee.

**Esta sección viaja en la plantilla para que exista antes de que haga falta**, igual que «ADRs Retirados»: quien tenga que declarar la primera señal tiene dónde escribirla y no descubre la obligación cuando la puerta ya está roja.

| Valor de `Retención` | Cuándo se usa |
| :--- | :--- |
| `Nd` · `Nm` · `Na` | Una duración: días, meses o años. Nunca por debajo del piso de la clase |
| `indefinida` | Se guarda sin caducidad |
| `no-emite` | Este repositorio no produce esa señal. Obliga a `no-emite` también en `Protección`, y la razón se escribe en `Base` |
| `no-gobernada` | La señal existe y su destino lo opera otro. **Exige un `G-NNN` abierto en la misma celda** |

| Valor de `Protección` | Qué declara |
| :--- | :--- |
| `append-only` | El destino no admite `UPDATE` ni `DELETE`. Es el **piso** de `pista_auditoria` y lo decidió [ADR-0016](https://github.com/unimar-peru/unimar_arch/blob/main/reference/architecture/adrs/core/0016-pista-auditoria-inmutable-negocio.es.md) |
| `firma` · `custodia-separada` | El registro se firma, o vive fuera del alcance de quien lo produce |
| `ninguna` · `no-gobernada` | Declaraciones honestas de ausencia. **Exigen un `G-NNN` abierto en la misma celda**: la declaración caduca con su pendiente |

> **Lo que la puerta NO comprueba:** que la infraestructura cumpla lo declarado. Que Loki borre a los 90 días lo sabe Loki, no el estándar. Se juzga la **declaración**; el contraste con la configuración real es revisión humana.

<!--retencion-senal:inicio-->

| Señal | Retención | Destino | Base | Protección |
| :--- | :--- | :--- | :--- | :--- |
| `log_aplicacion` | TRIAJE | DONDE_VIVE | JUSTIFICAR | TRIAJE |
| `metrica` | TRIAJE | DONDE_VIVE | JUSTIFICAR | TRIAJE |
| `traza` | TRIAJE | DONDE_VIVE | JUSTIFICAR | TRIAJE |
| `pista_auditoria` | TRIAJE | DONDE_VIVE | JUSTIFICAR | TRIAJE |

<!--retencion-senal:fin-->

## Análisis estático por runtime

**S-23** ya ordena cablear en local «linters/SAST del stack», y [ADR-0056](https://github.com/unimar-peru/unimar_arch/blob/main/reference/architecture/adrs/core/0056-convenciones-nombre-diseno-empresarial.es.md) §4 fija seis reglas de Clean Code y cuatro umbrales para R4, cuyo propio **CA-6** se declara «no ejecutable». [ADR-0210](https://github.com/unimar-peru/unimar_arch/blob/main/reference/architecture/adrs/core/0210-el-analizador-estatico-se-declara-por-runtime.es.md) domicilia aquí la respuesta de este repositorio. La regla es **S-37** y el ejecutor, `validate-analisis-estatico.mjs`, que el plugin provee.

**Esta sección viaja en la plantilla para que exista antes de que haga falta.** Las **tres filas son fijas**: `no-presente` es una respuesta, el silencio no.

| Valor de `Severidad` | Cuándo se usa |
| :--- | :--- |
| `bloquea` | El analizador corre y su hallazgo detiene el trabajo. Es lo que S-23 ordena, y la única respuesta que no cuesta una ficha |
| `avisa` | Corre y no detiene nada. Legítimo mientras se salda deuda heredada. **Exige un `G-NNN` abierto en la misma celda** |
| `sin-analizador` | Hay código de ese runtime y ningún analizador. **Exige un `G-NNN` abierto en la misma celda** |
| `no-presente` | No hay código de ese runtime. **Se contrasta con el árbol**: si lo hay, la puerta se pone roja |

| Valor de `Umbrales` | Qué declara sobre los cuatro umbrales de ADR-0056 D4 |
| :--- | :--- |
| `estandar` | `> 50` líneas, `> 3` parámetros, complejidad `> 10` y anidamiento `> 3` rigen sin desviación. Solo cabe con severidad `bloquea` o `avisa` |
| `propios` | Los umbrales efectivos se apartan, o el analizador no los expresa. **Exige un `G-NNN` abierto en la misma celda** |
| `no-presente` | No hay código de ese runtime. Solo cabe con severidad `no-presente` |

> **Lo que la puerta NO comprueba:** el **contenido** de la configuración. Que tu `eslint.config.mjs` encienda las nueve reglas de ADR-0056 D3 lo sabe ESLint al correr, no un lector de Markdown. Se juzga que la declaración exista, que la ruta exista y que la invocación esté **cableada** en algo que este repositorio ejecuta.

<!--analisis-estatico:inicio-->

| Runtime | Analizador | Severidad | Configuración | Invocación | Umbrales |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `nodejs` | HERRAMIENTA | TRIAJE | RUTA | COMANDO | TRIAJE |
| `dotnet` | HERRAMIENTA | TRIAJE | RUTA | COMANDO | TRIAJE |
| `android` | HERRAMIENTA | TRIAJE | RUTA | COMANDO | TRIAJE |

<!--analisis-estatico:fin-->

## ADRs Retirados

Todo ADR **local** de este satélite (`ADR-<SIGLA>-NNN`, S-15) cuyo front-matter declare `estado: Supersedido` o `estado: Deprecado` **debe** tener aquí su fila con la **razón** de la remoción (**S-31**). La sección viaja en la plantilla precisamente para que exista **antes** de que haga falta: quien retire el primer ADR del satélite tiene dónde escribir por qué, y no descubre la obligación cuando la puerta ya está roja.

La comprobación la hace `validate-docs.mjs` sobre esta sección —no sobre el fichero entero—, así que nombrar un ADR retirado en cualquier otro párrafo **no** lo registra. Y solo se juzga que la razón **exista**: si es buena o no, lo dice una persona.

> Mientras este satélite no haya retirado ningún ADR local, la tabla se queda vacía y la puerta no exige nada: sin ADR retirado no hay objeto que registrar.

| ADR | Título | Estado | Fecha | Razón de la remoción |
| :-- | :----- | :----- | :---- | :------------------- |

## Decisiones locales

| ID | Decisión | Fecha | Justificación |
| :--- | :--- | :--- | :--- |
| D-001 | REGISTRAR_LA_PRIMERA_DECISION | FECHA_DE_HOY | JUSTIFICAR |

---

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978
</p>
