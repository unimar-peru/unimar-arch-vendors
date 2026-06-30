# Stack Tecnológico Autorizado: Ecosistema Node.js & TypeScript

**Tipo de Documento:** Apéndice de Runtime
**Prerrequisito:** DEBE leerse después de la **[Línea Base Agnóstica](stack-tecnologico-autorizado-agnostico.es.md)**.
**ADR Primario:** [ADR-0002 — Clean Architecture NestJS](./adrs/nodejs/0002-arquitectura-limpia-nestjs.es.md).
**Ecosistema Objetivo:** APIs de Alta Concurrencia, Tiempo Real (WebSockets), Pasarelas BFF, Sistemas de Frontend/Backend unificados en TypeScript.

---

## 1. Matriz de Cumplimiento Ejecutiva (Mandatos para Proveedores)

Todas las escuadras de ingeniería que desarrollen dentro del ecosistema Node.js DEBEN imponer estrictamente los artefactos autorizados a continuación. Cualquier intento de reemplazo exige un ADR aprobado ANTES de escribir código.

| Categoría | Herramienta / Framework Aprobado | Versión Validada | ¿ADR Requerido para Cambiar? | Alternativas Explícitamente Rechazadas |
| :--- | :--- | :--- | :--- | :--- |
| **Runtime Base** | **Node.js (LTS)** | 20.x | **Sí** | Bun, Deno (hasta próxima auditoría) |
| **Lenguaje** | **TypeScript (Modo Estricto)** | 5.4+ | **Sí** | JavaScript Puro, TypeScript Modo Indistinto |
| **Host Web** | **NestJS (Motor Express)** | 10.x+ | **Sí** | Fastify (requiere ADR aprobado), Express Puro |
| **BD Relacional** | **PostgreSQL** | v16+ | **Sí** | MySQL, MariaDB |
| **BD No Relacional** | **MongoDB** | Última | **Sí** | Cassandra, DynamoDB |
| **ORM Relacional** | **TypeORM** o **Drizzle** | Última | **No** | Sequelize, Prisma (requiere ADR de rendimiento) |
| **Driver Nativo BD** | **`pg`** (Alto Rendimiento) | 8.x | **No** | `mysql2`, `sqlite3` |
| **Caché** | **Redis** | v7.2 | **Sí** | Memcached, KeyDB |
| **Bróker de Mensajes** | **RabbitMQ** | Última | **Sí** | Apache Kafka (excepto para streaming pesado), AWS SQS |
| **Almacén de Objetos** | **MinIO** (Compatible S3) | Última | **Sí** | Almacenamiento local de archivos |
| **Validación** | **class-validator** | Última | **No** | Zod (excepto para contratos de API externos) |
| **Motor de Pruebas** | **Jest** | 29.x | **Sí** | Mocha, Ava |
| **Tests de Integración** | **Testcontainers Node** | Última | **Sí** | Fakes en memoria sin paridad de producción |
| **Tests de Contrato** | **Pact JS** | Última | **Sí** | Spring Cloud Contract |
| **Control de Flujo de Errores** | **neverthrow** (`Result<T,E>`) | Última | **Sí** | Excepciones lanzadas como control de flujo |
| **Orquestador Monorepo** | **Nx** | 18.x+ | **Sí** | Turborepo, Lerna |
| **Compilador** | **SWC** (`@swc/core`) | Última | **Sí** | `tsc`, `esbuild` |
| **Linting y Formateo** | **ESLint v8 + Prettier v3** | Última | **No** | Rome, Biome |
| **Documentación API** | **Swagger (OpenAPI v3)** vía decoradores NestJS | — | **No** | Scalar, Redocly |
| **Resiliencia** | **@nestjs/bull** (colas) + **bree** (scheduler) + **p-retry / opossum** (circuit breaker) | Última | **Sí** | BullMQ sin capa de abstracción |
| **Observabilidad** | **@opentelemetry/instrumentation-express** + **pino** | Última | **Sí** | Winston (solo si se justifica), Application Insights SDK |
| **Logs Estructurados** | **pino** (JSON nativo, alta performance) | Última | **Sí** | Winston, Bunyan |

---

## 2. Guía de Herramientas — Propósito, Cuándo, Por Qué y Referencias

