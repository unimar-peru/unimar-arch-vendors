# Checklist de Simplicidad — Fase 1

> **Estado:** Pendiente de Importación
> **Fase:** 1 — Concepción

## Propósito

Bloquea la sobre-ingeniería antes de aprobar la Baseline de Diseño. La Fase 1 es deliberadamente simple: monolitio modular, una sola base de datos, sin bus externo, sin microservicios.

## Checklist

* [ ] ¿La iniciativa se puede entregar como un único proceso sin separación de redes?
* [ ] ¿La base de datos única soporta la carga esperada del primer año?
* [ ] ¿No se ha introducido un broker de mensajes externo?
* [ ] ¿No se ha introducido Kubernetes ni Service Mesh?
* [ ] ¿El equipo de ingeniería tiene menos de 8 personas?
* [ ] ¿El modelo de dominio cabe en una cabeza humana?
* [ ] ¿Las integraciones externas se han modelado como puertos inyectables aunque hoy exista una sola implementación?

## Resultado

Si todas las respuestas son afirmativas, se mantiene la Fase 1 simple. Cualquier "No" activa una revisión con el Architecture Board para determinar si corresponde saltar de fase.

## Documentos Relacionados

| Documento | Propósito |
| --- | --- |
| [Blueprint de Referencia](./blueprint-referencia.es.md) | Visión C4 canónica. |
| [ADR-0047: Patrones Arquitectónicos](../adrs/core/0047-patrones-arquitectonicos-monolito-soa-microservicios.es.md) | Marco de selección de topología. |
| [ADR-0045: Criterios de Extracción](../adrs/core/0045-criterios-extraccion-microservicios.es.md) | Cuándo se justifica salir de la Fase 1. |
