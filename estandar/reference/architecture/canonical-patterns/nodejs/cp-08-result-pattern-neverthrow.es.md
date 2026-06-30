# CP-08: Result Pattern con neverthrow

**Tipo:** Patrón Canónico — Node.js (TypeScript)  
**Estado:** Aceptado

---

## Problema

Las excepciones como mecanismo de control de flujo rompen la cadena de tipos, dificultan el testing y ocultan caminos de error. Se necesita un patrón que modele el éxito y el fallo como tipos de primera clase.

---

## Patrón

Usar `Result<T, E>` de neverthrow para modelar operaciones que pueden fallar. Los casos de uso retornan `Result` y las capas superiores (controller, scheduler) deciden cómo manejar cada caso.

```typescript
import { Result, ok, err } from 'neverthrow';

interface DomainError {
  type: string;
  message: string;
  details?: unknown;
}
```

---

## Ejemplo de Caso de Uso

```typescript
export class RegistrarManifiestoUseCase {
  constructor(
    private readonly repo: IManifiestoRepository,
    @Inject(ILogger) private readonly logger: ILogger,
  ) {}

  async execute(
    dto: RegistrarManifiestoDto,
  ): Promise<Result<Manifiesto, DomainError>> {
    const duplicado = await this.repo.findByNumero(dto.numero);
    if (duplicado) {
      return err({
        type: 'MANIFIESTO_DUPLICADO',
        message: `Ya existe un manifiesto con número ${dto.numero}`,
      });
    }

    const manifiesto = Manifiesto.create(dto);
    if (manifiesto.isErr()) return err(manifiesto.error);

    await this.repo.save(manifiesto.value);
    return ok(manifiesto.value);
  }
}
```

---

## Controller

```typescript
@Controller('manifiestos')
export class ManifiestoController {
  @Post()
  async crear(@Body() dto: RegistrarManifiestoDto) {
    const result = await this.useCase.execute(dto);

    if (result.isErr()) {
      const err = result.error;
      switch (err.type) {
        case 'MANIFIESTO_DUPLICADO':
          return { status: 409, error: err.message };
        default:
          return { status: 400, error: err.message };
      }
    }

    return { status: 201, data: result.value };
  }
}
```

---

## Reglas

| Regla | Descripción |
|-------|-------------|
| Casos de uso retornan `Result<T, E>` | Nunca lanzan excepciones |
| `DomainError` se define por módulo | Cada módulo define sus errores como uniones discriminadas |
| Controladores traducen `Result` a HTTP | `ok` → 2xx, `err` → 4xx/5xx según el tipo de error |
| Background jobs traducen `Result` a cola de reintentos | `err` → encola para retry con backoff |

---

## Patrones Relacionados

- [CP-05: Propagación del Contexto con CLS](cp-05-propagacion-contexto-cls.es.md)
- [CP-06: Logging PII-Safe con Pino](cp-06-logging-pino-seguro-pii.es.md)
