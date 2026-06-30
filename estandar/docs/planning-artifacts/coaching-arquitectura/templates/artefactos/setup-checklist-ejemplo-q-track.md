# Ejemplo Q-Track — Checklist de Instalación de Herramientas

> **Módulo:** [Módulo Base (Bootcamp)](../../artefactos/modulo-base.md) · **Tipo:** Lista de Verificación de Instalación

Ejemplo completamente diligenciado del Checklist de Instalación para el **Módulo Base**.

---

# Checklist de Instalación — Jorge Salas

**Fecha:** 2025-01-31   **Sistema Operativo:** Windows 11 Pro

---

## 1. Editor de Código

| Herramienta | Versión Requerida | Versión Instalada | Estado |
| :--- | :--- | :--- | :--- |
| **Visual Studio Code** | ≥ 1.85 | 1.86.2 | ☑ Instalado |
| **Extensión GitLens** | Latest | 14.6.1 | ☑ Instalada |
| **Extensión OpenCode** | Latest | 0.3.5 | ☑ Instalada |
| **Extensión ESLint** | Latest | 2.4.6 | ☑ Instalada |
| **Extensión Prettier** | Latest | 12.2.0 | ☑ Instalada |

---

## 2. Herramientas de Sistema

| Herramienta | Versión Requerida | Versión Instalada | Estado |
| :--- | :--- | :--- | :--- |
| **Git** | ≥ 2.40 | 2.43.0.windows.1 | ☑ Instalado |
| **Node.js** | ≥ 20.x | v20.11.0 | ☑ Instalado |
| **npm** | ≥ 9.x | 10.2.4 | ☑ Instalado |
| **Docker Desktop** | ≥ 4.20 | 4.27.1 (136695) | ☑ Instalado |

---

## 3. Configuración de Git

| Configuración | Valor Requerido | Valor Configurado | Estado |
| :--- | :--- | :--- | :--- |
| **user.name** | Jorge Salas | Jorge Salas | ☑ Configurado |
| **user.email** | jorge.salas@unimar.com.pe | jorge.salas@unimar.com.pe | ☑ Configurado |
| **credential.helper** | manager | manager | ☑ Configurado |

**Comando de verificación:**
```bash
git config --global user.name
# Resultado: Jorge Salas

git config --global user.email
# Resultado: jorge.salas@unimar.com.pe
```

---

## 4. Acceso a Repositorios

| Repositorio | Acceso Requerido | Estado |
| :--- | :--- | :--- |
| **unimar_arch** | Lectura y escritura | ☑ Verificado |
| **q-track (proyecto)** | Lectura y escritura | ☑ Verificado |

**Verificación:**
- [x] Cloné `unimar_arch` exitosamente: `git clone https://github.com/mhernandez-unimar/unimar_arch.git`
- [x] Creé rama feature: `git checkout -b setup-q-track-env`
- [x] Hice commit y push sin errores

---

## 5. Verificación de Instalación

Ejecuta los siguientes comandos y captura el resultado:

```bash
# 1. Verificar Git
git --version
# Resultado: git version 2.43.0.windows.1

# 2. Verificar Node.js
node --version
# Resultado: v20.11.0

# 3. Verificar npm
npm --version
# Resultado: 10.2.4

# 4. Verificar Docker
docker --version
# Resultado: Docker version 25.0.2, build 29cf629

# 5. Verificar VS Code
code --version
# Resultado: 1.86.2
```

---

## 6. Evidencias

Adjunta capturas de pantalla de:

- [x] VS Code abierto con las extensiones instaladas (pestaña de extensiones) → `evidencias/vscode-extensiones.png`
- [x] Terminal mostrando versiones de Git, Node.js, npm y Docker → `evidencias/terminal-versiones.png`
- [x] GitHub Desktop o git config mostrando usuario configurado → `evidencias/git-config.png`
- [x] Acceso a repositorio unimar_arch verificado → `evidencias/repositorio-acceso.png`

---

## 7. Criterios de Aceptación del Módulo Base

- [x] Todas las herramientas instaladas con versiones requeridas
- [x] Git configurado con user.name y user.email corporativos
- [x] Extensiones de VS Code instaladas y activas
- [x] Acceso a repositorios verificado
- [x] Evidencias adjuntas en el PR
- [x] Pull Request: `setup-q-track-env` → `develop`, estado: **Merged** (PR #123)

---

## 8. Notas de Instalación

**Problemas encontrados y soluciones:**

1. **Docker Desktop no iniciaba en Windows:** Requería habilitar virtualización en BIOS. Solución: Reiniciar y activar Hyper-V.
2. **Extensión OpenCode no aparecía en marketplace:** Instalar manualmente desde VSIX proporcionado por el equipo de Arquitectura.

---

*Ejemplo Q-Track generado bajo el estándar del corpus arquitectónico de UNIMAR · Idioma: Español · Versión: 1.0*
