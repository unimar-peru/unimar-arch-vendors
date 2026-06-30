# Ejemplo: PRD Q-Track MVP

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Ejemplo%3A%20PRD%20Q--Track%20MVP-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Aprobado-27ae60?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-1.0.0-042139?style=flat-square" alt="Versión">
</p>

> **Estado:** Activo
> **Producto:** Q-Track (Gestión de Turnos de Camiones)
> **Versión:** 1.0.0

## 1. Resumen Ejecutivo

Este PRD describe el Producto Mínimo Viable (MVP) para **Q-Track**, el sistema de gestión de citas y colas de camiones en las garitas de Unimar. Su objetivo es orquestar la llegada de los transportistas, asignarles turnos de balanza y dirigir el tráfico de patio para evitar cuellos de botella en la avenida principal.

## 2. Contexto y Problema

Actualmente, los camiones llegan de forma no planificada, causando congestión en la Av. Néstor Gambetta. Los transportistas pierden en promedio 3 horas en la cola externa. No hay visibilidad en tiempo real para los operadores de garita sobre qué contenedor trae cada camión hasta que este llega a la ventana física.

## 3. Objetivos y Métricas

| Objetivo | Métrica | Valor Inicial | Meta |
| --- | --- | --- | --- |
| Reducir tiempo de espera externo | Horas promedio por camión | 3h | < 30min |
| Aumentar throughput de garita | Camiones procesados / hora | 15 | 45 |
| Digitalizar el registro de llegada | % de choferes usando QR | 0% | 85% |

## 4. Alcance Funcional

### En Alcance (MVP)
* **Portal del Transportista**: Reserva de citas web 24/7.
* **Módulo de Garita**: Lector de códigos QR integrado a las tabletas de los prevencionistas.
* **Motor de Turnos**: Asignación FIFO priorizada por tipo de carga (Refrigerados tienen prioridad).
* **Pantallas de Patio**: Visualización de placas llamadas a balanza.

### Fuera de Alcance
* Integración directa con GPS de los camiones para pre-llegada automática.
* Módulo de facturación de demoras.

## 5. Casos de Uso Principales

1. **Agendar Cita**: El despachador de la agencia de aduanas ingresa la DUA, placa del camión y DNI del chofer para obtener un código QR con su franja horaria.
2. **Check-in en Garita**: El chofer muestra el QR desde su celular al prevencionista. El sistema valida la franja horaria y le asigna un número de ticket virtual.
3. **Llamado a Balanza**: El operador de balanza presiona "Siguiente". Q-Track busca en la cola virtual al camión con mayor prioridad o mayor tiempo de espera y lo muestra en la pantalla gigante del patio.

## 6. Supuestos y Restricciones
* Los choferes disponen de smartphones básicos para mostrar el QR.
* La conectividad en el patio de Unimar está asegurada mediante antenas Wi-Fi industriales.
* Las reglas corporativas exigen alta disponibilidad (99.9%) dado que el puerto no cierra.
