# Prompt Library — Módulo 3 (Desarrollo y Code Review)

> **Módulo:** Módulo 3 · **Tipo:** Biblioteca de Prompts para IA  
> **Herramientas:** OpenCode, BMAD Method v6.8.0, Agente Amelia (Dev)

---

## Propósito

Este documento contiene los prompts exactos para ejecutar cada actividad del Módulo 3 con asistencia de IA. Copia y pega cada prompt en OpenCode o tu asistente de IA preferido.

---

## Agenda con Prompts

| Bloque | Actividad | Duración | Prompt |
| :--- | :--- | :--- | :--- |
| 2 | Arquitectura Hexagonal: teoría y ejemplos | 25 min | [Prompt 1: Repasar Hexagonal](#prompt-1-repasar-hexagonal) |
| 3 | Configuración del proyecto NestJS | 30 min | [Prompt 2: Generar Estructura](#prompt-2-generar-estructura) |
| 4 | Implementación de entidad de dominio | 45 min | [Prompt 3: Generar Entidad](#prompt-3-generar-entidad) |
| 6 | Implementación de caso de uso | 60 min | [Prompt 4: Generar Caso de Uso](#prompt-4-generar-caso-de-uso) |
| 8 | Tests unitarios con Jest | 60 min | [Prompt 5: Generar Tests](#prompt-5-generar-tests) |
| 10 | Code Review con checklist | 45 min | [Prompt 6: Revisar Código](#prompt-6-revisar-código) |
| 12 | Fix de cobertura y refactor | 30 min | [Prompt 7: Mejorar Cobertura](#prompt-7-mejorar-cobertura) |

---

## Prompt 1: Repasar Hexagonal

**Propósito:** Generar repaso de Arquitectura Hexagonal aplicado a Q-Track.

**Cuándo usar:** Bloque 2 — 25 min

**Prompt:**

```
Actúa como un Tech Lead experto en Arquitectura Hexagonal dando un repaso práctico antes de empezar a codificar.

Genera un repaso de Arquitectura Hexagonal aplicado a Q-Track (Gestor de Colas de Camiones) con ejemplos de código TypeScript.

Incluye:

1. **Recordatorio visual:**
   - Diagrama Mermaid simple mostrando dominio en el centro, puertos y adaptadores
   - Flechas de dependencia apuntando hacia adentro (hacia el dominio)

2. **Estructura de carpetas para Q-Track:**

```
src/
  domain/           # Lógica de negocio (sin imports de framework)
    entities/       # Entidades: Turno, Patio, Operador
    usecases/       # Casos de uso: AsignarTurno, AvanzarCola
    repositories/   # Interfaces (puertos): TurnoRepository
  infrastructure/   # Implementaciones técnicas
    controllers/    # Controladores NestJS (adaptadores de entrada)
    repositories/   # Implementaciones TypeORM (adaptadores de salida)
    dtos/           # Data Transfer Objects
  app.module.ts     # Configuración de inyección de dependencias
```

3. **Reglas de oro:**
   - `src/domain/` NO importa de `src/infrastructure/`
   - Entidades son clases TypeScript puras (sin decoradores de TypeORM)
   - Casos de uso dependen de interfaces, no de implementaciones
   - Tests unitarios de dominio NO levantan BD ni servidores

4. **Ejemplo de código:**
   - Entidad `Turno` (pura, sin imports de framework)
   - Interfaz `TurnoRepository` (puerto)
   - Implementación `PostgresTurnoRepository` (adaptador)

5. **Señales de alerta:**
   - `import { Entity, Column } from 'typeorm'` en `src/domain/` ❌
   - `new DatabaseConnection()` dentro de un caso de uso ❌
   - Tests que requieren `docker-compose up` para ejecutarse ❌

Formato de salida:
- Diagrama Mermaid
- Estructura de carpetas en bloque de código
- Lista de reglas de oro
- Ejemplo de código TypeScript
- Señales de alerta

Audiencia: Desarrolladores que van a implementar Q-Track.
Tono: Práctico, con ejemplos de código reales.
```

**Salida esperada:** Repaso visual + estructura + ejemplos de código.

---

## Prompt 2: Generar Estructura

**Propósito:** Generar estructura de proyecto NestJS con Arquitectura Hexagonal.

**Cuándo usar:** Bloque 3 — 30 min

**Prompt:**

```
Actúa como un Tech Lead experto en NestJS y Arquitectura Hexagonal.

Genera la estructura inicial de un proyecto NestJS para Q-Track siguiendo Arquitectura Hexagonal.

**Requisitos:**

1. **Comandos de inicialización:**
   ```bash
   nest new q-track
   cd q-track
   npm install --save-dev @types/jest jest
   npm install --save class-validator class-transformer
   ```

2. **Estructura de carpetas completa:**
   ```
   src/
     domain/
       entities/
         turno.entity.ts
         index.ts
       usecases/
         asignar-turno.usecase.ts
         index.ts
       repositories/
         turno.repository.ts
         index.ts
     infrastructure/
       controllers/
         turnos.controller.ts
       repositories/
         postgres-turno.repository.ts
       dtos/
         crear-turno.dto.ts
     app.module.ts
     main.ts
   test/
     domain/
       asignar-turno.usecase.spec.ts
   ```

3. **Archivos boilerplate:**
   - `src/domain/entities/turno.entity.ts` (clase pura con propiedades)
   - `src/domain/repositories/turno.repository.ts` (interfaz)
   - `src/infrastructure/dtos/crear-turno.dto.ts` (con class-validator)

4. **Configuración de Jest:**
   - `jest.config.json` con coverage configurado para `src/domain/`
   - Script en `package.json`: `"test:coverage": "jest --coverage"`

5. **Configuración de ESLint:**
   - Reglas para forzar que `src/domain/` no importe de `src/infrastructure/`

Formato de salida:
- Comandos bash en bloque de código
- Estructura de árbol completa
- Contenido de archivos boilerplate
- Configuraciones de Jest y ESLint

Audiencia: Desarrolladores configurando proyecto desde cero.
Tono: Instruccional, paso a paso.
```

**Salida esperada:** Estructura completa lista para copiar y pegar.

---

## Prompt 3: Generar Entidad

**Propósito:** Generar entidad de dominio `Turno` sin dependencias de framework.

**Cuándo usar:** Bloque 4 — 45 min

**Prompt:**

```
Actúa como un desarrollador senior experto en Domain-Driven Design y TypeScript.

Genera la entidad de dominio `Turno` para Q-Track siguiendo estas reglas:

**Reglas:**
1. **Cero dependencias de framework:** No importar TypeORM, NestJS, ni nada de `src/infrastructure/`
2. **Propiedades privadas:** Usar getters, no propiedades públicas
3. **Métodos de dominio:** La entidad tiene comportamiento, no solo datos
4. **Validación en el constructor:** La entidad nunca está en estado inválido

**Propiedades de Turno:**
- `id`: string (UUID)
- `numero`: number (consecutivo por patio)
- `placa`: string (formato XXX-123)
- `tipoCamion`: enum ('SIMPLE', 'DOBLE', 'TRAILER')
- `patio`: enum ('NORTE', 'SUR')
- `estado`: enum ('EN_ESPERA', 'EN_PROGRESO', 'COMPLETADO', 'CANCELADO')
- `fechaCreacion`: Date
- `fechaAsignacion`: Date | null
- `fechaCompletado`: Date | null

**Métodos de dominio:**
- `asignar(fecha: Date): void` — Cambia estado a EN_PROGRESO
- `avanzar(): void` — Valida que esté en PROGRESO antes de avanzar
- `cancelar(motivo: string): void` — Cambia estado a CANCELADO
- `esActivo(): boolean` — Retorna true si no está COMPLETADO o CANCELADO

**Requisitos técnicos:**
- Usar TypeScript estricto
- Validar en el constructor (placa no vacía, tipoCamion válido)
- Lanzar errores de dominio personalizados (ej: `TurnoInvalidoError`)
- Incluir tests unitarios de la entidad

Formato de salida:
- Código TypeScript completo de la entidad
- Clase de error personalizada
- Tests unitarios con Jest (al menos 5 tests)

Audiencia: Desarrolladores implementando dominio.
Tono: Técnico, con explicación de decisiones de diseño.
```

**Salida esperada:** Entidad `Turno` completa + tests unitarios.

---

## Prompt 4: Generar Caso de Uso

**Propósito:** Generar caso de uso `AsignarTurnoUseCase`.

**Cuándo usar:** Bloque 6 — 60 min

**Prompt:**

```
Actúa como un desarrollador senior experto en Clean Architecture y TypeScript.

Genera el caso de uso `AsignarTurnoUseCase` para Q-Track siguiendo Arquitectura Hexagonal.

**Requisitos:**

1. **Interfaz del caso de uso:**
   ```typescript
   interface AsignarTurnoUseCase {
     ejecutar(placa: string, tipoCamion: string, patio: string): Promise<Turno>;
   }
   ```

2. **Implementación:**
   - Inyecta `TurnoRepository` (interface, NO implementación)
   - Valida que no exista turno activo para la misma placa
   - Crea nueva entidad `Turno` con estado EN_ESPERA
   - Guarda en repositorio
   - Retorna turno creado

3. **Manejo de errores:**
   - `TurnoDuplicadoError`: Si ya existe turno activo para esa placa
   - `PatioInvalidoError`: Si el patio no es NORTE o SUR
   - `TipoCamionInvalidoError`: Si el tipo no es válido

4. **Tests unitarios:**
   - Mock de `TurnoRepository` (NO usa BD real)
   - Test de camino feliz (turno creado exitosamente)
   - Test de error (placa duplicada lanza excepción)
   - Test de validaciones (patio inválido, tipo inválido)

5. **Inyección de dependencias:**
   - Registrar en `TurnoModule` de NestJS
   - Usar `@Injectable()` solo en infraestructura, NO en dominio

Formato de salida:
- Interfaz del caso de uso
- Implementación completa
- Tests unitarios con Jest (al menos 6 tests)
- Configuración de inyección en módulo

Audiencia: Desarrolladores implementando casos de uso.
Tono: Técnico, con explicación de patrones (Repository, Use Case).
```

**Salida esperada:** Caso de uso completo + tests + configuración DI.

---

## Prompt 5: Generar Tests

**Propósito:** Generar tests unitarios para casos de uso de dominio.

**Cuándo usar:** Bloque 8 — 60 min

**Prompt:**

```
Actúa como un QA Engineer experto en testing unitario con Jest y TypeScript.

Genera tests unitarios completos para los casos de uso de Q-Track.

**Requisitos:**

1. **Patrón Arrange-Act-Assert:**
   ```typescript
   test('debe asignar turno cuando placa es válida', async () => {
     // Arrange
     const mockRepository = {
       buscarPorPlaca: jest.fn().mockResolvedValue(null),
       guardar: jest.fn(),
     };
     const useCase = new AsignarTurnoUseCase(mockRepository);
     
     // Act
     const turno = await useCase.ejecutar('ABC-123', 'SIMPLE', 'NORTE');
     
     // Assert
     expect(turno.placa).toBe('ABC-123');
     expect(turno.estado).toBe('EN_ESPERA');
   });
   ```

2. **Cubrir todos los caminos:**
   - Camino feliz (éxito)
   - Errores de validación (placa inválida, patio inválido)
   - Errores de negocio (turno duplicado)
   - Casos borde (límites de valores)

3. **Mocks adecuados:**
   - Mockear SOLO interfaces de repositorio
   - NO mockear entidades de dominio
   - Usar `jest.fn()` con `mockResolvedValue` o `mockRejectedValue`

4. **Cobertura objetivo:**
   - ≥ 80% en `src/domain/`
   - 100% de ramas cubiertas en casos de uso críticos

5. **Tests que documentan:**
   - Nombres descriptivos: `debe [acción] cuando [condición]`
   - Comentarios solo si la lógica es compleja
   - Uno o dos asserts por test (si hay más, separar en tests distintos)

Formato de salida:
- Archivo de tests completo (`*.spec.ts`)
- Al menos 8-10 tests cubriendo todos los caminos
- Configuración de Jest para coverage

Audiencia: Desarrolladores escribiendo tests unitarios.
Tono: Práctico, con ejemplos copy-paste.
```

**Salida esperada:** Suite de tests completa con cobertura ≥ 80%.

---

## Prompt 6: Revisar Código

**Propósito:** Generar code review con checklist estructurada.

**Cuándo usar:** Bloque 10 — 45 min

**Prompt:**

```
Actúa como un Tech Lead experto en code review y Arquitectura Hexagonal.

Genera un code review estructurado para el PR de implementación de Q-Track.

**Checklist de revisión:**

## 1. Calidad de Código

- [ ] Código sigue estándares de linting (eslint/prettier)
- [ ] Nombres de variables y funciones son descriptivos
- [ ] Funciones son pequeñas (< 30 líneas) y con única responsabilidad
- [ ] No hay código comentado o dead code
- [ ] Manejo adecuado de errores (try/catch, Result pattern)

## 2. Arquitectura Hexagonal

- [ ] Entidades de dominio sin imports de framework
- [ ] Casos de uso aislados en `src/domain/`
- [ ] Adaptadores de infraestructura en `src/infrastructure/`
- [ ] Inyección de dependencias configurada correctamente

## 3. Pruebas

- [ ] Tests unitarios para casos de uso críticos
- [ ] Cobertura ≥ 80% en `src/domain/`
- [ ] Tests siguen patrón Arrange-Act-Assert
- [ ] Tests son independientes y no dependen de estado externo

## 4. Seguridad

- [ ] No hay secrets o credenciales en el código
- [ ] Validación de inputs en endpoints (class-validator)
- [ ] Autenticación y autorización verificadas
- [ ] No hay vulnerabilidades conocidas (SQL injection, XSS)

## 5. Documentación

- [ ] README actualizado con instrucciones de uso
- [ ] Comentarios en código solo donde es necesario
- [ ] Changelog actualizado si es feature nuevo

**Formato de review:**

Para cada ítem de la checklist:
- ✅ Si cumple (sin comentarios)
- ⚠️ Si cumple parcialmente (comentario sugerente)
- ❌ Si no cumple (comentario bloqueante)

**Comentarios adicionales:**
- 2-3 fortalezas del código
- 2-3 áreas de mejora prioritarias
- Pregunta abierta para el autor (ej: "¿Consideraste X alternativa?")

Formato de salida:
- Checklist completa con estado por ítem
- Comentarios específicos con línea de código referenciada
- Resumen ejecutivo (fortalezas + mejoras)

Audiencia: Autor del PR y equipo de desarrollo.
Tono: Constructivo, específico, accionable.
```

**Salida esperada:** Code review completo listo para publicar en GitHub.

---

## Prompt 7: Mejorar Cobertura

**Propósito:** Identificar código sin tests y generar tests faltantes.

**Cuándo usar:** Bloque 12 — 30 min

**Prompt:**

```
Actúa como un QA Engineer experto en análisis de cobertura de código.

Analiza el reporte de cobertura y genera tests faltantes para alcanzar ≥ 80% en `src/domain/`.

**Entrada:**
- Reporte de cobertura de Jest (output de `npm run test:coverage`)
- Archivos con cobertura < 80%: [LISTAR ARCHIVOS]

**Tareas:**

1. **Identificar líneas sin cobertura:**
   - Funciones no testeadas
   - Ramas if/else no cubiertas
   - Casos de error no validados

2. **Generar tests faltantes:**
   - Para cada función sin test: crear test con Arrange-Act-Assert
   - Para cada rama no cubierta: crear test con condición específica
   - Para cada error no validado: crear test que lanza excepción

3. **Priorizar por impacto:**
   - Primero: casos de uso críticos (asignar turno, avanzar cola)
   - Segundo: validaciones de entidad
   - Tercero: métodos utilitarios

4. **Verificar después de agregar tests:**
   - Ejecutar `npm run test:coverage` nuevamente
   - Confirmar que `src/domain/` tiene ≥ 80%
   - Confirmar que todos los tests pasan (100% pass rate)

Formato de salida:
- Lista de archivos con cobertura actual
- Tests generados para cada archivo
- Instrucciones para ejecutar y verificar cobertura

Audiencia: Desarrolladores mejorando cobertura.
Tono: Práctico, enfocado en alcanzar el umbral.
```

**Salida esperada:** Tests faltantes que llevan cobertura a ≥ 80%.

---

## Cómo Usar Esta Prompt Library

1. **Antes de la sesión:** El facilitador configura proyecto boilerplate con la estructura
2. **Durante la sesión:** Los participantes usan prompts para implementar entidad, caso de uso y tests
3. **Después de la sesión:** Los prompts quedan disponibles para futuros features

### Mejores Prácticas

- ✅ **TDD:** Usa el prompt de tests ANTES de implementar (test-first)
- ✅ **Itera:** Refactoriza basado en feedback del code review
- ✅ **Cobertura:** No merges sin ≥ 80% en dominio
- ✅ **Arquitectura:** Respeta límites hexagonales estrictamente

---

*Prompt Library del Módulo 3 · Corpus arquitectónico UNIMAR · Versión: 1.0*
