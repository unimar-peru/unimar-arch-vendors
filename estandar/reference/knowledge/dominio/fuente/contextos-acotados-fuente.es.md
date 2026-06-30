# Contextos Acotados — Fuente Reutilizable

> **Propósito:** Fuente reutilizable para mapear los bounded contexts de un producto o módulo de UNIMAR.
> **Fase SDLC:** 1 — Concepción y Descubrimiento / 2 — Diseño y Arquitectura
> **Responsable:** Arquitecto de Solución + Product Owner
> **Puerta de salida:** Baseline de Diseño Aprobado

---

## Mapa de Contextos — [Nombre del Producto / Suite]

### Diagrama de Relaciones

```mermaid
graph TD
    classDef core fill:#1e3a5f,stroke:#3b82f6,color:#fff,font-weight:bold
    classDef supporting fill:#14532d,stroke:#22c55e,color:#fff
    classDef generic fill:#374151,stroke:#9ca3af,color:#fff

    CTX_A["[Nombre Contexto A]<br/>Core"]:::core
    CTX_B["[Nombre Contexto B]<br/>Core"]:::core
    CTX_C["[Nombre Contexto C]<br/>Supporting"]:::supporting
    CTX_D["[Nombre Contexto D]<br/>Generic"]:::generic

    CTX_A -->|"OHS + PL<br/>[nombre del contrato]"| CTX_B
    CTX_C -->|"ACL<br/>[nombre del contrato]"| CTX_A
    CTX_D -->|"CF<br/>[nombre del contrato]"| CTX_C
```

---

### Catálogo de Contextos

---

#### [Nombre del Contexto] — Core | Supporting | Generic

**Lenguaje Ubicuo:** [Lista de términos clave con definición precisa dentro de este contexto]

**Responsabilidades:**

* [Qué posee y gestiona este contexto]
* [Qué reglas de negocio aplica]
* [Qué eventos de dominio publica]

**Lo que NO hace** *(límites explícitos)*:

* [Responsabilidad excluida 1]
* [Responsabilidad excluida 2]

**Relaciones con otros contextos:**

| Contexto relacionado | Patrón | Dirección | Contrato |
|---|---|---|---|
| [Nombre del Contexto X] | ACL / OHS+PL / C/S / CF / P | Upstream → / → Downstream | REST API `GET /ruta`, Evento `NombreEvento`, Archivo CSV |

**Schema de base de datos:** `[nombre_schema]`

**Módulo NestJS / proyecto Nx:** `[nombre del módulo o app]`

**Equipo responsable:** [nombre del equipo o rol]

---

*(Repetir bloque por cada contexto adicional)*

---

## Decisiones Pendientes

* [ ] [Pregunta abierta sobre límites entre contexto A y B]
* [ ] [Patrón de integración a confirmar entre X e Y]

---

## Historial de Revisiones

| Fecha | Cambio | Responsable |
|---|---|---|
| AAAA-MM-DD | Versión inicial | [Nombre] |

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-06-08
</p>
