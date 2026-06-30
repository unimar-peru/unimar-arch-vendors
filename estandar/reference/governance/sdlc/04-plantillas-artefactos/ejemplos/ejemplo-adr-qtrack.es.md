# Ejemplo: ADR - Uso de MQTT para Pantallas de Patio

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Ejemplo%3A%20ADR%20Q--Track-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
</p>

**Título:** Uso de protocolo MQTT sobre WebSockets para actualización en tiempo real de pantallas Smart TV en el patio de camiones.
**Estado:** Aceptado
**Fecha:** 2026-05-10
**Autor:** Equipo de Arquitectura Q-Track

## 1. Contexto
Las pantallas gigantes (Smart TVs Samsung) instaladas a lo largo de los 5,000 m² del patio de camiones deben mostrar qué placa acaba de ser llamada a la balanza en tiempo real.
Actualmente se evaluó usar *Long Polling* HTTP, *Server-Sent Events (SSE)* o *WebSockets*.
Las Smart TVs tienen navegadores limitados, la red Wi-Fi exterior sufre de micro-cortes constantes debido a los muros metálicos de los contenedores, y HTTP Polling satura la red de Unimar.

## 2. Decisión
Adoptaremos el protocolo **MQTT sobre WebSockets** utilizando el broker EMQX.
Las Smart TVs ejecutarán una SPA (React) estática que se conectará al tópico MQTT `qtrack/patio/turnos`.

## 3. Consecuencias
**Positivas:**
* MQTT maneja micro-cortes de red de forma nativa (QoS 1 garantiza entrega).
* El consumo de ancho de banda se reduce un 90% comparado con HTTP Polling.
* Latencia casi nula al llamar al camión; la TV se actualiza instantáneamente.

**Negativas:**
* El equipo Backend debe aprender a emitir mensajes MQTT desde NestJS.
* Se añade una nueva pieza de infraestructura (Broker EMQX) que debe ser mantenida por el equipo de DevOps.

## 4. Alternativas Consideradas
* **HTTP Short Polling (Cada 5s):** Rechazado. Inundaría la red con 12 solicitudes por minuto por cada pantalla, creando overhead de headers HTTP innecesario.
* **Socket.io puro:** Rechazado. Muy pesado para los navegadores antiguos de las Smart TVs y no maneja reconexiones en redes degradadas tan bien como el estándar IoT MQTT.
