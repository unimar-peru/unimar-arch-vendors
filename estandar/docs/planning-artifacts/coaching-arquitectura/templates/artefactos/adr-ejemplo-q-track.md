# Ejemplo Q-Track — Architecture Decision Record (ADR)

> **Módulo:** [2. Diseño y Arquitectura](../../artefactos/modulo-2.md) · **Tipo:** Registro de Decisión Arquitectónica

Ejemplo completamente diligenciado del ADR para la decisión de persistencia de **Q-Track (Gestor de Colas de Camiones)**.

---

# ADR-001: Estrategia de Persistencia para Q-Track

**Fecha:** 2025-02-10   **Autor(es):** Alberto Arroyo, Jorge Salas (Arquitectura)
**Estado:** ☑ Aceptado

---

## 1. Contexto

Q-Track requiere almacenar de forma persistente:
- Turnos de camiones (número, estado, timestamps)
- Registro de incidencias (motivo, tiempo de resolución)
- Configuración de patios (Norte/Sur, ventanas de tiempo)
- Usuarios y roles (conductores, operadores, supervisores)

**Restricciones de negocio:**
- Los datos deben persistir por 5 años mínimo (requisito de auditoría aduanera)
- Lecturas frecuentes: consulta de turno por placa (≤ 200ms)
- Escrituras moderadas: ~60 turnos/día + incidencias
- Debe soportar consultas analíticas para reportes de KPIs semanales

**Stakeholders:**
- **Operaciones:** Necesita disponibilidad 99.9% durante horario de patio (6am-8pm)
- **Auditoría:** Requiere trazabilidad completa de cambios
- **Desarrollo:** Prefiere tecnología con curva de aprendizaje baja y soporte en el equipo

---

## 2. Decisión

**Se usará PostgreSQL 15 como base de datos relacional para Q-Track**, accedida mediante un repositorio con patrón Repository-Entity a través de TypeORM.

**Justificación técnica:**
- PostgreSQL ofrece ACID compliance para garantizar integridad de turnos
- Soporte nativo para JSONB permite flexibilidad en metadatos de incidencias
- TypeORM proporciona migraciones versionadas y tipado TypeScript end-to-end
- El equipo ya tiene experiencia con PostgreSQL de proyectos UMS y MMS

---

## 3. Consecuencias

### Positivas

- **Integridad garantizada:** Transacciones ACID previenen turnos duplicados o perdidos
- **Consultas analíticas:** SQL nativo permite reportes de KPIs sin herramientas adicionales
- **Reutilización de conocimiento:** El equipo no requiere capacitación en la tecnología
- **Ecosistema maduro:** Drivers, ORMs y herramientas de monitoreo ampliamente disponibles

### Negativas

- **Acoplamiento tecnológico:** Migrar a NoSQL en el futuro requerirá refactor significativo
- **Overhead de ORM:** TypeORM añade ~15-30ms por query vs. SQL nativo (aceptable para este caso)
- **Licenciamiento:** PostgreSQL es open-source, pero soporte enterprise requiere contrato (costo: ~USD 5k/año)

### Neutras / Consideraciones

- **Backup strategy:** Se requiere backup diario a las 2am (ventana de menor actividad)
- **Escalabilidad:** PostgreSQL escala verticalmente; si se requieren >10k turnos/día, evaluar sharding

---

## 4. Alternativas Consideradas

### Alternativa 1: MongoDB (NoSQL Document-Oriented)

**Descripción:** Usar MongoDB como base de datos NoSQL para almacenar turnos como documentos JSON.

**Ventajas:**
- Schema flexible facilita cambios en estructura de turnos
- Escalabilidad horizontal nativa
- Buen desempeño para lecturas por clave (placa)

**Desventajas:**
- **No ofrece transacciones multi-documento completas** (riesgo de inconsistencia en asignación de turnos)
- **Curva de aprendizaje:** Solo 2 desarrolladores tienen experiencia con MongoDB
- **Consultas analíticas complejas:** Requiere MongoDB Atlas o agregaciones complejas para KPIs

**Razón del rechazo:** La falta de ACID compliance completo y la complejidad de consultas analíticas hacen que MongoDB sea inadecuado para un sistema de colas que requiere integridad transaccional.

---

### Alternativa 2: SQLite (Base de Datos Embebida)

**Descripción:** Usar SQLite como base de datos embebida en el mismo servidor de la API.

**Ventajas:**
- Cero configuración de infraestructura
- Despliegue simplificado (un solo binario)
- Bajo consumo de recursos

**Desventajas:**
- **No soporta concurrencia de escrituras múltiples** (bloqueo de base de datos)
- **No es adecuada para producción enterprise** (sin HA, sin replication)
- **Backup complejo:** Requiere copiar archivo .db en caliente

**Razón del rechazo:** SQLite no soporta la concurrencia requerida (múltiples operadores registrando turnos simultáneamente) y no cumple con requisitos de alta disponibilidad de UNIMAR.

---

### Alternativa 3: Redis (Base de Datos en Memoria)

**Descripción:** Usar Redis como almacén principal de turnos en memoria.

**Ventajas:**
- **Latencia ultra-baja:** < 5ms por operación
- **Estructuras de datos ricas:** Listas, sets, sorted sets ideales para colas

**Desventajas:**
- **Persistencia opcional:** RDB/AOF no garantizan durabilidad 100%
- **Costo de memoria:** 60 turnos/día × 5 años = ~110k registros, factible pero costoso en RAM
- **Consultas analíticas limitadas:** No soporta joins ni agregaciones complejas

**Razón del rechazo:** Redis es excelente como caché o broker de colas, pero no como fuente de verdad persistente para datos que requieren auditoría de 5 años.

---

## 5. Referencias

- [Documentación oficial PostgreSQL 15](https://www.postgresql.org/docs/15/)
- [TypeORM Documentation](https://typeorm.io/)
- ADR-002: Patrón de Arquitectura Hexagonal
- [Estándar de Persistencia UNIMAR](../../../../../reference/governance/standards/engineering/estrategia-base-datos.es.md)

---

## 6. Criterios de Aceptación del ADR

- [x] Secciones 1-4 completas sin campos vacíos
- [x] Al menos 3 alternativas rechazadas con justificación de negocio documentada
- [x] Consecuencias positivas, negativas y neutras explicitadas
- [x] Revisado y aprobado por el Architecture Board (Alberto Arroyo, 2025-02-10)

---

*Ejemplo Q-Track generado bajo el estándar del corpus arquitectónico de UNIMAR · Idioma: Español · Versión: 1.0*
