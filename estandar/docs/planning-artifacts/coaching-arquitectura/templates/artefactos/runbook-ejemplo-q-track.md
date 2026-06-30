# Ejemplo Q-Track — Runbook de Operaciones

> **Módulo:** [6. Soporte y Retrospectiva](../../artefactos/modulo-6.md) · **Tipo:** Manual de Operaciones y Troubleshooting

Ejemplo completamente diligenciado del Runbook para **Q-Track v1.0.0**.

---

# Runbook de Operaciones — Q-Track: Gestor de Colas de Camiones

**Versión:** 1.0   **Fecha:** 2025-04-20   **Autor(es):** Alberto Arroyo, María Rodríguez
**Sistema:** Q-Track   **Entorno:** Producción

---

## 1. Información del Sistema

| Campo | Valor |
| :--- | :--- |
| **Nombre del Sistema** | Q-Track |
| **Versión en Producción** | v1.0.0 |
| **Responsable Técnico** | Alberto Arroyo, alberto.arroyo@unimar.com.pe, +51 999 123 456 |
| **Responsable de Negocio** | Jorge Salas (Procesos), jorge.salas@unimar.com.pe, +51 999 234 567 |
| **Horario de Soporte** | Lunes-Viernes 6am-8pm (horario de operación de patios) |
| **SLA de Respuesta** | 30 minutos para incidentes críticos, 2 horas para incidentes medios |

---

## 2. Escenarios de Incidente

### Escenario 1: API no responde (HTTP 500 o timeout)

**Síntoma:**
- Operadores reportan que el frontend muestra "Error de conexión" o "Tiempo de espera agotado"
- No se pueden registrar camiones ni consultar turnos
- Monitoreo alerta: `q-track health check failed`

**Impacto:**
- **100% de usuarios afectados** (operadores, conductores, supervisores)
- **Patio detenido:** No se puede gestionar la cola de camiones
- **Riesgo de multa:** Ventanas de aduana pueden incumplirse

**Severidad:** 🔴 Alta

**Diagnóstico:**

```bash
# Paso 1: Verificar salud del servicio
curl http://localhost:3000/health
# Esperado: {"status":"ok","version":"1.0.0","timestamp":"..."}
# Error: Connection refused o timeout

# Paso 2: Verificar estado del contenedor
docker ps | grep q-track
# Esperado: q-track en estado "Up"
# Error: Contenedor no existe o en estado "Exited"

# Paso 3: Revisar logs recientes
docker logs q-track --tail 100
# Buscar: "ERROR", "Exception", "Cannot connect to database"

# Paso 4: Consulta en Loki para errores de los últimos 15 minutos
{app="q-track"} |="ERROR" | line_format "{{.timestamp}} {{.message}}"
```

**Diagnóstico Positivo Si:**
- Health check falla con HTTP 500 o timeout
- Contenedor en estado "Exited" o "Restarting"
- Logs muestran "Cannot connect to database" o "Out of memory"

**Resolución:**

```bash
# Paso 1: Intentar restart del contenedor
docker restart q-track

# Paso 2: Verificar recuperación
sleep 10
curl http://localhost:3000/health

# Paso 3: Si falla por base de datos, verificar conexión a PostgreSQL
docker exec q-track ping db.unimar.com.pe
# Si no responde: contactar equipo de Infraestructura para verificar BD

# Paso 4: Si es out of memory, aumentar límite y restart
docker update --memory=512m q-track
docker restart q-track

# Paso 5: Validar con operador
# Llamar a Operador de Patio (ext. 1234) y confirmar que puede registrar camiones
```

**Escalamiento:**

| Condición | Escalar a | Contacto |
| :--- | :--- | :--- |
| Si no se resuelve en 15 minutos | Infraestructura | Carlos Ruiz, carlos.ruiz@unimar.com.pe, +51 999 345 678 |
| Si el incidente dura >30 minutos | Gerencia de Operaciones | María Fernández, maria.fernandez@unimar.com.pe, +51 999 456 789 |
| Si hay multa de aduana inminente | Gerencia General | Luis Gómez, luis.gomez@unimar.com.pe, +51 999 567 890 |

