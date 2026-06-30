# Hub de Gobernanza

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Gobernanza-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Activo-27ae60?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-0.2.0-042139?style=flat-square" alt="Versión">
</p>

**← [Inicio](../../README.md) / Hub de Gobernanza**

> **Meta:** Políticas, estándares y reglas que rigen el ciclo de vida de desarrollo de software de Unimar.
> **Objetivos:** (1) Definir el SDLC con gates de calidad y trazabilidad, (2) establecer estándares de ingeniería, (3) mantener el glosario y taxonomía corporativos.

---

<details>
<summary><strong>Ciclo de Vida (SDLC)</strong></summary>

Define el proceso de desarrollo, los puntos de control de calidad y la cadena de trazabilidad entre requisitos, decisiones, construcción y pruebas.

| Documento | Propósito | Por qué | Cuándo usarlo |
| :-------- | :-------- | :------ | :------------ |
| [Framework SDLC](./sdlc/02-ingenieria/framework-sdlc-enfoque-construccion.es.md) | Ciclo de construcción, métricas y Definition of Done | Unifica el proceso entre equipos y elimina ambigüedad en los entregables | Al iniciar un nuevo proyecto o al planificar un sprint |
| [Gates de Calidad](./sdlc/gates-calidad.es.md) | Checkpoints y criterios de promoción entre fases | Cada fase debe validar métricas bloqueantes antes de avanzar | Al completar cada fase del SDLC (F1 a F5) |
| [Modelo de Trazabilidad](./sdlc/modelo-trazabilidad.es.md) | Cadena de evidencia end-to-end (requisito → ADR → historia → test) | Permite auditar qué decisión o requisito generó cada artefacto | Durante todo el ciclo, especialmente en F4 (validación) |
| [Mapeo SDLC-Artefactos](./sdlc/mapeo-artefactos-sdlc.es.md) | Matriz de artefactos por fase del SDLC | Responde: ¿qué documento producir en cada fase? | Al planificar la documentación de un proyecto nuevo |
| [Estrategia de Ramificación GitFlow](./sdlc/estrategia-ramificacion.es.md) | Modelo de ramas, flujo de promoción, Pull Requests, estándar de commits y herramientas de validación | Sin una convención explícita se producen merges caóticos y pérdida de trazabilidad | Al iniciar un proyecto nuevo, crear ramas, abrir PRs o planificar un release |
| [Mejores Prácticas de Documentación](./sdlc/03-documentacion/mejores-practicas-documentacion-sdlc.es.md) | Convenciones de metadatos, UTF-8, versionado | La documentación inconsistente genera errores de interpretación | Al crear o modificar cualquier documento del repositorio |
| [Estándar de Redacción de HF](./sdlc/03-documentacion/estandar-redaccion-historias-funcionales.es.md) | Anatomía y criterios de aceptación de Historias Funcionales | Las HF son el contrato entre Producto y Construcción | Durante F2 (diseño) al redactar historias funcionales |

> **Métrica:** Porcentaje de proyectos que completan todos los gates antes de avanzar a la siguiente fase. Objetivo: 100%.

</details>

---

<details>
<summary><strong>Estándares de Ingeniería</strong></summary>

Normas técnicas que todo equipo debe aplicar durante la construcción. Definen el stack, el diseño de APIs, las estrategias de frontend, integraciones, base de datos y monitoreo.

| Documento | Propósito | Por qué | Cuándo usarlo |
| :-------- | :-------- | :------ | :------------ |
| [Manifiesto de Ingeniería](./standards/engineering/manifiesto-ingenieria.md) | Principios SOLID, DRY, KISS, YAGNI, test-first | Establece la cultura técnica del equipo | Antes de escribir la primera línea de código |
| [Estándar de Diseño de API](./standards/engineering/estandar-diseno-api.es.md) | Formato de respuesta, errores, paginación, versionado, idempotencia, OpenAPI | Unifica el consumo de APIs entre frontend, B2B y externos | Durante F2 (diseño) al definir contratos; durante F3 al implementar endpoints |
| [Estrategia de Frontend Web](./standards/engineering/estrategia-frontend-web.es.md) | React + Vite + TypeScript, Atomic Design, pruebas, rendimiento, seguridad | Todas las aplicaciones web comparten el mismo stack y patrones | Al iniciar un nuevo frontend o al migrar uno existente |
| [Estrategia de Integraciones](./standards/engineering/estrategia-integraciones.es.md) | Integración con SUNAT, SAP, clientes B2B, proveedores; ACL, seguridad, monitoreo | Centraliza el conocimiento de integraciones críticas del negocio | Al diseñar una nueva integración o al modificar una existente |
| [Estrategia de Monitoreo](./standards/engineering/estrategia-monitoreo.es.md) | Stack LGTM + Prometheus, métricas RED/USE, dashboards, alertas, SLIs/SLOs | Sin monitoreo, los incidentes se detectan cuando el usuario reporta | Al desplegar un nuevo servicio; al configurar alertas |
| [Estrategia de Base de Datos](./standards/engineering/estrategia-base-datos.es.md) | Motor por runtime (SQL Server/PG/SQLite), 3NF, seguridad, operaciones | Errores de diseño de BD son la segunda causa de incidentes en producción | Durante F2 al seleccionar motor; durante F3 al diseñar esquemas |
| [Guía de Pruebas de Contrato](./standards/engineering/guia-pruebas-contrato.es.md) | Contract testing con Pact: REST, gRPC, eventos | Sin contract testing, un cambio en API rompe consumidores silenciosamente | Durante F2 (diseño) y F3 (construcción), antes de integrar servicios |
| [Evaluación de Riesgo de Proveedor](./standards/engineering/evaluacion-riesgo-proveedor.es.md) | Vendor Risk Assessment (VRA): scoring 0-100, SCA, legal | Una dependencia vulnerable puede comprometer todo el sistema | Al introducir una nueva dependencia externa o librería |
| [Playbook de Observabilidad](./standards/engineering/playbook-observabilidad.es.md) | Buenas prácticas de observabilidad con OpenTelemetry | Estandariza la instrumentación entre stacks | Durante F3 (construcción) al instrumentar servicios |

