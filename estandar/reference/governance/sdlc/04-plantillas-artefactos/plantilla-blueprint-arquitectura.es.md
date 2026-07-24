# Plantilla: Blueprint de Arquitectura de Producto (arc42)

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Plantilla%3A%20Blueprint%20de%20Arquitectura-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Activo-27ae60?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-1.0.0-042139?style=flat-square" alt="Versión">
</p>

> **Fase:** 2 — Diseño y Arquitectura (se inicia como borrador en Fase 1 — Discovery)
> **Puerta de salida:** Baseline de Diseño Aprobado
> **Padre:** [Plantillas de Artefactos](./README.md)

---

## Propósito

Un **Blueprint de Arquitectura de Producto** es el documento arc42 que cada producto produce para describir *su* arquitectura concreta: fronteras, contenedores, decisiones, atributos de calidad y fase de evolución. Es la instancia por-producto de la [Arquitectura de Referencia Corporativa](../../../architecture/blueprints/blueprint-referencia.es.md).

- La **Arquitectura de Referencia Corporativa** (documento lleno) es **la referencia agnóstica** de lo que Unimar propone: fronteras, pilares baseline, atributos de calidad y lógica de evolución.
- Esta **plantilla** es el **formato vacío para trabajar**: el equipo la copia en el repositorio del producto, la completa durante el Discovery y la congela en el gate **Baseline de Diseño Aprobado**.

> El Blueprint **no reemplaza** los ADRs: los referencia. Cada decisión significativa sigue documentándose en su propio ADR ([plantilla-adr](./plantilla-adr.es.md)); el Blueprint las consolida en una vista única navegable.

---

## Cuándo y cómo se usa

| Momento | Qué hacer con el Blueprint |
|---|---|
| **Fase 1 — Discovery** | Se crea como **borrador**: contexto (C4 N1), atributos de calidad objetivo, restricciones heredadas y fase de evolución elegida. Acompaña al PRD como entregable de descubrimiento. |
| **Fase 2 — Diseño** | Se completa: vista de contenedores (C4 N2), conceptos transversales, decisiones (ADR), requisitos de calidad y riesgos. Es **evidencia obligatoria** del gate. |
| **Fase 3+ — Construcción/Evolución** | Se **versiona** cuando cambia una frontera, un contenedor o un atributo de calidad. El delta documental es parte del DoD. |

---

## Elige tu Vista

| Vista | Link | Úsalo cuando |
|---|---|---|
| **Fuente Markdown** | [Abrir fuente Markdown reutilizable](./fuente/plantilla-blueprint-arquitectura-fuente.es.md) | Necesites copiar la estructura canónica arc42 en el repositorio del producto. |
| **Ejemplo Renderizado** | [Abrir ejemplo renderizado Q-Track](./ejemplos/ejemplo-blueprint-arquitectura-qtrack.es.md) | Quieras ver un Blueprint completado de un producto de Discovery y el nivel de detalle esperado. |
| **Referencia Corporativa** | [Abrir Arquitectura de Referencia](../../../architecture/blueprints/blueprint-referencia.es.md) | Necesites el modelo agnóstico de fronteras, pilares y evolución que el producto debe respetar. |

---

## Reglas de Autoría

- Copia el archivo **fuente** como punto de partida para cada nuevo producto; no edites la referencia corporativa.
- Todo Blueprint declara su **PRD padre** y deja trazables las **Historias Funcionales** que de él derivan ([Modelo de Trazabilidad](../modelo-trazabilidad.es.md)).
- Cada decisión significativa del Blueprint enlaza a un **ADR** con estado `Aceptado`; no se documentan decisiones nuevas dentro del Blueprint.
- Respeta el **Canon de Evolución Progresiva**: declara la fase actual (Monolito Modular → Extracción → Mesh) y no introduzcas complejidad que la fase no justifique.
- Cumple la **Baseline Agnóstica** y las **Directivas Arquitectónicas**: cualquier desviación requiere ADR + waiver de gobernanza.
- Los diagramas usan **Mermaid** (C4 Nivel 1 Contexto y Nivel 2 Contenedores como mínimo) y deben ser trazables a la referencia corporativa.

---

## Criterio de aprobación del gate (Baseline de Diseño)

- [ ] Contexto (C4 N1) y Contenedores (C4 N2) presentes y trazables al blueprint corporativo.
- [ ] Tabla de Atributos de Calidad con escenarios medibles.
- [ ] Decisiones significativas con ADR `Aceptado` referenciado (sin decisiones huérfanas).
- [ ] Fase de evolución declarada y justificada; sin sobre-ingeniería ([Checklist de Simplicidad F1](../../../architecture/blueprints/lista-verificacion-simplicidad-fase-01.es.md)).
- [ ] PRD padre y Historias Funcionales derivadas referenciados.
- [ ] Riesgos y deuda técnica registrados.

---

## Documentos Relacionados

| Documento | Propósito |
|---|---|
| [Arquitectura de Referencia Corporativa](../../../architecture/blueprints/blueprint-referencia.es.md) | Modelo agnóstico que este Blueprint instancia. |
| [Mapeo SDLC–Artefactos](../mapeo-artefactos-sdlc.es.md) | Define cuándo el Blueprint es requerido. |
| [Modelo de Trazabilidad](../modelo-trazabilidad.es.md) | Cómo el Blueprint enlaza PRD, FS y ADR. |
| [Plantilla de ADR](./plantilla-adr.es.md) | Artefacto donde se documenta cada decisión que el Blueprint referencia. |
| [Plantilla de Historia Funcional](./plantilla-historia-funcional.es.md) | Artefacto derivado del alcance que el Blueprint estructura. |
| [Gates de Calidad SDLC](../gates-calidad.es.md) | Umbrales y evidencia del gate Baseline de Diseño. |

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-06-26
</p>
