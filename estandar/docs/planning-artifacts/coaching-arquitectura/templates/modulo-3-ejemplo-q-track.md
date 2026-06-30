# Ejemplo Q-Track — Módulo 3: Desarrollo y Code Review

> **Ruta:** [Plan de Implementación](../../plan-implementacion-arquitectura.md) → [Hub Módulo 3](../hubs/modulo-3.md) → [Plantilla](./modulo-3-template.md) → Ejemplo Q-Track

Sesión real completamente diligenciada usando el proyecto **Q-Track (Gestor de Colas de Camiones)** como caso de referencia.

---

# Sesión: Módulo 3 — Desarrollo y Code Review (API Q-Track + Arquitectura Hexagonal)

**Fecha:** 2025-02-17 al 2025-03-06   **Duración:** 3 semanas (1 sesión teórica + 4 talleres)
**Facilitador:** Alberto Arroyo   **Participantes:** Desarrollo, QA (como revisores)

---

## Propósito de la Sesión

Construir el API REST de Q-Track bajo el estándar corporativo completo: Arquitectura Hexagonal, TDD con cobertura ≥ 80%, GitFlow y Code Review obligatorio. Al finalizar, el equipo habrá producido un activo de software real (3 endpoints operativos) que sirve como referencia de implementación para todos los proyectos futuros de la Suite Operativa de UNIMAR.

---

## Pre-work Obligatorio

