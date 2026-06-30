# Hub de Contribución

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Contribuci%C3%B3n-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Activo-27ae60?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-0.1.0-042139?style=flat-square" alt="Versión">
</p>

**← [Inicio](../../README.md) / Hub de Contribución**

> **Meta:** Canalizar y gobernar las contribuciones de todos los equipos internos de Unimar al corpus arquitectónico.
> **Objetivos:** (1) Definir quién puede contribuir y qué, (2) establecer un flujo de aprobación claro por tipo de cambio, (3) proveer plantillas y reglas para mantener la calidad del repositorio.

Este repositorio vive de la colaboración de todos los equipos internos de Unimar. Cualquier persona —programador, analista funcional, arquitecto, operador, QA— puede proponer mejoras, nuevo conocimiento o correcciones. El objetivo es que el corpus refleje fielmente la realidad operativa y tecnológica de la organización.

---

<details>
<summary><strong>¿Quién puede contribuir?</strong></summary>

| Rol | ¿Qué puede aportar? | ¿Cómo? |
| :-- | :------------------ | :----- |
| **Programador / Desarrollador** | Nuevos estándares de código, guías de implementación, patrones por stack, ADRs técnicos | PR con propuesta + evidencia |
| **Analista Funcional / de Procesos** | Glosario de negocio, contextos acotados, reglas de dominio, flujos de proceso, PRDs | Issue + documento de propuesta |
| **Arquitecto** | ADRs, blueprints, estándares arquitectónicos, NFRs, decisiones de stack | PR con ADR + justificación |
| **QA / Tester** | Estrategias de prueba, planes de performance, guías de seguridad, casos de prueba | PR con estrategia + métricas |
| **DevOps / Operaciones** | Runbooks, guías de despliegue, configuraciones de infra, alertas, DR plans | PR con procedimiento + validación |
| **Producto / PM** | PRDs, épicas, roadmaps, casos de negocio, retrospectivas | Issue + documento de propuesta |
| **Cualquier rol** | Correcciones de enlaces, typos, actualización de versiones, mejoras de formato | PR directo (sin issue previo) |

</details>

---

<details>
<summary><strong>¿Qué se puede contribuir?</strong></summary>

| Categoría | Ejemplos | Tipo de cambio |
| :-------- | :------- | :------------- |
| **Estándares de ingeniería** | Guías de stack, estrategias (API, frontend, BD, monitoreo, integraciones) | **Mayor** — requiere revisión del Architecture Board |
| **Decisiones arquitectónicas (ADRs)** | Nuevos ADRs, actualización de ADRs existentes, deprecación | **Mayor** — requiere ADR + revisión del Architecture Board |
| **Conocimiento de dominio** | Glosario de negocio, contextos acotados, flujos de proceso, reglas de negocio | **Media** — requiere revisión del Analista Funcional líder |
| **Guías operativas** | Runbooks, troubleshooting, DR plans, procedimientos de incidentes | **Media** — requiere revisión del DevOps líder |
| **Plantillas y ejemplos** | Nuevas plantillas SDLC, ejemplos UMS, formatos de reporte | **Media** — requiere revisión de Arquitectura |
| **Mejoras de navegación** | Enlaces, índices, tablas de contenido, descripciones | **Menor** — PR directo, revisión rápida |
| **Correcciones** | Enlaces rotos, typos, versiones desactualizadas, formato | **Menor** — PR directo, sin issue |

</details>

---

<details>
<summary><strong>Estrategia de Aprobación</strong></summary>

| Tipo de cambio | Aprueba | Tiempo estimado | Gate |
| :------------- | :------ | :-------------- | :--- |
| **Mayor** (nuevos estándares, ADRs, cambios arquitectónicos) | Architecture Board (mínimo 2 miembros) | 5-10 días hábiles | PR revisado + reunión semanal de arquitectura |
| **Media** (guías, dominio, plantillas) | Tech Lead del área correspondiente + 1 revisor | 2-5 días hábiles | PR revisado por al menos 1 par |
| **Menor** (navegación, correcciones) | Cualquier mantenedor | < 24 horas | PR directo sin blocker |

> **Regla:** Ningún cambio **Mayor** puede mergearse sin un ADR asociado (nuevo o existente) que lo respalde. Los cambios **Medios** deben incluir una sección de "Sustento y Evidencias" en la descripción del PR.

</details>

---

<details>
<summary><strong>Flujo de Contribución</strong></summary>

