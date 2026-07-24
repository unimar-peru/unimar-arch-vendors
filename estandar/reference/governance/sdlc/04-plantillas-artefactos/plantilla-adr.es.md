# Plantilla: Registro de Decisión Arquitectónica (ADR)

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Plantilla%3A%20Registro%20de%20Decisi%C3%B3n%E2%80%A6-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Activo-27ae60?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-1.0.0-042139?style=flat-square" alt="Versión">
</p>

> **Fase:** 2 — Diseño y Arquitectura (y durante la construcción)
> **Puerta de salida:** Baseline de Diseño Aprobada (ADRs iniciales); Build Exitoso (ADRs de runtime)
> **Padre:** [Plantillas de Artefactos](./README.md)

---

## Propósito

Un ADR registra una decisión arquitectónica significativa con su contexto, opciones, trade-offs, consecuencias y trazabilidad. Los ADRs hacen que las decisiones sean revisables antes de implementación y auditables después del delivery.

---

## Elige tu Vista

| Vista | Link | Úsalo cuando |
|---|---|---|
| **Fuente Markdown** | [Abrir fuente Markdown reutilizable](./fuente/plantilla-adr-fuente.es.md) | Necesites copiar la estructura canónica ADR en un repositorio de producto o delivery. |
| **Ejemplo Renderizado** | [Abrir ejemplo renderizado Q-Track](./ejemplos/ejemplo-adr-qtrack.es.md) | Quieras ver cómo debe verse un ADR aceptado en la práctica. |

---

## Reglas de Autoría

- Un ADR debe representar una sola decisión.
- Documenta opciones rechazadas, no solo la decisión seleccionada.
- Enlaza el ADR con PRDs, Historias Funcionales, Historias Técnicas y bounded contexts relacionados.
- No implementes una decisión arquitectónica significativa antes de que el ADR sea aceptado o tenga waiver explícito.

---

## Documentos Relacionados

| Documento | Propósito |
|---|---|
| [Mapeo SDLC–Artefactos](../mapeo-artefactos-sdlc.es.md) | Define cuándo los ADRs son requeridos o condicionales. |
| [Modelo de Trazabilidad](../modelo-trazabilidad.es.md) | Explica la posición del ADR en la cadena de evidencia. |
| [Gates de Calidad](../gates-calidad.es.md) | Define restricciones bloqueantes de release que pueden derivarse de ADRs. |

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-06-05
</p>
