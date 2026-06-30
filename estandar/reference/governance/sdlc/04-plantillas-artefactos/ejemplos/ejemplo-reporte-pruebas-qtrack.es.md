# Ejemplo: Reporte de Pruebas (Test Summary) - Q-Track

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Ejemplo%3A%20QA%20Q--Track-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
</p>

## 1. Resumen de Ejecución
**Ciclo de Pruebas:** Regresión Sprint 3 (RC-0.9.5)
**Fecha:** 2026-06-25
**Entorno:** Staging (Pre-Producción)
**Resultado Global:** **APROBADO CON OBSERVACIONES**

## 2. Métricas de Calidad
* **Casos de Prueba Ejecutados:** 45
* **Casos Exitosos (Passed):** 42 (93.3%)
* **Casos Fallidos (Failed):** 3 (6.7%)
* **Defectos Críticos/Bloqueantes:** 0
* **Cobertura de Código Backend (SonarQube):** 81%

## 3. Resumen de Defectos Abiertos
* **BUG-QT-089 (Severidad Baja):** En la tablet Android de la garita exterior, bajo luz solar directa, el botón "Rechazar Ingreso" tiene bajo contraste y es difícil de leer. *(Fix agendado para Sprint 4).*
* **BUG-QT-092 (Severidad Media):** Si el servidor de correos (SendGrid) se cae, la reserva de la cita arroja HTTP 500 en vez de guardar la cita y reintentar enviar el correo después. *(Se agregó manejo asíncrono para Sprint 4).*

## 4. Pruebas de Rendimiento (Load Testing)
* Se simuló el ingreso concurrente de 300 camiones haciendo Check-in durante la franja crítica de las 8:00 AM.
* El motor Redis asignó los turnos con un p95 de 8ms.
* Las pantallas de patio (MQTT) actualizaron la pizarra visual en un promedio de 115ms. Rendimiento óptimo aprobado.