| Herramienta | Capas (Hexagonal) | Propósito | Cuándo usarlo | Por qué esta recomendación | ADR | Referencias / Tendencias |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Node.js 20 LTS** | Todas | Runtime JavaScript corporativo con soporte prolongado (hasta 2026) | Todos los proyectos nuevos Node.js | LTS garantiza seguridad y estabilidad; ciclo predecible de 30 meses | ADR-0002 | [Node.js Releases](https://nodejs.org/en/about/previous-releases) |
| **TypeScript (Modo Estricto)** | Todas | Tipado estático, contratos en compilación, autocompletado IDE | Todo archivo .ts en el ecosistema | Evita clases enteras de bugs en runtime; obliga a manejar null/undefined | ADR-0003 | [TypeScript Strict Mode (typescriptlang.org)](https://www.typescriptlang.org/tsconfig#strict); tendencia 2022-2026: strict mode es estándar de facto |
| **NestJS + Express** | Presentación (API) | Framework opinado con decoradores, DI nativo, modular | APIs REST, GraphQL BFF, WebSockets, microservicios gRPC | Arquitectura modular similar a Angular; inyección de dependencias nativa; soporte oficial de OpenAPI, GraphQL, gRPC, colas | ADR-0002 | [NestJS docs](https://docs.nestjs.com/); [Estado 2025-2026: NestJS lidera frameworks Node.js empresariales](https://survey.stackoverflow.co/) |
| **TypeORM / Drizzle** | Infraestructura | ORM relacional type-safe con migraciones y query builder | CRUD transaccional, consultas complejas, migraciones | TypeORM: madurez y decoradores; Drizzle: rendimiento y tipo inferido | ADR-0043 | [TypeORM](https://typeorm.io/), [Drizzle](https://orm.drizzle.team/); tendencia 2024-2026: Drizzle gana adopción por DX y rendimiento |
| **PostgreSQL** | Infraestructura | Motor relacional open-source con extensibilidad (JSONB, RLS, full-text search) | Persistencia primaria de todos los servicios Node.js | Rendimiento, extensiones (PostGIS, pgvector), RLS nativo, sin costo de licencia | ADR-0051 | [PostgreSQL docs](https://www.postgresql.org/docs/); [DB-Engines Ranking 2026: PostgreSQL #4 global](https://db-engines.com/en/ranking) |
| **RabbitMQ** | Infraestructura | Bróker de mensajes AMQP con garantía de entrega, DLQ, FIFO | Eventos de dominio, comunicación asíncrona entre contextos acotados | Madurez, soporte multiplataforma, integración nativa con NestJS | ADR-0036 | [RabbitMQ docs](https://www.rabbitmq.com/documentation.html); tendencia empresarial consolidada |
| **Redis** | Infraestructura | Caché distribuida en memoria con estructuras de datos avanzadas | Caché de consultas, sesiones, rate limiting, colas ligeras | Velocidad, versatilidad, persistencia opcional | ADR-0014 | [Redis docs](https://redis.io/docs/); [DB-Engines Ranking: #1 key-value store 2026](https://db-engines.com/en/ranking/) |
| **class-validator** | Aplicación | Validación declarativa vía decoradores en DTOs | Validación de entrada en controladores NestJS y pipes | Integración nativa con NestJS Pipes; decoradores reutilizables | ADR-0002 | [class-validator GitHub](https://github.com/typestack/class-validator); estándar NestJS |
| **neverthrow (Result\<T,E\>)** | Aplicación + Dominio | Manejo de errores functional-safe sin excepciones | Toda operación que puede fallar (repositorios, servicios de dominio, casos de uso) | Obliga al manejo explícito de errores en tiempo de compilación; patrón Result type-safe | ADR-0038 | [neverthrow GitHub](https://github.com/supermacro/neverthrow); tendencia: Result pattern en TypeScript empresarial |
| **pino** | Infraestructura | Logger estructurado JSON de alta velocidad | Todo módulo Node.js; middleware HTTP, servicios, workers | 5-10x más rápido que Winston; salida JSON nativa para OpenTelemetry | ADR-0007 | [pino docs](https://getpino.io/); comparativa de rendimiento: [medium.com/@pinojs](https://medium.com/@pinojs) |
| **OpenTelemetry JS** | Infraestructura | Trazas distribuidas y métricas con exportador vendor-neutral | Todos los servicios; instrumentación de Express, NestJS, gRPC, PostgreSQL | Estandar W3C Trace Context; evita vendor lock-in | ADR-0007 | [OpenTelemetry JS](https://opentelemetry.io/docs/languages/js/); [CNCF Adoption Report](https://www.cncf.io/reports/) |
| **Jest** | Pruebas | Framework de pruebas con assertions, mocks, coverage | Pruebas unitarias, de integración y E2E | Experiencia todo-en-uno; mocking integrado; snapshot testing; adopción masiva | ADR-0052 | [Jest docs](https://jestjs.io/); estándar de facto 2022-2026 |
| **Testcontainers Node** | Pruebas | Contenedores desechables para pruebas de integración fieles a producción | Pruebas que requieren PostgreSQL real, Redis, RabbitMQ | Elimina fakes en memoria; misma versión que producción | ADR-0053 | [Testcontainers Node](https://node.testcontainers.org/); patrón estándar de integración |
| **Nx** | Todas (orquestación) | Monorepo con computación distribuida, caché remota, generación de librerías | Todo proyecto que contenga múltiples aplicaciones o librerías | Computación incremental, dependencias explícitas entre librerías, tags de alcance | ADR-0001 | [Nx docs](https://nx.dev/); adoptado por grandes corporaciones (2024-2026) |
| **SWC** | Herramienta | Compilador TypeScript/JS 20x más rápido que tsc | CI/CD, compilación en caliente para desarrollo | Rendimiento crítico en monorepos grandes; compatible con Jest (transform) | ADR-0001 | [SWC](https://swc.rs/); tendencia: Rust-based toolchain en JS |
| **p-retry / opossum** | Infraestructura | Retry y circuit breaker para operaciones asíncronas | Toda comunicación externa (HTTP, BD, Redis, RabbitMQ) | p-retry es simple y compone bien; opossum es circuit breaker estándar Node.js | ADR-0011 | [p-retry](https://github.com/sindresorhus/p-retry), [opossum](https://github.com/nodeshift/opossum); patrón estándar de resiliencia |

---

## 3. Implementación Arquitectónica (Mapeo NestJS)

Para cumplir con el mandato general de [Arquitectura Hexagonal](stack-tecnologico-autorizado-agnostico.es.md#1-restricciones-ejecutivas-y-no-negociables) y el [ADR-0002](./adrs/nodejs/0002-arquitectura-limpia-nestjs.es.md), se aplican las siguientes reglas de organización dentro del espacio de trabajo Nx:

### 3.1 Segregación de Librerías (Tags Nx)

| Tag Nx | Capa Hexagonal | Contenido | Importaciones Permitidas | Prohibiciones |
| :--- | :--- | :--- | :--- | :--- |
| **`type:domain`** | Núcleo de Dominio | Entidades, Objetos de Valor, interfaces de Puertos, tipos puros | Cero dependencias externas | No importar NestJS, TypeORM, infraestructura |
| **`type:application`** | Casos de Uso | Manejadores CQRS (CommandBus/QueryBus), casos de uso, lógica de orquestación | Solo `type:domain` | No importar NestJS, TypeORM, Redis, HTTP |
| **`type:infrastructure`** | Adaptadores | Módulos NestJS, controladores, entidades TypeORM (mapping BD), repositorios, clientes Redis, RabbitMQ, API externas | `type:domain`, `type:application`, NestJS, TypeORM | No contener lógica de negocio; solo implementar puertos |
| **`type:api`** | Punto de entrada | Módulo raíz de la aplicación NestJS, middleware global, filtros de excepción, pipes de validación | `type:infrastructure`, NestJS | No contener reglas de dominio |

### 3.2 Política de Gestión de Errores

Lanzar excepciones estándar (`throw new Error()`) para control de flujo está **PROHIBIDO**. Los equipos DEBEN utilizar el **Patrón Result** (`neverthrow`) según el [ADR-0038](./adrs/nodejs/0038-estrategia-manejo-errores-patron-result.es.md):

```typescript
import { Result, ok, err } from 'neverthrow';

class CreateOrderUseCase {
  async execute(cmd: CreateOrderCommand): Promise<Result<OrderDto, AppError>> {
    const customer = await this.customerRepo.findById(cmd.customerId);
    if (!customer) return err(new NotFoundError('Customer not found'));

    const order = Order.create(customer, cmd.items);
    if (!order.isValid()) return err(new ValidationError(order.errors));

    await this.orderRepo.save(order);
    return ok(OrderDto.from(order));
  }
}
```

Las respuestas HTTP DEBEN mapearse desde `Result` a códigos de estado estándar mediante un **NestJS ExceptionFilter global**.

### 3.3 Inyección de Dependencias

Utilizar el contenedor DI nativo de NestJS. Se **PROHÍBE** el uso de contenedores DI ajenos (tsyringe, inversify) dentro de módulos NestJS. Para librerías `type:domain` y `type:application`, la DI se aplica exclusivamente por constructor en las clases concretas ubicadas en `type:infrastructure`.

---

## 4. Persistencia y Acceso a Datos

### 4.1 Estrategia ORM

Siguiendo el [ADR-0043](./adrs/nodejs/0043-estrategia-acceso-datos-orm.es.md), se autorizan dos ORMs relacionales:

| ORM | Cuándo usarlo | Por qué |
| :--- | :--- | :--- |
| **TypeORM** | CRUD transaccional, proyectos existentes NestJS, uso de decoradores `@Entity`, `@Column` | Mayor madurez y ecosistema; decoradores intuitivos; Active Record / Data Mapper |
| **Drizzle** | Nuevos proyectos, equipos con preferencia type-safe, queries de alto rendimiento | Inferencia de tipos más precisa; bundle más pequeño; SQL-like DX |

### 4.2 Aislamiento por Sucursal (Multi-Tenancy)

Siguiendo el [ADR-0010](./adrs/core/0010-estrategia-arquitectura-multitenant.es.md) y el [ADR-0044](./adrs/core/0044-estrategia-persistencia-seguridad-configurable.es.md):

1. **Aplicación (primario):** `SucursalFilter` en TypeORM QueryBuilder o middleware Drizzle que inyecta `sucursal_id` desde claims JWT.
2. **PostgreSQL (secundario):** Row-Level Security.

```typescript
// Aislamiento primario vía QueryBuilder
const orders = await orderRepository
  .createQueryBuilder('order')
  .andWhere('order.sucursal_id = :sucursalId', { sucursalId })
  .getMany();
```

### 4.3 Migraciones

Ejecutar `DataSource.synchronize()` desde el arranque de NestJS está **FUERTEMENTE DESACONSEJADO** para producción. Las migraciones DEBEN generarse como archivos SQL mediante `typeorm migration:generate` y ejecutarse dentro de Init-Containers de Kubernetes.

### 4.4 Transacciones y Outbox Pattern

Para mensajería asíncrona, DEBE implementarse el **Patrón Transactional Outbox** según [ADR-0033](./adrs/core/0033-patron-transactional-outbox.es.md). La tabla `outbox` DEBE residir en la misma base de datos PostgreSQL del contexto acotado.

```typescript
@Transactional()
async createOrder(cmd: CreateOrderCommand): Promise<void> {
  await this.orderRepo.save(order);
  await this.outboxRepo.save(new OutboxMessage('OrderCreated', order));
}
```

---

## 5. Resiliencia y Tolerancia a Fallos

Siguiendo el [ADR-0011](./adrs/core/0011-patrones-resiliencia-tolerancia-fallos.es.md), toda comunicación externa DEBE protegerse:

| Patrón | Librería | Cuándo aplica | Ejemplo |
| :--- | :--- | :--- | :--- |
| **Retry** | `p-retry` | Fallos transitorios en BD, HTTP, Redis | `await pRetry(() => fetchOrder(id), { retries: 3 })` |
| **Circuit Breaker** | `opossum` | Fallos sostenidos en servicios externos | `const breaker = new CircuitBreaker(fetchOrder, { errorThresholdPercentage: 50 })` |
| **Timeout** | `p-timeout` | Evitar operaciones colgadas | `await pTimeout(operation, { milliseconds: 5000 })` |
| **Bulkhead** | `p-limit` | Limitar concurrencia a BD o API | `const limit = pLimit(10); await limit(() => processOrder(order))` |

```typescript
// Pipeline combinado para cliente HTTP externo
const fetchWithResilience = async (url: string) => {
  const response = await pRetry(
    () => pTimeout(fetch(url), { milliseconds: 5000 }),
    { retries: 3, minTimeout: 200 }
  );
  return response.json();
};
```

---

## 6. Observabilidad

Siguiendo el [ADR-0007](./adrs/nodejs/0007-observabilidad-telemetria-loki-opentelemetry.es.md), todo servicio Node.js DEBE instrumentar:

### 6.1 Trazas Distribuidas (OpenTelemetry)

```typescript
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino';

const sdk = new NodeSDK({
  instrumentations: [
    new ExpressInstrumentation(),
    new PinoInstrumentation(),
  ],
});
sdk.start();
```

### 6.2 Logs Estructurados (pino)

```typescript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level(label) { return { level: label }; },
  },
  redact: ['req.headers.authorization', 'req.body.password'],
});
```

### 6.3 Salud y Readiness

Ver Patrón Canónico CP-07 para la implementación estandarizada de health checks con NestJS.

---

## 7. Bibliotecas de Referencia (NestJSLatam)

Las siguientes librerías corporativas estandarizan patrones DDD en el ecosistema Node.js. Ver Patrones Canónicos Node.js para guía de uso detallada.

| Librería | Propósito | Cuándo usarla |
| :--- | :--- | :--- |
| **@nestjslatam/ddd** | Primitivas DDD táctico: AggregateRoot, ValueObject, DomainEvent, Entity | Base de todas las entidades de dominio |
| **@nestjslatam/ddd-valueobjects** | Objetos de Valor preconstruidos: Email, Phone, RUC, DNI, Currency, DateRange | Cuando se necesitan VO validados y tipados sin escribirlos desde cero |

---

## 8. Comunicación Interna entre Servicios

### 8.1 gRPC (NestJS Microservices)

Para comunicación síncrona entre contextos acotados, DEBE utilizarse **gRPC** sobre HTTP/2 con NestJS Microservices. La decisión de protocolo sigue la [Matriz de Decisión de Protocolos API (ADR-0032)](./adrs/core/0032-matriz-decision-protocolos-api-rest-grpc-graphql.es.md).

```typescript
// Definición del microservicio gRPC
@GrpcMethod('OrderService', 'GetOrder')
async getOrder(dto: OrderRequest): Promise<OrderResponse> {
  const result = await this.mediator.send(new GetOrderQuery(dto.id));
  return result.match(
    (order) => OrderResponse.from(order),
    (err) => { throw new RpcException(err); }
  );
}
```

### 8.2 RabbitMQ (Mensajería Asíncrona)

Para eventos de dominio y comunicación asíncrona, DEBE utilizarse **RabbitMQ** gobernado por [ADR-0036](./adrs/core/0036-estrategia-entrega-bus-mensajes-fifo-dlq.es.md) (FIFO, DLQ, control de flujo).

---

## 9. Pruebas

La pirámide de pruebas sigue el [ADR-0018](./adrs/core/0018-piramide-pruebas-gates-calidad.es.md).

| Tipo | Framework | Aislamiento | ADR |
| :--- | :--- | :--- | :--- |
| **Unitarias** | Jest | Mocks (verificación) o Stubs (estado) vía `jest.mock()` | ADR-0052 |
| **Integración** | Jest + Testcontainers | Contenedores reales (PostgreSQL, Redis, RabbitMQ) | ADR-0053 |
| **Contrato** | Pact JS | Verificación de contratos consumidor/proveedor | — |
| **Carga** | k6 (estándar agnóstico) | Scripts JS independientes del runtime | — |

> [!TIP]
> **Aislamiento de Pruebas:** Los desarrolladores DEBEN seguir la estrategia definida en [ADR-0052](./adrs/core/0052-estrategia-aislamiento-pruebas-unitarias.es.md) al utilizar Mocks o Stubs.
>
> **Pruebas de Infraestructura:** Las pruebas de Integración y E2E DEBEN utilizar **Testcontainers** según [ADR-0053](./adrs/core/0053-estrategia-pruebas-integracion-e2e.es.md).

---

## 10. Herramientas de Runtime Específicas

| Herramienta | Propósito | Referencia |
| :--- | :--- | :--- |
| **`@swc/core`** | Compilación 20x más rápida en CI/CD y desarrollo | [SWC](https://swc.rs/) |
| **ESLint v8 + Prettier v3** | Linting estricto + formateo automático | [ESLint](https://eslint.org/), [Prettier](https://prettier.io/) |
| **Husky + lint-staged** | Gateways de Git: ejecutar ESLint y pruebas antes de cada commit | [Husky](https://typicode.github.io/husky/) |

---

## 11. Advertencia Final de Integración para Proveedores

No satisfacer estas definiciones de herramientas estáticas bloqueará automáticamente la aceptación del código de integración.

-> Volver al **[Índice Maestro Global](../navigation/MASTER_INDEX.md)**

---

[Volver al Índice](README.md)
