# Test Log: Crear turno para camión con placa válida
# Test ID: test-001
# Fecha: 2025-04-15 10:23:45 UTC
# Estado: PASS ✅

---

## Configuración del Test

```bash
TEST_DATABASE_URL=postgresql://test:test@localhost:5432/qtrack_test
TEST_API_URL=http://localhost:3001
```

---

## Ejecución

### Request

```http
POST /turnos HTTP/1.1
Host: localhost:3001
Content-Type: application/json

{
  "placa": "ABC-123",
  "tipoCamion": "SIMPLE",
  "patio": "NORTE",
  "operador": "juan.perez"
}
```

### Response

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "numero": 42,
  "placa": "ABC-123",
  "tipoCamion": "SIMPLE",
  "patio": "NORTE",
  "estado": "EN_ESPERA",
  "fechaCreacion": "2025-04-15T10:23:45.123Z",
  "fechaAsignacion": null,
  "fechaCompletado": null
}
```

---

## Verificación en Base de Datos

```sql
SELECT id, numero, placa, estado, fecha_creacion 
FROM turnos 
WHERE placa = 'ABC-123';
```

**Resultado:**

| id | numero | placa | estado | fecha_creacion |
| :--- | :--- | :--- | :--- | :--- |
| 550e8400-e29b-41d4-a716-446655440000 | 42 | ABC-123 | EN_ESPERA | 2025-04-15 10:23:45.123 |

---

## Assertions

```typescript
expect(response.status).toBe(201);
expect(response.body.placa).toBe('ABC-123');
expect(response.body.estado).toBe('EN_ESPERA');
expect(response.body.numero).toBeGreaterThan(0);
expect(response.body.fechaCreacion).toBeDefined();
```

**Resultado:** 5/5 assertions passed ✅

---

## Cleanup

```sql
DELETE FROM turnos WHERE placa = 'ABC-123';
```

**Resultado:** 1 fila eliminada ✅

---

## Métricas

| Métrica | Valor |
| :--- | :--- |
| **Duración del test** | 234 ms |
| **Tiempo de respuesta API** | 45 ms |
| **Tiempo de consulta BD** | 12 ms |

---

*Log generado automáticamente por Jest + Testcontainers · Q-Track v1.0.0*