```mermaid
flowchart TD
    subgraph PROP["1. Proponer"]
        A["Identificar necesidad<br/>o mejora"]
        B["¿Es cambio<br/>Menor?"]
        C["Crear Issue<br/>describiendo la propuesta"]
        D["IR directo a PR"]
    end
    subgraph REV["2. Revisión"]
        E["PR con cambios<br/>+ evidencia"]
        F["Revisión técnica<br/>(Tech Lead / par)"]
        G["Revisión de arquitectura<br/>(si aplica)"]
    end
    subgraph APROB["3. Aprobación"]
        H{"¿Tipo de<br/>cambio?"}
        I["Menor: merge<br/>por mantenedor"]
        J["Media: aprobación<br/>de Tech Lead"]
        K["Mayor: aprobación<br/>del Architecture Board"]
    end
    subgraph MERGE["4. Integrar"]
        L["Merge a main"]
        M["Validación automática<br/>pre-commit hook"]
    end
    A --> B
    B -->|"Sí"| D
    B -->|"No"| C
    C --> E
    D --> E
    E --> F
    F --> G
    G --> H
    H -->|"Menor"| I
    H -->|"Media"| J
    H -->|"Mayor"| K
    I --> L
    J --> L
    K --> L
    L --> M
    M -->|"Error"| E
    M -->|"OK"| N["¡Contribución<br/>publicada!"]

</details>

---

<details>
<summary><strong>Formato de Propuesta</strong></summary>

Al crear un **Issue** o **PR**, incluir esta plantilla en la descripción:

```markdown
## Propuesta de Cambio

### 1. ¿Qué se propone?
[Descripción clara del cambio: nuevo documento, modificación, deprecación]

### 2. ¿Por qué es necesario?
[Problema que resuelve, oportunidad que aprovecha, riesgo que mitiga]

### 3. Sustento y Evidencias
- **Fuentes internas:** [enlace a documento interno, minuta, decisión de comité]
- **Fuentes externas:** [estándar de referencia, artículo, benchmark, herramienta]
- **Datos / métricas:** [si aplica, incluir datos que respaldan la propuesta]

### 4. Impacto
- **Documentos afectados:** [lista de archivos a crear/modificar/eliminar]
- **Equipos afectados:** [.NET, Node.js, Android, Frontend, QA, DevOps, etc.]
- **¿Requiere ADR?:** [Sí / No — si Sí, incluir enlace al ADR]

### 5. Checklist de Validación
- [ ] Los enlaces internos resuelven correctamente
- [ ] El contenido está en español (salvo acrónimos/identificadores)
- [ ] Los diagramas Mermaid pasan validación sintáctica
- [ ] Se actualizaron los índices de navegación (MASTER_INDEX, fase) si aplica
- [ ] La propuesta fue revisada por al menos un par del área afectada
```

</details>

---

<details>
<summary><strong>Reglas y Restricciones</strong></summary>

| Regla | Descripción | Consecuencia |
| :---- | :---------- | :----------- |
| **Idioma único** | Todo el contenido debe estar en español. Excepciones: acrónimos, identificadores de código, nombres de herramientas | El PR será rechazado si incluye contenido en otro idioma |
| **Enlaces relativos** | Todos los enlaces internos deben ser relativos y resolverse desde la ubicación del archivo | El hook de pre-commit valida los enlaces |
| **kebab-case** | Archivos y directorios en kebab-case. Sin directorios sin scope (`utils`, `common`, `shared`) | Se solicitará renombrar antes del merge |
| **Mermaid válido** | Todo bloque Mermaid debe pasar validación sintáctica | El pre-commit blockea bloques inválidos |
| **Índices actualizados** | Todo documento nuevo debe ser referenciado en el MASTER\_INDEX.md y en el índice de fase correspondiente | Se solicitará actualizar antes del merge |
| **Evidencia obligatoria** | Los cambios Mayores y Medios deben incluir sustento y evidencias en la descripción del PR | El PR no será revisado hasta que incluya la sección |
| **Pre-commit obligatorio** | Todos los commits deben pasar el hook de pre-commit (lint-staged + validate-docs) | El mantenedor puede rechazar commits que no pasen validación |

</details>

---

<details>
<summary><strong>Documentos de Referencia</strong></summary>

| Documento | Propósito |
| :-------- | :-------- |
| [AGENTS.md](../../AGENTS.md) | Reglas y convenciones para agentes IA que trabajan en este repositorio |
| [MASTER_INDEX.md](../navigation/MASTER_INDEX.md) | Índice completo de navegación del repositorio |
| [DECISIONS.md](../../DECISIONS.md) | Registro de decisiones arquitectónicas activas |
| [Glosario](../governance/glosario.md) | Terminología controlada del proyecto |
| [Taxonomía de Repositorio](../governance/standards/taxonomia-repositorio.md) | Estructura y nomenclatura del repositorio |
| [Gates de Calidad SDLC](../governance/sdlc/gates-calidad.es.md) | Criterios de calidad que aplican también a la documentación |
| [Template de ADR](../governance/sdlc/04-plantillas-artefactos/plantilla-adr.es.md) | Formato para registrar decisiones arquitectónicas |

</details>

---

<details>
<summary><strong>Navegación Rápida</strong></summary>

| Acción | Enlace |
| :----- | :----- |
| Volver al inicio | [README principal](../../README.md) |
| Ver todos los hubs | [Hubs Transversales](../../README.md#3-hubs-transversales) |
| Ver reglas para agentes IA | [AGENTS.md](../../AGENTS.md) |
| Ver índice completo | [MASTER_INDEX.md](../navigation/MASTER_INDEX.md) |

</details>

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-06-11
</p>