- [x] Revisar el ADR de Persistencia y los diagramas C4 aprobados en el Módulo 2
- [x] Leer sobre Arquitectura Hexagonal: [https://alistair.cockburn.us/hexagonal-architecture/](https://alistair.cockburn.us/hexagonal-architecture/)
- [x] Leer sobre TDD: [https://martinfowler.com/bliki/TestDrivenDevelopment.html](https://martinfowler.com/bliki/TestDrivenDevelopment.html)
- [x] Tener Node.js + TypeScript + Jest configurados localmente

---

## Agenda

| Bloque | Actividad | Duración | Prompt IA |
| :--- | :--- | :--- | :--- |
| 1 | Apertura: "Construir bajo estándar vs. construir rápido" (el dilema real) | 15 min | — |
| 2 | Arquitectura Hexagonal de Q-Track: cómo se mapean las capas | 20 min | [Prompt 1: Repasar Hexagonal](../prompts/modulo-3-prompts.md#prompt-1-repasar-hexagonal) |
| 3 | TDD lite: ciclo Red-Green-Refactor con caso `Turno.avanzar()` | 20 min | — |
| 4 | Code Review: qué se busca y cómo comunicar feedback constructivo | 15 min | — |
| 5 | Pipeline CI local: lint + test + cobertura | 20 min | — |
| — | BREAK | 10 min | — |
| 6 | Mob Programming: facilitador crea estructura hexagonal del proyecto | 45 min | [Prompt 2: Generar Estructura](../prompts/modulo-3-prompts.md#prompt-2-generar-estructura) |
| 7 | Primer test unitario en mob: `Turno.avanzar()` con estado CERRADO | 30 min | [Prompt 5: Generar Tests](../prompts/modulo-3-prompts.md#prompt-5-generar-tests) |
| 8 | Implementación mínima que pasa el test | 30 min | — |
| — | BREAK 15 min | 15 min | — |
| 9 | Cada participante crea rama `feature/modulo3-[nombre]` | 10 min | — |
| 10 | Implementar `POST /turnos` con TDD (práctica guiada) | 90 min | [Prompt 3: Generar Entidad](../prompts/modulo-3-prompts.md#prompt-3-generar-entidad) + [Prompt 4: Generar Caso de Uso](../prompts/modulo-3-prompts.md#prompt-4-generar-caso-de-uso) |
| 11 | Ejecutar cobertura y verificar ≥ 80% en capa de dominio | 20 min | [Prompt 7: Mejorar Cobertura](../prompts/modulo-3-prompts.md#prompt-7-mejorar-cobertura) |
| 12 | Implementar `GET /turnos/{id}` y `PATCH /turnos/{id}/avanzar` (independiente) | 90 min | — |
| 13 | Abrir PR + Code Review cruzado (mínimo 2 comentarios por reviewer) | 60 min | [Prompt 6: Revisar Código](../prompts/modulo-3-prompts.md#prompt-6-revisar-código) |
| 14 | Incorporar feedback + pipeline CI verde + merge | 45 min | — |

---

## Entregable de la Sesión (Quality Gate)

- **Qué debe producir el participante:** Código del API Q-Track con 3 endpoints en rama `feature/modulo3-endpoints-[nombre]`, con tests y cobertura ≥ 80% en la capa de dominio.
- **Criterios de aceptación (los 5 deben cumplirse):**
  - [x] Endpoints operativos: `POST /turnos`, `GET /turnos/{id}`, `PATCH /turnos/{id}/avanzar`
  - [x] Arquitectura Hexagonal respetada: entidades sin imports de Express/framework
  - [x] Cobertura de tests unitarios ≥ 80% en la capa de dominio (reporte adjunto)
  - [x] PR aprobado con al menos 2 comentarios de Code Review resueltos
  - [x] Pipeline CI local en verde (log adjunto al PR)
- **Forma de entrega:** Pull Request: `feature/modulo3-endpoints-[nombre]` → `develop`
- **Regla de oro:** Ningún código llega a `develop` con cobertura inferior al 80% o sin revisión de PR. El pipeline CI es el árbitro objetivo —no la opinión del desarrollador.

---

## Recursos y Herramientas

| Herramienta | Propósito | Enlace |
| :--- | :--- | :--- |
| Agente Amelia (Dev) — BMAD | Asistencia en implementación y revisión | `bmad-agent-dev` en OpenCode |
| Node.js + TypeScript | Runtime y lenguaje del API | [nodejs.org](https://nodejs.org/) |
| Jest | Framework de testing con cobertura | [jestjs.io](https://jestjs.io/) |
| Postman / curl | Verificación manual de endpoints | [postman.com](https://www.postman.com/) |
| ESLint | Linting estático del código TypeScript | [eslint.org](https://eslint.org/) |
| ADR de Persistencia | Restricciones técnicas aprobadas | `reference/architecture/adrs/adr-001-persistencia-q-track.md` |

---

## Estructura del Proyecto — Arquitectura Hexagonal Q-Track

```
q-track-api/
├── src/
│   ├── domain/                      ← Núcleo: sin dependencias externas
│   │   ├── entities/
│   │   │   ├── Turno.ts             ← Entidad principal con lógica de negocio
│   │   │   └── Cola.ts
│   │   ├── ports/
│   │   │   ├── ITurnoRepository.ts  ← Puerto de salida (interfaz)
│   │   │   └── INotificacion.ts
│   │   └── usecases/
│   │       ├── AvanzarTurno.ts      ← Caso de uso: orquesta dominio
│   │       └── AsignarTurno.ts
│   └── infrastructure/              ← Adaptadores (Express, PostgreSQL)
│       ├── http/
│       │   └── TurnoController.ts   ← Adaptador de entrada (HTTP)
│       └── persistence/
│           └── PostgresTurnoRepo.ts ← Adaptador de salida (BD)
└── tests/
    └── unit/domain/                 ← Tests del dominio (cobertura ≥ 80%)
```

---

## Ejemplo Test TDD — Turno.avanzar()

```typescript
// tests/unit/domain/Turno.test.ts
describe('Turno — Reglas de negocio', () => {
  it('lanza error si se intenta avanzar un turno CERRADO', () => {
    const turno = new Turno({ id: 'T-042', estado: EstadoTurno.CERRADO });
    expect(() => turno.avanzar()).toThrow('Turno cerrado, no se puede modificar');
  });

  it('cambia estado a EN_PROCESO si el turno está PENDIENTE', () => {
    const turno = new Turno({ id: 'T-043', estado: EstadoTurno.PENDIENTE });
    turno.avanzar();
    expect(turno.estado).toBe(EstadoTurno.EN_PROCESO);
  });
});
```

---

## Checklist de Code Review

- [x] La entidad `Turno` no importa Express, TypeORM ni ningún framework
- [x] El repositorio de BD es un Adaptador que implementa `ITurnoRepository` (Puerto)
- [x] El test de `Turno.avanzar()` con estado CERRADO falla sin la validación
- [x] Cobertura reportada ≥ 80% en archivos de `src/domain/`
- [x] Nombres de clases y métodos descriptivos y consistentes con el dominio
- [x] Sin `console.log` de depuración commiteados

---

## Notas del Facilitador

- Durante el Mob Programming, no escribir nunca antes de que el equipo proponga la solución. Si hay silencio, hacer preguntas: "¿Qué carpeta debería contener la entidad Turno?"
- Insistir en que el test se escriba ANTES de la implementación. Si alguien escribe el código primero, detener y reescribir en el orden correcto. El patrón mental importa más que la velocidad.
- El Code Review cruzado debe producir comentarios técnicos reales, no solo aprobaciones automáticas. El facilitador puede rechazar un PR sin comentarios genuinos.
- Recordar: OpenCode es un asistente, no el autor del código. Verificar siempre que el código generado respete la Arquitectura Hexagonal antes de aceptarlo.

---

## Evidencias de Certificación

- [x] Reporte de cobertura Jest: ≥ 80% en `src/domain/` (comentario en el PR)
- [x] Log del pipeline CI: lint ✓, test ✓, sin errores (adjunto al PR)
- [x] PR con mínimo 2 comentarios de Code Review con estado "Resolved"
- [x] Captura de `curl` o Postman: 3 endpoints respondiendo 200 OK
- [x] PR: `feature/modulo3-endpoints-[nombre]` → `develop`, estado: **Merged**

---

*Documento generado bajo el estándar del corpus arquitectónico de UNIMAR · Idioma: Español · Versión: 1.0*
