# Ejemplo de Prueba de Carga con k6

> **Propósito:** Script de referencia para ejecutar pruebas de carga contra APIs del ecosistema Unimar, usando [k6](https://k6.io/).

---

## Script Base

```javascript
import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const orderLatency = new Trend('order_latency');

export const options = {
  stages: [
    { duration: '2m', target: 50 },   // subida gradual a 50 usuarios
    { duration: '5m', target: 50 },   // meseta de 5 minutos
    { duration: '2m', target: 100 },  // escalada a 100 usuarios
    { duration: '5m', target: 100 },  // meseta de 5 minutos
    { duration: '2m', target: 0 },    // descenso gradual
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],  // 95% de requests en menos de 2s
    http_req_failed: ['rate<0.01'],     // menos de 1% de errores
    errors: ['rate<0.05'],              // tasa de error personalizada < 5%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000';

export default function () {
  group('health check', () => {
    const res = http.get(`${BASE_URL}/health`);
    check(res, {
      'health status 200': (r) => r.status === 200,
    });
  });

  group('crear orden', () => {
    const payload = JSON.stringify({
      clienteId: 'CL-001',
      productos: [
        { id: 'PROD-01', cantidad: 5 },
        { id: 'PROD-02', cantidad: 3 },
      ],
    });

    const res = http.post(`${BASE_URL}/api/v1/ordenes`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    const passed = check(res, {
      'orden creada (201)': (r) => r.status === 201,
      'respuesta tiene id': (r) => r.json('id') !== undefined,
    });

    errorRate.add(!passed);
    orderLatency.add(res.timings.duration);
  });

  sleep(1);
}
```

---

## Cómo Ejecutar

```bash
# Instalar k6 (una vez)
brew install k6                    # macOS
winget install k6                  # Windows
docker pull grafana/k6             # Docker

# Ejecutar prueba local
k6 run ejemplo-carga.js

# Ejecutar contra staging
k6 run -e BASE_URL=https://staging.unimar.com ejemplo-carga.js

# Ejecutar con salida HTML
k6 run --out html=reporte-carga.html ejemplo-carga.js
```

---

## Cómo Interpretar los Resultados

```
     ✓ health status 200
     ✓ orden creada (201)
     ✓ respuesta tiene id

     checks.........................: 100.00% ✓ 4500  ✗ 0
     data_received..................: 12 MB  1.2 MB/s
     data_sent......................: 4.2 MB  420 kB/s
     http_req_blocked...............: avg=12ms   min=0s    med=5µs   max=1.2s
     http_req_connecting............: avg=8ms    min=0s    med=0s     max=1s
     http_req_duration..............: avg=450ms  min=120ms med=380ms max=3.2s
       { expected_response:true }...: avg=450ms  min=120ms med=380ms max=3.2s
     http_req_failed................: 0.00%  ✓ 0       ✗ 4500
     order_latency..................: avg=480ms  min=150ms med=410ms max=3.2s
     errors.........................: 0.00%  ✓ 0       ✗ 4500
```

| Métrica | Valor en ejemplo | Threshold | ¿Qué significa? |
| :------ | :--------------- | :-------- | :-------------- |
| **p95 http_req_duration** | 1.2s | < 2s | ✅ Dentro del SLA. El 95% de requests responden en menos de 1.2s. |
| **http_req_failed** | 0% | < 1% | ✅ Sin errores HTTP. |
| **order_latency promedio** | 480ms | < 1s | ✅ El endpoint de órdenes responde rápido. |
| **max http_req_duration** | 3.2s | — | ⚠️ Hubo un request lento (outlier). Revisar si fue por garbage collection o contención. |
| **errors** | 0% | < 5% | ✅ Sin errores de validación de negocio. |

---

## Documentos Relacionados

| Documento | Propósito |
| :-------- | :-------- |
| [Plan de Pruebas de Performance (ISO 25000)](plantilla-plan-performance.es.md) | Plan canónico con criterios de aceptación, perfiles de carga y matriz de decisión |
| [Estrategia de Pruebas](../../sdlc/estrategia-pruebas.es.md) | Metodología general y definición de tipos de prueba |

## Referencias

- [k6 Documentation](https://k6.io/docs/)
- [k6 Thresholds](https://k6.io/docs/using-k6/thresholds/)
- [k6 Metrics](https://k6.io/docs/using-k6/metrics/)
- [Google SRE — Load Testing](https://sre.google/sre-book/)
- [ISO/IEC 25010:2023 — Quality Model](https://www.iso.org/standard/78176.html)
- [ISO/IEC 29119-4:2015 — Performance Testing](https://www.iso.org/standard/56737.html)

---

[Volver a Estrategia de Pruebas](../../sdlc/estrategia-pruebas.es.md)
