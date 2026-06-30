# Estándar de Diseño de API

> **Estándares de Referencia:** [OpenAPI 3.1](https://spec.openapis.org/oas/v3.1.0), [JSON:API](https://jsonapi.org/), [RFC 7231](https://datatracker.ietf.org/doc/html/rfc7231) (HTTP Semantics), ADR-0032 (protocolos), ADR-0038 (Result Pattern).
> **Propósito:** Definir el estándar de diseño de APIs REST en Unimar: formato de respuesta, códigos de error, paginación, versionado, idempotencia y documentación.

---

## 1. Formato de Respuesta Estándar

Toda respuesta API DEBE seguir esta estructura:

```typescript
// Éxito
{
  "data": T,                    // Payload del recurso o array
  "meta": {                     // Metadatos (opcional)
    "pagination": {             // Obligatorio si es lista
      "page": 1,
      "pageSize": 20,
      "total": 150,
      "totalPages": 8
    },
    "requestId": "uuid"         // Trace ID para correlación
  }
}

// Error
{
  "error": {
    "code": "VALIDATION_ERROR",        // Código de error del dominio
    "message": "El campo RUC es obligatorio",
    "status": 400,                      // Código HTTP
    "details": [                        // Detalle de errores de validación
      {
        "field": "ruc",
        "code": "REQUIRED",
        "message": "El campo RUC es obligatorio"
      }
    ],
    "requestId": "uuid"
  }
}
```

### Reglas

| Regla | Descripción |
| :---- | :---------- |
| **Envoltorio consistente** | Usar `data` para payload, `error` para errores. No mezclar en la misma respuesta |
| **Meta siempre presente** | Incluir `requestId` en toda respuesta para trazabilidad |
| **Paginación en meta** | No mezclar datos de paginación en `data`. Usar `meta.pagination` |
| **Campos en camelCase** | `.NET` usa PascalCase en BD, pero la API expone camelCase para el frontend |
| **Fechas en ISO 8601** | `2026-06-11T14:30:00-05:00`. Siempre con timezone |

---

## 2. Códigos de Error del Dominio

| Código HTTP | Código de dominio | Cuándo usarlo | Ejemplo |
| :---------- | :---------------- | :------------ | :------ |
| **400** | `VALIDATION_ERROR` | Error de validación de campos | RUC inválido, email mal formado |
| **400** | `BUSINESS_RULE_ERROR` | Regla de negocio violada | Despacho ya numerado, no se puede modificar |
| **401** | `UNAUTHORIZED` | Token faltante o inválido | JWT expirado, API Key faltante |
| **403** | `FORBIDDEN` | Token válido pero sin permiso | Usuario sin rol para numerar DUA |
| **404** | `NOT_FOUND` | Recurso no existe | Despacho con ID 12345 no encontrado |
| **409** | `CONFLICT` | Conflicto de estado | Despacho en estado incorrecto para la operación |
| **422** | `UNPROCESSABLE_ENTITY` | Payload sintácticamente válido pero semánticamente incorrecto | Fecha de ETA anterior a la fecha actual |
| **429** | `RATE_LIMIT_EXCEEDED` | Límite de peticiones excedido | Incluir header `Retry-After` |
| **500** | `INTERNAL_ERROR` | Error inesperado del servidor | No incluir detalle técnico en respuesta |
| **503** | `SERVICE_UNAVAILABLE` | Dependencia externa caída | SUNAT no disponible, reintentar más tarde |

---

## 3. Paginación

| Parámetro | Tipo | Default | Máximo | Descripción |
| :-------- | :--- | :------ | :----- | :---------- |
| `page` | integer | 1 | — | Número de página |
| `pageSize` | integer | 20 | 100 | Elementos por página |

```typescript
// Request
GET /api/v1/despachos?page=1&pageSize=20

// Response
{
  "data": [ ... ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 150,
      "totalPages": 8
    },
    "requestId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  }
}
```

**Headers de paginación (opcional, complementario):**
```
X-Pagination-Page: 1
X-Pagination-PageSize: 20
X-Pagination-Total: 150
X-Pagination-TotalPages: 8
```

---

## 4. Versionado de API

| Estrategia | Cómo | Ejemplo |
| :--------- | :--- | :------ |
| **URL Path** | `v1`, `v2` en la ruta | `GET /api/v1/despachos` |
| **Headers** | `Accept: application/json; version=1` | — |
| **SemVer** | Major version = breaking change | v1 → v2 solo si hay breaking change |

> **Regla:** Usar **URL Path** como estrategia primaria. Major version en la URL. Minor/patch no cambian la URL.

### Ciclo de Vida de Versiones

| Estado | Descripción | Acción |
| :----- | :---------- | :----- |
| **Active** | Versión actual, soportada plenamente | Documentada como versión por defecto |
| **Deprecated** | Versión antigua con fecha de EOL definida | Responder con header `Warning: 299 - "El API v1 será deprecado el 2026-12-31"` |
| **Sunset** | Versión eliminada | Retornar 410 Gone con link a la nueva versión |

```typescript
// Header de deprecación
Warning: 299 api.unimar.com "El API v1 será deprecado el 2026-12-31"
Deprecation: true
Sunset: Sat, 31 Dec 2026 23:59:59 GMT
Link: <https://api.unimar.com/api/v2/despachos>; rel="successor-version"
```

---

## 5. Idempotencia en APIs Mutativas

Toda operación mutativa (POST, PUT, PATCH) DEBE soportar idempotencia:

| Header | Tipo | Descripción |
| :----- | :--- | :---------- |
| `Idempotency-Key` | UUID | Clave única que identifica la operación |

```typescript
// Request
POST /api/v1/despachos
Idempotency-Key: 123e4567-e89b-12d3-a456-426614174000
Content-Type: application/json
{ "ruc": "20100412447", "tipo": "IMPORTACION" }

// Response (primera vez)
HTTP 201 Created
Idempotency-Key: 123e4567-e89b-12d3-a456-426614174000
{ "data": { "id": "DP-001", "estado": "CREADO" } }

// Response (reintento con misma key)
HTTP 200 OK (o 409 Conflict si el estado cambió)
Idempotency-Key: 123e4567-e89b-12d3-a456-426614174000
{ "data": { "id": "DP-001", "estado": "CREADO" } }
```

**Reglas:**
- TTL de la clave de idempotencia: 24 horas
- Almacenar en Redis con expiración automática
- Si la clave existe y el payload difiere → 422 UNPROCESSABLE_ENTITY
- Si la clave existe y el payload coincide → retornar la respuesta original

---

## 6. Documentación de API (OpenAPI 3.1)

| Elemento | Requerido | Descripción |
| :------- | :-------- | :---------- |
| `info.title` | ✅ | Nombre del servicio |
| `info.version` | ✅ | Versión semántica del API |
| `info.description` | ✅ | Propósito del servicio, ejemplos de uso |
| `servers` | ✅ | URL base del servicio por entorno |
| `paths` | ✅ | Todos los endpoints con métodos, parámetros, request/response |
| `components.schemas` | ✅ | Todos los DTOs con tipos, required, description |
| `components.securitySchemes` | ✅ | Bearer JWT, API Key |
| `tags` | ✅ | Agrupación lógica de endpoints |

```yaml
openapi: 3.1.0
info:
  title: API de Despachos
  version: 1.2.0
  description: Gestión de despachos aduaneros — creación, consulta, numeración y seguimiento.
servers:
  - url: https://api.unimar.com/api/v1
    description: Producción
paths:
  /despachos:
    get:
      summary: Listar despachos
      parameters:
        - name: page
          in: query
          schema: { type: integer, default: 1 }
        - name: pageSize
          in: query
          schema: { type: integer, default: 20, maximum: 100 }
      responses:
        '200':
          description: Lista de despachos paginada
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DespachoListResponse'
```

---

## 7. Herramientas

| Herramienta | Propósito | Instalación | Uso | Licencia |
| :---------- | :-------- | :---------- | :-- | :------- |
| [Swashbuckle](https://github.com/domaindrivendev/Swashbuckle.AspNetCore) | OpenAPI para .NET | NuGet | [docs](https://github.com/domaindrivendev/Swashbuckle.AspNetCore) | MIT |
| [@nestjs/swagger](https://docs.nestjs.com/openapi/introduction) | OpenAPI para NestJS | npm | [docs](https://docs.nestjs.com/openapi/introduction) | MIT |
| [Stoplight](https://stoplight.io/) | Design-first API (OpenAPI editor) | Web / CLI | [docs](https://docs.stoplight.io/) | Free / Team (paga) |
| [Redoc](https://redocly.com/redoc) | Documentación API renderizada | npm | [docs](https://redocly.com/docs/redoc/) | MIT |
| [Kong](https://konghq.com/) | API Gateway + Developer Portal | [guía](https://konghq.com/install/) | [docs](https://docs.konghq.com/) | Apache 2.0 |

---

## 8. ADRs Relacionados

| ADR | Título | ¿Qué define? |
| :-- | :----- | :----------- |
| ADR-0032 | Protocolos API | Cuándo usar REST, gRPC, GraphQL |
| ADR-0038 | Result Pattern | Manejo de errores con Result<T,E> |
| ADR-0030 | API Gateway 2 niveles | Kong + BFF |
| ADR-0040 | Contratos Multi-Runtime | Type-safe, versionado, compatibilidad |

---

## 9. Documentos Relacionados

| Documento | Propósito |
| :-------- | :-------- |
| [Estrategia de Frontend Web](./estrategia-frontend-web.es.md) | Consumo de APIs desde el frontend |
| [Estrategia de Integraciones](./estrategia-integraciones.es.md) | Integración con SUNAT, SAP, clientes y proveedores |
| Estrategia de Pruebas | API testing: unitarias, integración, contrato, E2E |
| [Plan de Seguridad](../testing/plan-seguridad.es.md) | Autenticación, autorización, rate limiting, cifrado en APIs |
| [Estrategia de Seguridad](../../sdlc/estrategia-seguridad.es.md) | SAST, DAST aplicado a APIs |
| [Estrategia de Monitoreo](./estrategia-monitoreo.es.md) | Métricas por endpoint, alertas de latencia y errores |

---

[Volver a Fase 2 — Diseño y Arquitectura](../../../navigation/indices/fase-2-diseno-arquitectura.md)
