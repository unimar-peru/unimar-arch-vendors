# Test Log: Avanzar turno y publicar evento a XMS
# Test ID: test-003
# Fecha: 2025-04-15 10:25:34 UTC
# Estado: PASS ✅

---

## Configuración del Test

```bash
TEST_DATABASE_URL=postgresql://test:test@localhost:5432/qtrack_test
TEST_API_URL=http://localhost:3001
XMS_MOCK_URL=http://localhost:3002
```

---

## Ejecución

### Setup Inicial

```http
POST /turnos HTTP/1.1
Host: localhost:3001
Content-Type: application/json

{
  "placa": "DEF-456",
  "tipoCamion": "TRAILER",
  "patio": "NORTE",
  "operador": "luis.gomez"
}
```

**Respuesta:** Turno creado con ID `550e8400-e29b-41d4-a716-446655440001`, estado `EN_ESPERA`

---

### Request: Avanzar Turno

```http
PATCH /turnos/550e8400-e29b-41d4-a716-446655440001/avanzar HTTP/1.1
Host: localhost:3001
Content-Type: application/json

{
  "operador": "luis.gomez",
  "observacion": "Camión listo para ingreso"
}
```

### Response

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "numero": 43,
  "placa": "DEF-456",
  "estado": "EN_PROGRESO",
  "fechaAsignacion": "2025-04-15T10:25:34.456Z",
  "observacion": "Camión listo para ingreso"
}
```

---

## Verificación de Evento Publicado a XMS

```http
GET /events/publicados HTTP/1.1
Host: localhost:3002
```

**Respuesta del Mock XMS:**

```json
{
  "eventos": [
    {
      "tipo": "TurnoAvanzado",
      "turnoId": "550e8400-e29b-41d4-a716-446655440001",
      "placa": "DEF-456",
      "estadoAnterior": "EN_ESPERA",
      "estadoNuevo": "EN_PROGRESO",
      "timestamp": "2025-04-15T10:25:34.789Z",
      "metadata": {
        "patio": "NORTE",
        "operador": "luis.gomez"
      }
    }
  ]
}
```

✅ Evento publicado correctamente a XMS

---

## Verificación en Base de Datos

```sql
SELECT id, estado, fecha_asignacion, observacion 
FROM turnos 
WHERE id = '550e8400-e29b-41d4-a716-446655440001';
```

**Resultado:**

| id | estado | fecha_asignacion | observacion |
| :--- | :--- | :--- | :--- |
| 550e8400-e29b-41d4-a716-446655440001 | EN_PROGRESO | 2025-04-15 10:25:34.456 | Camión listo para ingreso |

---

## Assertions

```typescript
// Verificar cambio de estado
expect(response.status).toBe(200);
expect(response.body.estado).toBe('EN_PROGRESO');
expect(response.body.fechaAsignacion).toBeDefined();

// Verificar evento publicado a XMS
const eventos = await xmsMock.getEventos('TurnoAvanzado');
expect(eventos.length).toBe(1);
expect(eventos[0].turnoId).toBe('550e8400-e29b-41d4-a716-446655440001');
expect(eventos[0].estadoAnterior).toBe('EN_ESPERA');
expect(eventos[0].estadoNuevo).toBe('EN_PROGRESO');

// Verificar persistencia en BD
const turno = await turnoRepository.getById('550e8400-e29b-41d4-a716-446655440001');
expect(turno.estado).toBe('EN_PROGRESO');
expect(turno.observacion).toBe('Camión listo para ingreso');
```

**Resultado:** 8/8 assertions passed ✅

---

## Cleanup

```sql
DELETE FROM turnos WHERE id = '550e8400-e29b-41d4-a716-446655440001';
DELETE FROM eventos_xms WHERE turno_id = '550e8400-e29b-41d4-a716-446655440001';
```

**Resultado:** 2 filas eliminadas ✅

---

## Métricas

| Métrica | Valor |
| :--- | :--- |
| **Duración del test** | 445 ms |
| **Tiempo de respuesta API** | 67 ms |
| **Tiempo de publicación a XMS** | 34 ms |
| **Tiempo de consulta BD** | 15 ms |

---

*Log generado automáticamente por Jest + Testcontainers · Q-Track v1.0.0*
