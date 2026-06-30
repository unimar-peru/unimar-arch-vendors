# Glosario de Negocio — Lenguaje Ubicuo UNIMAR

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Glosario%20de%20Negocio%20UNIMAR-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Activo-27ae60?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-0.1.0-042139?style=flat-square" alt="Versión">
</p>

> **Producto:** Suite de Sistemas de Soporte Operativo — UNIMAR S.A.
> **Padre:** [Glosario de Negocio](../glosario-negocio.md)
> **Audiencia:** Todos los equipos de desarrollo y negocio de UNIMAR

---

## Términos Transversales

*Definición única en todos los contextos de la suite.*

---

#### Sucursal

* **Definición:** Instalación operativa de UNIMAR habilitada para prestar servicios aduaneros y logísticos (depósito temporal, patio de contenedores, almacén). Identificada por un código único `sucursal_id`.
* **Contexto Acotado:** Transversal — todos los contextos
* **Tipo:** Entidad
* **Sinónimos (no usar):** sede, agencia, local, tenant, organización
* **Términos relacionados:** Depósito Temporal, Almacén Aduanero
* **Fuente regulatoria:** SUNAT — Reglamento de Almacenes Aduaneros

---

#### Operador

* **Definición:** Usuario interno de UNIMAR con acceso autenticado al sistema. Posee uno o más roles que determinan qué operaciones puede ejecutar y sobre qué sucursales.
* **Contexto Acotado:** Transversal — todos los contextos
* **Tipo:** Entidad
* **Sinónimos (no usar):** usuario, empleado, agente, user
* **Términos relacionados:** Rol, Permiso, Sucursal Autorizada
* **Fuente regulatoria:** —

---

#### Rol

* **Definición:** Conjunto nombrado de permisos asignado a un operador. Determina qué acciones puede ejecutar en el sistema. Ejemplos: `DespachadoSenior`, `JefeDePatio`, `SupervisorRegional`.
* **Contexto Acotado:** Transversal (gestionado en Identity & Access)
* **Tipo:** Concepto de Negocio
* **Sinónimos (no usar):** perfil, grupo, cargo
* **Términos relacionados:** Operador, Permiso
* **Fuente regulatoria:** —

---

#### Sucursal Autorizada

* **Definición:** Sucursal sobre la que un operador tiene permiso de ejecutar operaciones. Un operador puede tener autorización sobre una o múltiples sucursales. La autorización es gestionada por el módulo Identity & Access y viaja en el JWT como el claim `sucursales_autorizadas`.
* **Contexto Acotado:** Transversal
* **Tipo:** Concepto de Negocio
* **Sinónimos (no usar):** sucursal asignada, sucursal propietaria, tenant
* **Términos relacionados:** Operador, Rol, Sucursal
* **Fuente regulatoria:** —

---

## Despacho Aduanero

---

#### DUA (Declaración Única de Aduanas)

* **Definición:** Documento oficial exigido por SUNAT que formaliza la declaración de mercadería en una operación de importación o exportación. El DUA lleva un número único asignado por SUNAT al momento de la numeración.
* **Contexto Acotado:** Despacho Aduanero
* **Tipo:** Término Regulatorio
* **Sinónimos (no usar):** declaración, formulario aduanero, DAM
* **Términos relacionados:** Numeración, Régimen Aduanero, Levante
* **Fuente regulatoria:** SUNAT — Ley General de Aduanas (D.Leg. 1053)

---

#### Despacho

* **Definición:** Proceso completo de importación o exportación de una mercadería, que abarca desde la transmisión de la declaración hasta la obtención del levante de SUNAT. Un despacho está asociado a un cliente, un régimen aduanero y uno o más contenedores o bultos.
* **Contexto Acotado:** Despacho Aduanero
* **Tipo:** Entidad — raíz de agregado
* **Sinónimos (no usar):** expediente, trámite, operación aduanera
* **Términos relacionados:** DUA, Régimen Aduanero, Levante, Cliente
* **Fuente regulatoria:** SUNAT — Ley General de Aduanas

---

#### Numeración

* **Definición:** Acto mediante el cual SUNAT asigna un número oficial al DUA, marcando el inicio formal del despacho bajo control aduanero. A partir de la numeración, el despacho tiene existencia legal ante SUNAT.
* **Contexto Acotado:** Despacho Aduanero
* **Tipo:** Evento de Dominio
* **Sinónimos (no usar):** registro, aprobación, ingreso
* **Términos relacionados:** DUA, Despacho
* **Fuente regulatoria:** SUNAT — Procedimiento General INTA-PG.01

