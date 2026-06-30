# Plantilla Vacía — Runbook de Operaciones

> **Módulo:** [6. Soporte y Retrospectiva](../../artefactos/modulo-6.md) · **Tipo:** Manual de Operaciones y Troubleshooting

Copia esta plantilla, completa los escenarios de incidente y commitéala antes de pasar el sistema a producción.

---

# Runbook de Operaciones — [Nombre del Sistema]

**Versión:** ___   **Fecha:** ___________   **Autor(es):** ___________
**Sistema:** [Nombre del sistema]   **Entorno:** Producción

---

## 1. Información del Sistema

| Campo | Valor |
| :--- | :--- |
| **Nombre del Sistema** | [Nombre] |
| **Versión en Producción** | [vMAJOR.MINOR.PATCH] |
| **Responsable Técnico** | [Nombre, email, teléfono] |
| **Responsable de Negocio** | [Nombre, email, teléfono] |
| **Horario de Soporte** | [ej: Lunes-Viernes 6am-8pm] |
| **SLA de Respuesta** | [ej: 2 horas para incidentes críticos] |

---

## 2. Escenarios de Incidente

### Escenario 1: [Nombre del incidente]

**Síntoma:**
[¿Qué ve el usuario o el operador cuando ocurre este incidente?]

**Impacto:**
[¿Qué funcionalidad está afectada? ¿Cuántos usuarios impacta?]

**Severidad:** 🔴 Alta / 🟡 Media / 🟢 Baja

**Diagnóstico:**

```bash
# Paso 1: [Comando o consulta para diagnosticar]
[ej: curl http://localhost:3000/health]

# Paso 2: [Comando o consulta adicional]
[ej: docker logs q-track --tail 100]

# Paso 3: [Consulta en Loki para logs específicos]
[ej: {app="q-track"} |="ERROR" | line_format "{{.timestamp}} {{.message}}"]
```

**Diagnóstico Positivo Si:**
[¿Qué condición confirma que este es el incidente?]

**Resolución:**

```bash
# Paso 1: [Acción correctiva]
[ej: docker restart q-track]

# Paso 2: [Verificación de recuperación]
[ej: curl http://localhost:3000/health]

# Paso 3: [Validación con usuario]
[ej: Confirmar con operador que el sistema responde]
```

**Escalamiento:**

| Condición | Escalar a | Contacto |
| :--- | :--- | :--- |
| [Si no se resuelve en X minutos] | [Rol/Persona] | [email/teléfono] |
| [Si el incidente afecta a todos los usuarios] | [Rol/Persona] | [email/teléfono] |

---

### Escenario 2: [Nombre del incidente]

**Síntoma:**
[¿Qué ve el usuario o el operador cuando ocurre este incidente?]

**Impacto:**
[¿Qué funcionalidad está afectada? ¿Cuántos usuarios impacta?]

**Severidad:** 🔴 Alta / 🟡 Media / 🟢 Baja

**Diagnóstico:**

```bash
# Paso 1: [Comando o consulta para diagnosticar]

# Paso 2: [Comando o consulta adicional]

# Paso 3: [Consulta en Loki para logs específicos]
```

**Diagnóstico Positivo Si:**
[¿Qué condición confirma que este es el incidente?]

**Resolución:**

```bash
# Paso 1: [Acción correctiva]

# Paso 2: [Verificación de recuperación]

# Paso 3: [Validación con usuario]
```

**Escalamiento:**

| Condición | Escalar a | Contacto |
| :--- | :--- | :--- |
| [Si no se resuelve en X minutos] | [Rol/Persona] | [email/teléfono] |

---

### Escenario 3: [Nombre del incidente]

[Repetir estructura del Escenario 1]

---

### Escenario 4: [Nombre del incidente]

[Repetir estructura del Escenario 1]

---

### Escenario 5: [Nombre del incidente]

[Repetir estructura del Escenario 1]

---

## 3. Contactos de Emergencia

| Rol | Nombre | Email | Teléfono | Disponible |
| :--- | :--- | :--- | :--- | :--- |
| **On-Call Técnico** | [Nombre] | [email] | [teléfono] | 24/7 |
| **Product Owner** | [Nombre] | [email] | [teléfono] | Horario laboral |
| **Tech Lead** | [Nombre] | [email] | [teléfono] | Horario laboral |
| **Infraestructura** | [Nombre] | [email] | [teléfono] | 24/7 |

---

## 4. Procedimiento de Escalamiento

1. **Detección:** El operador o sistema de monitoreo detecta el incidente
2. **Clasificación:** Determinar severidad (Alta/Media/Baja) según impacto
3. **Diagnóstico:** Seguir los pasos del escenario correspondiente en este runbook
4. **Resolución:** Ejecutar acciones correctivas
5. **Validación:** Confirmar con usuarios que el sistema funciona
6. **Documentación:** Registrar incidente en [sistema de tickets] con causa raíz
7. **Post-Mortem:** Si es severidad Alta, agendar post-mortem en 48 horas

---

## 5. Criterios de Aceptación del Runbook

- [ ] Mínimo 5 escenarios de incidente documentados
- [ ] Cada escenario con síntoma, diagnóstico, resolución y escalamiento
- [ ] Contactos de emergencia actualizados y verificados
- [ ] Comandos de diagnóstico y resolución probados en entorno de staging
- [ ] Revisado y aprobado por el responsable técnico

---

*Plantilla generada bajo el estándar del corpus arquitectónico de UNIMAR · Idioma: Español · Versión: 1.0*
