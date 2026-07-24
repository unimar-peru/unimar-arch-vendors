# Estrategia de Auditoría Continua y Versionado Automatizado

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Estrategia%20de%20Auditor%C3%ADa%20Continu%E2%80%A6-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Activo-27ae60?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-1.0.0-042139?style=flat-square" alt="Versión">
</p>

Para mantener un registro de auditoría estricto y rastreable sincronizado con GitHub, este repositorio puede usar el método spec-driven AI-DD [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) sin convertirlo en la identidad de la documentación. El proceso de release no se basa en la redacción manual de documentos. En su lugar, aprovechamos el flujo de ingeniería ya establecido (**Conventional Commits**) combinado con el poder nativo de nuestro orquestador: **Nx Release**.

__DOUBLE_BLANK__

## 1. El Pilar: Conventional Commits
Dado que ya hemos implementado `commitlint`, el repositorio sabe exactamente qué tipo de cambio ocurrió.
* `fix(auth): ...` -> Genera un lanzamiento de parche automático (ej. de `v1.0.0` a `v1.0.1`).
* `feat(api): ...` -> Genera un lanzamiento menor automático (ej. de `v1.0.1` a `v1.1.0`).
* Si un commit incluye `BREAKING CHANGE` -> Genera un lanzamiento mayor automático (ej. de `v1.1.0` a `v2.0.0`).


## 2. Automatización con `nx release`
Nx incluye una suite de versionado nativa para monorepos que ejecuta el siguiente ciclo de auditoría con un solo comando (`npx nx release`):

1. **Versionado Automático**: Nx analiza todos los commits desde el último despliegue y calcula el nuevo SemVer (Versionado Semántico) para el API y las aplicaciones Web.
2. **Generación de `CHANGELOG.md`**: Nx crea (o actualiza) un archivo `CHANGELOG.md` físico en la raíz del proyecto. Este archivo sirve como tu **Documento Oficial de Auditoría**, detallando:
   * Nuevas características añadidas.
   * Correcciones de bugs resueltas.
   * Enlaces de hipertexto que apuntan directamente a los hashes de los commits en GitHub para una trazabilidad absoluta.
3. **Etiquetado Git**: Crea una etiqueta en Git (ej. `v1.1.0`) apuntando exactamente al estado de la base de código en ese momento específico.
4. **Sincronización con GitHub Releases**: Cuando se configura con GitHub Actions, este `CHANGELOG` se publica automáticamente en la pestaña "Releases" de tu repositorio en la nube.

---


## 3. Beneficios para el Esqueleto de Referencia
* **Cero Esfuerzo Manual**: Se acabó la redacción manual de notas de lanzamiento.
* **Auditoría Forense**: Si una versión como la `v1.2.0` falla en producción, el `CHANGELOG.md` te dice exactamente qué commits introdujeron el error y quién los hizo.
* **Transparencia Total**: Ejecutivos o QA pueden ver un documento amigable y legible por humanos en GitHub Releases que explica qué contiene cada despliegue.

---


## 4. Plan de Acción (Próximos Pasos)
Para activar esto, solo necesitamos:
1. Modificar tu archivo `nx.json` para habilitar el bloque de configuración `"release"`.
2. Probar la generación de nuestra primera versión `v1.0.0` y nuestro primer `CHANGELOG.md` fundacional.

---
[Volver al Índice](./README.md)

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-06-05
</p>
