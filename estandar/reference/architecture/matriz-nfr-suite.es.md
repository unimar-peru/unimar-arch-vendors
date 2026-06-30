# Matriz de Requisitos No Funcionales de la Suite UNIMAR

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Matriz%20NFR-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Activo-27ae60?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-0.1.0-042139?style=flat-square" alt="Versión">
</p>

> **Owner:** Architecture Board
> **Aplicabilidad:** Toda la suite UNIMAR
> **Fase SDLC:** 2 — Diseño y Arquitectura / 4 — Validación y QA / 5 — Entrega y Operaciones
> **Padre:** [Estándar Arquitectónico Corporativo de la Suite UNIMAR](estandar-arquitectonico-suite-unimar.es.md)

---

## Propósito

Esta matriz define la línea base de requisitos no funcionales que todo producto de la Suite UNIMAR debe declarar, adaptar y verificar. Su función es convertir atributos de calidad en evidencia revisable durante los gates del SDLC.

Los umbrales concretos pueden variar por criticidad del sistema, pero ninguna iniciativa debe omitir la categoría. Cuando un NFR no aplique, el artefacto de diseño debe registrar la justificación.

---

## 1. Clasificación de Criticidad

| Nivel | Descripción | Ejemplos |
|---|---|---|
| C1 — Crítico Operativo | Interrumpe operación logística, cumplimiento regulatorio o facturación. | Depósito Temporal, Transportes, Facturación, Integraciones SUNAT/OSE. |
| C2 — Alto | Afecta operación diaria, pero admite contingencia manual temporal. | Almacenes, Contenedores, Patios, Notificaciones. |
| C3 — Medio | Afecta productividad, análisis o soporte, sin detener operación principal. | Reportes, tableros, backoffice no crítico. |
| C4 — Bajo | Herramientas internas o capacidades experimentales. | Prototipos, demos, utilidades no productivas. |

La criticidad se declara en el PRD y se confirma en la Baseline de Diseño.

---

## 2. Matriz NFR Mínima

| Categoría | Requisito base | Evidencia de diseño | Evidencia de validación |
|---|---|---|---|
| Disponibilidad | Definir objetivo de disponibilidad por criticidad y ventana operacional. | NFR en PRD, arquitectura de despliegue, dependencias críticas. | Monitoreo nominal, reporte de incidentes, prueba de failover cuando aplique. |
| Rendimiento | Definir latencia p95/p99 para rutas críticas y throughput esperado. | Capacidad estimada, endpoints críticos, presupuesto de latencia. | Pruebas de carga o medición productiva controlada. |
| Escalabilidad | Definir estrategia de crecimiento por usuario, transacción, sucursal y datos. | Modelo de escalado, límites conocidos, criterios de extracción. | Métricas de saturación, pruebas de stress o análisis de capacidad. |
| Seguridad | Autenticación, autorización, aislamiento por sucursal y secretos fuera de Git. | Modelo de amenazas, roles, permisos, estrategia de secretos. | Escaneo de seguridad, pruebas de autorización, revisión de configuración. |
| Privacidad y PII | Clasificar datos sensibles, reglas de logging y retención. | Catálogo de datos, clasificación, política de masking. | Revisión de logs, pruebas de redacción, evidencias de retención. |
| Auditabilidad | Registrar acciones de negocio relevantes con actor, tiempo, contexto y resultado. | Eventos auditables, estructura de auditoría, retención. | Pruebas de auditoría, consulta de trazas, validación de inmutabilidad. |
| Observabilidad | Logs estructurados, trazas y métricas para rutas productivas. | Diseño de señales, dashboards esperados, alertas. | Dashboard, trazas correlacionadas, checklist de observabilidad. |
| Resiliencia | Definir retry, timeout, circuit breaker, fallback e idempotencia donde aplique. | Matriz de fallas y dependencias externas. | Pruebas de falla, simulación controlada o evidencia operacional. |
| Recuperación | Definir RTO, RPO, backup, restore y rollback. | Plan DR, política de backup, estrategia de rollback. | Prueba de restore, dry-run de rollback, evidencia de backup. |
| Interoperabilidad | Contratos versionados para APIs, eventos y archivos. | OpenAPI, Protobuf, AsyncAPI o especificación de archivo. | Contract tests o revisión formal mientras la guía esté pendiente. |
| Mantenibilidad | Límites de módulo, complejidad, cobertura y deuda técnica bajo umbral. | Estructura modular, ADRs, patrones canónicos. | CI, cobertura, complejidad, revisión de arquitectura. |
| Portabilidad | Evitar acoplamiento a proveedor; usar puertos y protocolos estándar. | Puertos, adaptadores, estrategia de salida. | Prueba de configuración, revisión de dependencias, evaluación de proveedor. |

