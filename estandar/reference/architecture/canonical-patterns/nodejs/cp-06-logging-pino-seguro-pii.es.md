# CP-06: Logging PII-Safe con Pino

**Tipo:** Patrón Canónico — Node.js (TypeScript)  
**Estado:** Aceptado

---

## Problema

Los logs de aplicación pueden contener datos personales (PII) como DNI, correo electrónico, direcciones o números de teléfono. Se necesita un pipeline de logging que garantice la exclusión o redacción automática de estos campos sin depender de la disciplina del desarrollador.

---

## Patrón

Configurar Pino con un serializador personalizado y un `redact` array que censure campos sensibles en todos los objetos logueados. Además, se define un logger wrapper tipado con métodos seguros.

```
Log Statement
     │
     ▼
Pino Logger wrapper  →  redact: ['req.headers.authorization', '*.dni', '*.email']
     │
     ▼
Serializador custom  →  elimina campos PII antes de salida JSON
     │
     ▼
Transporte (consola/archivo/OpenTelemetry)
```

---

## Configuración

```typescript
import pino from 'pino';

const piiRedactPaths = [
  'req.headers.authorization',
  'req.headers.cookie',
  '*.dni',
  '*.documentNumber',
  '*.email',
  '*.phone',
  '*.address',
  '*.password',
  '*.secret',
];

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  redact: {
    paths: piiRedactPaths,
    censor: '[REDACTED]',
  },
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      headers: { 'x-correlation-id': req.headers['x-correlation-id'] },
    }),
    res: (res) => ({ statusCode: res.statusCode }),
    err: pino.stdSerializers.err,
  },
});
```

---

## Logger Tipado

```typescript
export interface ILogger {
  info(msg: string, ctx?: Record<string, unknown>): void;
  warn(msg: string, ctx?: Record<string, unknown>): void;
  error(msg: string, err?: Error, ctx?: Record<string, unknown>): void;
  debug(msg: string, ctx?: Record<string, unknown>): void;
}

export class PinoLogger implements ILogger {
  constructor(private readonly pino: pino.Logger) {}

  info(msg: string, ctx?: Record<string, unknown>) {
    this.pino.info(ctx ?? {}, msg);
  }

  error(msg: string, err?: Error, ctx?: Record<string, unknown>) {
    this.pino.error({ err, ...ctx }, msg);
  }
  // ...resto de métodos delegados
}
```

---

## Registro en NestJS

```typescript
@Global()
@Module({
  providers: [
    { provide: ILogger, useFactory: () => new PinoLogger(logger) },
  ],
  exports: [ILogger],
})
export class LoggingModule {}
```

---

## Validación en Pruebas

```typescript
test('no emite campos PII en log output', () => {
  const lines = spawnLogsFor(() => {
    logger.info({ email: 'test@example.com', dni: '12345678' }, 'test');
  });
  for (const line of lines) {
    expect(line).not.toContain('test@example.com');
    expect(line).not.toContain('12345678');
    expect(line).toContain('[REDACTED]');
  }
});
```

---

## Patrones Relacionados

- [CP-05: Propagación del Contexto con CLS](cp-05-propagacion-contexto-cls.es.md)
- [CP-08: Result Pattern con neverthrow](cp-08-result-pattern-neverthrow.es.md)
