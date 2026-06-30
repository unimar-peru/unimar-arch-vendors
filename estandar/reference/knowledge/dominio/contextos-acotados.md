# Mapa de Contextos Acotados

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Contextos%20Acotados-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Activo-27ae60?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-0.1.0-042139?style=flat-square" alt="Versión">
</p>

> **Fase SDLC:** 1 — Concepción y Descubrimiento / 2 — Diseño y Arquitectura
> **Puerta de salida:** Baseline de Diseño Aprobado
> **Padre:** [Conocimiento de Dominio](../dominio/README.md)
> **Audiencia:** Arquitectos, Tech Leads, Product Owners, analistas de negocio

---

## Propósito

Un **Contexto Acotado** (*Bounded Context*) es el límite explícito dentro del cual un modelo de dominio tiene significado preciso y consistente. Dentro de ese límite, cada término del Lenguaje Ubicuo tiene una sola definición. Fuera de él, el mismo término puede significar algo diferente.

El Mapa de Contextos Acotados (Context Map) cumple tres funciones en UNIMAR:

* **Evita ambigüedad de lenguaje**: el término "cliente" en Despacho Aduanero es el importador/exportador; en Gestión Comercial es la empresa con contrato activo. Sin un mapa explícito, los equipos hablan de cosas distintas usando las mismas palabras.
* **Define integraciones con contratos**: cada relación entre contextos es un contrato explícito (API, evento, ACL). Sin mapa, las dependencias se descubren tarde y rompen sprints.
* **Guía la arquitectura de módulos y microservicios**: los bounded contexts son los candidatos naturales a módulos en el monolito modular (Fase 1) y a microservicios en fases posteriores ([ADR-0045](../../architecture/adrs/core/0045-criterios-extraccion-microservicios.es.md)).

---

## Elige tu Vista

| Vista | Link | Úsalo cuando |
|---|---|---|
| **Fuente Markdown** | [Abrir fuente reutilizable](./fuente/contextos-acotados-fuente.es.md) | Necesites mapear los contextos de un nuevo producto o módulo. Copia esta estructura y complétala con tu dominio. |
| **Ejemplo Unimar** | [Abrir ejemplo Unimar](./ejemplo/contextos-acotados-ejemplo-unimar.es.md) | Quieras ver el mapa de contextos real de la suite de sistemas UNIMAR con sus relaciones y contratos. |

---

## Conceptos Clave del Mapa

### Clasificación de contextos

| Tipo | Significado | Implicación de diseño |
|---|---|---|
| **Core** | Genera ventaja competitiva directa. Es donde el negocio gana o pierde. | Máxima inversión en diseño y calidad. El equipo más fuerte. |
| **Supporting** | Apoya al core pero no es diferenciador. Necesario pero no único. | Puede desarrollarse internamente con estándares más simples o comprarse. |
| **Generic** | Funcionalidad commodity. Cualquier empresa lo necesita igual. | Comprar, usar OSS o un SaaS. Nunca construir desde cero. |

### Patrones de integración entre contextos

| Patrón | Abreviatura | Cuándo usarlo |
|---|---|---|
| Partnership | P | Dos equipos coordinan su evolución con frecuencia. |
| Customer–Supplier | C/S | Un contexto upstream provee; el downstream consume y tiene poder de negociación. |
| Conformist | CF | El downstream acepta el modelo del upstream sin poder cambiarlo. |
| Anti-Corruption Layer | ACL | El downstream traduce el modelo upstream para proteger su propio modelo de dominio. |
| Open Host Service | OHS | El upstream publica una API estable para múltiples consumidores. |
| Published Language | PL | Lenguaje de intercambio explícito y documentado (OpenAPI, AsyncAPI, Protobuf). |
| Separate Ways | SW | Los contextos no se integran. Resuelven el mismo problema de forma independiente. |

---

## Reglas de Autoría

* Cada contexto tiene exactamente un nombre canónico en el Lenguaje Ubicuo. No usar sinónimos dentro del mismo mapa.
* Toda relación entre contextos debe nombrar el patrón de integración y el contrato (API REST, evento de dominio, archivo).
* El tipo Core / Supporting / Generic debe ser acordado por el Architecture Board y el Product Owner — no es una decisión técnica unilateral.
* El mapa se revisa obligatoriamente al inicio de cada Fase 2 (Diseño y Arquitectura) de un nuevo producto o módulo.
* Los contextos Generic que se resuelven con OSS o SaaS se documentan de todas formas — ayuda a decidir qué NO construir.

---

## Documentos Relacionados

| Documento | Propósito |
|---|---|
| [ADR-0031 — Schema por Contexto](../../architecture/adrs/core/0031-esquema-por-contexto-catalogo-eventos-dominio.es.md) | Cada bounded context tiene su propio schema de base de datos. Los bounded contexts del mapa son la fuente de verdad para los schemas. |
| [ADR-0045 — Criterios de Extracción a Microservicios](../../architecture/adrs/core/0045-criterios-extraccion-microservicios.es.md) | Los bounded contexts Core son los candidatos naturales a extracción cuando se cumplen los criterios. |
| [ADR-0056 — Convenciones de Naming Empresarial](../../architecture/adrs/core/0056-convenciones-nombre-diseno-empresarial.es.md) | El nombre canónico de cada contexto rige el naming de módulos, schemas y namespaces. |
| [Glosario de Negocio](./glosario-negocio.md) | Terminología del dominio logístico-aduanero. El Lenguaje Ubicuo de cada contexto debe ser consistente con el glosario. |
| [Blueprint de Referencia](../../architecture/blueprints/blueprint-referencia.es.md) | Cómo los bounded contexts se materializan en módulos NestJS, schemas PostgreSQL y contratos de API. |

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-06-08
</p>