---

### Escenario 2: Base de datos no responde (timeout en consultas)

**Síntoma:**
- Operadores reportan que la aplicación "se congela" al registrar camiones
- Consultas de turno tardan >30 segundos (normal: <200ms)
- Logs muestran: "Connection timeout to PostgreSQL"

**Impacto:**
- **100% de usuarios afectados**
- **Operación lenta:** Tiempo de espera de camiones aumenta drásticamente
- **Riesgo de pérdida de datos:** Si la BD se cae completamente

**Severidad:** 🔴 Alta

**Diagnóstico:**

```bash
# Paso 1: Verificar conectividad a PostgreSQL
docker exec q-track ping db.unimar.com.pe

# Paso 2: Verificar estado de PostgreSQL desde el contenedor
docker exec q-track psql -h db.unimar.com.pe -U qtrack -c "SELECT 1"
# Esperado: 1 fila retornada
# Error: timeout o connection refused

# Paso 3: Consultar locks en PostgreSQL (si hay acceso)
psql -h db.unimar.com.pe -U qtrack -d qtrack_prod -c "SELECT * FROM pg_locks WHERE NOT granted;"

# Paso 4: Consulta en Loki para errores de BD
{app="q-track"} |="database" |="timeout"
```

**Diagnóstico Positivo Si:**
- Ping a BD falla o tiene latencia >100ms
- Consulta SQL básica falla o tarda >5 segundos
- Logs muestran "connection timeout" o "too many connections"

**Resolución:**

```bash
# Paso 1: Contactar equipo de Infraestructura para verificar PostgreSQL
# Email: infraestructura@unimar.com.pe
# Teléfono: +51 999 345 678

# Paso 2: Si hay locks, identificar query problemático
psql -h db.unimar.com.pe -U qtrack -d qtrack_prod -c "SELECT query, state, duration FROM pg_stat_activity WHERE state != 'idle' ORDER BY duration DESC LIMIT 5;"

# Paso 3: Si es por muchas conexiones, aumentar pool en Q-Track
# Editar variable de entorno: DATABASE_MAX_CONNECTIONS=20 (actual: 10)
docker-compose down
docker-compose up -d

# Paso 4: Validar con operador
# Confirmar que las consultas responden en <1 segundo
```

**Escalamiento:**

| Condición | Escalar a | Contacto |
| :--- | :--- | :--- |
| Si BD no responde en 10 minutos | Infraestructura (DBA) | Carlos Ruiz, carlos.ruiz@unimar.com.pe |
| Si hay pérdida de datos confirmada | Gerencia + Legal | María Fernández, maria.fernandez@unimar.com.pe |

---

### Escenario 3: Sistema XMS (Message Broker) no recibe eventos

**Síntoma:**
- Sistemas downstream (SIL, MMS) no reciben eventos de turnos asignados
- Logs de Q-Track muestran: "Failed to publish event to XMS"
- Operadores no notan impacto inmediato (es asíncrono)

**Impacto:**
- **Impacto diferido:** Sistemas downstream no se actualizan
- **Inconsistencia de datos:** SIL muestra cola diferente a Q-Track
- **Trabajo manual:** Operadores deben sincronizar sistemas manualmente

**Severidad:** 🟡 Media

**Diagnóstico:**

```bash
# Paso 1: Verificar logs de Q-Track para errores de XMS
docker logs q-track --tail 200 | grep -i xms
# Buscar: "Failed to publish", "Connection refused", "RabbitMQ"

# Paso 2: Verificar conectividad a XMS
docker exec q-track ping xms.unimar.com.pe

# Paso 3: Verificar estado de RabbitMQ (si hay acceso)
curl -u guest:guest http://xms.unimar.com.pe:15672/api/healthchecks/node
# Esperado: {"status":"ok"}

# Paso 4: Consulta en Loki para errores de XMS
{app="q-track"} |="XMS" |="error"
```

**Diagnóstico Positivo Si:**
- Logs muestran errores de conexión a XMS
- Ping a xms.unimar.com.pe falla
- Health check de RabbitMQ falla

