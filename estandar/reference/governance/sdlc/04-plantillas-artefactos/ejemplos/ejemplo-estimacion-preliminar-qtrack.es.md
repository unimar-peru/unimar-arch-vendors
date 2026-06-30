# Ejemplo: Estimación Preliminar (T-Shirt Sizing) - Q-Track

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Ejemplo%3A%20Estimaci%C3%B3n%20Q--Track-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
</p>

## 1. Alcance Evaluado
Sistema Q-Track (Portal web de citas + Backend de turnos + App Garita Android).

## 2. Dimensionamiento por Componente

| Componente | Complejidad | Tamaño (T-Shirt) | Rango Estimado (Sprints) | Justificación |
| --- | --- | --- | --- | --- |
| Portal Web Citas | Media | M | 2-3 | Requiere UX simple, pero integración con SSO corporativo. |
| Backend y Motor Cola | Alta | L | 4-5 | Lógica transaccional crítica, concurrencia, reglas de prioridad complejas. |
| App Tablet Garita | Baja | S | 1-2 | Lectura QR y llamadas API REST básicas. Interfaz mínima. |

## 3. Esfuerzo Total Estimado
* **Tamaño Global:** Large (L)
* **Duración proyectada:** 3 meses (6 sprints de 2 semanas)
* **Equipo requerido:** 1 PM, 1 TL/Arquitecto, 2 Dev Backend, 1 Dev Frontend/Mobile, 1 QA.

## 4. Riesgos Técnicos que podrían alterar la estimación
* Retrasos en la adquisición de las tablets Rugged (hardware).
* Intermitencia en la red Wi-Fi del patio exterior que requiera modo offline complejo (incrementaría la App de S a L).
