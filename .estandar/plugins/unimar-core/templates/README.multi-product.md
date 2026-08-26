# NOMBRE_DEL_SATELITE

<!--
  PLANTILLA DE README PRINCIPAL — Perfil MULTI-PRODUCT.
  Úsala cuando el satélite representa una SUITE de varios sistemas.
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
    Cada fase agrupa sus documentos y sus HUBS (índices de área), de nivel
    Suite y por sistema.

  Para un solo producto usa README.single-product.md.
-->

<div align="center">

![Unimar](https://img.shields.io/badge/Unimar_Arch-003c6b?style=for-the-badge)
![Perfil](https://img.shields.io/badge/Perfil-multi--product-8e44ad?style=for-the-badge)
![Suite](https://img.shields.io/badge/Suite-SIGLA_SUITE-0f3e67?style=for-the-badge)
![Estado](https://img.shields.io/badge/Estado-Activo-256c27?style=for-the-badge)
![Satélite](https://img.shields.io/badge/Sat%C3%A9lite-S--16-042139?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-informational?style=for-the-badge)

<br/>

**DESCRIBIR_EL_SATELITE**<br/>
Satélite de [`unimar_arch`](https://github.com/unimar-peru/unimar_arch): consume el estándar corporativo, versionado, desde el plugin `unimar-core`. No lo copia.

> _Operador Logístico Aduanero desde 1978_

</div>

DESCRIBIR_LA_SUITE: una plataforma de **sistemas que evolucionan de forma independiente** y se consolidan en una visión integrada. La carta fundacional es `PRD-SIGLA_SUITE-001` (`Alcance: suite`).

| Identidad | |
| :--- | :--- |
| Tipo de repositorio (ADR-0069) | `producto` |
| Perfil | `multi-product` |
| Suite | **SIGLA_SUITE** — NOMBRE_SUITE |
| Productos (`Ratificada`) | SIGLA_1 · SIGLA_2 · SIGLA_3 |
| Raíz de fuente (ADR-0107) | `src/RAIZ_DE_FUENTE` |
| Owner | OWNER |

---

## Flujo SDLC

Abre la fase en la que trabajas. Cada una declara su **meta**, sus documentos y sus **hubs** (índices de área), de nivel Suite y por sistema.

> **Numeración canon `unimar_arch`:** las fases van de **1 a 5** (Mapeo SDLC–Artefactos). **No existe «Fase 0».** Cada sistema evoluciona con su propio ritmo; esta vista consolida.

<details>
<summary><strong>Fase 1 — Concepción y Descubrimiento</strong> · visión y requisitos</summary>

<br/>

> **Meta:** fijar el _qué_ y el _para quién_ de la Suite y de cada sistema.

| Documento | Descripción | Tipo |
| :--- | :--- | :--- |
| [PRD de Suite](<enlace>) | Carta fundacional `PRD-SIGLA_SUITE-001` (`Alcance: suite`) | PRD |
| PRDs por sistema | `PRD-<Sistema>-NNN` (`Alcance: local`) — ver «Productos de la Suite» | PRD |
| [Capacidades transversales](<enlace>) | PRD transversal = padre + _workstreams_ (ADR-0120) | Transversal |

</details>

<details>
<summary><strong>Fase 2 — Diseño y Arquitectura</strong> · topología y contratos</summary>

<br/>

> **Meta:** fijar el _cómo_ estructural; cada sistema es un Bounded Context.

| Documento | Descripción | Tipo |
| :--- | :--- | :--- |
| [Hub de Arquitectura](<enlace>) | Topología de la Suite y contratos entre sistemas | Hub |
| [Índice de ADR](<enlace>) | Decisiones de Suite y `ADR-<Sistema>-NNN` | Decisión |
| [Blueprints por sistema](<enlace>) | Diseño de cada Bounded Context | Blueprint |

</details>

<details>
<summary><strong>Fase 3 — Construcción</strong> · el monorepo gobernado</summary>

<br/>

> **Meta:** materializar el diseño en código gobernado (monorepo).

| Documento | Descripción | Tipo |
| :--- | :--- | :--- |
| Código (`src/`) | Apps, libs y un servicio por sistema | Código |
| [Hub de Construcción](<enlace>) | Historias técnicas y planes por sistema | Hub |
| [Backlogs / Roadmaps](<enlace>) | Prioridades por sistema y consolidado | Backlog |

</details>

<details>
<summary><strong>Fase 4 — Validación y QA</strong> · la promesa se comprueba</summary>

<br/>

> **Meta:** comprobar que cada sistema cumple lo prometido.

| Documento | Descripción | Tipo |
| :--- | :--- | :--- |
| [Objetivos de calidad y SLO](<enlace>) | Confiabilidad por sistema | Calidad |
| [Resultados de pruebas](<enlace>) | Evidencia por sistema y capa | Pruebas |
| [Hub de QA](<enlace>) | Planes, cobertura y criterios de salida | Hub |

</details>

<details>
<summary><strong>Fase 5 — Entrega y Operaciones</strong> · lo que ya corre</summary>

<br/>

> **Meta:** operar la Suite y sostener su superficie de integración.

| Documento | Descripción | Tipo |
| :--- | :--- | :--- |
| [Deployment Architecture Hub](<enlace>) | Local · AKS · EKS · On-Prem · Serverless | Hub |
| [Executive Dashboard](<enlace>) | Rollup de salud por Sistema y Suite (ADR-0121) | Tablero |
| [Runbooks / Releases](<enlace>) | Operación y versionado | Runbook |

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
<summary><strong>¿Qué productos tiene la Suite y dónde vive cada uno?</strong></summary>

<br/>

_Una fila por sigla `Ratificada` de `suite.yaml → sistemas`. No incluyas siglas `Propuesta`._

| Sistema | Qué es | `sistema.yaml` | PRDs | Estado |
| :--- | :--- | :--- | :--- | :--- |
| **SIGLA_1** — NOMBRE_1 | DESCRIBIR | `src/services/xxx/sistema.yaml` | `<enlace>` | Fase N |
| **SIGLA_2** — NOMBRE_2 | DESCRIBIR | `src/services/yyy/sistema.yaml` | `<enlace>` | Fase N |
| **SIGLA_3** — NOMBRE_3 | DESCRIBIR | `src/services/zzz/sistema.yaml` | `<enlace>` | Fase N |

Un producto es una **capacidad funcional**, no una app: se sirve desde la Web/App compartidas más sus servicios propios.

</details>

<details>
<summary><strong>¿Dónde va cada cosa en este repositorio?</strong></summary>

<br/>

```text
src/                 raíz de fuente (ADR-0107) — todo el código bajo src/
  apps/              APP_WEB, GATEWAY. App móvil: repo <repo-app>
  libs/              UI, dominio, contracts, infraestructura compartidos
  services/          un Bounded Context por sistema
docs/                artefactos SDLC (PRDs, planes, reportes)
reference/           corpus propio (ADRs locales, blueprints, deployment)
DECISIONS.md  GAPS.md  MADUREZ.md  CLAUDE.md  CONTRIBUTING.md  AGENTS.md
```

Satélites de apoyo — **integración, no pertenencia**: LISTA_SATELITES_APOYO.

</details>

<details>
<summary><strong>¿Cómo se comunican los sistemas entre sí?</strong></summary>

<br/>

_Patrón normativo del núcleo — no lo redefinas, referéncialo:_

- **Intra-servicio** (entre agregados y contextos de un mismo sistema): **eventos de dominio in-memory** ([ADR-0015](https://github.com/unimar-peru/unimar_arch/blob/main/reference/architecture/adrs/core/0015-arquitectura-eventos-intradominio.es.md)).
- **Persistencia**: **una base de datos por servicio**, esquema por contexto (_database-per-service_, [ADR-0031](https://github.com/unimar-peru/unimar_arch/blob/main/reference/architecture/adrs/core/0031-esquema-por-contexto-catalogo-eventos-dominio.es.md)). Ningún sistema lee la BD de otro.
- **Inter-sistema** (entre sistemas de la Suite): **eventos de integración a través del bróker XMS en coreografía** ([ADR-0097](https://github.com/unimar-peru/unimar_arch/blob/main/reference/architecture/adrs/core/0097-integracion-entre-sistemas-suite-eventos-xms.es.md), en ratificación), con contrato AsyncAPI/CloudEvents, entrega FIFO/DLQ e idempotencia ([ADR-0036](https://github.com/unimar-peru/unimar_arch/blob/main/reference/architecture/adrs/core/0036-estrategia-entrega-bus-mensajes-fifo-dlq.es.md)) y publicación garantizada por _outbox_ ([ADR-0033](https://github.com/unimar-peru/unimar_arch/blob/main/reference/architecture/adrs/core/0033-patron-transactional-outbox.es.md)). El transporte del bus (p. ej. RabbitMQ) no acopla sistemas punto a punto.

Toda integración externa cruza el bróker con contrato declarado.

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

No. Toda decisión técnica referencia un ADR **aceptado** de `unimar_arch`; si no existe, se crea allí primero (S-06). Lo que sí vive aquí son los ADR **locales** (`ADR-<Sistema>-NNN`): decisiones propias de un sistema que no alteran el estándar.

</details>

---

<div align="center">

**© Unimar S.A.** · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br/>
Estándar: [Unimar Arch](https://github.com/unimar-peru/unimar_arch) · Plugin: `unimar-core`

</div>