---

#### Régimen Aduanero

* **Definición:** Modalidad legal bajo la cual se realiza el despacho, que determina el tratamiento tributario y el destino de la mercadería. Ejemplos: Importación Definitiva (código 10), Exportación Definitiva (código 40), Admisión Temporal (código 20).
* **Contexto Acotado:** Despacho Aduanero
* **Tipo:** Término Regulatorio
* **Sinónimos (no usar):** modalidad, tipo de despacho
* **Términos relacionados:** DUA, Despacho
* **Fuente regulatoria:** SUNAT — Tabla de Regímenes Aduaneros

---

#### Canal de Control

* **Definición:** Clasificación asignada por SUNAT al despacho que determina el tipo de revisión requerida. Verde: solo revisión documentaria automática. Naranja: revisión documentaria por un funcionario. Rojo: aforo físico obligatorio.
* **Contexto Acotado:** Despacho Aduanero
* **Tipo:** Concepto de Negocio
* **Sinónimos (no usar):** color de canal, resultado de canal, semáforo aduanero
* **Términos relacionados:** Aforo, DUA, Despacho
* **Fuente regulatoria:** SUNAT — Ley General de Aduanas Art. 162

---

#### Levante

* **Definición:** Autorización otorgada por SUNAT que habilita al propietario de la mercadería para retirarla del almacén o depósito. Es el hito final del proceso de despacho bajo control aduanero.
* **Contexto Acotado:** Despacho Aduanero
* **Tipo:** Evento de Dominio / Término Regulatorio
* **Sinónimos (no usar):** autorización de retiro, liberación, aprobación final
* **Términos relacionados:** DUA, Canal de Control, Aforo
* **Fuente regulatoria:** SUNAT — Ley General de Aduanas

---

#### Tributos

* **Definición:** Aranceles, IGV, percepciones y otros gravámenes liquidados a nombre del cliente en el despacho de importación. UNIMAR los paga a SUNAT en nombre del cliente y los recupera en la liquidación de servicio.
* **Contexto Acotado:** Despacho Aduanero / Facturación y Liquidación
* **Tipo:** Concepto de Negocio / Término Regulatorio
* **Sinónimos (no usar):** impuestos, derechos, cargos aduaneros
* **Términos relacionados:** DUA, Liquidación, Valor CIF
* **Fuente regulatoria:** SUNAT — Arancel de Aduanas

---

#### Valor CIF

* **Definición:** Valor de la mercadería calculado como Costo + Seguro + Flete (Cost, Insurance, Freight). Es la base imponible para el cálculo de los tributos de importación.
* **Contexto Acotado:** Despacho Aduanero
* **Tipo:** Término Regulatorio
* **Sinónimos (no usar):** valor de la mercadería, valor aduanero
* **Términos relacionados:** Tributos, DUA
* **Fuente regulatoria:** Acuerdo de Valoración en Aduana de la OMC

---

## Gestión de Contenedores

---

#### Contenedor

* **Definición:** Unidad de carga intermodal estándar identificada por un número ISO 6346 de 11 caracteres (ej. `MSCU1234567`). Posee tipo (20', 40', HC, Reefer), tara y estado físico. Pertenece operativamente a una sucursal en cada momento de su ciclo de vida.
* **Contexto Acotado:** Gestión de Contenedores
* **Tipo:** Entidad — raíz de agregado
* **Sinónimos (no usar):** caja, box, TEU (TEU es una unidad de medida, no el contenedor)
* **Términos relacionados:** BL, Transferencia, Sucursal, ETA
* **Fuente regulatoria:** ISO 6346

---

#### BL (Bill of Lading)

* **Definición:** Documento de embarque marítimo emitido por la línea naviera que identifica la carga, el embarcador, el consignatario y el puerto de destino. Es el título de propiedad de la carga durante el tránsito marítimo.
* **Contexto Acotado:** Gestión de Contenedores / Despacho Aduanero
* **Tipo:** Término Regulatorio
* **Sinónimos (no usar):** conocimiento de embarque (aceptable en comunicaciones, no en código), B/L
* **Términos relacionados:** Contenedor, Despacho
* **Fuente regulatoria:** Convenio de Hamburgo (ONU) / UNCTAD

