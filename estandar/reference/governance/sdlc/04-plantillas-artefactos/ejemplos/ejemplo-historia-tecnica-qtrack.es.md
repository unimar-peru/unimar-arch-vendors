# Ejemplo: Historia Técnica (TS) - Migración a Redis para Turnos

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Ejemplo%3A%20TS%20Q--Track-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
</p>

## 1. Identificador y Título
**TS-QTRACK-042:** Implementar caché en Redis para el motor de priorización de turnos en el patio.

## 2. Motivación (Problema Técnico)
Actualmente, cada vez que la TV del patio consulta "¿Quién es el siguiente a balanza?", el backend ejecuta un `SELECT` masivo en PostgreSQL evaluando fechas, prioridades y tiempos de espera de todos los camiones "En Patio". Con 200 camiones simultáneos y la pantalla haciendo *polling* cada 5 segundos, la base de datos está sufriendo picos de CPU del 85%.

## 3. Solución Propuesta (Tarea)
Reemplazar la consulta relacional pesada por una estructura de datos `Sorted Set` en Redis (`ZSET`).
* Cada vez que un camión entra (Check-in), se añade al ZSET con un *score* calculado en base a su prioridad y timestamp de llegada.
* Cada vez que se llama a balanza, se ejecuta `ZPOPMIN` para obtener al siguiente de la cola con latencia sub-milisegundo.

## 4. Criterios de Aceptación Técnicos
1. El endpoint `GET /turnos/siguiente` debe responder en menos de 10ms (p95).
2. El uso de CPU del servidor PostgreSQL debe caer por debajo del 30% en horas punta.
3. Se debe implementar un fallback: si Redis cae, el sistema lee de PostgreSQL, degrada el rendimiento pero no se cae el servicio (Circuit Breaker).
4. La implementación debe quedar documentada en un ADR.
