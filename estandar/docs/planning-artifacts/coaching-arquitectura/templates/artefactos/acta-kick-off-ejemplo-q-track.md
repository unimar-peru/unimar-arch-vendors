# Ejemplo Q-Track — Acta de Kick-off

> **Módulo:** [0. Visión, Gates y Kick-off](../../artefactos/modulo-0.md) · **Tipo:** Documento de Acuerdo Organizacional

Ejemplo completamente diligenciado del Acta de Kick-off para el proyecto **Q-Track (Gestor de Colas de Camiones)**.

---

# Acta de Kick-off — Q-Track v1.0

**Versión:** 1.0   **Fecha:** 2025-01-21   **Lugar:** Sala de Reuniones UNIMAR / Microsoft Teams

---

## 1. Participantes y Firmas

| Nombre | Rol | Firma digital (Git user.name) | Fecha de firma |
| :--- | :--- | :--- | :--- |
| Alberto Arroyo | Facilitador / Arquitecto | aarroyo-unimar | 2025-01-21 |
| María López | Gerencia General | mlopez-unimar | 2025-01-21 |
| Carlos Vega | Líder de Desarrollo | cvega-unimar | 2025-01-21 |
| Patricia Ruiz | QA Lead | pruiz-unimar | 2025-01-21 |
| Jorge Salas | Procesos / Operaciones | jsalas-unimar | 2025-01-21 |
| Luis Quispe | Infraestructura | lquispe-unimar | 2025-01-21 |

---

## 2. Propósito del Proyecto

Q-Track es el sistema corporativo de gestión de colas de camiones para las operaciones aduaneras de UNIMAR. Resuelve el caos operativo en los patios de ingreso donde los conductores esperan sin información sobre su turno, generando cuellos de botella, incumplimiento de ventanas de aduanas y pérdida de contratos logísticos. Al finalizar el programa, UNIMAR contará con un sistema productivo que asigna, avanza y notifica turnos en tiempo real, reduciendo el tiempo promedio de espera en los patios Norte y Sur en al menos un 40%.

---

## 3. Métricas de Éxito (KPIs)

| KPI | Definición | Línea base | Objetivo | Fecha de medición |
| :--- | :--- | :--- | :--- | :--- |
| Tiempo promedio de espera | Minutos desde ingreso del camión hasta llamado a bay | 87 min | ≤ 50 min | 2025-06-30 |
| Incidentes de turno perdido | Turnos sin llamado en ventana de 30 min | 12/semana | ≤ 2/semana | 2025-06-30 |
| Adopción del sistema | % de operadores usando Q-Track vs. gestión manual | 0% | ≥ 90% | 2025-04-30 |

---

## 4. Quality Gates Aceptados

| Gate | Umbral numérico | Responsable de validación | Aceptado |
| :--- | :--- | :--- | :--- |
| Cobertura de tests unitarios | ≥ 80% en `src/domain/` | QA Lead (Patricia Ruiz) | ☑ Sí |
| Cobertura de tests integración | 100% escenarios críticos en verde | QA Lead (Patricia Ruiz) | ☑ Sí |
| Rendimiento del pipeline CI | Build + test < 5 minutos | Infra (Luis Quispe) | ☑ Sí |
| Code Review | Mínimo 2 revisores aprobados por PR | Líder Dev (Carlos Vega) | ☑ Sí |
| RC Sellado antes de deploy | Todos los escenarios en verde | Facilitador (Alberto Arroyo) | ☑ Sí |

---

## 5. Alcance del Programa

**Incluido:**
- API REST de gestión de colas y turnos (Q-Track)
- Integración con sistema de notificaciones XMS existente
- Instrumentación OpenTelemetry y despliegue en Docker
- Capacitación del equipo completo en el estándar SDLC de UNIMAR

**Excluido explícitamente:**
- Frontend / UI de Q-Track (fuera del alcance del programa de coaching)
- Migración de datos históricos de turnos del sistema legacy
- Integración con el sistema de facturación

---

## 6. Cronograma de Módulos

| Módulo | Duración estimada | Fecha de inicio | Fecha de cierre |
| :--- | :--- | :--- | :--- |
| Módulo Base (Bootcamp) | 2 sem | 2025-01-08 | 2025-01-17 |
| Módulo 0: Visión, Gates y Kick-off | 2 días | 2025-01-20 | 2025-01-21 |
| Módulo 1: Requisitos y Producto | 1 sem | 2025-01-27 | 2025-01-31 |
| Módulo 2: Diseño y Arquitectura | 2 sem | 2025-02-03 | 2025-02-13 |
| Módulo 3: Desarrollo y Code Review | 3 sem | 2025-02-17 | 2025-03-06 |
| Módulo 4: Calidad e Integración | 2 sem | 2025-03-10 | 2025-03-20 |
| Módulo 5: Infraestructura y Despliegue | 1 sem | 2025-03-24 | 2025-03-28 |
| Módulo 6: Soporte y Retrospectiva | 4 sem | 2025-04-07 | 2025-04-30 |

---

## 7. Riesgos Identificados

| # | Riesgo | Probabilidad | Impacto | Mitigador |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Restricciones de antivirus bloquean instalación de herramientas en máquinas corporativas | Media | Alto | Coordinación previa con TI para whitelist; sesión de recuperación reservada en el plan |
| 2 | Rotación de personal durante el programa interrumpe la progresión | Baja | Alto | Grabación de todas las sesiones teóricas en Teams; materiales auto-suficientes en el repositorio |
| 3 | Resistencia al cambio de operadores acostumbrados a la gestión manual | Media | Medio | Demo ejecutiva de Q-Track en Módulo 0; sponsors de Gerencia visibles y comprometidos |

---

## 8. Declaración de Inicio Formal

> El equipo firmante declara que comprende el estándar de calidad establecido en el Manifiesto de Ingeniería de UNIMAR, acepta los 5 Quality Gates definidos con sus umbrales numéricos y se compromete a cumplir el cronograma de módulos acordado. Sin el cumplimiento de los Quality Gates, no se avanza al módulo siguiente.

---

*Ejemplo Q-Track generado bajo el estándar del corpus arquitectónico de UNIMAR · Idioma: Español · Versión: 1.0*
