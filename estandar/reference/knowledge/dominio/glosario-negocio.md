# Glosario de Negocio — Lenguaje Ubicuo

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Glosario%20de%20Negocio-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Activo-27ae60?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-1.0.0-042139?style=flat-square" alt="Versión">
</p>

> **Fase SDLC:** 1 — Concepción y Descubrimiento / Transversal
> **Puerta de salida:** Aprobación de Negocio (Gate F1) — debe existir antes de nominar entidades
> **Padre:** [Conocimiento de Dominio](../dominio/README.md)
> **Audiencia:** Arquitectos, desarrolladores, QA Engineers, Product Owners, analistas de negocio

---

## Propósito

El Glosario de Negocio es el **Lenguaje Ubicuo** (*Ubiquitous Language*) de UNIMAR: el vocabulario compartido y controlado que conecta el lenguaje del negocio con el lenguaje del código.

Su función concreta en el SDLC de UNIMAR es triple:

* **Eliminar ambigüedad entre equipos**: el término "cliente" puede significar el importador en Despacho Aduanero y la empresa con contrato activo en Gestión Comercial. Sin glosario explícito, los equipos hablan de cosas distintas usando la misma palabra.
* **Gobernar el naming del código**: los nombres de entidades, casos de uso, endpoints, columnas de base de datos y eventos de dominio deben derivar directamente del glosario ([ADR-0056](../../architecture/adrs/core/0056-convenciones-nombre-diseno-empresarial.es.md)). Un término que no está en el glosario no debe aparecer en el código.
* **Anclar los contratos de API y eventos**: los campos en OpenAPI, Protobuf y AsyncAPI usan los términos del glosario — nunca abreviaciones ni sinónimos locales.

---

## Elige tu Vista

| Vista | Link | Úsalo cuando |
|---|---|---|
| **Fuente Markdown** | [Abrir fuente reutilizable](./fuente/glosario-negocio-fuente.es.md) | Necesites agregar términos nuevos al glosario de un producto o módulo. Copia la estructura canónica de entrada. |
| **Ejemplo Unimar** | [Abrir glosario completo Unimar](./ejemplo/glosario-negocio-ejemplo-unimar.es.md) | Quieras consultar el vocabulario oficial del dominio logístico-aduanero de UNIMAR con definiciones, contextos y sinónimos prohibidos. |

---

## Reglas de Autoría

* Cada término tiene exactamente una definición canónica. No existen dos entradas para el mismo concepto.
* Los sinónimos se listan explícitamente y se marcan como **no usar** — su presencia en código o documentación es un defecto.
* Cuando un término tiene significado distinto en contextos distintos, se crea una entrada por contexto con el prefijo `[NombreContexto] ·`.
* Toda entidad de dominio, caso de uso o evento que aparezca en el código debe tener su término en este glosario antes del merge a `main`.
* El glosario es propietad del Architecture Board y el Product Owner. Un cambio de definición requiere revisión de ambos — impacta naming de código, contratos y documentación.
* Los términos regulatorios (DUA, SUNAT, régimen aduanero) deben coincidir con la definición oficial del ente regulador, no con el uso coloquial interno.

---

## Documentos Relacionados

| Documento | Propósito |
|---|---|
| [ADR-0056 — Convenciones de Naming Empresarial](../../architecture/adrs/core/0056-convenciones-nombre-diseno-empresarial.es.md) | Los términos del glosario son la fuente de verdad para el naming de código, schemas y endpoints. |
| [ADR-0049 — Política de Naming y Código Limpio](../../architecture/adrs/core/0049-politica-naming-semantica-codigo-limpio.es.md) | Aplica el Lenguaje Ubicuo en variables, funciones y módulos. |
| [Contextos Acotados](./contextos-acotados.md) | El Lenguaje Ubicuo de cada contexto se define aquí; el glosario lo centraliza y controla. |
| [Glosario de Arquitectura](../../governance/glosario.md) | Terminología controlada del repositorio técnico (ADR, BMAD, SDLC…). Complementa el glosario de negocio. |

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-06-08
</p>
