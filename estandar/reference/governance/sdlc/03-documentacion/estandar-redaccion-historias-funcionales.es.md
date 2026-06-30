# Estándar de Redacción de Historias Funcionales

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Est%C3%A1ndar%20de%20Redacci%C3%B3n%20de%20Histor%E2%80%A6-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Activo-27ae60?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-0.1.0-042139?style=flat-square" alt="Versión">
</p>

> **Fase SDLC:** 2 — Diseño Funcional
> **Padre:** [Documentación SDLC](../README.md)
> **Audiencia:** Product Owners, Analistas Funcionales, QA, Agentes AI

## Propósito

Este estándar define cómo deben redactarse las Historias Funcionales en Unimar Arch para garantizar que sean:

- **Atómicas:** una sola intención de valor de negocio.
- **Verificables:** criterios de aceptación medibles objetivamente.
- **Negociables:** no son contratos rígidos, son unidades de conversación.
- **Trazables:** toda Historia Funcional nace de un PRD aprobado.
- **Estimables:** pueden ser dimensionadas sin ambigüedad.

## 1. Anatomía de una Historia Funcional

Una Historia Funcional se estructura en cinco bloques:

| Bloque | Propósito | Anti-patrones |
| --- | --- | --- |
| **Identificador** | `FS-<Proyecto>-<NNN>` único por repositorio. | Identificadores sin numeración correlativa. |
| **Título** | Frase nominal que describa el valor, no la implementación. | Títulos técnicos ("Crear endpoint /user"). |
| **Contexto de Negocio** | Por qué esta historia existe, qué problema resuelve, qué relación tiene con el PRD. | Historias huérfanas sin PRD o sin métrica. |
| **Escenarios de Comportamiento** | Lista de criterios de aceptación redactados con estructura *Dado/Cuando/Entonces* o equivalentemente declarativa. | Listas de "la pantalla debe verse bonita". |
| **Reglas de Negocio Explícitas** | Restricciones no obvias que el implementador debe respetar (segmentos, plazos, redondeos, excepciones regulatorias). | Reglas implícitas que viven en la cabeza de un analista. |

## 2. Forma de los Criterios de Aceptación

- **Positivos y negativos:** incluir al menos un escenario feliz y un escenario de error esperado.
- **Deterministas:** mismo estímulo produce el mismo resultado observable.
- **No redundantes:** no repetir el comportamiento del sistema base.
- **Ordenados:** escenario base primero, alternaciones después.
- **Trazables a la Historia:** ningún escenario puede sobrevivir sin la historia.

### 2.1 Plantilla verbal

```
Escenario: <nombre del escenario>
  Dado que   <contexto inicial estable>
  Cuando     <acción del usuario o evento de negocio>
  Y          <opcional, condición adicional observable>
  Entonces   <resultado esperado, observable y medible>
  Y          <opcional, efecto secundario verificable>
```

## 3. Reglas No Negociables

1. **Una Historia = un valor de negocio.** Si la frase requiere "y", es varias historias.
2. **Sin criterios visuales o de UI.** "Bonito" no es criterio. El comportamiento observable sí.
3. **Sin dependencias implícitas a otras historias.** Las dependencias se declaran explícitamente.
4. **Sin selección tecnológica.** La Historia Funcional no menciona framework, lenguaje ni base de datos.
5. **Cada criterio es ejecutable como prueba.** Si QA no puede convertirlo en test, falta detalle.
6. **Una sola persona o rol cliente por historia.** Múltiples roles implican múltiples historias.

## 4. Anti-patrones Frecuentes

- **Historia de tarea técnica disfrazada de negocio.** "Como usuario quiero que el sistema implemente Redis" no es una Historia Funcional; es una Historia Técnica.
- **Historia épica inflada.** Una Historia Funcional no requiere 5 criterios de aceptación para ser valiosa. Si los requiere, es un Epic.
- **Criterios que empiezan con "rápido", "fácil", "intuitivo".** Son subjetivos y no verificables.
- **Historia sin PRD.** Cualquier Historia Funcional debe ser trazable a una sección del PRD vigente.

## 5. Lista de Verificación de Listo

Antes de promover una Historia Funcional al Backlog de Iteración, debe satisfacer:

- [ ] Identificador y título estables.
- [ ] Contexto de Negocio redactado en una sola idea principal.
- [ ] Mínimo 2 escenarios de aceptación (feliz + alterno).
- [ ] Reglas de Negocio Explícitas cuando apliquen.
- [ ] Sin verbos ni sustantivos tecnológicos.
- [ ] Enlace al PRD y al reporte de trazabilidad.
- [ ] Al menos un par (rol, valor de negocio) claramente identificable.

## 6. Trazabilidad Handoff

Las Historias Funcionales son el artefacto central del SDLC:

- Su **alcance y comportamiento** se traducen en [Historias Técnicas](../04-plantillas-artefactos/plantilla-historia-tecnica.es.md).
- Sus **criterios de aceptación** alimentan la matriz de pruebas y son referenciados en el [Reporte Resumen de Pruebas](../04-plantillas-artefactos/plantilla-reporte-resumen-pruebas.es.md).
- Su **valor de negocio** se comunica a la audiencia en las [Notas de Lanzamiento](../04-plantillas-artefactos/plantilla-notas-lanzamiento.es.md).

## 7. Documentos Relacionados

| Documento | Propósito |
|---|---|
| [Mejores Prácticas de Documentación SDLC](./mejores-practicas-documentacion-sdlc.es.md) | Convenciones transversales del repositorio. |
| [Plantilla Historia Funcional](../04-plantillas-artefactos/plantilla-historia-funcional.es.md) | Estructura canónica para uso directo. |
| [Mapeo SDLC–Artefactos](../mapeo-artefactos-sdlc.es.md) | Define cuándo este estándar aplica. |

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-06-05
</p>
