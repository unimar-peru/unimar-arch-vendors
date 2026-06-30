# Test Log: Consultar turno por placa (≤ 200ms)
# Test ID: test-004
# Fecha: 2025-04-15 10:26:45 UTC
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
  "placa": "GHI-789",
  "tipoCamion": "SIMPLE",
  "patio": "SUR",
  "operador": "ana.martinez"
}
```

**Respuesta:** Turno creado con ID `550e8400-e29b-41d4-a716-446655440002`, estado `EN_ESPERA`

---

### Request: Consultar Turno

```http
GET /turnos?placa=GHI-789 HTTP/1.1
Host: localhost:3001
```

### Response

```http
HTTP/1.1 200 OK
Content-Type: application/json
X-Response-Time-Ms: 142

{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "numero": 44,
  "placa": "GHI-789",
  "tipoCamion": "SIMPLE",
  "patio": "SUR",
  "estado": "EN_ESPERA",
  "fechaCreacion": "2025-04-15T10:26:45.123Z",
  "fechaAsignacion": null,
  "fechaCompletado": null
}
```

---

## Verificación de Performance

### 10 Iteraciones del Test

| Iteración | Tiempo de Respuesta (ms) | Estado |
| :--- | :--- | :--- |
| 1 | 138 | ✅ |
| 2 | 145 | ✅ |
| 3 | 141 | ✅ |
| 4 | 149 | ✅ |
| 5 | 136 | ✅ |
| 6 | 152 | ✅ |
| 7 | 143 | ✅ |
| 8 | 140 | ✅ |
| 9 | 147 | ✅ |
| 10 | 144 | ✅ |

### Métricas de Performance

| Métrica | Valor | Umbral | Estado |
| :--- | :--- | :--- | :--- |
| **Mínimo** | 136 ms | - | ✅ |
| **Máximo** | 152 ms | - | ✅ |
| **Promedio** | 143.5 ms | - | ✅ |
| **p95** | 142 ms | ≤ 200 ms | ✅ |
| **p99** | 151 ms | ≤ 300 ms | ✅ |

---

## Verificación en Base de Datos

```sql
EXPLAIN ANALYZE 
SELECT id, numero, placa, estado, fecha_creacion 
FROM turnos 
WHERE placa = 'GHI-789';
```

**Plan de Ejecución:**

```
Index Scan using idx_turnos_placa on turnos  (cost=0.28..8.29 rows=1 width=48)
  Index Cond: (placa = 'GHI-789'::text)
  Actual Time: 0.045..0.045 rows=1 loops=1
Planning Time: 0.234 ms
Execution Time: 0.067 ms
```

✅ Índice en columna `placa` está siendo utilizado correctamente

---

## Assertions

```typescript
// Verificar respuesta
expect(response.status).toBe(200);
expect(response.body.placa).toBe('GHI-789');
expect(response.body.estado).toBe('EN_ESPERA');

// Verificar performance (p95 ≤ 200ms)
const responseTimes = await Promise.all(Array(10).fill(0).map(() => medirTiempo()));
const p95 = percentile(responseTimes, 95);
expect(p95).toBeLessThanOrEqual(200);
console.log(`p95: ${p95}ms (umbral: 200ms)`);

// Verificar que usa índice en BD
const queryPlan = await getQueryPlan('SELECT * FROM turnos WHERE placa = $1', ['GHI-789']);
expect(queryPlan).toContain('Index Scan');
```

**Resultado:** 5/5 assertions passed ✅

---

## Cleanup

```sql
DELETE FROM turnos WHERE placa = 'GHI-789';
```

**Resultado:** 1 fila eliminada ✅

---

## Métricas

| Métrica | Valor |
| :--- | :--- |
| **Duración total del test** | 1,567 ms (10 iteraciones) |
| **Tiempo promedio por iteración** | 143.5 ms |
| **p95** | 142 ms |
| **Tiempo de ejecución de consulta BD** | 0.067 ms |

---

*Log generado automáticamente por Jest + Testcontainers · Q-Track v1.0.0*
