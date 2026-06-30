# Ejemplo: Historia Funcional (FS) - Lector QR Garita

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Ejemplo%3A%20FS%20Q--Track-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
</p>

## 1. Identificador
**FS-QTRACK-015:** Registro de llegada (Check-in) mediante lectura QR en Tablet Android.

## 2. Requerimiento Funcional
El personal de prevención en la garita física (tranquera exterior) utilizará una tablet Android provista por Unimar para escanear el código QR que el transportista trae en su celular o impreso. El sistema validará que el código pertenece a una cita activa del día de hoy y confirmará el ingreso del camión al patio (cambio de estado de `Programado` a `En Patio`).

## 3. Reglas de Negocio
* **RN-01:** Solo se permite el ingreso si la cita está programada para la fecha actual y la ventana horaria actual (con una tolerancia de +/- 30 minutos).
* **RN-02:** Si la cita corresponde a otro día, el sistema bloquea el ingreso mostrando una pantalla roja de advertencia ("Cita no corresponde a hoy").
* **RN-03:** Si el QR ya fue escaneado anteriormente, el sistema muestra "Ticket ya utilizado".
* **RN-04:** El sistema debe registrar la hora exacta del escaneo y el ID del prevencionista en turno.

## 4. Diseño de Interfaz (Wireframes)
*(En un documento real, se enlazan los wireframes de Figma aquí)*
* Pantalla 1: Cámara activa con recuadro guía.
* Pantalla 2: Modal verde (Aprobado) o Rojo (Rechazado) que ocupa toda la pantalla para fácil lectura bajo el sol.

## 5. Casos de Prueba Funcionales (BDD)
```gherkin
Feature: Check-in por QR en Garita

  Scenario: Chofer llega en su franja horaria correcta
    Given que el chofer tiene la cita CITA-100 para las 10:00 AM
    And el reloj actual marca las 10:15 AM
    When el prevencionista escanea el QR de CITA-100
    Then el sistema cambia el estado a "En Patio"
    And muestra el mensaje "INGRESO AUTORIZADO" en color verde
```
