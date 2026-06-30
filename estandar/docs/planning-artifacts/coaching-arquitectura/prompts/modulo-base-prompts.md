# Prompt Library — Módulo Base (Bootcamp)

> **Módulo:** Módulo Base · **Tipo:** Biblioteca de Prompts para IA  
> **Herramientas:** OpenCode, BMAD Method v6.8.0

---

## Propósito

Este documento contiene los prompts exactos para ejecutar cada actividad del Módulo Base con asistencia de IA. Copia y pega cada prompt en OpenCode o tu asistente de IA preferido.

---

## Agenda con Prompts

| Bloque | Actividad | Duración | Prompt |
| :--- | :--- | :--- | :--- |
| 1 | Apertura: "El costo del caos sin estándar" | 10 min | [Prompt 1: Generar casos de caos técnico](#prompt-1-casos-de-caos-técnico) |
| 2 | Marco teórico GitFlow | 20 min | [Prompt 2: Explicar GitFlow](#prompt-2-explicar-gitflow) |
| 3 | Introducción a OpenCode y BMAD | 25 min | [Prompt 3: Demo BMAD](#prompt-3-demo-bmad) |
| 5 | Instalación guiada de herramientas | 30 min | [Prompt 4: Checklist de instalación](#prompt-4-checklist-de-instalación) |
| 7 | Generar README.md de rama | 20 min | [Prompt 5: Generar README](#prompt-5-generar-readme) |
| 9 | Completar Checklist de Configuración | 45 min | [Prompt 6: Verificar configuración](#prompt-6-verificar-configuración) |

---

## Prompt 1: Casos de Caos Técnico

**Propósito:** Generar ejemplos reales de problemas causados por falta de estándares.

**Cuándo usar:** Bloque 1 (Apertura) — 10 min

**Prompt:**

```
Actúa como un Tech Lead con 10 años de experiencia en empresas de logística y e-commerce.

Genera 3 casos reales de "caos técnico" causados por falta de estándares de ingeniería. Cada caso debe incluir:

1. **Contexto:** ¿Qué estaba construyendo el equipo?
2. **Problema:** ¿Qué estándar faltó? (ej: no había tests, no había code review, no había ADRs)
3. **Consecuencia:** ¿Qué pasó en producción? (ej: rollback, multa de cliente, incidente de seguridad)
4. **Costo:** ¿Cuánto tiempo/dinero costó resolver?
5. **Lección:** ¿Qué estándar hubiera prevenido esto?

Formato de salida: Tabla con columnas [Contexto, Problema, Consecuencia, Costo, Lección]

Audiencia: Gerentes y desarrolladores que no ven el valor de los estándares.
Tono: Profesional pero impactante, con datos cuantitativos cuando sea posible.
```

**Salida esperada:** Tabla con 3 casos concretos y medibles.

---

## Prompt 2: Explicar GitFlow

**Propósito:** Generar explicación clara de GitFlow con ejemplos del repositorio unimar_arch.

**Cuándo usar:** Bloque 2 (Marco teórico) — 20 min

**Prompt:**

```
Actúa como un experto en control de versiones Git con experiencia enseñando a equipos corporativos.

Explica GitFlow de manera visual y práctica para un equipo que nunca lo ha usado. Incluye:

1. **Diagrama Mermaid** de las ramas principales (main, develop, feature, release, hotfix)
2. **Flujo típico:** Desde crear feature hasta merge a main
3. **Ejemplo concreto:** Usa el repositorio unimar_arch como ejemplo
   - ¿Cómo se crea una feature para agregar un nuevo ADR?
   - ¿Cómo se prepara un release de documentación?
   - ¿Cómo se hace un hotfix si hay un error en un enlace?
4. **Reglas de oro:** 5 reglas que nunca deben romperse
5. **Errores comunes:** 3 errores que los principiantes cometen y cómo evitarlos

Formato de salida:
- Diagrama Mermaid
- Lista numerada de pasos
- Tabla de errores comunes con solución

Audiencia: Desarrolladores y analistas de negocio que usan Git por primera vez.
Tono: Didáctico, con analogías cotidianas.
```

**Salida esperada:** Diagrama + guía paso a paso + tabla de errores.

---

## Prompt 3: Demo BMAD

**Propósito:** Demostrar cómo BMAD/OpenCode acelera la creación de documentación.

**Cuándo usar:** Bloque 3 (Introducción a OpenCode y BMAD) — 25 min

**Prompt:**

```
Actúa como un facilitador certificado en BMAD Method v6.8.0.

Demuestra en vivo cómo usar BMAD/OpenCode para crear un README.md profesional. Sigue estos pasos:

1. **Contexto:** "Vamos a crear el README para una nueva feature de Q-Track"
2. **Prompt inicial:** Muestra el prompt exacto que usarías
3. **Iteración 1:** Muestra la salida inicial de la IA
4. **Refinamiento:** Muestra cómo pedir mejoras (ej: "agrega ejemplos", "hazlo más corto")
5. **Resultado final:** Muestra el README terminado
6. **Lecciones:** 3 tips para trabajar efectivamente con IA

Formato de salida:
- Transcripción paso a paso de la interacción
- Capturas de pantalla simuladas (bloques de código con prompts y respuestas)
- Lista de tips finales

Audiencia: Equipos que nunca han usado IA para programación.
Tono: Entusiasta pero realista, mostrando tanto beneficios como limitaciones.
```

**Salida esperada:** Demo interactiva con prompts y resultados visibles.

---

## Prompt 4: Checklist de Instalación

**Propósito:** Generar checklist personalizada de herramientas para el Módulo Base.

**Cuándo usar:** Bloque 5 (Instalación guiada) — 30 min

**Prompt:**

```
Actúa como un ingeniero de DevOps con experiencia configurando entornos de desarrollo corporativos.

Genera una checklist de instalación de herramientas para el Módulo Base de UNIMAR. Incluye:

1. **Herramientas requeridas:**
   - Visual Studio Code
   - Git
   - Node.js v20+
   - Docker Desktop
   - Extensión OpenCode en VS Code
   - Extensiones: GitLens, ESLint, Prettier

2. **Para cada herramienta:**
   - Enlace de descarga oficial
   - Versión mínima requerida
   - Comando de verificación (ej: `git --version`)
   - Configuración específica (ej: Git user.name y user.email)

3. **Tabla de verificación:**
   | Herramienta | Versión Instalada | Verificado | Notas |
   | :--- | :--- | :--- | :--- |
   | VS Code | | ☐ | |
   | Git | | ☐ | |
   | ... | | ☐ | |

4. **Solución de problemas:**
   - 3 errores comunes en Windows
   - 3 errores comunes en macOS
   - 3 errores comunes en Linux
   - Solución para cada uno

Formato de salida: Checklist imprimible + tabla + troubleshooting.
Audiencia: Participantes del Módulo Base con diversos niveles técnicos.
Tono: Claro, paso a paso, sin asumir conocimiento previo.
```

**Salida esperada:** Checklist completa con troubleshooting.

---

## Prompt 5: Generar README

**Propósito:** Crear README.md para la rama feature del participante.

**Cuándo usar:** Bloque 7 (Generar README de rama) — 20 min

**Prompt:**

```
Actúa como un technical writer experto en documentación de repositorios Git.

Genera un README.md para la rama `feature/setup-q-track-env-[nombre]` del repositorio unimar_arch.

El README debe incluir:

1. **Título:** "Configuración de Entorno - [Nombre del Participante]"
2. **Propósito:** ¿Por qué existe esta rama?
3. **Checklist completada:** Tabla con herramientas instaladas y verificadas
4. **Evidencias:** Lista de capturas de pantalla adjuntas
5. **Comandos ejecutados:** Historial de comandos Git usados
6. **Aprendizajes:** 3 cosas que aprendí en este módulo
7. **Próximos pasos:** ¿Qué sigue en el Módulo 1?

Formato: Markdown con badges, tablas y secciones claras.
Tono: Profesional pero personal (primera persona).
Longitud: 1-2 páginas máximo.

Incluye placeholders claros para que el participante complete con su información específica.
```

**Salida esperada:** README.md listo para commitear con placeholders.

---

## Prompt 6: Verificar Configuración

**Propósito:** Validar que todas las herramientas estén correctamente configuradas.

**Cuándo usar:** Bloque 9 (Completar Checklist) — 45 min

**Prompt:**

```
Actúa como un ingeniero de QA automatizando validación de entornos de desarrollo.

Genera un script de validación (o checklist manual si no es posible automatizar) para verificar que el entorno del Módulo Base está correctamente configurado.

Incluye validaciones para:

1. **Git:**
   - `git --version` retorna versión ≥ 2.40
   - `git config user.name` está configurado
   - `git config user.email` está configurado con correo corporativo

2. **Node.js:**
   - `node --version` retorna v20+
   - `npm --version` retorna 9+

3. **VS Code:**
   - Extensiones instaladas: OpenCode, GitLens, ESLint, Prettier
   - Comandos disponibles en palette (Ctrl+Shift+P)

4. **Docker:**
   - `docker --version` retorna versión ≥ 4.20
   - `docker ps` ejecuta sin errores

5. **Acceso a repositorios:**
   - `git clone` del repositorio unimar_arch funciona
   - `git checkout -b` crea rama feature sin errores
   - `git push` sube cambios sin errores de autenticación

Formato de salida:
- Script bash/PowerShell si es automatizable
- Checklist manual con comandos exactos si no es automatizable
- Mensajes de error esperados y cómo resolverlos

Audiencia: Participantes con diversos niveles de experiencia técnica.
Tono: Instruccional, con validación paso a paso.
```

**Salida esperada:** Script o checklist con comandos de validación.

---

## Cómo Usar Esta Prompt Library

1. **Antes de la sesión:** El facilitador revisa los prompts y los prueba en su entorno
2. **Durante la sesión:** Los participantes copian prompts en OpenCode/IA
3. **Después de la sesión:** Los prompts quedan disponibles como referencia para futuros módulos

### Mejores Prácticas

- ✅ **Personaliza:** Ajusta los prompts con nombres específicos de tu proyecto
- ✅ **Itera:** Si la salida no es la esperada, refina el prompt (ej: "hazlo más corto", "agrega ejemplos")
- ✅ **Guarda:** Los prompts que funcionen bien, guárdalos en tu propia biblioteca
- ✅ **Comparte:** Si mejoras un prompt, compártelo con el equipo

---

*Prompt Library del Módulo Base · Corpus arquitectónico UNIMAR · Versión: 1.0*
