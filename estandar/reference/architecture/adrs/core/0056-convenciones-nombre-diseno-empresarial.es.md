# ADR-0056: Clean Code como Base de Ingeniería de la Suite

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-ADR-0056%3A%20Clean%20Code%20como%20base%E2%80%A6-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Aceptado-27ae60?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-1.0.0-042139?style=flat-square" alt="Versión">
</p>

> **Estado:** Aceptado — supersede a [ADR-0049](./0049-politica-naming-semantica-codigo-limpio.es.md)
> **Fecha:** 2026-06-05
> **Decisores:** Architecture Board

## Contexto

La ingeniería de la suite necesita una base común de calidad de código que sea coherente entre múltiples lenguajes (TypeScript, C#, Kotlin), plataformas (Backend, Web, Mobile) y artefactos (clases, archivos, variables, mensajes, eventos, errores). La nomenclatura semántica es una consecuencia de esa base, no un cuerpo de reglas aislado.

## Decisión

Adoptar **Clean Code como base de ingeniería de la suite**: los principios de código limpio (nombres que comunican intención, funciones pequeñas, responsabilidad única, ausencia de duplicación) son el criterio transversal del que derivan las convenciones de nomenclatura y diseño. Este ADR **supersede a ADR-0049**.

Las reglas concretas se apoyan en las decisiones ya vigentes:

- [Calidad de Código](./0005-ci-cd-calidad-codeql.es.md) (CI/CD y gates)
- [Tipos Estrictos TypeScript](../nodejs/0003-estandares-estrictos-typescript.es.md) (estándar TS)
- [Estrategia de Mapeo de Bounded Contexts](./0031-esquema-por-contexto-catalogo-eventos-dominio.es.md) (lenguaje ubicuo)

Referenciado por las [Directrices Arquitectónicas](../../../governance/standards/vision/directivas-arquitectonicas.es.md).

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-06-05
</p>
