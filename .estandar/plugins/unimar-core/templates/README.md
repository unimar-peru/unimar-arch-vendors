# NOMBRE_DEL_SATELITE

<!--
  PLANTILLA DE README PRINCIPAL — Perfil BASE (librería o componente).
  Úsala cuando el satélite publica código reusable, no un sistema desplegable.
  Copia este archivo como README.md en la raíz del satélite y sustituye
  TODOS los marcadores EN_MAYUSCULAS y los <...>. Borra este comentario.

  CONVENCIÓN DEL ESTÁNDAR (obligatoria):
  - El README del satélite es un PORTAL de CUATRO secciones, y solo cuatro:
    Cabecera · Flujo SDLC · Cómo colaborar · Preguntas y respuestas.
    No añadas secciones de primer nivel: lo que no encaje va dentro de una
    de las cuatro, plegado.
  - Todo el detalle vive en secciones EXPANDIBLES (<details>/<summary>), y
    todas abren CERRADAS. El lector ve el mapa completo antes de elegir.
  - El «Flujo SDLC» abre por FASE (canon unimar_arch 1..5, sin Fase 0).
    Cada fase agrupa sus documentos y sus HUBS (índices de área).

  Para un producto desplegable usa README.single-product.md.
  Para una Suite multiproducto usa README.multi-product.md.
-->

<div align="center">

