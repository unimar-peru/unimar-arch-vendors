# Stack Tecnológico Autorizado: Ecosistema .NET & C#

**Tipo de Documento:** Apéndice de Runtime
**Prerrequisito:** DEBE leerse después de la **[Línea Base Agnóstica](stack-tecnologico-autorizado-agnostico.es.md)**.
**ADR Primario:** [ADR-0041 — Arquitectura Backend Canónica .NET](./adrs/dotnet/0041-arquitectura-backend-canonica-dotnet.es.md).
**Ecosistema Objetivo:** Workers de Cómputo Pesado, Interoperabilidad Legacy, Procesamiento por Lotes Empresarial, APIs transaccionales.

---

## 1. Matriz de Cumplimiento Ejecutiva (Mandatos para Proveedores)

Todas las escuadras de ingeniería que desarrollen dentro del ecosistema .NET DEBEN imponer estrictamente los artefactos autorizados a continuación. Cualquier intento de reemplazo exige un ADR aprobado ANTES de escribir código.

| Categoría | Herramienta / Framework Aprobado | Versión Validada | ¿ADR Requerido para Cambiar? | Alternativas Explícitamente Rechazadas |
| :--- | :--- | :--- | :--- | :--- |
| **Runtime Base** | **.NET 10 LTS** | 10.0.x | **Sí** | .NET Framework 4.8, .NET 8, .NET 9 (STS) |
| **Host Web** | **ASP.NET Core (Minimal APIs)** | 10.0.x | **Sí** | Hospedaje IIS, Legacy WCF |
| **ORM Relacional** | **EF Core** (vía SQL Server) | 10.0.x | **Sí** | Npgsql, Oracle, MySQL |
| **Micro-ORM Lectura** | **Dapper** | Última | **No** | — |
| **BD No Relacional** | **MongoDB** | Última | **Sí** | Cassandra, DynamoDB |
| **Caché** | **Redis** | v7.2 | **Sí** | Memcached, KeyDB |
| **Bróker de Mensajes** | **RabbitMQ** | Última | **Sí** | Apache Kafka (excepto streaming pesado), AWS SQS |
| **Almacén de Objetos** | **MinIO** (Compatible S3) | Última | **Sí** | Almacenamiento local de archivos |
| **Validación** | **FluentValidation** | 11.9+ | **No** | System.ComponentModel (Data Annotations) dentro del Dominio |
| **Documentación API** | **Swashbuckle / NSwag** (OpenAPI v3) | Última | **No** | — |
| **Pruebas Unitarias** | **xUnit** | 2.6.x | **Sí** | MSTest, NUnit |
| **Assertions** | **FluentAssertions** | Última | **No** | Assert clásico de xUnit |
| **Mocks / Stubs** | **Moq 4.x** o **NSubstitute** | Última | **No** | WireMock (solo para mocks de API externos) |
| **Tests de Integración** | **WebApplicationFactory + Testcontainers.NET** | Última | **Sí** | Fakes en memoria sin paridad de producción |
| **Tests de Contrato** | **PactNet** | Última | **Sí** | — |
| **Control de Flujo de Errores** | **OneOf\<T\>** o **Result\<T, TError\>** | — | **Sí** | Excepciones lanzadas como control de flujo |
| **Resiliencia** | **Polly** | Última | **Sí** | Circuit breaker casero, retry loops sin librería |
| **Formateo** | **CSharpier** | Última | **No** | `dotnet format` |
| **Observabilidad** | **OpenTelemetry.Extensions.Hosting** | 1.7+ | **Sí** | Application Insights SDK nativo (vendor lock-in) |
| **Logs Estructurados** | **Serilog** (con pipeline PII-safe) | Última | **Sí** | NLog, log4net |
| **Workers / Background Jobs** | **Microsoft.Extensions.Hosting.BackgroundService** | — | **No** | Hangfire (solo si se requiere dashboard persistente) |

---

## 2. Guía de Herramientas — Propósito, Cuándo, Por Qué y Referencias