</details>

---

<details>
<summary><strong>Visión y Estrategia</strong></summary>

Documentos que definen la dirección arquitectónica de largo plazo y las reglas de gobierno del repositorio.

| Documento | Propósito | Cuándo consultarlo |
| :-------- | :-------- | :----------------- |
| [Directivas Arquitectónicas](./standards/vision/directivas-arquitectonicas.es.md) | Principios rectores de la arquitectura corporativa | Antes de tomar decisiones arquitectónicas que afecten a toda la suite |
| [Roadmap de Estrategia Evolutiva](./standards/vision/roadmap-estrategia-evolutiva.es.md) | Evolución planeada del ecosistema Unimar | Al planificar el siguiente horizonte de producto (6-12 meses) |

</details>

---

<details>
<summary><strong>Glosario y Taxonomía</strong></summary>

Lenguaje controlado y estructura del repositorio para mantener consistencia entre equipos y proyectos.

| Documento | Propósito | Para quién |
| :-------- | :-------- | :---------- |
| [Glosario Corporativo](./glosario.md) | 550+ términos controlados de dominio, testing, seguridad, estándares e infraestructura | Todos los roles: unifica el lenguaje entre negocio, tecnología y operaciones |
| [Taxonomía de Repositorio](./standards/taxonomia-repositorio.md) | Estructura de directorios, nomenclatura y capas de autoridad | Arquitectos y contribuidores: guía dónde crear cada documento |
| [Guía de Herencia de Repositorio Hijo](./standards/onboarding/guia-herencia-repositorio-hijo.md) | Cómo los productos satélite heredan y especializan este corpus | Equipos de producto al crear un nuevo repositorio satélite |

</details>

---

<details>
<summary><strong>Plantillas SDLC</strong></summary>

Todas las plantillas reutilizables organizadas por fase, con fuente (copiable) y ejemplo (renderizado UMS).

| Fase | Plantillas | Ir al hub |
| :--- | :--------- | :-------- |
| F1 — Concepción | PRD, Épica, Backlog, HU, Lienzo Desc., Caso ROI, Estimación | [Hub de Plantillas →](./sdlc/04-plantillas-artefactos/README.md) |
| F2 — Diseño | Historia Funcional, ADR | [Hub de Plantillas →](./sdlc/04-plantillas-artefactos/README.md) |
| F3 — Construcción | Historia Técnica | [Hub de Plantillas →](./sdlc/04-plantillas-artefactos/README.md) |
| F4 — Validación | Reporte Resumen de Pruebas | [Hub de Plantillas →](./sdlc/04-plantillas-artefactos/README.md) |
| F5 — Entrega | Notas de Lanzamiento | [Hub de Plantillas →](./sdlc/04-plantillas-artefactos/README.md) |

</details>

---

<details>
<summary><strong>Informes Ejecutivos</strong></summary>

Análisis estratégicos y recomendaciones para la toma de decisiones de la Dirección de Tecnología.

| Documento | Propósito | Cuándo consultarlo |
| :-------- | :-------- | :----------------- |
| [Análisis SCM y DevSecOps](./informes-ejecutivos/informe-analisis-scm-devsecops.es.md) | Evaluación comparativa de plataformas SCM (GitHub, Azure DevOps, GitLab, Bitbucket) con modelo financiero, matriz de decisión y hoja de ruta | Al seleccionar o migrar la plataforma de control de código fuente corporativa |
| [Plan de Adquisición de Licencias de IA](./informes-ejecutivos/informe-adquisicion-licencias-ia.es.md) | Plan de suscripción de herramientas de IA (Claude, OpenCode, GitHub Copilot) para equipo de 20 personas, con escenarios de costo, hoja de ruta y recomendación estratégica | Al planificar la inversión en licencias de IA para el equipo de desarrollo |
| [Resumen de Inversión 2026-2029](./informes-ejecutivos/resumen-ejecutivo-inversion.es.md) | Proyección financiera mensual y anual de todas las herramientas (SCM, IA, Docker, hardware), con desglose por rubro y veredicto consolidado | Al presentar la inversión total al Comité Ejecutivo |

</details>

---

## Navegación Rápida

| Acción | Enlace |
| :----- | :----- |
| Volver al inicio | [README principal](../../README.md) |
| Ir al SDLC | [SDLC →](./sdlc/README.md) |
| Ir a Estándares | [Estándares →](./standards/README.md) |
| Ir a Ingeniería | [Estándares de Ingeniería →](./standards/engineering/README.md) |
| Ir a Informes Ejecutivos | Informes → |
| Ver todas las fases | [MASTER_INDEX.md](../navigation/MASTER_INDEX.md) |

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-06-11
</p>