![Unimar](https://img.shields.io/badge/Unimar_Arch-003c6b?style=for-the-badge)
![Perfil](https://img.shields.io/badge/Perfil-libreria-8e44ad?style=for-the-badge)
![Estado](https://img.shields.io/badge/Estado-Activo-256c27?style=for-the-badge)
![Satélite](https://img.shields.io/badge/Sat%C3%A9lite-S--16-042139?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-informational?style=for-the-badge)

<br/>

**DESCRIBIR_EL_SATELITE**<br/>
Satélite de [`unimar_arch`](https://github.com/unimar-peru/unimar_arch): consume el estándar corporativo, versionado, desde el plugin `unimar-core`. No lo copia.

> _Operador Logístico Aduanero desde 1978_

</div>

| Identidad | |
| :--- | :--- |
| Tipo de repositorio (ADR-0069) | `libreria` |
| Perfil | `base` |
| Paquete publicado | `NOMBRE_DEL_PAQUETE` |
| Raíz de fuente (ADR-0107) | `src/RAIZ_DE_FUENTE` |
| Owner | OWNER |

---

## Flujo SDLC

Abre la fase en la que trabajas. Cada una declara su **meta**, sus documentos y sus **hubs** (índices de área).

> **Numeración canon `unimar_arch`:** las fases van de **1 a 5** (Mapeo SDLC–Artefactos). **No existe «Fase 0».**

<details>
<summary><strong>Fase 1 — Concepción y Descubrimiento</strong> · qué resuelve la librería</summary>

<br/>

> **Meta:** fijar qué problema transversal resuelve y quién la consume.

| Documento | Descripción | Tipo |
| :--- | :--- | :--- |
| [PRD](<enlace>) | Capacidades, consumidores previstos y NFRs | PRD |
| [Hub de Gobernanza](<enlace>) | Requisitos y backlog | Hub |
| [Historias técnicas](<enlace>) | Requisitos verificables | Historia |

</details>

<details>
<summary><strong>Fase 2 — Diseño y Arquitectura</strong> · la API pública y sus límites</summary>

<br/>

> **Meta:** fijar la superficie pública y lo que queda deliberadamente fuera.

| Documento | Descripción | Tipo |
| :--- | :--- | :--- |
| [Hub de Arquitectura](<enlace>) | Cómo adopta o especializa la línea base | Hub |
| [Índice de ADR locales](<enlace>) | Decisiones `ADR-SIGLA-NNN` | Decisión |
| [Contrato de API pública](<enlace>) | Qué se exporta, qué es interno y por qué | Contrato |

</details>

<details>
<summary><strong>Fase 3 — Construcción</strong> · el código gobernado</summary>

<br/>

> **Meta:** materializar el diseño sin filtrar detalle de implementación.

| Documento | Descripción | Tipo |
| :--- | :--- | :--- |
| Código (`src/`) | Runtime de la librería, bajo la raíz de fuente | Código |
| [Hub de Construcción](<enlace>) | Historias técnicas y planes | Hub |
| [Backlog / Roadmap](<enlace>) | Prioridades | Backlog |

</details>

<details>
<summary><strong>Fase 4 — Validación y QA</strong> · la promesa se comprueba</summary>

<br/>

> **Meta:** demostrar que la API pública cumple lo que declara, versión a versión.

| Documento | Descripción | Tipo |
| :--- | :--- | :--- |
| [Objetivos de calidad](<enlace>) | Cobertura, compatibilidad y umbrales | Calidad |
| [Resultados de pruebas](<enlace>) | Evidencia por capa | Pruebas |
| [Pruebas de contrato](<enlace>) | Lo que un consumidor puede dar por estable | Contrato |

</details>

<details>
<summary><strong>Fase 5 — Entrega y Operaciones</strong> · publicación y compatibilidad</summary>

<br/>

> **Meta:** publicar sin romper a quien ya depende de la librería.

| Documento | Descripción | Tipo |
| :--- | :--- | :--- |
| [Proceso de release](<enlace>) | Publicación y versionado SemVer | Release |
| [Política de compatibilidad](<enlace>) | Qué rompe una mayor y cómo se anuncia | Hub |
| [Guías de migración](<enlace>) | Camino de una mayor a la siguiente | Migración |

</details>

---

## Cómo colaborar

<details>
<summary><strong>Arranque rápido</strong> · del clon al primer commit válido</summary>

<br/>

Este repositorio no lleva el estándar dentro. Lo obtiene del plugin `unimar-core`, que se instala una vez y se comparte entre satélites.

1. **Instala el plugin del estándar** (marketplace de Unimar):

   ```bash
   claude plugin marketplace add unimar-peru/unimar-marketplace
   claude plugin install unimar-core@unimar
   ```

2. **Localiza la versión instalada y activa el hook** (una vez por clon; git no lo activa solo, por diseño):

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
   node "$UNIMAR_CORE/scripts/install-hooks.mjs"
   ```

3. **Valida la gobernanza** antes de tu primer commit:

   ```bash
   # Con Claude Code, el barrido completo en un paso:
   #   /unimar-core:validar-gobernanza
   node "$UNIMAR_CORE/scripts/validate-estructura-satelite.mjs"
   node "$UNIMAR_CORE/scripts/validate-satellite-base.mjs"
   ```

4. **Build y pruebas del runtime:**

   ```bash
   COMANDO_BUILD
   COMANDO_PRUEBAS
   ```

</details>

<details>
<summary><strong>Reglas que gobiernan tu cambio</strong> · gobernanza viva del satélite</summary>

<br/>

| Documento | Qué gobierna |
| :--- | :--- |
| [CLAUDE.md](./CLAUDE.md) | Reglas del núcleo Unimar, redactadas para este satélite |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Proceso de contribución y cómo proponer cambios al núcleo |
| [AGENTS.md](./AGENTS.md) | Convenciones para agentes que operen aquí |
| [DECISIONS.md](./DECISIONS.md) | Triaje de herencia y decisiones locales |
| [GAPS.md](./GAPS.md) | Registro único de hallazgos (S-20) |
| [MADUREZ.md](./MADUREZ.md) | Medición de madurez TOGAF ACMM (S-19) |

**Quality & Security:** los gates locales (S-23, ADR-0106) son inevadibles en el pre-commit: gitleaks, auditoría de dependencias, coverage con umbral, commitlint y los validadores del estándar.

</details>

<details>
<summary><strong>Proponer un cambio al estándar</strong> · el camino de vuelta al núcleo</summary>

<br/>

Lo que este repositorio no puede decidir por su cuenta —una regla, un validador, una plantilla, un ADR de núcleo— se propone en [`unimar_arch`](https://github.com/unimar-peru/unimar_arch) por PR. El estándar baja versionado en el plugin; nunca se parchea en local.

El detalle del flujo, con roles y categorías de cambio, está en [CONTRIBUTING.md](./CONTRIBUTING.md), sección «Contribuir al núcleo».

</details>

---

## Preguntas y respuestas

<details>
<summary><strong>¿Dónde va cada cosa en este repositorio?</strong></summary>

<br/>

```text
src/                 raíz de fuente (ADR-0107) — todo el código bajo src/
  RAIZ_DE_FUENTE     la librería
docs/                artefactos SDLC (PRDs, planes, reportes)
reference/           corpus propio (ADRs locales, contratos, guías)
DECISIONS.md  GAPS.md  MADUREZ.md  CLAUDE.md  CONTRIBUTING.md  AGENTS.md
```

</details>

<details>
<summary><strong>¿Por qué no hay <code>.harness/</code> aquí?</strong></summary>

<br/>

Porque el satélite **consume** el estándar, no lo aloja (S-16). Reglas, scripts y subagentes llegan por el plugin `unimar-core`, así que todos los satélites ejecutan exactamente la misma versión y esa versión es su identidad ([ADR-0062](https://github.com/unimar-peru/unimar_arch/blob/main/reference/architecture/adrs/core/0062-estandar-distribuido-como-plugin-versionado.es.md)). Un hook `PreToolUse` deniega la escritura en `.harness/` y el CI la rechaza.

</details>

<details>
<summary><strong>¿Cómo actualizo el estándar a una versión nueva?</strong></summary>

<br/>

```bash
claude plugin update unimar-core@unimar
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
node "$UNIMAR_CORE/scripts/validate-estructura-satelite.mjs"
```

Si la versión nueva añade reglas, el triaje correspondiente se registra en [DECISIONS.md](./DECISIONS.md) con su operación `Adopt` / `Extend` / `Override` / `N/A`.

</details>

<details>
<summary><strong>El pre-commit me bloqueó. ¿Qué hago?</strong></summary>

<br/>

Léelo: los validadores nombran el archivo y la regla. No se saltan con `--no-verify` — un gate evadido es un gate roto, y el CI lo vuelve a encontrar. Si crees que el validador se equivoca, eso **es** un hallazgo: regístralo en [GAPS.md](./GAPS.md) y propón el arreglo en `unimar_arch`.

</details>

<details>
<summary><strong>Encontré algo que no puedo arreglar ahora. ¿Dónde lo registro?</strong></summary>

<br/>

En [GAPS.md](./GAPS.md), con su dimensión de madurez, criticidad y complejidad (SD-07). Con Claude Code: `/unimar-core:unimar-gap`. La evidencia precede a la afirmación (SD-05): si no puedes enlazar la prueba, el hallazgo se registra como pendiente en vez de darse por resuelto.

</details>

<details>
<summary><strong>Necesito una decisión técnica que no tiene ADR. ¿La decido aquí?</strong></summary>

<br/>

No. Toda decisión técnica referencia un ADR **aceptado** de `unimar_arch`; si no existe, se crea allí primero (S-06). Lo que sí vive aquí son los ADR **locales** (`ADR-SIGLA-NNN`): decisiones propias del satélite que no alteran el estándar.

</details>

---

<div align="center">

**© Unimar S.A.** · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br/>
Estándar: [Unimar Arch](https://github.com/unimar-peru/unimar_arch) · Plugin: `unimar-core`

</div>
