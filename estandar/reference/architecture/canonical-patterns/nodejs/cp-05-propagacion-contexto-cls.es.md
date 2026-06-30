# CP-05: Propagación del Contexto con CLS

**Tipo:** Patrón Canónico — Node.js (TypeScript)  
**Estado:** Aceptado

---

## Problema

Los interceptores, guards, pipes y servicios de NestJS necesitan acceso a las señales de observabilidad con scope de request (CorrelationId, SessionTrackingId, TraceId, SpanId) sin acoplarse a `REQUEST` ni a `AsyncLocalStorage` directamente.

---

## Patrón

Un `RequestContext` con scope es escrito por un middleware y consumido por cualquier componente en el mismo request vía `AsyncLocalStorage`. Se exponen dos interfaces: `IRequestContext` (solo lectura, capa de Aplicación) y `IContextAccessor` (escritura, Infraestructura).

```
HTTP Request
     │
     ▼
CorrelationIdMiddleware     escribe CLS store + headers de respuesta
     │
     ▼
SessionTrackingMiddleware   enriquece CLS store con SessionTrackingId
     │
     ▼
AsyncLocalStorage<RequestContext>   ← fuente única de verdad
     │
     ├── IRequestContext          solo lectura (Aplicación)
     └── IContextAccessor         escritura (Infraestructura / Interceptores)
```

---

## Tipos de la Shell Library

```typescript
// Colocar en una shell library portable

export interface RequestContext {
  correlationId: string;
  sessionTrackingId: string;
  traceId: string;
  spanId: string;
}

export interface IRequestContext {
  readonly correlationId?: string;
  readonly sessionTrackingId?: string;
  readonly traceId?: string;
  readonly spanId?: string;
}

export interface IContextAccessor {
  get(): RequestContext;
  set(ctx: RequestContext): void;
}
```

```typescript
export const CTX_HEADERS = {
  CORRELATION_ID: 'x-correlation-id',
  SESSION_TRACKING_ID: 'x-session-tracking-id',
} as const;
```

---

## Implementación

```typescript
import { AsyncLocalStorage } from 'node:async_hooks';

export class ClsContextAccessor implements IContextAccessor {
  private static readonly storage = new AsyncLocalStorage<RequestContext>();

  get(): RequestContext {
    const ctx = ClsContextAccessor.storage.getStore();
    if (!ctx) throw new Error('No hay contexto CLS disponible');
    return ctx;
  }

  set(ctx: RequestContext): void {
    ClsContextAccessor.storage.enterWith(ctx);
  }

  static get storageInstance() {
    return ClsContextAccessor.storage;
  }
}
```

---

## Middleware

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const correlationId =
      req.headers[CTX_HEADERS.CORRELATION_ID]?.toString() ?? crypto.randomUUID();

    const context: RequestContext = {
      correlationId,
      sessionTrackingId: '',
      traceId: '',
      spanId: '',
    };

    ClsContextAccessor.storageInstance.run(context, () => {
      res.setHeader(CTX_HEADERS.CORRELATION_ID, correlationId);
      next();
    });
  }
}
```

---

## Registro en Módulo NestJS

```typescript
@Global()
@Module({
  providers: [
    { provide: IContextAccessor, useClass: ClsContextAccessor },
    { provide: IRequestContext, useExisting: IContextAccessor },
  ],
  exports: [IContextAccessor, IRequestContext],
})
export class ContextModule {}
```

---

## Reglas de Referencia por Capa

| Capa | Interfaz | Acceso |
|------|----------|--------|
| `Domain` | — | No necesita contexto |
| `Application` | `IRequestContext` (inyectado) | Solo lectura |
| `Infrastructure` | `IContextAccessor` | Lectura + escritura |
| `Presentation` (middleware) | `ClsContextAccessor` directo | Escritura |

---

## Handoff a Background Job

```typescript
const snapshot = this.contextAccessor.get();

// Pasar snapshot al job
await this.jobQueue.add('process', { correlationId: snapshot.correlationId });
```

---

## Patrones Relacionados

- [CP-06: Logging PII-Safe con Pino](cp-06-logging-pino-seguro-pii.es.md)
- [CP-08: Result Pattern con neverthrow](cp-08-result-pattern-neverthrow.es.md)
