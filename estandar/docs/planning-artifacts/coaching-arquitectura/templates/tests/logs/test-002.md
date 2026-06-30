# Test Log: Rechazar turno duplicado para misma placa
# Test ID: test-002
# Fecha: 2025-04-15 10:24:12 UTC
# Estado: PASS ✅

---

## Configuración del Test

```bash
TEST_DATABASE_URL=postgresql://test:test@localhost:5432/qtrack_test
TEST_API_URL=http://localhost:3001
```

---

## Ejecución

### Setup Inicial

```http
POST /turnos HTTP/1.1
Host: localhost:3001
Content-Type: application/json

{
  "placa": "XYZ-789",
  "tipoCamion": "DOBLE",
  "patio": "SUR",
  "operador": "maria.gonzalez"
}
```

**Respuesta inicial (201 Created):** Turno creado exitosamente

---

### Request Duplicado

```http
POST /turnos HTTP/1.1
Host: localhost:3001
Content-Type: application/json

{
  "placa": "XYZ-789",
  "tipoCamion": "DOBLE",
  "patio": "SUR",
  "operador": "carlos.ruiz"
}
```

### Response

```http
HTTP/1.1 409 Conflict
Content-Type: application/json

{
  "statusCode": 409,
  "error": "Conflict",
  "message": "Ya existe un turno activo para la placa XYZ-789",
  "code": "TURNO_DUPLICADO"
}
```

---

## Verificación en Base de Datos

```sql
SELECT COUNT(*) as total_turnos 
FROM turnos 
WHERE placa = 'XYZ-789' AND estado IN ('EN_ESPERA', 'EN_PROGRESO');
```

**Resultado:**

| total_turnos |
| :--- |
| 1 |

✅ Solo existe 1 turno activo (el segundo fue rechazado correctamente)

---

## Assertions

```typescript
// Primer request - debe crear turno
expect(crearResponse.status).toBe(201);

// Segundo request - debe rechazar por duplicado
expect(duplicadoResponse.status).toBe(409);
expect(duplicadoResponse.body.code).toBe('TURNO_DUPLICADO');
expect(duplicadoResponse.body.message).toContain('Ya existe un turno activo');

// Verificar que solo hay 1 turno en BD
const count = await turnoRepository.countByPlaca('XYZ-789');
expect(count).toBe(1);
```

**Resultado:** 5/5 assertions passed ✅

---

## Cleanup

```sql
DELETE FROM turnos WHERE placa = 'XYZ-789';
```

**Resultado:** 1 fila eliminada ✅

---

## Métricas

| Métrica | Valor |
| :--- | :--- |
| **Duración del test** | 312 ms |
| **Tiempo de respuesta API (creación)** | 48 ms |
| **Tiempo de respuesta API (duplicado)** | 23 ms |
| **Tiempo de consulta BD** | 8 ms |

---

*Log generado automáticamente por Jest + Testcontainers · Q-Track v1.0.0*
