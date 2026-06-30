# Ejemplo: Épica - Motor de Turnos de Patio

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Ejemplo%3A%20%C3%89pica%20Q--Track-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
</p>

## 1. Información General
* **ID:** EPIC-QTRACK-002
* **Nombre:** Motor de Encolamiento y Priorización de Turnos (Balanza)
* **Producto:** Q-Track

## 2. Descripción
Como Operador de Patio de Unimar, necesito un sistema automático que decida qué camión ingresa a la balanza basándose en reglas de negocio (prioridad de carga refrigerada, tiempo en patio, cita puntual), para maximizar la fluidez interna y reducir el criterio humano manual.

## 3. Criterios de Éxito
* El sistema asigna turnos automáticamente sin intervención del operador.
* Las cargas perecibles (Reefer) siempre saltan la cola estándar.
* Tiempo de respuesta de la asignación de turno < 500ms.

## 4. Historias de Usuario Asociadas
* [US-021] Algoritmo FIFO base para el patio.
* [US-022] Excepción de prioridad para Contenedores Refrigerados.
* [US-023] Alerta de caducidad (camión esperando > 2 horas en patio).
* [US-024] Panel de visualización de turnos en TV gigante (Patio).

## 5. Dependencias
* Requiere que la Épica EPIC-QTRACK-001 (Portal de Citas y Check-in QR) esté completada para tener camiones ingresados al patio.
