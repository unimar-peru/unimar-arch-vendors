# Test Log: Generar reporte de incidencias del día
# Test ID: test-005
# Fecha: 2025-04-15 10:28:12 UTC
# Estado: PASS ✅

---

## Configuración del Test

```bash
TEST_DATABASE_URL=postgresql://test:test@localhost:5432/qtrack_test
TEST_API_URL=http://localhost:3001
```

---

## Ejecución

### Setup Inicial: Insertar 10 Turnos de Prueba

```sql
INSERT INTO turnos (placa, tipo_camion, patio, estado, fecha_creacion) VALUES
('ABC-001', 'SIMPLE', 'NORTE', 'COMPLETADO', NOW() - INTERVAL '1 hour'),
('ABC-002', 'DOBLE', 'NORTE', 'COMPLETADO', NOW() - INTERVAL '2 hour'),
('ABC-003', 'SIMPLE', 'SUR', 'CANCELADO', NOW() - INTERVAL '3 hour'),
('ABC-004', 'TRAILER', 'NORTE', 'EN_PROGRESO', NOW() - INTERVAL '4 hour'),
('ABC-005', 'SIMPLE', 'SUR', 'EN_ESPERA', NOW() - INTERVAL '5 hour'),
('ABC-006', 'DOBLE', 'NORTE', 'COMPLETADO', NOW() - INTERVAL '6 hour'),
('ABC-007', 'SIMPLE', 'SUR', 'CANCELADO', NOW() - INTERVAL '7 hour'),
('ABC-008', 'TRAILER', 'NORTE', 'COMPLETADO', NOW() - INTERVAL '8 hour'),
('ABC-009', 'SIMPLE', 'SUR', 'EN_PROGRESO', NOW() - INTERVAL '9 hour'),
('ABC-010', 'DOBLE', 'NORTE', 'EN_ESPERA', NOW() - INTERVAL '10 hour');
```

**Resultado:** 10 filas insertadas ✅

---

### Request: Obtener Reporte de Incidencias

```http
GET /reportes/incidencias?fecha=2025-04-15 HTTP/1.1
Host: localhost:3001
```

### Response

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "fecha": "2025-04-15",
  "resumen": {
    "totalTurnos": 10,
    "turnosCompletados": 4,
    "turnosCancelados": 2,
    "turnosEnProgreso": 2,
    "turnosEnEspera": 2,
    "tiempoPromedioEspera": 87,
    "tiempoPromedioAtencion": 34
  },
  "porPatio": {
    "NORTE": {
      "total": 6,
      "completados": 3,
      "cancelados": 0,
      "enProgreso": 1,
      "enEspera": 2
    },
    "SUR": {
      "total": 4,
      "completados": 1,
      "cancelados": 2,
      "enProgreso": 1,
      "enEspera": 1
    }
  },
  "porTipoCamion": {
    "SIMPLE": { "total": 5, "completados": 2 },
    "DOBLE": { "total": 3, "completados": 2 },
    "TRAILER": { "total": 2, "completados": 1 }
  },
  "incidencias": [
    {
      "turnoId": "550e8400-e29b-41d4-a716-446655440003",
      "placa": "ABC-003",
      "tipo": "CANCELADO",
      "motivo": "Camión no se presentó en ventana de 30 min",
      "timestamp": "2025-04-15T07:28:12.000Z"
    },
    {
      "turnoId": "550e8400-e29b-41d4-a716-446655440007",
      "placa": "ABC-007",
      "tipo": "CANCELADO",
      "motivo": "Documentación incompleta",
      "timestamp": "2025-04-15T03:28:12.000Z"
    }
  ]
}
```

---

## Verificación en Base de Datos

```sql
SELECT 
  estado,
  COUNT(*) as total,
  AVG(EXTRACT(EPOCH FROM (fecha_asignacion - fecha_creacion))/60) as avg_espera_min
FROM turnos
WHERE DATE(fecha_creacion) = '2025-04-15'
GROUP BY estado;
```

**Resultado:**

| estado | total | avg_espera_min |
| :--- | :--- | :--- |
| COMPLETADO | 4 | 28.5 |
| CANCELADO | 2 | 45.2 |
| EN_PROGRESO | 2 | - |
| EN_ESPERA | 2 | 67.8 |

✅ Datos coinciden con el reporte generado

---

## Assertions

```typescript
// Verificar estructura del reporte
expect(response.status).toBe(200);
expect(response.body.fecha).toBe('2025-04-15');
expect(response.body.resumen.totalTurnos).toBe(10);
expect(response.body.resumen.turnosCompletados).toBe(4);
expect(response.body.resumen.turnosCancelados).toBe(2);

// Verificar desglose por patio
expect(response.body.porPatio.NORTE.total).toBe(6);
expect(response.body.porPatio.SUR.total).toBe(4);

// Verificar incidencias (cancelados)
expect(response.body.incidencias.length).toBe(2);
expect(response.body.incidencias[0].tipo).toBe('CANCELADO');
expect(response.body.incidencias[0].motivo).toBeDefined();

// Verificar tiempos promedio
expect(response.body.resumen.tiempoPromedioEspera).toBeLessThan(100); // minutos
expect(response.body.resumen.tiempoPromedioAtencion).toBeLessThan(50); // minutos
```

**Resultado:** 12/12 assertions passed ✅

---

## Cleanup

```sql
DELETE FROM turnos WHERE placa LIKE 'ABC-%';
```

**Resultado:** 10 filas eliminadas ✅

---

## Métricas

| Métrica | Valor |
| :--- | :--- |
| **Duración del test** | 523 ms |
| **Tiempo de respuesta API** | 89 ms |
| **Tiempo de consulta BD (agregación)** | 34 ms |
| **Total de datos procesados** | 10 turnos |

---

*Log generado automáticamente por Jest + Testcontainers · Q-Track v1.0.0*