---

## 3. Umbrales Recomendados por Criticidad

| NFR | C1 — Crítico Operativo | C2 — Alto | C3 — Medio | C4 — Bajo |
|---|---|---|---|---|
| Disponibilidad | Definida con operación 24/7 o ventana crítica explícita. | Definida para horario operacional. | Definida por jornada de uso. | Best effort documentado. |
| Latencia p95 API interna | Objetivo explícito por ruta crítica. | Objetivo por flujo principal. | Objetivo general por pantalla o job. | Sin umbral bloqueante salvo UX crítica. |
| RTO | Obligatorio y probado antes de producción. | Obligatorio y ensayado al menos por procedimiento. | Documentado. | Opcional con justificación. |
| RPO | Obligatorio por tipo de dato. | Obligatorio para datos operativos. | Documentado para datos persistidos. | Opcional con justificación. |
| Observabilidad | Dashboard, alertas y trazas obligatorias. | Dashboard y alertas obligatorias. | Logs y métricas básicas. | Logs básicos. |
| Seguridad | Revisión de amenazas y pruebas de autorización obligatorias. | Pruebas de autorización obligatorias. | Revisión de permisos. | Controles básicos. |
| Performance | Carga, stress o capacidad requerida. | Carga requerida en flujos principales. | Medición básica. | No requerida salvo decisión explícita. |
| Contract testing | Obligatorio para integraciones externas. | Obligatorio para APIs consumidas por otros sistemas. | Recomendado. | Opcional. |

Los valores numéricos finales se definen por producto. Cuando el Architecture Board apruebe umbrales corporativos cuantitativos, esta matriz debe actualizarse junto con los gates correspondientes.

---

## 4. Evidencia por Gate

| Gate | Evidencia NFR obligatoria |
|---|---|
| Aprobación de Negocio | Criticidad, restricciones regulatorias, ventanas operativas y no-objetivos. |
| Baseline de Diseño Aprobado | Matriz NFR completada, ADRs relevantes, diseño de seguridad, datos, integración y observabilidad. |
| Build Exitoso | Pruebas automatizadas, escaneo de seguridad, cobertura, complejidad y delta documental. |
| RC Sellado | Test Summary Report con NFRs verificados o waivers aprobados. |
| Producción Activa | Release Notes, rollback, monitoreo nominal, dashboards y evidencia de operación. |

---

## 5. Plantilla de Registro por Producto

```markdown
## NFR-<Producto>-<NNN>

> **Producto:** <nombre>
> **Criticidad:** C1 | C2 | C3 | C4
> **Owner:** <rol/equipo>
> **Estado:** Borrador | Aprobado | Supersedido

| Categoría | Objetivo | Evidencia requerida | Gate |
|---|---|---|---|
| Disponibilidad | <objetivo> | <evidencia> | <gate> |
| Rendimiento | <objetivo> | <evidencia> | <gate> |
| Seguridad | <objetivo> | <evidencia> | <gate> |
```

---

## 6. Documentos Relacionados

| Documento | Relación |
|---|---|
| [Estándar Arquitectónico Corporativo](estandar-arquitectonico-suite-unimar.es.md) | Define el marco general de arquitectura. |
| [Gates de Calidad SDLC](../governance/sdlc/gates-calidad.es.md) | Define umbrales bloqueantes de calidad. |
| [Modelo de Trazabilidad](../governance/sdlc/modelo-trazabilidad.es.md) | Conecta NFRs con artefactos y evidencia de release. |
| [ADR-0045](adrs/core/0045-criterios-extraccion-microservicios.es.md) | Define criterios cuantitativos de extracción. |
| [Línea Base Agnóstica](stack-tecnologico-autorizado-agnostico.es.md) | Define estándares universales de tecnología e infraestructura. |

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-06-09
</p>
