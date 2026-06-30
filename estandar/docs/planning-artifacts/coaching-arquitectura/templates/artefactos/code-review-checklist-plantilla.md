# Plantilla Vacía — Code Review Checklist

> **Módulo:** [3. Desarrollo y Code Review](../../artefactos/modulo-3.md) · **Tipo:** Lista de Verificación de Revisión de Código

Usa esta plantilla para revisarPull Requests durante el Módulo 3.

---

# Code Review Checklist — [Nombre del Feature/Componente]

**PR:** #[Número]   **Autor:** ___________   **Reviewer:** ___________
**Fecha:** ___________   **Estado:** ☐ Pendiente · ☐ En revisión · ☐ Aprobado

---

## 1. Calidad de Código

| Criterio | Cumple | Comentarios |
| :--- | :--- | :--- |
| Código sigue estándares de linting (eslint/prettier) | ☐ Sí ☐ No | |
| Nombres de variables y funciones son descriptivos | ☐ Sí ☐ No | |
| Funciones son pequeñas (< 30 líneas) y con única responsabilidad | ☐ Sí ☐ No | |
| No hay código comentado o dead code | ☐ Sí ☐ No | |
| Manejo adecuado de errores (try/catch, resultados) | ☐ Sí ☐ No | |

---

## 2. Arquitectura Hexagonal

| Criterio | Cumple | Comentarios |
| :--- | :--- | :--- |
| Entidades de dominio sin imports de framework | ☐ Sí ☐ No | |
| Casos de uso aislados en `src/domain/` | ☐ Sí ☐ No | |
| Adaptadores de infraestructura en `src/infrastructure/` | ☐ Sí ☐ No | |
| Inyección de dependencias configurada correctamente | ☐ Sí ☐ No | |

---

## 3. Pruebas

| Criterio | Cumple | Comentarios |
| :--- | :--- | :--- |
| Tests unitarios para casos de uso críticos | ☐ Sí ☐ No | |
| Cobertura ≥ 80% en `src/domain/` | ☐ Sí ☐ No | |
| Tests siguen patrón Arrange-Act-Assert | ☐ Sí ☐ No | |
| Tests son independientes y no dependen de estado externo | ☐ Sí ☐ No | |

---

## 4. Seguridad

| Criterio | Cumple | Comentarios |
| :--- | :--- | :--- |
| No hay secrets o credenciales en el código | ☐ Sí ☐ No | |
| Validación de inputs en endpoints | ☐ Sí ☐ No | |
| Autenticación y autorización verificadas | ☐ Sí ☐ No | |
| No hay vulnerabilidades conocidas (SQL injection, XSS) | ☐ Sí ☐ No | |

---

## 5. Documentación

| Criterio | Cumple | Comentarios |
| :--- | :--- | :--- |
| README actualizado con instrucciones de uso | ☐ Sí ☐ No | |
| Comentarios en código solo donde es necesario | ☐ Sí ☐ No | |
| Changelog actualizado si es feature nuevo | ☐ Sí ☐ No | |

---

## 6. Criterios de Aceptación del Feature

| Criterio | Cumple |
| :--- | :--- |
| [Criterio 1 del PRD/historia] | ☐ Sí ☐ No |
| [Criterio 2 del PRD/historia] | ☐ Sí ☐ No |
| [Criterio 3 del PRD/historia] | ☐ Sí ☐ No |

---

## 7. Decisión del Review

- ☐ **Aprobado** — Merge permitido
- ☐ **Aprobado con comentarios** — Merge permitido, comentarios opcionales
- ☐ **Cambios solicitados** — Requiere revisión adicional

**Comentarios adicionales:**

[Escribir aquí comentarios constructivos para el autor]

---

*Plantilla generada bajo el estándar del corpus arquitectónico de UNIMAR · Idioma: Español · Versión: 1.0*