---

#### ETA (Estimated Time of Arrival)

* **Definición:** Fecha y hora estimada de arribo de la nave al puerto de destino. Determina la ventana de descarga y el inicio del plazo de almacenaje.
* **Contexto Acotado:** Gestión de Contenedores
* **Tipo:** Concepto de Negocio
* **Sinónimos (no usar):** fecha de llegada, fecha de arribo
* **Términos relacionados:** Contenedor, BL
* **Fuente regulatoria:** —

---

#### Transferencia

* **Definición:** Movimiento físico y registro de un contenedor desde una sucursal de UNIMAR hacia otra. Requiere autorización del operador sobre ambas sucursales (`sucursales_autorizadas`). Genera el evento `ContenedorTransferido` con `sucursal_origen` y `sucursal_destino`.
* **Contexto Acotado:** Gestión de Contenedores
* **Tipo:** Evento de Dominio
* **Sinónimos (no usar):** traslado, movimiento inter-sede
* **Términos relacionados:** Contenedor, Sucursal, Sucursal Autorizada
* **Fuente regulatoria:** —

---

## Gestión de Almacenes

---

#### Almacén Aduanero

* **Definición:** Instalación autorizada y supervisada por SUNAT para la custodia de mercadería bajo control aduanero, pendiente de levante. Puede ser un Depósito Temporal o un Almacén Simple.
* **Contexto Acotado:** Gestión de Almacenes
* **Tipo:** Término Regulatorio
* **Sinónimos (no usar):** bodega, depósito (depósito es un subtipo), warehouse
* **Términos relacionados:** Sucursal, Depósito Temporal, Levante
* **Fuente regulatoria:** SUNAT — Reglamento de Almacenes Aduaneros

---

#### Depósito Temporal

* **Definición:** Tipo de Almacén Aduanero habilitado para custodiar mercadería desde su descarga en el puerto hasta la numeración del DUA o el vencimiento del plazo legal (30 días para importación).
* **Contexto Acotado:** Gestión de Almacenes
* **Tipo:** Término Regulatorio
* **Sinónimos (no usar):** depósito simple, almacén temporal
* **Términos relacionados:** Almacén Aduanero, Levante
* **Fuente regulatoria:** SUNAT — Ley General de Aduanas Art. 111

---

#### Aforo

* **Definición:** Inspección física de la mercadería ordenada por SUNAT cuando el despacho cae en Canal de Control Rojo. Un inspector de SUNAT verifica que la mercadería declarada coincide con la real en cantidad, descripción y valor.
* **Contexto Acotado:** Gestión de Almacenes / Despacho Aduanero
* **Tipo:** Término Regulatorio
* **Sinónimos (no usar):** inspección, revisión física, verificación
* **Términos relacionados:** Canal de Control, Almacén Aduanero, DUA
* **Fuente regulatoria:** SUNAT — Ley General de Aduanas Art. 162

---

#### Ubicación

* **Definición:** Posición física de una mercadería dentro del almacén, expresada como `[nave]-[fila]-[columna]-[nivel]`. Ejemplo: `A-03-12-2`.
* **Contexto Acotado:** Gestión de Almacenes
* **Tipo:** Valor (Value Object)
* **Sinónimos (no usar):** posición, slot, espacio
* **Términos relacionados:** Almacén Aduanero, Aforo
* **Fuente regulatoria:** —

---

#### Precinto

* **Definición:** Dispositivo de seguridad (metálico o plástico) colocado en el acceso del contenedor o bulto para garantizar la integridad de la carga desde la descarga hasta el levante. Su número se registra en el sistema y debe coincidir con el declarado en el BL.
* **Contexto Acotado:** Gestión de Almacenes
* **Tipo:** Concepto de Negocio
* **Sinónimos (no usar):** sello, candado, cerrojo
* **Términos relacionados:** Contenedor, BL, Aforo
* **Fuente regulatoria:** SUNAT

---

## Transporte y Logística

---

#### Orden de Transporte

