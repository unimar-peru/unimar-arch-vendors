# Plantilla Vacía — Checklist de Instalación de Herramientas

> **Módulo:** [Módulo Base (Bootcamp)](../../artefactos/modulo-base.md) · **Tipo:** Lista de Verificación de Instalación

Copia esta plantilla, completa cada herramienta instalada y commitéala al finalizar el Módulo Base.

---

# Checklist de Instalación — [Tu Nombre]

**Fecha:** ___________   **Sistema Operativo:** [Windows / macOS / Linux]

---

## 1. Editor de Código

| Herramienta | Versión Requerida | Versión Instalada | Estado |
| :--- | :--- | :--- | :--- |
| **Visual Studio Code** | ≥ 1.85 | | ☐ Instalado ☐ Pendiente |
| **Extensión GitLens** | Latest | | ☐ Instalada ☐ Pendiente |
| **Extensión OpenCode** | Latest | | ☐ Instalada ☐ Pendiente |
| **Extensión ESLint** | Latest | | ☐ Instalada ☐ Pendiente |
| **Extensión Prettier** | Latest | | ☐ Instalada ☐ Pendiente |

---

## 2. Herramientas de Sistema

| Herramienta | Versión Requerida | Versión Instalada | Estado |
| :--- | :--- | :--- | :--- |
| **Git** | ≥ 2.40 | | ☐ Instalado ☐ Pendiente |
| **Node.js** | ≥ 20.x | | ☐ Instalado ☐ Pendiente |
| **npm** | ≥ 9.x | | ☐ Instalado ☐ Pendiente |
| **Docker Desktop** | ≥ 4.20 | | ☐ Instalado ☐ Pendiente |

---

## 3. Configuración de Git

| Configuración | Valor Requerido | Valor Configurado | Estado |
| :--- | :--- | :--- | :--- |
| **user.name** | [Tu nombre completo] | | ☐ Configurado ☐ Pendiente |
| **user.email** | [Tu email corporativo] | | ☐ Configurado ☐ Pendiente |
| **credential.helper** | manager / osxkeychain / libsecret | | ☐ Configurado ☐ Pendiente |

---

## 4. Acceso a Repositorios

| Repositorio | Acceso Requerido | Estado |
| :--- | :--- | :--- |
| **unimar_arch** | Lectura y escritura | ☐ Verificado ☐ Pendiente |
| **q-track (proyecto)** | Lectura y escritura | ☐ Verificado ☐ Pendiente |

---

## 5. Verificación de Instalación

Ejecuta los siguientes comandos y captura el resultado:

```bash
# 1. Verificar Git
git --version
# Resultado: _______________

# 2. Verificar Node.js
node --version
# Resultado: _______________

# 3. Verificar npm
npm --version
# Resultado: _______________

# 4. Verificar Docker
docker --version
# Resultado: _______________

# 5. Verificar VS Code
code --version
# Resultado: _______________
```

---

## 6. Evidencias

Adjunta capturas de pantalla de:

- [ ] VS Code abierto con las extensiones instaladas (pestaña de extensiones)
- [ ] Terminal mostrando versiones de Git, Node.js, npm y Docker
- [ ] GitHub Desktop o git config mostrando usuario configurado
- [ ] Acceso a repositorio unimar_arch verificado

---

## 7. Criterios de Aceptación del Módulo Base

- [ ] Todas las herramientas instaladas con versiones requeridas
- [ ] Git configurado con user.name y user.email corporativos
- [ ] Extensiones de VS Code instaladas y activas
- [ ] Acceso a repositorios verificado
- [ ] Evidencias adjuntas en el PR
- [ ] Pull Request: `setup-q-track-env` → `develop`, estado: Merged

---

*Plantilla generada bajo el estándar del corpus arquitectónico de UNIMAR · Idioma: Español · Versión: 1.0*
