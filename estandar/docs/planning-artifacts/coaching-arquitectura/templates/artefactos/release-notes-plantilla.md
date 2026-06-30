# Plantilla Vacía — Release Notes

> **Módulo:** [5. Infraestructura y Despliegue](../../artefactos/modulo-5.md) · **Tipo:** Notas de Lanzamiento

Copia esta plantilla, completa la información del release y commitéala antes del despliegue a producción.

---

# Release Notes — [Nombre del Sistema] v[VERSIÓN]

**Versión:** [MAJOR.MINOR.PATCH]   **Fecha de lanzamiento:** ___________
**Autor(es):** ___________   **Estado:** ☐ BORRADOR · ☐ APROBADO · ☐ PUBLICADO

---

## 1. Resumen del Release

[Describir en 2-4 oraciones qué incluye esta versión y cuál es su propósito principal.]

---

## 2. Cambios Incluidos

### Nuevas Funcionalidades

- [FEATURE-XXX] [Descripción de la funcionalidad] — [Autor]
- [FEATURE-XXX] [Descripción de la funcionalidad] — [Autor]

### Corrección de Bugs

- [BUG-XXX] [Descripción del bug corregido] — [Autor]
- [BUG-XXX] [Descripción del bug corregido] — [Autor]

### Mejoras de Performance

- [Descripción de la mejora] — [Autor]

### Documentación

- [Descripción de la actualización de documentación] — [Autor]

---

## 3. Calidad Certificada

| Métrica | Resultado | Umbral | Estado |
| :--- | :--- | :--- | :--- |
| **Tests Unitarios** | [X]% pass rate | ≥ 95% | ☐ Pass ☐ Fail |
| **Cobertura de Código** | [X]% | ≥ 80% | ☐ Pass ☐ Fail |
| **Tests de Integración** | [X]/[Y] pass | 100% | ☐ Pass ☐ Fail |
| **Performance (p95)** | [X]ms | ≤ [Y]ms | ☐ Pass ☐ Fail |
| **Security Scan** | [X] vulnerabilidades | 0 críticas | ☐ Pass ☐ Fail |

**Test Summary Report:** Enlace al RC sellado

---

## 4. Instrucciones de Despliegue

### Pre-requisitos

- [ ] [Requisito 1, ej: PostgreSQL 15 disponible]
- [ ] [Requisito 2, ej: Variables de entorno configuradas]
- [ ] [Requisito 3, ej: Backup de base de datos realizado]

### Pasos de Despliegue

```bash
# 1. Pull de la nueva imagen
docker pull [registry]/[nombre-sistema]:v[VERSION]

# 2. Detener contenedor actual
docker stop [nombre-sistema]

# 3. Iniciar nueva versión
docker-compose up -d [nombre-sistema]

# 4. Verificar salud
curl http://localhost:[puerto]/health
```

### Rollback (si es necesario)

```bash
# Revertir a versión anterior
docker pull [registry]/[nombre-sistema]:v[VERSION_ANTERIOR]
docker stop [nombre-sistema]
docker-compose up -d [nombre-sistema]
```

---

## 5. Variables de Entorno

| Variable | Valor | Descripción |
| :--- | :--- | :--- |
| `[NOMBRE_VARIABLE]` | `[valor]` | [Descripción] |
| `[NOMBRE_VARIABLE]` | `[valor]` | [Descripción] |

---

## 6. Breaking Changes

☐ **Sí** — Hay cambios incompatibles hacia atrás
☐ **No** — Compatible con versiones anteriores

[Si hay breaking changes, describirlos aquí con instrucciones de migración]

---

## 7. Aprobaciones

| Rol | Nombre | Firma (commit hash) | Fecha |
| :--- | :--- | :--- | :--- |
| **Product Owner** | | | |
| **Tech Lead** | | | |
| **QA Lead** | | | |

---

## 8. Referencias

- Jira/Issue Tracker: v[VERSION]
- Test Summary Report
- Release Notes v[VERSION_ANTERIOR]

---

*Plantilla generada bajo el estándar del corpus arquitectónico de UNIMAR · Idioma: Español · Versión: 1.0*
