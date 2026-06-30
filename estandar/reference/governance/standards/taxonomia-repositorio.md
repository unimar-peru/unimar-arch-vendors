# Taxonomía de Repositorio y Política de Estructuración

> **Estado:** Adoptado | **Referencia:** Estándar local

Este documento establece la taxonomía local y los límites de autoridad para el repositorio satélite Unimar Arch. 

## 1. Estructura Estándar de Directorios

```text
/ (raíz del repositorio)
  README.md                     # Portal público y navegación inicial
  MASTER_INDEX.md               # Ruteo exhaustivo por rol e intención
  CONTRIBUTING.md               # Guía de contribución
  DECISIONS.md                  # Triage de patrones upstream (Adopt/Extend/Override/N/A)
  AGENTS.md                     # Reglas y convenciones para agentes
  DOCUMENTATION_VERSIONS.md     # Log de releases de documentación
  .bmad-core/                   # Instalación de BMAD Method (opcional)
  .github/                      # Flujos de CI y plantillas de colaboración
  .harness/                     # Reglas de validación de documentos y agentes
  .husky/                       # Hooks de pre-commit
  .vscode/                      # Recomendaciones del editor
  _bmad/                        # Instalación de BMAD Method (agentes, workflows)
  docs/                         # Artefactos de planificación e implementación BMAD
  license/                      # Documentación legal consolidada
  reference/                    # Corpus de referencia arquitectónica
    getting-started/
    architecture/               # Autoridad arquitectónica y guía de implementación
      blueprints/
      adrs/
      canonical-patterns/
    governance/                 # Políticas, SDLC, terminología y onboarding
    knowledge/                  # Evidencia aplicada, investigación y aprendizaje
      dominio/                  # Conocimiento de dominio específico de Unimar
    operations/
    infrastructure/
    quick-access/
    navigation/
```

## 2. Convenciones de Nomenclatura y Artefactos

- Los directorios y archivos base usan `kebab-case`.
- Los ADRs usan `[4-digit-id]-[descriptive-title].md`.
- Un documento runtime-específico debe identificar el runtime en su carpeta, título o declaración de scope.
- Los patrones canónicos son artefactos de implementación mapeados a ADRs aceptados y permanecen condicionados por su scope de runtime.
- No se deben crear directorios sin scope como `utils`, `misc`, `temp`, `common` o `shared`.

## 3. Idioma Único

- Toda la documentación de este repositorio se mantiene exclusivamente en español. No se generan pares bilingües, archivos `.en.md`, ni contrapartes en otros idiomas.
- Los nombres de archivos, títulos, encabezados, etiquetas de diagramas y código embebido deben estar en español.
- Las excepciones explícitas (acrónimos, identificadores de código, marcas, citas bibliográficas) son las únicas admisibles. Ver [`../../../AGENTS.md`](../../../AGENTS.md) § Idioma de la Documentación.

## 4. Capas de Autoridad Documental

| Capa | Propósito | Ubicaciones Canónicas | Autoridad |
|---|---|---|---|
| Guía | Ayudar al lector a navegar el corpus | `README.md`, `MASTER_INDEX.md`, `reference/getting-started/` | Navegacional |
| Referencia Canónica | Definir política reutilizable, criterios de decisión y trade-offs aceptados | `reference/architecture/blueprints/`, `reference/architecture/adrs/`, `reference/governance/` | Normativo o decisional según el estado del documento |
| Guía de Implementación Runtime-Específica | Materializar decisiones aceptadas para un runtime declarado | `reference/architecture/canonical-patterns/`, blueprints, y ADRs específicos | Reutilizable solo dentro del scope y ADR declarados |
| Evidencia de Producto Aplicado | Demostrar adopción y especialización en el producto Unimar | `reference/knowledge/dominio/`, código, y docs externos | Ilustrativo hasta su promoción a artefacto canónico |


## 6. Política de Raíz del Repositorio

La raíz debe mantenerse pequeña y navegable. Las categorías permitidas son:

- Archivos públicos de navegación: `README.md`, `MASTER_INDEX.md`, `DOCUMENTATION_VERSIONS.md`, `CONTRIBUTING.md`, `AGENTS.md`, `DECISIONS.md`.
- Documentos legales consolidados en `license/`: `LICENSE`, `NOTICE.md`, `DISCLAIMER.md` (y `license/README.md` como índice).
- Dot-folders de tooling y plataforma: `.github/`, `.harness/`, `.husky/`, `.vscode/`, `.bmad-core/`, `.opencode/` y configuración de editor o automatización (`.editorconfig`, `.gitignore`, `.markdownlint.json`).
- `_bmad/` para la instalación de BMAD Method.
- `reference/` para el corpus documental y arquitectónico.
- `docs/` para los artefactos de planificación e implementación de BMAD.

No se mantienen directorios `src/` de aplicación en este repositorio; la implementación ejecutable vive en los repositorios de producto de Unimar, no aquí.
