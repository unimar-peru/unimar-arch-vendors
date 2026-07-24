# Mejores Prácticas de Documentación SDLC

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Mejores%20Pr%C3%A1cticas%20de%20Documentac%E2%80%A6-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Activo-27ae60?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-1.0.0-042139?style=flat-square" alt="Versión">
</p>

> **Fase SDLC:** Transversal
> **Padre:** [Documentación SDLC](../README.md)
> **Audiencia:** Redactores de artefactos, mantenedores del repositorio, agentes AI

## Propósito

Este documento establece las convenciones transversales que toda la documentación del SDLC debe respetar. Su objetivo es asegurar que la documentación sea:

- **Encontrable** (estructura estable, identificadores consistentes).
- **Legible** (lenguaje claro, sin ruido técnico irrelevante).
- **Trazable** (cada artefacto declara su origen, su destino y su padre).
- **Duradera** (codificación, convenciones de archivo y formato que resisten el paso del tiempo).

## 1. Convenciones de Codificación y Formato

- **UTF-8 sin BOM:** toda la documentación se almacena en UTF-8 sin marca de orden de bytes (Rule R-03 del repositorio).
- **Saltos de línea LF:** se prohíben las terminaciones CRLF. El validador fallará en caso contrario.
- **Sin caracteres de reemplazo:** la salida debe estar libre de mojibake, caracteres de reemplazo U+FFFD y emojis decorativos.
- **Indentación Markdown:** 2 espacios en listas anidadas; 1 espacio antes y después de separadores de tabla (`| --- |`).
- **Listas no ordenadas:** se utiliza el carácter `*` (asterisco), no `-` (guion), por convención del repositorio (Rule R-04 de lint).

## 2. Nomenclatura de Archivos

- **Plantillas:** `<artefacto>-template.es.md` para la página de aterrizaje; `<artefacto>-template-source.es.md` para el archivo fuente reutilizable.
- **Ejemplos:** `<artefacto>-example-<producto>.es.md` para versiones renderizadas.
- **Estándares:** `<nombre-del-estandar>.es.md` sin el sufijo `-template`.
- **Sin espacios ni acentos** en nombres de archivo. Los acentos se reemplazan por su equivalente ASCII; las letras con tildes conservan el carácter original si el sistema de archivos lo soporta.
- **Idioma único:** todos los archivos se crean en español con sufijo `.es.md`. El repositorio Unimar Arch no genera archivos `.en.md` paralelos (regla de idioma único).

## 3. Identificadores de Artefacto

- **PRD:** `PRD-<Producto>-<NNN>`.
- **Historia Funcional:** `FS-<Producto>-<NNN>`.
- **Historia Técnica:** `TS-<Producto>-<NNN>`.
- **ADR:** `ADR-<NNN>-<slug-descriptivo>` (sin prefijo de producto, porque los ADRs son del repositorio raíz).
- **Reporte Resumen de Pruebas:** `TSR-<Producto>-<NNN>`.
- **Release Notes:** `RN-<Producto>-<Versión>`.
- **Hotfix:** `HF-<Producto>-<NNN>`.

Los identificadores se preservan aunque el archivo se mueva de carpeta.

## 4. Encabezados y Metadatos

Cada artefacto debe iniciar con un bloque de metadatos en el siguiente orden:

```markdown
# <Título del Artefacto>

> **Fase SDLC:** <Nº> — <Nombre de la fase>
> **Puerta de salida:** <Compuerta que controla la promoción del artefacto>
> **Padre:** [Enlace al artefacto del que deriva]
> **Audiencia:** <Roles que consumen el artefacto>
```

## 5. Estructura Interna Canónica

| Sección | Obligatoriedad | Reglas |
| --- | --- | --- |
| **Propósito** | Obligatoria | Una sola idea principal. Sin ambigüedad. |
| **Elige tu Vista** | Obligatoria en plantillas con fuente y ejemplo | Tabla con dos o tres filas. |
| **Reglas de Autoría** | Obligatoria | Lista con `*`. |
| **Documentos Relacionados** | Obligatoria | Tabla. |
| **Anexo / Versión** | Opcional | Solo si la trazabilidad histórica lo justifica. |

## 6. Reglas de Cross-Linking

- Todo enlace a otro artefacto del SDLC debe ser **relativo** a la raíz del repositorio.
- Todo enlace a un ADR debe resolverse al `README.md` del directorio de ADRs correspondiente, no al archivo individual, a menos que la referencia sea al ADR específico.
- Todos los enlaces deben ser relativos al repositorio local. El repositorio Unimar Arch es autosuficiente.
- Verificar cada enlace con `node .harness/scripts/validate-docs.mjs` antes de commitear.

## 7. Lenguaje y Estilo

- **Imperativo en títulos de sección** ("Reglas de Autoría", no "Reglas Para La Autoría").
- **Voz activa en criterios de aceptación** ("El sistema rechaza la solicitud", no "La solicitud debe ser rechazada por el sistema").
- **Términos del glosario corporativo** en su forma exacta; no introducir sinónimos locales.
- **Prohibido el lenguaje condescendiente, sexista o discriminatorio.**
- **Sin párrafos de una sola línea** separados del resto. Cada bloque debe tener al menos dos oraciones.

## 8. Validación Automática

Antes de cada commit, ejecutar:

```bash
node .harness/scripts/validate-docs.mjs
npx -y markdownlint-cli2
```

El hook de pre-commit rechaza el commit si:

- Algún enlace interno no resuelve.
- Algún bloque Mermaid usa identificadores no estables o sintaxis no soportada.
- Algún archivo `.md` contiene CRLF, BOM, U+FFFD, mojibake o emoji decorativo.
- Algún archivo `.md` contiene terminaciones `- [ ]` o `-` como marcador de lista en lugar de `*`.

## 9. Versionado y Trazabilidad de Cambios

- Cada modificación a un artefacto requiere una entrada en el changelog del repositorio (no en el archivo).
- Las promociones entre fases se documentan en el campo `Puerta de salida` del bloque de metadatos, mediante una entrada con timestamp y responsable.
- Los archivos en estado *Borrador* deben declararlo en el bloque de metadatos: `> **Estado:** Borrador`.

## 10. Documentos Relacionados

| Documento | Propósito |
|---|---|
| [Estándar de Redacción de Historias Funcionales](./estandar-redaccion-historias-funcionales.es.md) | Reglas específicas del artefacto de Historia Funcional. |
| [Mapeo SDLC–Artefactos](../mapeo-artefactos-sdlc.es.md) | Define cuándo cada artefacto es requerido. |
| [Quality Gates SDLC](../gates-calidad.es.md) | Compuertas de promoción entre fases. |
| [Marco de Trabajo SDLC](../02-ingenieria/framework-sdlc-enfoque-construccion.es.md) | Visión general del SDLC. |

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-06-05
</p>
