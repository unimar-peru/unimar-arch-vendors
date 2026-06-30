# Formato de Caso de Prueba Funcional

> **Propósito:** Estandarizar la documentación de escenarios de prueba funcional, asegurando que cualquier QA o desarrollador pueda ejecutarlos y reportar resultados de forma consistente.

---

## Estructura del Caso de Prueba

Cada caso de prueba funcional DEBE contener:

| Campo | Descripción | Ejemplo |
| :---- | :---------- | :------ |
| **ID** | Identificador único del caso | `CP-FUNC-042` |
| **Historia Funcional** | ID de la FS que origina la prueba | `FS-UMS-012` |
| **Título** | Resumen del escenario | "Crear orden con cliente válido y productos en stock" |
| **Precondiciones** | Estado del sistema antes de ejecutar | "Usuario autenticado con rol 'Almacén'. Cliente existe. Productos con stock > 0." |
| **Datos de entrada** | Valores específicos a introducir | `clienteId: "CL-001"`, `productos: [{id: "PROD-01", cantidad: 5}]` |
| **Pasos** | Secuencia numerada de acciones | 1. Navegar a Órdenes / 2. Click "Nueva Orden" / 3. Seleccionar cliente / 4. Agregar productos / 5. Click "Guardar" |
| **Resultado esperado** | Comportamiento esperado del sistema | "Orden creada con estado 'Pendiente'. Código de orden visible en pantalla. Email de confirmación enviado." |
| **Criterio de éxito** | Condición que determina PASA/FALLA | "La orden aparece en la BD con los datos ingresados. HTTP 201." |
| **Evidencia** | Captura, log o video del resultado | `screenshot_orden-creada.png` |

---

## Ejemplo Completado

```markdown
---
ID: CP-FUNC-042
FS: FS-UMS-012
Título: Crear orden con cliente válido y productos en stock
Precondiciones:
  - Usuario autenticado con rol 'Almacén'
  - Cliente CL-001 existe en el sistema
  - Productos PROD-01 y PROD-02 tienen stock > 0
Datos de entrada:
  clienteId: "CL-001"
  productos: ["PROD-01", "PROD-02"]
Pasos:
  1. Navegar a Órdenes > Nueva Orden
  2. Seleccionar cliente "Corporación Nacional S.A."
  3. Agregar producto "PROD-01" x 10 unidades
  4. Agregar producto "PROD-02" x 5 unidades
  5. Click "Guardar Orden"
Resultado esperado:
  - Orden creada con estado "Pendiente"
  - Código de orden: ORD-2026-00642
  - Email de confirmación enviado a facturacion@corporacion.com
Criterio de éxito:
  - La orden se persiste en la BD con los datos ingresados
  - HTTP 201 Created
  - El total calculado = (precio PROD-01 * 10) + (precio PROD-02 * 5)
Evidencia:
  - screenshot_orden-creada.png
  - email_confirmacion.txt
```

---

## Reglas

1. Cada caso de prueba DEBE poder ejecutarse de forma independiente (sin depender del resultado de otro caso).
2. Los datos de entrada DEBEN ser específicos, no genéricos ("ingresar datos válidos" no es aceptable).
3. Si el caso de prueba requiere datos maestros (clientes, productos), estos DEBEN crearse como parte de las precondiciones.
4. El resultado esperado DEBE ser verificable (no "el sistema funciona").

---

[Volver a Estrategia de Pruebas](../../sdlc/estrategia-pruebas.es.md)
