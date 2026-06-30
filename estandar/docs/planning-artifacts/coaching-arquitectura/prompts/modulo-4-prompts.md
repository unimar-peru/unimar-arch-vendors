# Prompt Library — Módulo 4 (Calidad e Integración)

> **Módulo:** Módulo 4 · **Tipo:** Biblioteca de Prompts para IA  
> **Herramientas:** OpenCode, BMAD Method v6.8.0, Testcontainers, Jest

---

## Propósito

Este documento contiene los prompts exactos para ejecutar cada actividad del Módulo 4 con asistencia de IA.

---

## Agenda con Prompts

| Bloque | Actividad | Duración | Prompt |
| :--- | :--- | :--- | :--- |
| 2 | Pirámide de Testing: teoría | 20 min | [Prompt 1: Explicar Pirámide](#prompt-1-explicar-pirámide) |
| 3 | Testcontainers: configuración | 30 min | [Prompt 2: Configurar Testcontainers](#prompt-2-configurar-testcontainers) |
| 4 | Tests de integración con PostgreSQL | 60 min | [Prompt 3: Generar Tests Integración](#prompt-3-generar-tests-integración) |
| 6 | Tests E2E del flujo completo | 60 min | [Prompt 4: Generar Tests E2E](#prompt-4-generar-tests-e2e) |
| 8 | Test Summary Report | 45 min | [Prompt 5: Generar Reporte](#prompt-5-generar-reporte) |
| 10 | Sellado de RC | 30 min | [Prompt 6: Validar RC](#prompt-6-validar-rc) |

---

## Prompt 1: Explicar Pirámide

**Propósito:** Generar explicación de Pirámide de Testing.

**Cuándo usar:** Bloque 2 — 20 min

**Prompt:**

```
Actúa como un QA Lead experto en estrategias de testing.

Explica la Pirámide de Testing y su aplicación en Q-Track.

Incluye:

1. **Los 3 niveles de la pirámide:**
   - **Base (70%):** Tests unitarios — rápidos, baratos, aislados
   - **Medio (20%):** Tests de integración — verifican conexiones entre componentes
   - **Cima (10%):** Tests E2E — flujos completos desde la UI

2. **Diagrama Mermaid:**
   - Triángulo dividido en 3 secciones
   - Porcentajes y características por nivel

3. **¿Por qué esta proporción?**
   - Unitarios: ejecutan en milisegundos, no requieren infraestructura
   - Integración: ejecutan en segundos, requieren contenedores (Docker)
   - E2E: ejecutan en minutos, frágiles, costosos de mantener

4. **Ejemplo Q-Track:**
   - **Unitario:** `AsignarTurnoUseCase.spec.ts` — testea lógica sin BD
   - **Integración:** `TurnoRepository.spec.ts` — testea PostgreSQL real con Testcontainers
   - **E2E:** `flujo-completo.spec.ts` — desde HTTP request hasta respuesta + BD

5. **Errores comunes:**
   - Pirámide invertida (muchos E2E, pocos unitarios)
   - Tests de integración que son en realidad unitarios (mockean todo)
   - Tests E2E que dependen de datos específicos

Formato de salida:
-Lista de los 3 niveles
- Diagrama Mermaid
- Tabla comparativa (velocidad, costo, confiabilidad)
- Ejemplos Q-Track por nivel
- Lista de errores comunes

Audiencia: Desarrolladores y QA aprendiendo estrategia de testing.
Tono: Didáctico, con ejemplos concretos.
```

**Salida esperada:** Explicación visual + ejemplos por nivel.

---

## Prompt 2: Configurar Testcontainers

**Propósito:** Generar configuración de Testcontainers para tests de integración.

**Cuándo usar:** Bloque 3 — 30 min

**Prompt:**

```
Actúa como un DevOps Engineer experto en Testcontainers y testing de integración.

Genera configuración completa de Testcontainers para Q-Track.

**Requisitos:**

1. **Instalación:**
   ```bash
   npm install --save-dev testcontainers @testcontainers/postgresql
   ```

2. **Configuración de Docker:**
   - Verificar Docker Desktop instalado y corriendo
   - Verificar que `docker ps` funciona sin sudo

3. **Helper de Testcontainers:**
   - Crear archivo `test/helpers/postgres-container.ts`
   - Función `startPostgresContainer()` que retorna conexión string
   - Función `stopPostgresContainer()` para cleanup

4. **Configuración de Jest:**
   - `globalSetup.ts`: inicia contenedor antes de todos los tests
   - `globalTeardown.ts`: detiene contenedor después de todos los tests
   - `jest.config.json`: referencia a globalSetup y globalTeardown

5. **Variables de entorno para tests:**
   - `TEST_DATABASE_URL` apuntando al contenedor
   - No usar la BD de desarrollo ni producción

6. **Ejemplo de uso:**
   ```typescript
   // En un test de integración
   import { startPostgresContainer } from '../helpers/postgres-container';
   
   beforeAll(async () => {
     const connectionString = await startPostgresContainer();
     process.env.DATABASE_URL = connectionString;
   });
   ```

Formato de salida:
- Comandos de instalación
- Código del helper de contenedor
- Configuración de Jest completa
- Ejemplo de uso en test

Audiencia: Desarrolladores configurando tests de integración.
Tono: Instruccional, paso a paso.
```

**Salida esperada:** Configuración completa lista para copiar y pegar.

---

## Prompt 3: Generar Tests Integración

**Propósito:** Generar tests de integración contra PostgreSQL real.

**Cuándo usar:** Bloque 4 — 60 min

**Prompt:**

```
Actúa como un QA Engineer experto en tests de integración con Testcontainers.

Genera 5 escenarios de tests de integración para Q-Track contra PostgreSQL real.

**Escenarios requeridos:**

1. **Crear turno y verificar persistencia:**
   - Crea turno vía repositorio
   - Consulta directamente en BD (SQL) para verificar que existe
   - Limpieza: delete del turno creado

2. **Buscar turno por placa:**
   - Inserta 3 turnos con distintas placas
   - Busca por una placa específica
   - Verifica que retorna solo el turno correcto

3. **Actualizar estado de turno:**
   - Crea turno en estado EN_ESPERA
   - Ejecuta método `asignar()`
   - Verifica que estado cambió a EN_PROGRESO en BD

4. **Validar unicidad de placa activa:**
   - Crea turno activo para placa ABC-123
   - Intenta crear otro turno para misma placa
   - Verifica que lanza `TurnoDuplicadoError`

5. **Reporte de KPIs:**
   - Inserta 10 turnos con distintos estados
   - Ejecuta query de agregación (COUNT por estado)
   - Verifica que números coinciden

**Requisitos técnicos:**
- Usar Testcontainers para PostgreSQL
- Cada test debe ser independiente (no depende de datos de otro test)
- Usar `beforeEach` para limpiar BD entre tests
- Usar transacciones para rollback automático si es posible

Formato de salida:
- Archivo de tests completo (`turno.repository.spec.ts`)
- 5 tests con nombres descriptivos
- Helpers de limpieza y setup
- Instrucciones para ejecutar

Audiencia: Desarrolladores escribiendo tests de integración.
Tono: Práctico, con ejemplos copy-paste.
```

**Salida esperada:** 5 tests de integración completos contra PostgreSQL real.

---

## Prompt 4: Generar Tests E2E

**Propósito:** Generar tests E2E del flujo completo.

**Cuándo usar:** Bloque 6 — 60 min

**Prompt:**

```
Actúa como un QA Engineer experto en tests E2E para APIs REST.

Genera 3 escenarios de tests E2E para Q-Track que cubran el flujo completo.

**Escenarios requeridos:**

1. **Flujo completo: Conductor consulta turno:**
   - POST /turnos (crear turno)
   - GET /turnos?placa=ABC-123 (consultar turno)
   - Verificar respuesta HTTP 200 + cuerpo correcto
   - Verificar que turno está en BD

2. **Flujo completo: Operador avanza cola:**
   - POST /turnos (crear turno)
   - PATCH /turnos/:id/avanzar (avanzar turno)
   - Verificar que estado cambió a EN_PROGRESO
   - Verificar que evento fue publicado (mock de XMS)

3. **Flujo completo: Supervisor genera reporte:**
   - POST /turnos (crear 5 turnos con distintos estados)
   - GET /reportes/kpis (obtener KPIs)
   - Verificar que números coinciden con datos insertados

**Requisitos técnicos:**
- Levantar API completa en puerto de test (ej: 3001)
- Usar Testcontainers para PostgreSQL
- Mockear sistemas externos (UMS, XMS) con `nock` o `msw`
- Cada test es independiente (setup y teardown propios)
- Assertions en respuesta HTTP y en BD

**Ejemplo de estructura:**
```typescript
describe('Flujo E2E: Consulta de Turno', () => {
  beforeAll(async () => {
    // Levantar API + BD
  });
  
  afterAll(async () => {
    // Bajar API + BD
  });
  
  test('debe retornar turno cuando placa existe', async () => {
    // Arrange: crear turno vía API
    // Act: consultar turno vía API
    // Assert: verificar respuesta + BD
  });
});
```

Formato de salida:
- Archivo de tests E2E completo (`e2e/flujo-completo.spec.ts`)
- 3 tests con nombres descriptivos
- Configuración de setup y teardown
- Instrucciones para ejecutar

Audiencia: Desarrolladores y QA escribiendo tests E2E.
Tono: Práctico, con ejemplos de integración API + BD.
```

**Salida esperada:** 3 tests E2E completos cubriendo flujos críticos.

---

## Prompt 5: Generar Reporte

**Propósito:** Generar Test Summary Report para RC.

**Cuándo usar:** Bloque 8 — 45 min

**Prompt:**

```
Actúa como un QA Lead redactando un Test Summary Report formal para un Release Candidate.

Genera un Test Summary Report para Q-Track v1.0.0 RC siguiendo esta estructura:

# Test Summary Report — Q-Track Release Candidate v1.0.0

**Versión:** 1.0.0   **Fecha:** [FECHA]   **Autor(es):** [NOMBRE]
**Estado:** ☐ BORRADOR · ☐ EN EJECUCIÓN · ☐ SELLADO

## 1. Información del Release Candidate

| Campo | Valor |
| :--- | :--- |
| **RC Versión** | v1.0.0 |
| **Commit Hash** | [HASH] |
| **Rama** | `release/v1.0.0` |
| **Fecha de corte** | [FECHA] |
| **Responsable de QA** | [NOMBRE] |

## 2. Resumen Ejecutivo

[2-3 oraciones describiendo estado general de calidad. ¿Está listo para producción?]

## 3. Cobertura de Pruebas

| Tipo de Prueba | Total | Ejecutadas | Aprobadas | Fallidas | Cobertura |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Unitarias** | | | | | |
| **Integración** | | | | | |
| **E2E** | | | | | |
| **TOTAL** | | | | | |

## 4. Escenarios Críticos Probados

| # | Escenario | Resultado | Evidencia |
| :--- | :--- | :--- | :--- |
| 1 | [Descripción] | ☐ Pass ☐ Fail | [Link] |
| 2 | [Descripción] | ☐ Pass ☐ Fail | [Link] |
| 3 | [Descripción] | ☐ Pass ☐ Fail | [Link] |
| 4 | [Descripción] | ☐ Pass ☐ Fail | [Link] |
| 5 | [Descripción] | ☐ Pass ☐ Fail | [Link] |

## 5. Defectos Conocidos

| ID | Severidad | Descripción | Impacto | Workaround | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| [BUG-001] | 🔴 Alta 🟡 Media 🟢 Baja | [Descripción] | [Impacto] | [Solución] | ☐ Abierto ☐ Cerrado |

## 6. Criterios de Aceptación del RC

| Criterio | Cumple |
| :--- | :--- |
| Todos los tests unitarios en verde (≥ 80% cobertura en dominio) | ☐ Sí ☐ No |
| Todos los tests de integración en verde (100% escenarios críticos) | ☐ Sí ☐ No |
| Cero defectos de severidad Alta abiertos | ☐ Sí ☐ No |
| Performance dentro de umbrales aceptables (≤ [X]ms p95) | ☐ Sí ☐ No |
| Documentación de release notes completa | ☐ Sí ☐ No |

## 7. Decisión de Release

- ☐ **APROBADO PARA PRODUCCIÓN**
- ☐ **APROBADO CON RIESGOS CONOCIDOS**
- ☐ **RECHAZADO**

**Firma del Responsable de QA:**

Nombre: ___________   Fecha: ___________   Commit hash: ___________

Formato: Markdown con tablas completas.
Tono: Formal, objetivo, basado en evidencia.
Longitud: 2-3 páginas.
```

**Salida esperada:** Test Summary Report completo listo para revisión.

---

## Prompt 6: Validar RC

**Propósito:** Checklist de validación final antes de sellar RC.

**Cuándo usar:** Bloque 10 — 30 min

**Prompt:**

```
Actúa como un Architecture Board validando un Release Candidate antes de sellarlo.

Genera una checklist de validación final para Q-Track v1.0.0 RC.

## 1. Validación de Código

- [ ] Pipeline de CI en verde (lint ✓, test ✓, build ✓)
- [ ] Cobertura ≥ 80% en `src/domain/`
- [ ] Cero vulnerabilidades CVE High/Critical
- [ ] Code Review aprobado por 2+ reviewers
- [ ] No hay comentarios bloqueantes sin resolver en el PR

## 2. Validación de Tests

- [ ] Tests unitarios: 100% pass rate
- [ ] Tests de integración: 5/5 escenarios pass
- [ ] Tests E2E: 3/3 flujos críticos pass
- [ ] Performance: p95 ≤ 300ms para endpoints críticos

## 3. Validación Documental

- [ ] Test Summary Report en estado SELLADO
- [ ] Release Notes completas y aprobadas
- [ ] Runbook de operaciones disponible
- [ ] ADRs actualizados si hubo cambios arquitectónicos

## 4. Validación de Negocio

- [ ] Criterios de aceptación del PRD verificados
- [ ] Product Owner aprobó funcionalidad en staging
- [ ] Stakeholders clave firmaron aceptación

## 5. Criterio de Aprobación

**Aprobar RC si:**
- ✅ Todos los tests en verde
- ✅ Cero defectos High/Critical abiertos
- ✅ Documentación completa
- ✅ Aprobación de negocio

**Rechazar RC si:**
- ❌ Tests fallidos sin explicación
- ❌ Defectos High/Critical sin resolver
- ❌ Documentación faltante
- ❌ Negocio no aprobó

Formato de salida:
- Checklist completa con checkboxes
- Espacio para comentarios por ítem
- Sección de "Observaciones" y "Acciones Requeridas"

Audiencia: QA Lead, Tech Lead, Product Owner, Architecture Board.
Tono: Formal, basado en evidencia, sin ambigüedad.
```

**Salida esperada:** Checklist de validación lista para usar en sesión de sellado.

---

## Cómo Usar Esta Prompt Library

1. **Antes de la sesión:** El facilitador configura Testcontainers y proyecto de tests
2. **Durante la sesión:** Los participantes generan tests de integración y E2E con IA
3. **Después de la sesión:** Los prompts quedan disponibles para futuros RCs

### Mejores Prácticas

- ✅ **Pirámide:** Respeta proporción 70/20/10 (unitarios/integración/E2E)
- ✅ **Independencia:** Cada test debe poder ejecutarse solo
- ✅ **Velocidad:** Tests de integración < 10 min, E2E < 5 min
- ✅ **Evidencia:** Todo test fallido debe tener log adjunto

---

*Prompt Library del Módulo 4 · Corpus arquitectónico UNIMAR · Versión: 1.0*
