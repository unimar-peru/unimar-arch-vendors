# Ejemplo Q-Track — Release Notes

> **Módulo:** [5. Infraestructura y Despliegue](../../artefactos/modulo-5.md) · **Tipo:** Notas de Lanzamiento

Ejemplo completamente diligenciado de las Release Notes para **Q-Track v1.0.0**.

---

# Release Notes — Q-Track v1.0.0

**Versión:** 1.0.0   **Fecha de lanzamiento:** 2025-04-20
**Autor(es):** Alberto Arroyo   **Estado:** ☑ PUBLICADO

---

## 1. Resumen del Release

Q-Track v1.0.0 es el lanzamiento inicial del Gestor de Colas de Camiones para UNIMAR. Esta versión permite a los operadores registrar camiones, asignar turnos automáticamente, gestionar la cola de ingreso y notificar a los conductores en tiempo real. Reemplaza el sistema manual de pizarras y radio, reduciendo el tiempo de espera en un 40%.

---

## 2. Cambios Incluidos

### Nuevas Funcionalidades

- [FEATURE-001] Implementación de API REST para gestión de turnos — Jorge Salas
- [FEATURE-002] Frontend web para operadores y supervisores — María López
- [FEATURE-003] Integración con sistema UMS para autenticación SSO — Carlos Ruiz
- [FEATURE-004] Publicación de eventos a XMS para sistemas downstream — Alberto Arroyo

### Corrección de Bugs

- [BUG-012] Validación de formato de placa no aceptaba camiones con remolque — Jorge Salas
- [BUG-015] Timeout en consulta de turnos cuando BD tenía >1000 registros — María López

### Mejoras de Performance

- Optimización de queries de consulta de turno: de 350ms a 142ms (p95) — Alberto Arroyo
- Implementación de caché de sesiones en Redis: reducción de 40% en latencia de autenticación — Carlos Ruiz

### Documentación

- README con instrucciones de instalación y configuración — Jorge Salas
- Runbook de operaciones con 5 escenarios de incidente — María Rodríguez

---

## 3. Calidad Certificada

| Métrica | Resultado | Umbral | Estado |
| :--- | :--- | :--- | :--- |
| **Tests Unitarios** | 98% pass rate | ≥ 95% | ☑ Pass |
| **Cobertura de Código** | 89% | ≥ 80% | ☑ Pass |
| **Tests de Integración** | 12/12 pass | 100% | ☑ Pass |
| **Performance (p95)** | 142ms | ≤ 300ms | ☑ Pass |
| **Security Scan** | 0 vulnerabilidades críticas | 0 críticas | ☑ Pass |

**Test Summary Report:** [RC Sellado v1.0.0](./test-summary-report-ejemplo-q-track.md)

---

## 4. Instrucciones de Despliegue

### Pre-requisitos

- [x] PostgreSQL 15 disponible en `db.unimar.com.pe:5432`
- [x] RabbitMQ (XMS) disponible en `xms.unimar.com.pe:5672`
- [x] Variables de entorno configuradas en el servidor
- [x] Backup de base de datos realizado (si es actualización)

### Pasos de Despliegue

```bash
# 1. Pull de la nueva imagen
docker pull registry.unimar.com.pe/q-track:v1.0.0

# 2. Detener contenedor actual (si existe)
docker stop q-track

# 3. Iniciar nueva versión
docker-compose up -d q-track

# 4. Verificar salud
curl http://localhost:3000/health
# Esperado: {"status":"ok","version":"1.0.0","timestamp":"..."}
```

### Rollback (si es necesario)

```bash
# Revertir a versión anterior (v0.9.0)
docker pull registry.unimar.com.pe/q-track:v0.9.0
docker stop q-track
docker-compose up -d q-track
```

---

## 5. Variables de Entorno

| Variable | Valor | Descripción |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Entorno de ejecución |
| `DATABASE_HOST` | `db.unimar.com.pe` | Host de PostgreSQL |
| `DATABASE_PORT` | `5432` | Puerto de PostgreSQL |
| `DATABASE_NAME` | `qtrack_prod` | Nombre de base de datos |
| `DATABASE_USER` | `[secrets]` | Usuario de BD (ver Vault) |
| `DATABASE_PASSWORD` | `[secrets]` | Password de BD (ver Vault) |
| `XMS_HOST` | `xms.unimar.com.pe` | Host del Message Broker |
| `UMS_BASE_URL` | `https://ums.unimar.com.pe` | URL de autenticación SSO |
| `JWT_SECRET` | `[secrets]` | Secreto para JWT (ver Vault) |

---

## 6. Breaking Changes

☐ **Sí** — Hay cambios incompatibles hacia atrás
☑ **No** — Compatible con versiones anteriores

Este es el lanzamiento inicial (v1.0.0), no hay versiones anteriores para comparar.

---

## 7. Aprobaciones

| Rol | Nombre | Firma (commit hash) | Fecha |
| :--- | :--- | :--- | :--- |
| **Product Owner** | Jorge Salas (Procesos) | `a3f7b2c` | 2025-04-18 |
| **Tech Lead** | Alberto Arroyo | `a3f7b2c` | 2025-04-18 |
| **QA Lead** | María Rodríguez | `a3f7b2c` | 2025-04-15 |

---

## 8. Referencias

- [Jira: Q-Track v1.0.0](https://unimar.atlassian.net/browse/QTRACK-001)
- [Test Summary Report](./test-summary-report-ejemplo-q-track.md)
- [Runbook de Operaciones](./runbook-ejemplo-q-track.md)

---

*Ejemplo Q-Track generado bajo el estándar del corpus arquitectónico de UNIMAR · Idioma: Español · Versión: 1.0*