**Resolución:**

```bash
# Paso 1: Verificar credenciales de XMS en variables de entorno
docker exec q-track env | grep XMS

# Paso 2: Intentar restart del worker de Q-Track (si usa colas internas)
docker restart q-track-worker

# Paso 3: Contactar equipo responsable de XMS
# Email: xms-support@unimar.com.pe
# Teléfono: +51 999 345 678

# Paso 4: Habilitar modo offline (cola local) si está disponible
# Editar variable: XMS_OFFLINE_MODE=true
docker restart q-track

# Paso 5: Cuando XMS se recupere, replay de eventos desde la cola local
docker exec q-track npm run replay-events
```

**Escalamiento:**

| Condición | Escalar a | Contacto |
| :--- | :--- | :--- |
| Si XMS no se recupera en 30 minutos | Equipo XMS | xms-support@unimar.com.pe |
| Si hay inconsistencia crítica de datos | Gerencia de Operaciones | María Fernández, maria.fernandez@unimar.com.pe |

---

### Escenario 4: Frontend no carga (pantalla en blanco)

**Síntoma:**
- Operadores reportan "pantalla en blanco" o "error de JavaScript"
- Consola del navegador muestra errores de carga de recursos
- API responde correctamente (health check OK)

**Impacto:**
- **Operadores no pueden usar el sistema**
- **Conductores no pueden consultar turnos**
- **Alternativa disponible:** Usar API directamente con curl/Postman

**Severidad:** 🟡 Media

**Diagnóstico:**

```bash
# Paso 1: Verificar estado del servicio de frontend
curl http://localhost:3000/
# Esperado: HTML de la aplicación
# Error: 404, 500, o timeout

# Paso 2: Verificar logs de nginx (si hay reverse proxy)
docker logs nginx-q-track --tail 50

# Paso 3: Verificar si hay errores de build en logs de frontend
docker logs q-track --tail 100 | grep -i "build"

# Paso 4: Pedir a operador que comparta captura de consola del navegador
# Buscar errores de "Failed to load resource" o "Uncaught TypeError"
```

**Diagnóstico Positivo Si:**
- Frontend retorna 404 o 500
- Logs muestran errores de build o assets no encontrados
- Consola del navegador muestra errores de JavaScript

**Resolución:**

```bash
# Paso 1: Intentar restart del servicio
docker restart q-track

# Paso 2: Si persiste, rebuild de la imagen
docker-compose build q-track
docker-compose up -d q-track

# Paso 3: Validar cargando el frontend en navegador
# Abrir http://q-track.unimar.com.pe y verificar que carga

# Paso 4: Validar con operador
# Confirmar que puede iniciar sesión y ver la cola de camiones
```

**Escalamiento:**

| Condición | Escalar a | Contacto |
| :--- | :--- | :--- |
| Si no se resuelve en 30 minutos | Tech Lead | Alberto Arroyo, alberto.arroyo@unimar.com.pe |
| Si es error de código (bug) | Equipo de Desarrollo | jorge.salas@unimar.com.pe |

---

### Escenario 5: Lentitud extrema en consultas de turno

**Síntoma:**
- Consultas de turno por placa tardan >5 segundos (normal: <200ms)
- Operadores reportan que el sistema "se pone lento"
- Dashboard de KPIs no carga o carga parcialmente

**Impacto:**
- **Tiempo de espera de camiones aumenta**
- **Operadores no pueden atender rápidamente**
- **Riesgo de multa:** Ventanas de aduana pueden incumplirse por lentitud

**Severidad:** 🟡 Media (puede escalar a 🔴 si dura >1 hora)

**Diagnóstico:**