* **Definición:** Instrucción interna que asigna un vehículo, conductor y ruta para el retiro de mercadería desde el almacén hacia el destino del cliente. Se genera después de concedido el levante.
* **Contexto Acotado:** Transporte y Logística
* **Tipo:** Entidad
* **Sinónimos (no usar):** despacho de transporte, orden de retiro
* **Términos relacionados:** Levante, Guía de Remisión, Ventana de Retiro
* **Fuente regulatoria:** —

---

#### Guía de Remisión

* **Definición:** Documento exigido por SUNAT que ampara el traslado físico de mercadería entre dos puntos dentro del territorio nacional. Debe emitirse antes de iniciar el transporte.
* **Contexto Acotado:** Transporte y Logística
* **Tipo:** Término Regulatorio
* **Sinónimos (no usar):** guía de transporte, remito
* **Términos relacionados:** Orden de Transporte, Levante
* **Fuente regulatoria:** SUNAT — Reglamento de Comprobantes de Pago

---

#### Ventana de Retiro

* **Definición:** Horario acordado con el cliente o su representante para el retiro de la carga del almacén. Su incumplimiento por parte del cliente genera penalidad de almacenaje adicional.
* **Contexto Acotado:** Transporte y Logística
* **Tipo:** Concepto de Negocio
* **Sinónimos (no usar):** cita de retiro, turno, horario de retiro
* **Términos relacionados:** Orden de Transporte, Almacén Aduanero
* **Fuente regulatoria:** —

---

## Gestión Comercial

---

#### Cliente

* **Definición:** Empresa o persona natural con contrato de servicios aduaneros activo con UNIMAR, en calidad de importador, exportador o consignatario habitual. No confundir con el concepto de Operador (usuario interno del sistema).
* **Contexto Acotado:** Gestión Comercial
* **Tipo:** Entidad — raíz de agregado
* **Sinónimos (no usar):** importador, exportador (son roles del cliente, no el cliente en sí), usuario
* **Términos relacionados:** Contrato, Tarifa, Despacho
* **Fuente regulatoria:** —

---

#### Contrato

* **Definición:** Acuerdo marco entre UNIMAR y un cliente que define las condiciones de servicio, tarifas aplicables, sucursales habilitadas y vigencia. Cada despacho se factura bajo las condiciones del contrato vigente del cliente.
* **Contexto Acotado:** Gestión Comercial
* **Tipo:** Entidad
* **Sinónimos (no usar):** acuerdo, convenio, carta de servicios
* **Términos relacionados:** Cliente, Tarifa, Liquidación
* **Fuente regulatoria:** —

---

#### Tarifa

* **Definición:** Precio unitario acordado en el contrato para un tipo de servicio específico (almacenaje por día/TEU, despacho, transporte local). Las tarifas pueden variar por sucursal y régimen.
* **Contexto Acotado:** Gestión Comercial / Facturación y Liquidación
* **Tipo:** Valor (Value Object)
* **Sinónimos (no usar):** precio, fee, arancel (arancel es un término regulatorio SUNAT)
* **Términos relacionados:** Contrato, Liquidación
* **Fuente regulatoria:** —

---

## Facturación y Liquidación

---

#### Liquidación

* **Definición:** Documento de cobro emitido por UNIMAR al cliente al cierre de un despacho. Detalla los servicios prestados, las tarifas aplicadas, los tributos pagados a SUNAT a nombre del cliente y el monto total a cobrar.
* **Contexto Acotado:** Facturación y Liquidación
* **Tipo:** Entidad — raíz de agregado
* **Sinónimos (no usar):** factura (la factura es el comprobante legal; la liquidación es el cálculo previo), cobro, estado de cuenta
* **Términos relacionados:** Despacho, Contrato, Tarifa, Tributos
* **Fuente regulatoria:** —

---

#### Nota de Crédito

* **Definición:** Documento emitido por UNIMAR que reduce el importe de una liquidación ya emitida, por concepto de error, descuento o devolución de servicio no prestado.
* **Contexto Acotado:** Facturación y Liquidación
* **Tipo:** Término Regulatorio
* **Sinónimos (no usar):** ajuste, corrección, descuento posterior
* **Términos relacionados:** Liquidación
* **Fuente regulatoria:** SUNAT — Reglamento de Comprobantes de Pago

---

## Historial de Revisiones

| Fecha | Término agregado / modificado | Responsable |
|---|---|---|
| 2026-06-08 | Versión inicial — 30 términos de la suite UNIMAR | Architecture Board |

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-06-08
</p>
