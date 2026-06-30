# Ejemplo Q-Track — Retrospectiva del Programa

> **Módulo:** [6. Soporte y Retrospectiva](../../artefactos/modulo-6.md) · **Tipo:** Documento de Aprendizaje Organizacional

Ejemplo completamente diligenciado de la Retrospectiva del Programa SDLC de **Q-Track**.

---

# Retrospectiva del Programa SDLC — Q-Track: Gestor de Colas de Camiones

**Versión:** 1.0   **Fecha:** 2025-05-15   **Facilitador:** Alberto Arroyo
**Participantes:** Jorge Salas (Procesos), María López (Frontend), Carlos Ruiz (Backend), María Rodríguez (QA), Luis Gómez (Infraestructura)

---

## 1. Resumen del Programa

**Duración:** 2025-01-31 a 2025-05-15 (15 semanas)
**Proyecto:** Q-Track: Gestor de Colas de Camiones
**Objetivo del Programa:** Transformar la cultura de ingeniería de UNIMAR mediante la adopción del SDLC gobernado, pasando de un modelo de desarrollo en silos a una cultura de ingeniería predecible, altamente gobernada y asistida por IA.

---

## 2. Métricas del Programa

| Métrica | Objetivo | Resultado | Estado |
| :--- | :--- | :--- | :--- |
| **Módulos Completados** | 7 módulos | 7/7 módulos | ☑ Cumplido |
| **Quality Gates Aprobados** | 15/15 gates | 14/15 gates | ☐ No cumplido (1 gate reprobado inicialmente) |
| **Cobertura de Tests** | ≥ 80% | 89% | ☑ Cumplido |
| **Incidentes en Producción** | ≤ 2 incidentes críticos | 1 incidente (Escenario 1, resuelto en 25 min) | ☑ Cumplido |
| **Satisfacción del Equipo** | ≥ 4/5 | 4.6/5 | ☑ Cumplido |

---

## 3. ¿Qué salió bien? (Keep)

- ✅ **Pair programming con IA:** El uso de OpenCode para debatir ADRs y revisar código redujo errores en un 40%
- ✅ **Quality Gates numéricos:** Tener umbrales claros (cobertura ≥80%, tests 100% pass) eliminó ambigüedad en definición de "terminado"
- ✅ **Plantillas pre-aprobadas:** Las plantillas de PRD, ADR y Test Summary Report aceleraron la documentación en un 60%
- ✅ **Simulacros de incidente:** El entrenamiento con el runbook en staging preparó al equipo para el incidente real de producción

---

## 4. ¿Qué no salió bien? (Problem)

- ❌ **Gate de Módulo 2 reprobado inicialmente:** El primer ADR no incluyó alternativas rechazadas con justificación de negocio, requiriendo reelaboración
- ❌ **Falta de tiempo dedicado:** Algunos participantes reportaron que la operación de soporte L1 interrumpió los talleres prácticos
- ❌ **Curva de aprendizaje de Testcontainers:** El equipo de QA tardó 3 días adicionales en configurar tests de integración con contenedores reales

---

## 5. ¿Qué haremos diferente? (Try)

| Acción | Responsable | Fecha límite | Cómo se medirá el éxito |
| :--- | :--- | :--- | :--- |
| **Pre-work obligatorio validado antes de cada módulo** | Alberto Arroyo | Próximo programa (2025-06-01) | 100% de participantes completan pre-work antes de sesión |
| **Bloqueo de calendario para talleres:** Los participantes estarán 100% liberados de operación durante talleres | Jorge Salas (Gerencia) | Próximo programa | 0 interrupciones operativas reportadas |
| **Sesión de onboarding de Testcontainers:** Módulo 0 incluirá taller específico de pruebas con contenedores | María Rodríguez | 2025-05-30 | QA configura tests de integración en <1 día |
| **Checklist de ADR antes de revisión:** Incluir lista de verificación de secciones obligatorias | Alberto Arroyo | 2025-05-20 | 100% de ADRs aprobados en primer review |

---

## 6. Lecciones Aprendidas

### Lección 1: La arquitectura documentada es un contrato, no una sugerencia

**Contexto:** Durante el Módulo 3, un desarrollador implementó un endpoint directamente en el controlador sin pasar por el caso de uso de dominio, violando la arquitectura hexagonal documentada en el ADR-001.

**Aprendizaje:** La arquitectura debe ser validada en code review con la misma severidad que la funcionalidad. Un código funcional que viola arquitectura es **deuda técnica inmediata**.

**Aplicación Futura:** Incluir "Respeto a arquitectura hexagonal" como criterio explícito en la Code Review Checklist. El reviewer debe verificar que no haya imports de framework en entidades de dominio.

---

### Lección 2: Los Quality Gates numéricos eliminan discusiones subjetivas

**Contexto:** En programas anteriores, la definición de "terminado" era debatible ("los tests están bien", "la cobertura es suficiente"). Con gates numéricos (cobertura ≥80%, 100% tests pass), no hay ambigüedad.

**Aprendizaje:** Los números objetivos aceleran la toma de decisiones y reducen fricción entre equipo y facilitador.

**Aplicación Futura:** Extender el modelo de gates numéricos a otros aspectos: performance (p95 ≤300ms), seguridad (0 vulnerabilidades críticas), documentación (100% secciones completas).

---

### Lección 3: La IA como par de programación multiplica el aprendizaje, no lo reemplaza

**Contexto:** Algunos participantes inicialmente usaron OpenCode para "hacer la tarea" sin entender el porqué. El facilitador corrigió esto pidiendo que explicaran el código generado.

**Aprendizaje:** La IA es una herramienta de aprendizaje acelerado cuando se usa con intención de comprender, no de delegar ciegamente.

**Aplicación Futura:** Incluir en las reglas del programa: "Todo código generado por IA debe ser explicado por el participante en el PR". El facilitador hará preguntas de comprensión en code review.

---

## 7. Agradecimientos

- 🙏 **Jorge Salas (Procesos)** por su compromiso con el pre-work y por validar el PRD con el equipo de operaciones en tiempo récord
- 🙏 **María Rodríguez (QA)** por crear el Test Summary Report más detallado que hemos visto y por el runbook de 5 escenarios
- 🙏 **Carlos Ruiz (Infraestructura)** por configurar el pipeline CI/CD en tiempo récord y por su paciencia enseñando Docker al equipo
- 🙏 **Alberto Arroyo (Facilitador)** por su dedicación en las sesiones y por estar disponible 24/7 durante el incidente de producción

---

## 8. Firma de Cierre

**Facilitador:** Alberto Arroyo   **Fecha:** 2025-05-15

**Representante del Equipo:** Jorge Salas   **Fecha:** 2025-05-15

---

*Ejemplo Q-Track generado bajo el estándar del corpus arquitectónico de UNIMAR · Idioma: Español · Versión: 1.0*