```bash
# Paso 1: Verificar tiempo de respuesta de la API
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000/turnos?placa=ABC-123
# curl-format.txt: time_namelookup:  %{time_namelookup}\n time_connect:  %{time_connect}\n time_startconnect:  %{time_startconnect}\n time_total:  %{time_total}\n
# Esperado: time_total < 0.2s
# Error: time_total > 2s

# Paso 2: Verificar queries lentas en PostgreSQL
psql -h db.unimar.com.pe -U qtrack -d qtrack_prod -c "SELECT query, calls, total_time, mean_time FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"

# Paso 3: Verificar uso de CPU y memoria del contenedor
docker stats q-track --no-stream

# Paso 4: Consulta en Loki para queries lentas
{app="q-track"} |="slow query" | line_format "{{.timestamp}} duration={{.duration}}ms"
```

**Diagnóstico Positivo Si:**
- Consultas de turno tardan >2 segundos
- PostgreSQL muestra queries con mean_time >1000ms
- Contenedor usa >90% de CPU o memoria

**Resolución:**

```bash
# Paso 1: Identificar query problemático y agregar índice si es necesario
psql -h db.unimar.com.pe -U qtrack -d qtrack_prod -c "CREATE INDEX IF NOT EXISTS idx_turnos_placa ON turnos(placa);"

# Paso 2: Si es por uso de recursos, aumentar límites del contenedor
docker update --memory=1g --cpus=2 q-track
docker restart q-track

# Paso 3: Si es por muchos datos, archivar turnos antiguos
psql -h db.unimar.com.pe -U qtrack -d qtrack_prod -c "INSERT INTO turnos_archivo SELECT * FROM turnos WHERE created_at < NOW() - INTERVAL '90 days'; DELETE FROM turnos WHERE created_at < NOW() - INTERVAL '90 days';"

# Paso 4: Validar con operador
# Confirmar que las consultas responden en <500ms
```

**Escalamiento:**

| Condición | Escalar a | Contacto |
| :--- | :--- | :--- |
| Si no se resuelve en 30 minutos | DBA / Infraestructura | Carlos Ruiz, carlos.ruiz@unimar.com.pe |
| Si hay multa de aduana inminente | Gerencia de Operaciones | María Fernández, maria.fernandez@unimar.com.pe |

---

## 3. Contactos de Emergencia

| Rol | Nombre | Email | Teléfono | Disponible |
| :--- | :--- | :--- | :--- | :--- |
| **On-Call Técnico** | Alberto Arroyo | alberto.arroyo@unimar.com.pe | +51 999 123 456 | 24/7 |
| **Product Owner** | Jorge Salas | jorge.salas@unimar.com.pe | +51 999 234 567 | Lun-Vie 8am-6pm |
| **Tech Lead** | Alberto Arroyo | alberto.arroyo@unimar.com.pe | +51 999 123 456 | Lun-Vie 8am-6pm |
| **Infraestructura** | Carlos Ruiz | carlos.ruiz@unimar.com.pe | +51 999 345 678 | 24/7 |
| **Gerencia Operaciones** | María Fernández | maria.fernandez@unimar.com.pe | +51 999 456 789 | Lun-Vie 8am-6pm |

---

## 4. Procedimiento de Escalamiento

1. **Detección:** El operador o sistema de monitoreo (Loki/Prometheus) detecta el incidente
2. **Clasificación:** Determinar severidad (Alta/Media/Baja) según impacto en operación
3. **Diagnóstico:** Seguir los pasos del escenario correspondiente en este runbook
4. **Resolución:** Ejecutar acciones correctivas
5. **Validación:** Confirmar con operadores de patio que el sistema funciona
6. **Documentación:** Registrar incidente en Jira con causa raíz y tiempo de resolución
7. **Post-Mortem:** Si es severidad Alta, agendar post-mortem en 48 horas para identificar mejoras

---

## 5. Criterios de Aceptación del Runbook

- [x] Mínimo 5 escenarios de incidente documentados
- [x] Cada escenario con síntoma, diagnóstico, resolución y escalamiento
- [x] Contactos de emergencia actualizados y verificados
- [x] Comandos de diagnóstico y resolución probados en entorno de staging
- [x] Revisado y aprobado por el responsable técnico (Alberto Arroyo, 2025-04-20)

---

*Ejemplo Q-Track generado bajo el estándar del corpus arquitectónico de UNIMAR · Idioma: Español · Versión: 1.0*
