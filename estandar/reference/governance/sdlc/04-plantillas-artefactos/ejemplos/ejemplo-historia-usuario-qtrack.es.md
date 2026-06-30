# Ejemplo: Historia de Usuario (US) - Agendar Cita Web

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Ejemplo%3A%20US%20Q--Track-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
</p>

## 1. Identificador y Título
**US-QTRACK-005:** Agendar cita de retiro de importación vía Web.

## 2. Descripción (User Story)
**Como** despachador de agencia de aduana,
**Quiero** ingresar al portal web, seleccionar la DUA de mi cliente y reservar una franja horaria para el recojo de la mercancía,
**Para que** mi camión no deba hacer cola innecesaria en la Av. Gambetta y asegure su atención.

## 3. Criterios de Aceptación
1. El portal debe mostrar únicamente los contenedores (DUA) que ya tienen levante aduanero (validado vía integración con SUNAT/Aduanas).
2. El usuario debe poder seleccionar una fecha y ver las ventanas horarias disponibles (slots de 1 hora, capacidad de 15 camiones por slot).
3. Si un slot ya alcanzó su capacidad máxima de 15 camiones, debe aparecer deshabilitado (gris).
4. Al confirmar la reserva, el sistema genera automáticamente un Código QR y lo envía al correo del usuario y por SMS al celular del chofer.

## 4. Notas Técnicas y Dependencias
* Depende de la API del Core Aduanero (Legado) para verificar el levante de la DUA.
* Se usará la librería `qrcode` en el frontend para renderizar el código y el servicio SendGrid para el correo.
