# Estrategia de Base de Datos

> **Estándares de Referencia:** ADR-0051 (motor BD por runtime), ADR-0054 (diseño y normalización), ADR-0044 (RLS, cifrado), [ISO/IEC 25010](https://www.iso.org/standard/35733.html) (eficiencia de rendimiento).
> **Propósito:** Definir la estrategia de selección, diseño, operación y seguridad de bases de datos segmentada por runtime (.NET, Node.js, Android), con herramientas, estándares y criterios de aceptación claros.

---

## 1. Selección de Motor por Runtime

| Runtime | Motor Obligatorio | Alternativa Autorizada | ¿Cuándo usar la alternativa? |
| :------ | :---------------- | :--------------------- | :--------------------------- |
| **.NET / C#** | Microsoft SQL Server | PostgreSQL (con ADR) | Si el producto requiere despliegue en entorno sin licencia SQL Server |
| **Node.js / TypeScript** | PostgreSQL 16+ | MongoDB | PostgreSQL para datos relacionales; MongoDB para datos documentales |
| **Android / Kotlin** | SQLite (Room) + SQLCipher | — | Almacenamiento local cifrado con Room + SQLCipher. Datos remotos vía API |

> **Decisión:** Ver ADR-0051 para el detalle completo de impulsores arquitectónicos y consecuencias.

---

## 2. Diseño de Base de Datos

### 2.1 Modelo Relacional (SQL Server / PostgreSQL)

| Principio | Descripción | Herramienta |
| :-------- | :---------- | :---------- |
| **3NF como línea base** | Tercera Forma Normal por defecto. Desnormalización solo con ADR que justifique el cuello de botella | EF Core / Dapper (.NET), TypeORM / Drizzle (Node.js) |
| **Claves foráneas obligatorias** | Integridad referencial siempre con FK. Sin relaciones implícitas | SQL Server Management Studio / pgAdmin |
| **Índices por query plan** | Indexar columnas de filtro y join. Revisar query plans periódicamente | SQL Server Profiler / EXPLAIN ANALYZE (PostgreSQL) |
| **Migraciones versionadas** | Cada cambio de schema es una migración en código. Rollback siempre disponible | EF Core migrations (.NET), TypeORM migrations (Node.js) |
| **Nomenclatura por runtime** | PascalCase para .NET (ej. `UserProfiles`), snake_case para Node.js (ej. `user_profiles`) | Ver ADR-0054 |
| **RLS activo** | Row-Level Security para aislamiento por sucursal. Ver ADR-0044 | SQL Server / PostgreSQL RLS policies |

### 2.2 Modelo NoSQL (MongoDB)

| Principio | Descripción | Herramienta |
| :-------- | :---------- | :---------- |
| **Design-for-Access** | Modelar según los patrones de consulta, no según la normalización | MongoDB Compass |
| **Incrustación (Embedding)** | Favorecer para relaciones 1:1 y 1:N pequeñas (< 1000 sub-ítems) | Mongoose / TypeORM |
| **Referenciación** | Usar para relaciones 1:N grandes y datos compartidos entre entidades | Mongoose `ref` / `$lookup` |
| **Prohibido: arreglos infinitos** | Usar Bucket Pattern o referenciación. Sin arreglos sin límite de crecimiento | MongoDB Schema Design |
| **Schema validation** | Validar estructura de documentos en MongoDB con JSON Schema | MongoDB `$jsonSchema` |

### 2.3 Modelo Local (Android)

| Principio | Descripción | Herramienta |
| :-------- | :---------- | :---------- |
| **Room + SQLCipher** | ORM local con cifrado en reposo obligatorio | Room, SQLCipher |
| **Flow reactivo** | Consultas como Flow de Kotlin para reactividad en UI | Room + Kotlin Flow |
| **Migraciones versionadas** | Cada cambio de schema = migración versionada | Room migrations |
| **Offline-First** | SQLite como Single Source of Truth local. Sincronizar cuando hay conectividad | Room + WorkManager + DataStore |

---

## 3. Seguridad en Base de Datos

| Aspecto | Medida | Estándar | Documento Relacionado |
| :------ | :----- | :------- | :-------------------- |
| **Cifrado en reposo** | TDE (SQL Server) / pgcrypto (PostgreSQL) / SQLCipher (Android) | ISO 27001 A.10 | Plan de Seguridad § BD |
| **Cifrado en tránsito** | TLS 1.2+ entre app y BD | NIST SP 800-53 (SC-8) | Plan de Seguridad |
| **Control de acceso** | Principio de mínimo privilegio. Roles por contexto | CIS Benchmarks | Plan de Seguridad § BD |
| **Aislamiento por sucursal** | RLS (Row-Level Security) por `sucursal_id` | ADR-0044 | ADR-0044 |
| **Auditoría** | SQL Server Audit / PostgreSQL Audit Log / pgaudit | ISO 27001 A.12.4 | Plan de Seguridad |
| **Backups cifrados** | Backup con cifrado nativo o TDE | NIST SP 800-53 (CP-9) | Hub de Infraestructura |

---

## 4. Herramientas

| Herramienta | Runtime | Propósito | Instalación | Uso | Licencia |
| :---------- | :------ | :-------- | :---------- | :-- | :------- |
| [SQL Server](https://www.microsoft.com/sql-server) | .NET | Motor relacional empresarial | [guía](https://learn.microsoft.com/sql/database-engine/install-windows/) | [docs](https://learn.microsoft.com/sql/) | Express (gratis) / Std+Ent (paga) |
| [PostgreSQL](https://www.postgresql.org/) | Node.js | Motor relacional open-source | [instalación](https://www.postgresql.org/download/) | [docs](https://www.postgresql.org/docs/) | PostgreSQL License (gratis) |
| [MongoDB](https://www.mongodb.com/) | Node.js | BD documental NoSQL | [instalación](https://www.mongodb.com/docs/manual/installation/) | [docs](https://www.mongodb.com/docs/) | SSPL (gratis) / Enterprise (paga) |
| [SQLite (Room)](https://developer.android.com/training/data-storage/room) | Android | BD local embebida | Nativa en Android SDK | [docs](https://developer.android.com/training/data-storage/room) | Apache 2.0 (gratis) |
| [SQLCipher](https://www.zetetic.net/sqlcipher/) | Android | Cifrado de SQLite en reposo | [guía](https://www.zetetic.net/sqlcipher/open-source/) | [docs](https://www.zetetic.net/sqlcipher/) | BSD (gratis) / Enterprise (paga) |
| [EF Core](https://learn.microsoft.com/ef/core/) | .NET | ORM transaccional con migraciones | NuGet | [docs](https://learn.microsoft.com/ef/core/) | MIT (gratis) |
| [Dapper](https://github.com/DapperLib/Dapper) | .NET | Micro-ORM de alta performance | NuGet | [docs](https://github.com/DapperLib/Dapper) | Apache 2.0 (gratis) |
| [TypeORM](https://typeorm.io/) | Node.js | ORM relacional con decoradores | npm | [docs](https://typeorm.io/) | MIT (gratis) |
| [Drizzle](https://orm.drizzle.team/) | Node.js | ORM type-safe de alto rendimiento | npm | [docs](https://orm.drizzle.team/docs/) | Apache 2.0 (gratis) |
| [Prisma](https://www.prisma.io/) | Node.js | ORM type-safe (requiere ADR de rendimiento) | npm | [docs](https://www.prisma.io/docs/) | Apache 2.0 (gratis) |
| [SQL Server Profiler](https://learn.microsoft.com/sql/tools/sql-server-profiler/) | .NET | Monitoreo y tuning de queries | SQL Server Management Studio | [docs](https://learn.microsoft.com/sql/tools/sql-server-profiler/) | Incluido en SQL Server |
| [pgAdmin](https://www.pgadmin.org/) | Node.js | Administración de PostgreSQL | [instalación](https://www.pgadmin.org/download/) | [docs](https://www.pgadmin.org/docs/) | PostgreSQL License (gratis) |
| [pg_backrest](https://pgbackrest.org/) | Node.js | Backup y restore de PostgreSQL | [guía](https://pgbackrest.org/user-guide.html) | [docs](https://pgbackrest.org/) | MIT (gratis) |
| [Trivy](https://trivy.dev/) | Transversal | Escaneo de vulnerabilidades en BD (CIS Benchmarks) | [instalación](https://trivy.dev/latest/getting-started/installation/) | [docs](https://trivy.dev/latest/docs/) | Apache 2.0 (gratis) |

---

## 5. Operaciones y Mantenimiento

| Tarea | Frecuencia | SQL Server | PostgreSQL |
| :---- | :--------- | :--------- | :--------- |
| **Backup completo** | Diario | `BACKUP DATABASE` | pg_dump / pgBackRest |
| **Backup de logs** | Cada 15 min | `BACKUP LOG` | WAL archiving |
| **Reindexación** | Semanal | `ALTER INDEX REBUILD` | `REINDEX` |
| **Actualizar estadísticas** | Diario (automático) | Auto-update por defecto | `ANALYZE` |
| **Monitoreo de queries lentas** | Continuo | SQL Server Profiler / Extended Events | `pg_stat_statements` |
| **Revisión de conexiones** | Diario | `sys.dm_exec_connections` | `pg_stat_activity` |
| **Prueba de restore** | Mensual | `RESTORE DATABASE ... WITH RECOVERY` | pgBackRest restore test |

---

## 6. Matriz de Decisión: SQL vs NoSQL

| Factor | ✅ SQL Server / PostgreSQL | ✅ MongoDB |
| :----- | :------------------------- | :--------- |
| **Esquema** | Rígido, predefinido, validado | Flexible, dinámico |
| **Transacciones** | ACID fuerte obligatorio | Consistencia eventual aceptable |
| **Relaciones** | Joins complejos entre tablas | Datos jerárquicos o aislados |
| **Escalado** | Vertical (típicamente) | Horizontal (sharding) |
| **Velocidad de datos** | Moderada, consistente | Alta, escritura pesada |
| **Consultas ad-hoc** | SQL estándar | Aggregation pipeline |
| **Ejemplo de uso** | Despachos, DUA, liquidaciones, clientes | Logs de eventos, sesiones, catálogos dinámicos |

> **Regla:** Si necesitas joins y ACID → SQL. Si necesitas escalado horizontal y esquemas flexibles → NoSQL. Si necesitas ambos → usa el motor correcto para cada contexto (no mezclar en el mismo servicio).

---

## 7. ADRs Relacionados

| ADR | Título | ¿Qué define? |
| :-- | :----- | :----------- |
| ADR-0051 | Motor BD Empresarial | SQL Server para .NET, PostgreSQL/MongoDB para Node.js |
| ADR-0054 | Diseño y Normalización | 3NF (SQL), Design-for-Access (NoSQL), nomenclatura |
| ADR-0044 | Persistencia Seguridad Configurable | RLS, cifrado, aislamiento por sucursal |
| ADR-0047 | Patrones Arquitectónicos | Evolución de patrones de persistencia |

---

## 8. Documentos Relacionados

| Documento | Propósito |
| :-------- | :-------- |
| Plan de Pruebas de Seguridad | Seguridad en BD: CIS Benchmarks, auditoría, cifrado |
| [Estrategia de Pruebas de Seguridad](../../sdlc/estrategia-seguridad.es.md) | Flujo de seguridad: escaneo de BD con Trivy y SQLMap |
| Hub de Infraestructura | Topología multi-AZ, DR, backups por motor BD |
| [Estándar de Diseño de API](./estandar-diseno-api.es.md) | Cómo se exponen los datos de BD vía API: formato, paginación, errores |
| [Estrategia de Monitoreo](./estrategia-monitoreo.es.md) | Métricas de BD: conexiones, queries lentas, deadlocks, cache hit ratio |
| Stack .NET | Persistencia con EF Core + Dapper |
| Stack Node.js | Persistencia con TypeORM / Drizzle |

---

Volver a Fase 3 — Construcción
