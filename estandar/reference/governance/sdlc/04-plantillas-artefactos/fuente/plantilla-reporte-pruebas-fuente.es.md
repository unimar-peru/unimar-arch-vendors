# Plantilla: Reporte Resumen de Pruebas

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Plantilla%3A%20Reporte%20Resumen%20de%20P%E2%80%A6-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Activo-27ae60?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-0.1.0-042139?style=flat-square" alt="Versión">
</p>

> **Fase:** 4 — Validación
> **Padre:** [Plantillas de Artefactos](../README.md)

## 1. Metadatos

- **Identificador:** `TSR-<Producto>-<NNN>`
- **Producto:** <Nombre del producto o servicio>
- **Versión:** <SemVer>
- **Ciclo de Lanzamiento:** <Identificador del release>
- **Estado:** Borrador | En Revisión | Aprobado
- **Responsable:** <Rol y nombre>
- **Fecha de Cierre:** <AAAA-MM-DD>

## 2. Resumen Ejecutivo

Resumen de máximo 200 palabras para audiencia ejecutiva: qué se probó, qué se aprobó, qué se rechazó y cuál es la decisión Go/No-Go recomendada. No incluir métricas intermedias; solo las más relevantes.

## 3. Alcance de Pruebas

- **Historias Funcionales probadas:** <Lista de IDs>
- **Historias Técnicas probadas:** <Lista de IDs>
- **Hotfixes probados:** <Lista de IDs>
- **Regresión cubierta:** <Módulos o áreas>
- **Fuera del alcance:** <Lo que explícitamente no se probó>

## 4. Métricas Clave

| Métrica | Valor | Umbral | Estado |
| --- | --- | --- | --- |
| Cobertura de líneas | <%> | <%> | OK / Atención / Fallo |
| Cobertura de ramas | <%> | <%> | OK / Atención / Fallo |
| Cobertura de mutación | <%> | <%> | OK / Atención / Fallo |
| Casos de prueba ejecutados | <Nº> | <Nº> | OK / Atención / Fallo |
| Tasa de éxito | <%> | <%> | OK / Atención / Fallo |
| Tiempo medio de respuesta (P95) | <ms> | <ms> | OK / Atención / Fallo |

## 5. Criterios de Aceptación Validados

| Historia | Criterio | Resultado | Evidencia |
| --- | --- | --- | --- |
| `FS-<Producto>-<NNN>` | <Criterio 1> | PASA / FALLA | <Enlace a la prueba> |
| `FS-<Producto>-<NNN>` | <Criterio 2> | PASA / FALLA | <Enlace a la prueba> |

## 6. Defectos

### 6.1 Pendientes

| ID | Severidad | Descripción | Bloqueante | Acción |
| --- | --- | --- | --- | --- |
| <HF-XXX> | Crítica/Alta/Media/Baja | <Descripción> | Sí/No | <Reabrir/Cerrar/Pospuesto> |

### 6.2 Cerrados Durante el Ciclo

| ID | Severidad | Descripción | Resolución |
| --- | --- | --- | --- |
| <HF-XXX> | <Severidad> | <Descripción> | <Resolución> |

## 7. Pruebas No Funcionales

| Categoría | Resultado | Evidencia |
| --- | --- | --- |
| Performance | OK / Atención / Fallo | <Enlace> |
| Seguridad (SAST/DAST) | OK / Atención / Fallo | <Enlace> |
| Accesibilidad | OK / Atención / Fallo | <Enlace> |
| Compatibilidad | OK / Atención / Fallo | <Enlace> |
| Resiliencia / Chaos | OK / Atención / Fallo | <Enlace> |

## 8. Riesgos Detectados Durante Validación

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| <Descripción> | Alta/Media/Baja | Alto/Medio/Bajo | <Plan> |

## 9. Decisión Aprobación / Rechazo

- [ ] **Aprobado:** todos los criterios de aceptación validados, no hay defectos bloqueantes, métricas clave dentro de umbrales.
- [ ] **Rechazado:** existe al menos un defecto bloqueante o una métrica clave fuera de umbral.

**Decisión:** <Aprobación / Rechazo>
**Justificación:** <1 a 3 párrafos>
**Aprobadores:**

- <Aprobador de Producto> — <Fecha>
- <Aprobador de Arquitectura> — <Fecha>
- <Aprobador de QA> — <Fecha>

## 10. Trazabilidad

- Este reporte es la base de la [Plantilla de Notas de Lanzamiento](../plantilla-notas-lanzamiento.es.md) y del acta de promoción a producción.
- Los criterios validados aquí se referencian desde el [Mapeo SDLC–Artefactos](../../mapeo-artefactos-sdlc.es.md).

## 11. Historial de Cambios

| Versión | Fecha | Autor | Cambios |
| --- | --- | --- | --- |
| 0.1.0 | <AAAA-MM-DD> | <Rol> | Versión inicial |

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-06-05
</p>