| Herramienta | Capas (Hexagonal) | Propósito | Cuándo usarlo | Por qué esta recomendación | ADR | Referencias / Tendencias |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **.NET 10 LTS** | Todas | Runtime oficial con soporte corporativo de 3 años | Todos los proyectos nuevos .NET | LTS garantiza estabilidad; .NET 10 es la versión vigente del ciclo anual de Microsoft | ADR-0041 | [Microsoft .NET LTS Policy](https://dotnet.microsoft.com/en-us/platform/support/policy) |
| **ASP.NET Core (Minimal APIs)** | Presentación (API) | Hosting HTTP, routing, middleware pipeline | APIs REST, gRPC, health checks | Rendimiento superior a controllers tradicionales; menor boilerplate; nativo AOT-compatible | ADR-0041 | [Minimal APIs overview (learn.microsoft.com)](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis) |
| **EF Core** | Infraestructura | ORM transaccional completo con tracking de cambios, migraciones y LINQ | CRUD transaccional, operaciones con cambio de estado, outbox pattern | ORM maduro con soporte Microsoft; LINQ type-safe; integración nativa con SQL Server | ADR-0041 | [Entity Framework Core docs (learn.microsoft.com)](https://learn.microsoft.com/en-us/ef/core/) |
| **Dapper** | Infraestructura | Micro-ORM para consultas de alta performance sin tracking | Lecturas ETL, reportes, batches, operaciones donde EF Core es excesivo | Mínimo overhead vs EF Core; ideal para cockteles de alto throughput | ADR-0041 | [Dapper GitHub](https://github.com/DapperLib/Dapper); trend: micro-ORMs ganan tracción en 2024-2026 para cargas de lectura |
| **FluentValidation** | Aplicación | Validación declarativa de comandos, queries y DTOs | Validación de entrada en capa de Aplicación; contracts de API | Separación de concerns; reglas reutilizables y testeables; compatible con ASP.NET pipeline | ADR-0041 | [FluentValidation docs](https://docs.fluentvalidation.net/); patrón estándar en Clean Architecture .NET |
| **OneOf / Result\<T\>** | Aplicación + Dominio | Manejo de errores como tipos de retorno en lugar de excepciones | Toda operación que puede fallar y debe ser manejada por el llamante | Evita excepciones como control de flujo; obliga al compilador a verificar todos los casos | ADR-0038 (ref. Node.js, aplica por simetría) | [OneOf GitHub](https://github.com/mcintyre321/OneOf); trend: pattern matching sobre union types en C# moderno |
| **Polly** | Infraestructura | Resilience pipeline: retry, circuit breaker, timeout, bulkhead, fallback | Toda comunicación externa (HTTP, BD, gRPC, RabbitMQ) | Librería estándar de facto en .NET para resiliencia; soporte oficial de Microsoft | ADR-0011 | [Polly GitHub](https://github.com/App-vNext/Polly); [Microsoft Resilience Guidelines](https://learn.microsoft.com/en-us/dotnet/architecture/microservices/implement-resilient-applications/) |
| **Serilog + PII-safe pipeline** | Infraestructura | Logging estructurado JSON con enriquecimiento de contexto y sanitización PII | Todo módulo .NET; reemplaza ILogger nativo en producción | Enriquecimiento semántico; pipeline configurable para filtrado de datos sensibles | ADR-0065 | [Serilog docs](https://serilog.net/); ADR-0064 define scope de request |
| **OpenTelemetry .NET** | Infraestructura | Trazas distribuidas, métricas y logs con exportador vendor-neutral | Todos los servicios; instrumentación automática de ASP.NET Core, EF Core, HttpClient | Estandar W3C Trace Context; evita vendor lock-in (App Insights nativo rechazado) | ADR-0064 | [OpenTelemetry .NET docs](https://opentelemetry.io/docs/languages/net/); [CNCF OpenTelemetry adoption 2024-2026](https://www.cncf.io/reports/) |
| **xUnit + FluentAssertions** | Pruebas | Framework de pruebas unitarias con assertions legibles | Todas las pruebas unitarias (aislamiento vía mocks/stubs) | xUnit es el estándar moderno .NET; FluentAssertions mejora legibilidad de fallos | ADR-0052, ADR-0041 | [xUnit docs](https://xunit.net/); [FluentAssertions](https://fluentassertions.com/) |
| **Testcontainers.NET** | Pruebas (Integración) | Contenedores desechables para pruebas de integración fieles a producción | Pruebas que requieren BD real, caché, bróker o almacenamiento | Elimina fakes en memoria; misma versión y configuración que producción | ADR-0053 | [Testcontainers for .NET](https://dotnet.testcontainers.org/); [ADR-0053](./adrs/core/0053-estrategia-pruebas-integracion-e2e.es.md) |
| **Moq / NSubstitute** | Pruebas | Creación de mocks y stubs para aislamiento de pruebas unitarias | Pruebas unitarias donde se requiere verificar interacciones o simular dependencias | Las dos librerías más usadas en el ecosistema .NET; intercambiables | ADR-0052 | [Moq](https://github.com/devlooped/moq); [NSubstitute](https://nsubstitute.github.io/) |
| **ShellD (Factory, Bootstrapper, Aop, Ddd)** | Aplicación + Infraestructura | Librerías comunes corporativas para DDD táctico, AOP, bootstrapping y factory pattern | Ver Patrones Canónicos .NET | Estandarización del ecosistema Unimar; reduce código boilerplate transversal | ADR-0041 (ref. implícita) | [ShellD GitHub](https://github.com/orgs/ShellD-DotNet/repositories); ver canonical-patterns |

---

## 3. Implementación Arquitectónica (Mapeo .NET)

Para cumplir con el mandato general de [Arquitectura Hexagonal](stack-tecnologico-autorizado-agnostico.es.md#1-restricciones-ejecutivas-y-no-negociables) y el [ADR-0041](./adrs/dotnet/0041-arquitectura-backend-canonica-dotnet.es.md), se aplican las siguientes reglas de organización de proyectos .NET:

### 3.1 Segregación de Proyectos (Estructura de la Solución)

| Proyecto | Rol en Hexagonal | Dependencias Permitidas | Prohibiciones |
| :--- | :--- | :--- | :--- |
| **`{BoundedContext}.Domain`** | Núcleo de Dominio (Entidades, VO, Puertos) | Solo `System.*` | Cero referencias NuGet externas; cero EF Core, cero ASP.NET, cero SDKs cloud |
| **`{BoundedContext}.Application`** | Casos de Uso / CQRS | `MediatR`, `FluentValidation`, `OneOf` / `Result<T>` | Sin referencias a EF Core, HTTP, Redis o infraestructura |
| **`{BoundedContext}.Infrastructure`** | Adaptadores (EF Core DbContext, Dapper, Redis, RabbitMQ, HttpClient) | `EF Core`, `Dapper`, `Polly`, `Serilog`, `OpenTelemetry`, `StackExchange.Redis`, `RabbitMQ.Client` | Sin lógica de negocio; solo implementación de puertos |
| **`{BoundedContext}.Presentation`** | Punto de entrada (Minimal APIs / Controllers) | `ASP.NET Core`, `Swashbuckle/NSwag` | Sin referencias directas a EF Core o Dapper |

### 3.2 Inyección de Dependencias

Utilizar el contenedor DI nativo `Microsoft.Extensions.DependencyInjection`. Se **PROHÍBE** el uso de contenedores DI ajenos (Autofac, StructureMap, Unity) dentro de módulos ASP.NET Core. El registro de dependencias DEBE hacerse mediante **Extension Methods** por proyecto de Infraestructura:

```csharp
// {BoundedContext}.Infrastructure/DependencyInjection.cs
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(...);
        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddHttpClient<IExternalPort, ExternalAdapter>()
                .AddTransientHttpErrorPolicy(b => b.RetryAsync(3));
        return services;
    }
}
```

### 3.3 Política de Gestión de Errores

Lanzar excepciones estándar (`throw new Exception()`) para el control de flujo está **PROHIBIDO**. Los equipos DEBEN utilizar el **Patrón Result** con `OneOf<T>` o clases personalizadas `Result<T, TError>` para propagar fallos de lógica de negocio de forma segura. Esta decisión está alineada por simetría con el [ADR-0038](./adrs/nodejs/0038-estrategia-manejo-errores-patron-result.es.md).

```csharp
// Ejemplo en Application Layer
public class CreateOrderHandler : IRequestHandler<CreateOrderCommand, OneOf<OrderDto, ValidationFailed, NotFound>>
{
    public async Task<OneOf<OrderDto, ValidationFailed, NotFound>> Handle(
        CreateOrderCommand request, CancellationToken ct)
    {
        var customer = await _customerRepo.GetByIdAsync(request.CustomerId);
        if (customer is null) return new NotFound("Customer not found");

        var order = Order.Create(customer, request.Items);
        if (!order.IsValid) return new ValidationFailed(order.Errors);

        await _orderRepo.SaveAsync(order, ct);
        return OrderDto.From(order);
    }
}
```

### 3.4 Background Services y Workers

Para procesamiento por lotes, workers de colas y tareas scheduladas, DEBE utilizarse `BackgroundService` (implementa `IHostedService`) según lo define el [ADR-0041](./adrs/dotnet/0041-arquitectura-backend-canonica-dotnet.es.md). El worker DEBE implementar un pipeline de resiliencia con Polly para el manejo de fallos transitorios:

```csharp
public class InvoiceBatchWorker : BackgroundService
{
    private readonly ILogger<InvoiceBatchWorker> _logger;
    private readonly IInvoiceProcessor _processor;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await _processor.ProcessBatchAsync(stoppingToken);
            await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
        }
    }
}
```

---

## 4. Persistencia y Acceso a Datos

### 4.1 Estrategia Dual: EF Core + Dapper

Siguiendo el [ADR-0041](./adrs/dotnet/0041-arquitectura-backend-canonica-dotnet.es.md) y el [ADR-0051](./adrs/core/0051-estrategia-motor-base-datos-empresarial.es.md), se autorizan dos mecanismos de acceso a datos:

| Mecanismo | Cuándo usarlo | Por qué |
| :--- | :--- | :--- |
| **EF Core** | CRUD transaccional, comandos CQRS, cambios de estado, outbox pattern | Tracking de cambios automático, LINQ type-safe, migraciones integradas |
| **Dapper** | Lecturas ETL, reportes, batches, queries de solo lectura con alta performance | Mínimo overhead, control total del SQL, hasta 10x más rápido en lecturas simples |

```csharp
// Ejemplo Dapper para lectura ETL
public class ReportRepository : IReportPort
{
    private readonly IDbConnection _connection; // Dapper

    public async Task<IEnumerable<SalesSummary>> GetDailySalesAsync(DateOnly date)
    {
        const string sql = """
            SELECT p.Name, SUM(od.Quantity) AS TotalUnits, SUM(od.Total) AS TotalRevenue
            FROM Orders o
            JOIN OrderDetails od ON o.Id = od.OrderId
            JOIN Products p ON od.ProductId = p.Id
            WHERE o.CreatedDate = @Date
            GROUP BY p.Name
        """;
        return await _connection.QueryAsync<SalesSummary>(sql, new { Date = date });
    }
}
```

### 4.2 Acceso por Sucursal

Siguiendo el [ADR-0010](./adrs/core/0010-estrategia-arquitectura-multitenant.es.md), el control de acceso por sucursal es **exclusivamente de autorización**. No hay segunda capa: SQL Server Row-Level Security **no se implementa** — impondría un aislamiento estricto que impide operaciones cross-sucursal legítimas (un contenedor transferido de Paita a Callao debe conservar su historial visible).

1. **Autorización (único mecanismo de control):** el caso de uso valida que `sucursal_id` esté en el claim `sucursales_autorizadas` del `ClaimsPrincipal`. Si no lo está, `403 Forbidden`.
2. **Filtro por defecto (usabilidad, no seguridad):** los filtros de consulta de EF Core evitan que el operador tenga que indicar su sucursal en cada consulta. **Deben ser anulables**: los casos de uso con visibilidad cross-sucursal los desactivan y lo documentan en su Historia Técnica.

```csharp
// EF Core Query Filter
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Order>().HasQueryFilter(o => o.SucursalId == _currentSucursalId);
}
```

### 4.3 Migraciones

Ejecutar automáticamente `context.Database.Migrate()` desde el host Web durante el arranque está **FUERTEMENTE DESACONSEJADO** para producción. Las migraciones DEBEN generarse como bundles de scripts SQL y ejecutarse dentro de Init-Containers de Kubernetes:

```bash
dotnet ef migrations bundle --self-contained -r linux-x64 -o ./migrations-bundle
# El bundle se ejecuta como Init-Container antes del despliegue del pod principal
```

### 4.4 Transacciones y Outbox Pattern

Para mensajería asíncrona, DEBE implementarse el **Patrón Transactional Outbox** según el [ADR-0033](./adrs/core/0033-patron-transactional-outbox.es.md). La tabla `outbox` DEBE residir en la misma base de datos SQL Server del contexto acotado:

```csharp
using var transaction = await context.Database.BeginTransactionAsync(ct);
context.Orders.Add(order);
context.OutboxMessages.Add(new OutboxMessage { Type = "OrderCreated", Payload = ... });
await context.SaveChangesAsync(ct);
await transaction.CommitAsync(ct);
```

---

## 5. Resiliencia y Tolerancia a Fallos

Siguiendo el [ADR-0011](./adrs/core/0011-patrones-resiliencia-tolerancia-fallos.es.md), toda comunicación externa (HTTP, BD, mensajería, caché) DEBE protegerse con un pipeline de resiliencia usando **Polly**:

| Patrón | Cuándo aplica | Ejemplo Polly |
| :--- | :--- | :--- |
| **Retry** | Fallos transitorios en BD, HTTP, Redis | `HttpClient` con `AddTransientHttpErrorPolicy(b => b.RetryAsync(3))` |
| **Circuit Breaker** | Fallos sostenidos en servicios externos | `HttpClient` con `AddTransientHttpErrorPolicy(b => b.CircuitBreakerAsync(5, TimeSpan.FromMinutes(1)))` |
| **Timeout** | Evitar threads bloqueados indefinidamente | `Policy.TimeoutAsync(10, TimeoutStrategy.Pessimistic)` |
| **Bulkhead** | Limitar concurrencia a recursos finitos | `Policy.BulkheadAsync(10, 20)` para hilos de base de datos |

```csharp
// Pipeline combinado para llamadas gRPC entre servicios
var resiliencePipeline = new ResiliencePipelineBuilder<MyResponse>()
    .AddRetry(new RetryStrategyOptions<MyResponse>
    {
        MaxRetryAttempts = 3,
        Delay = TimeSpan.FromMilliseconds(200),
        BackoffType = DelayBackoffType.Exponential
    })
    .AddCircuitBreaker(new CircuitBreakerStrategyOptions<MyResponse>
    {
        FailureRatio = 0.2,
        MinimumThroughput = 10,
        BreakDuration = TimeSpan.FromSeconds(30)
    })
    .AddTimeout(TimeSpan.FromSeconds(5))
    .Build();
```

---

## 6. Observabilidad

Siguiendo los [ADR-0064](./adrs/dotnet/0064-contexto-observabilidad-scope-request-dotnet.es.md) y [ADR-0065](./adrs/dotnet/0065-pipeline-serilog-seguro-pii-dotnet.es.md), todo servicio .NET DEBE instrumentar:

### 6.1 Trazas Distribuidas (OpenTelemetry)

```csharp
builder.Services.AddOpenTelemetry()
    .WithAspNetCoreInstrumentation()
    .WithHttpClientInstrumentation()
    .WithEntityFrameworkCoreInstrumentation()
    .WithAzureMonitorTraceExporter(o => o.ConnectionString = "..."); // vendor opcional
```

### 6.2 Logs Estructurados (Serilog + PII-safe)

```csharp
Log.Logger = new LoggerConfiguration()
    .Enrich.WithCorrelationId()
    .Enrich.WithProperty("Application", "unimar-invoicing")
    .Filter.ByExcluding(Matching.FromSource("Microsoft.AspNetCore"))
    .Destructure.With<SafePiiPolicy>()  // ADR-0065: sanitización PII
    .WriteTo.Console(new JsonFormatter())
    .CreateLogger();
```

### 6.3 Salud y Readiness (Health Checks)

Ver Patrón Canónico CP-03 para la implementación estandarizada de health checks con ASP.NET Core.

---

## 7. Librerías Comunes Recomendadas (ShellD)

Las siguientes librerías corporativas estandarizan patrones transversales en el ecosistema .NET. Ver Patrones Canónicos .NET para guía de uso detallada.

| Librería | Propósito | Cuándo usarla |
| :--- | :--- | :--- |
| **ShellD.Factory** | Fábrica abstracta y registry de puertos | Cuando se requiere creación dinámica de adaptadores según contexto |
| **ShellD.Bootstrapper** | Pipeline de arranque con ordenamiento por fases | En el startup de la aplicación; reemplaza código repetitivo de `Program.cs` |
| **ShellD.Aop** | Aspect-Oriented Programming mediante decorators dinámicos | Para cross-cutting concerns: logging, validación, caché, timing |
| **ShellD.Ddd** | Primitivas DDD táctico: AggregateRoot, ValueObject, DomainEvent, Entity | Base de todas las entidades de dominio en contextos acotados |

```csharp
// Ejemplo ShellD.Aop — decorador de caché automático
[Decorate(typeof(IProductRepository))]
public class CachedProductRepository : IProductRepository
{
    private readonly IProductRepository _inner;
    private readonly IDistributedCache _cache;

    public async Task<Product?> GetByIdAsync(Guid id)
    {
        var key = $"product:{id}";
        return await _cache.GetOrCreateAsync(key, 
            async () => await _inner.GetByIdAsync(id),
            TimeSpan.FromMinutes(10));
    }
}
```

---

## 8. Comunicación Interna entre Servicios

### 8.1 gRPC (ASP.NET Core gRPC)

Para comunicación síncrona entre contextos acotados, DEBE utilizarse **gRPC** sobre HTTP/2. La decisión de protocolo sigue la [Matriz de Decisión de Protocolos API (ADR-0032)](./adrs/core/0032-matriz-decision-protocolos-api-rest-grpc-graphql.es.md).

```protobuf
service OrderService {
  rpc GetOrder (OrderRequest) returns (OrderResponse);
}
```

### 8.2 RabbitMQ (Mensajería Asíncrona)

Para eventos de dominio y comunicación asíncrona, DEBE utilizarse **RabbitMQ** gobernado por [ADR-0036](./adrs/core/0036-estrategia-entrega-bus-mensajes-fifo-dlq.es.md) (FIFO, DLQ, control de flujo).

---

## 9. Pruebas

La pirámide de pruebas sigue el [ADR-0018](./adrs/core/0018-piramide-pruebas-gates-calidad.es.md)

| Tipo | Framework | Aislamiento | ADR |
| :--- | :--- | :--- | :--- |
| **Unitarias** | xUnit + FluentAssertions + Moq/NSubstitute | Mocks (interacción) o Stubs (estado) | ADR-0052 |
| **Integración** | WebApplicationFactory + Testcontainers.NET | Contenedores reales (SQL Server, Redis, RabbitMQ) | ADR-0053 |
| **Contrato** | PactNet | Verificación de contratos consumidor/proveedor | — |
| **Carga** | k6 (como estándar agnóstico) | Scripts JS independientes del runtime | — |

> [!TIP]
> **Aislamiento de Pruebas:** Los desarrolladores DEBEN seguir la estrategia definida en [ADR-0052](./adrs/core/0052-estrategia-aislamiento-pruebas-unitarias.es.md) al utilizar Mocks (verificación de interacción) o Stubs (configuración de estado).
>
> **Pruebas de Infraestructura:** Las pruebas de Integración y E2E DEBEN utilizar **Testcontainers** según [ADR-0053](./adrs/core/0053-estrategia-pruebas-integracion-e2e.es.md) para garantizar paridad con producción.

---

## 10. Advertencia Final de Integración para Proveedores

No satisfacer estas definiciones de herramientas estáticas bloqueará automáticamente la aceptación del código de integración.

-> Volver al **[Índice Maestro Global](../navigation/MASTER_INDEX.md)**

---

[Volver al Índice](README.md)
