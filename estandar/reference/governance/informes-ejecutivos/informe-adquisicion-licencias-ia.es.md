# INFORME ESTRATÉGICO PARA DECISIÓN EJECUTIVA
## Adquisición de Licencias de IA y Herramientas
**UNIMAR | JUNIO 2026**

| Control | Detalle |
| :------ | :------ |
| **Versión** | 1.0 |
| **Fecha** | 18/06/2026 |
| **Autores** | Alberto Arroyo, Cristhian Jara |
| **Aprobador** | Carlos Villanueva |
| **Estado** | Aprobado |

> **Descargar:** `Versión PDF` · [`Versión HTML`](./informe-adquisicion-licencias-ia.html)

---

## HOJA 0 — SÍNTESIS EJECUTIVA PARA DECISIÓN INMEDIATA

| Dimensión | Síntesis para la Dirección |
| :-------- | :------------------------- |
| **Problema** | 20 personas sin herramientas IA. El código se produce lento, sin control de calidad y sin seguir los estándares arquitectónicos de UNIMAR. |
| **Decisión** | **Aprobar USD 1,055/mes** para IA + Docker Desktop + GitHub Packages. El equipo completo tiene Claude (razonamiento + diseño con Claude Design Plugin), OpenCode (ejecución BMAD + diseño visual con Open Design). Los líderes además tienen Copilot (autocompletado) y Docker Desktop (contenedores locales). La publicación de imágenes Docker, paquetes NuGet y npm está incluida sin costo adicional en GitHub Team. Inversión única adicional de **~USD 30,000 en hardware** (equipos con 32 GB RAM y 512 GB SSD). |
| **Alternativas** | **Base (sin Copilot):** USD 960/mes. Ahorra USD 95/mes pero los líderes pierden autocompletado. Solo como transición. Sin Docker Desktop: usar WSL2 + Docker Engine (gratuito). Open Design: open source, USD 0, alternativo a herramientas de diseño comerciales. |
| **Próximo paso** | Arrancar Fase 1 con el Escenario Base por 3 meses. En Fase 2 activar Copilot para los 5 líderes. Adquirir hardware nuevo para quienes tengan **menos de 32 GB RAM**. |

> **Veredicto:** USD 1,055/mes.

---

## 1. MODELOS Y OPCIONES DE IA DISPONIBLES

### Tabla 1: Comparativa de Herramientas de IA

| Herramienta | Modelo / Plan | Costo por Usuario/Mes | Pros | Contras |
| :--- | :--- | :--- | :--- | :--- |
| **Claude** | Pro (Uso general) | ~USD 20 | • Excelente razonamiento lógico y matemático.<br>• Ideal para revisión de estándares de arquitectura.<br>• Gran capacidad de contexto (200K tokens). | • Costo elevado en los tiers superiores.<br>• No tiene integración nativa en VS Code tan profunda como Copilot. |
| **Claude** | Arquitecto / Analista | USD 200 | • Máxima capacidad de razonamiento complejo.<br>• Perfecto para generar especificaciones (SDD) y validar flujos BMAD.<br>• Agente autónomo para tareas críticas. | • Precio prohibitivo para asignar a todo el equipo.<br>• Requiere curva de aprendizaje para sacarle todo el provecho. |
| **OpenCode** | Gratuito (Freemium) | USD 0 | • Sin costo inicial.<br>• Acceso a modelos open-source de última generación.<br>• Suficiente para tareas de programación diarias. | • Límites de uso estrictos (ej. 200 peticiones/5h).<br>• Calidad y velocidad variables según la demanda del servidor. |
| **OpenCode** | Go (Suscripción) | USD 10 | • **Excelente relación costo-beneficio**.<br>• Acceso garantizado a modelos premium open-source (GLM-5.2, DeepSeek V4).<br>• Precio fijo y predecible. | • No incluye los modelos más grandes (disponibles en Black).<br>• Ligera sobrecarga de gestión de suscripciones individuales. |
| **OpenCode** | Black / Zen | USD 100 / 200 (plano) o Pago por uso | • Acceso a modelos de máxima capacidad.<br>• Flexibilidad de pago según consumo real (Zen). | • Costo fijo alto (Black) o impredecible (Zen).<br>• Sobredimensionado para el 80% del equipo. |
| **GitHub Copilot** | Business (Recomendado) | USD 19 | • **Integración nativa con VS Code** y GitHub.<br>• Autocompletado inteligente en tiempo real.<br>• Excelente para código boilerplate y pruebas unitarias.<br>• Seguridad empresarial y políticas de filtrado. | • Precio adicional a las otras herramientas.<br>• No es tan bueno como Claude para razonamiento arquitectónico profundo.<br>• Requiere plan Business para gestión centralizada. |
| **GitHub Copilot** | Pro (Individual) | USD 10 | • Más económico que Business. | • Gestión descentralizada (cada uno paga por su cuenta).<br>• Menos controles de seguridad y políticas de repositorio. |
| **Docker Desktop** | Team | USD 10 | • Entornos contenedorizados idénticos a producción.<br>• Ejecución local de Minio, SQL Server, Redis, RabbitMQ.<br>• Integración con WSL2 en Windows. | • **No es una herramienta IA**, pero es requisito para desarrollo local.<br>• Se puede suplir con Docker Engine + WSL2 (gratuito) sin interfaz gráfica. |
| **GitHub Packages** | Incluido en GitHub Team | USD 0 | • Publicación de imágenes Docker (GHCR), paquetes NuGet y npm.<br>• 2 GB de almacenamiento incluido.<br>• Misma cuenta y credenciales que GitHub. | • Límite de 2 GB; después USD 0.25/GB/mes.<br>• Sin SLA enterprise (incluido en GitHub Team). |
| **Claude Design** | Plugin incluido en Claude Pro y $200 | USD 0 | • Auditorías de accesibilidad WCAG.<br>• Síntesis de investigación de UX.<br>• Critica de diseño y UX writing.<br>• Incluido sin costo adicional con Claude. | • Requiere Claude (ya contratado).<br>• No genera diseños visuales desde cero (solo critica y texto). |
| **Open Design** | Open source (Apache-2.0) | USD 0 | • Alternativa open source a Claude Design.<br>• 217 skills de diseño + 149 design systems.<br>• Corre en local con el CLI que ya tenemos (OpenCode, Claude Code).<br>• Sin bloqueo de proveedor (BYOK). | • Open source reciente (requiere setup inicial).<br>• Calidad de render inferior a herramientas comerciales.<br>• La generación depende del modelo LLM que se conecte (coste de API aparte). |

---

## 2. ANÁLISIS Y RECOMENDACIÓN ESTRATÉGICA

Basado en el contexto del equipo (20 personas, estándar `unimar_arch`, uso de BMAD para automatización spec-driven, y presupuesto ajustado), **la herramienta más recomendada como núcleo estratégico es CLAUDE (Tier Arquitecto/Analista)**.

**Justificación de la elección:**
El éxito del enfoque **Spec-Driven con BMAD** depende críticamente de la precisión en la interpretación de requisitos y la generación de especificaciones técnicas complejas. Claude (especialmente el tier de USD 200) supera a las demás herramientas en razonamiento profundo, manejo de contexto largo y seguimiento de estándares de software. Si bien es costoso, basta con **2 licencias** (Arquitecto y Analista Principal) para orquestar a los agentes de IA que luego generarán el código base, el cual será validado por el resto del equipo con herramientas más económicas.

---

## 3. PLAN DE ADOPCIÓN Y ESCENARIOS DE COSTOS

Para equilibrar presupuesto y rendimiento, se propone un modelo **híbrido y progresivo**.

### Tabla 2: Escenarios de Suscripción (20 Personas)

| Rol / Herramienta | **Recomendado (Híbrido + Copilot)** | Escenario Base (Mínimo) | Escenario Full (Máxima Productividad) |
| :--- | :--- | :--- | :--- |
| **Claude USD 200** (2: Arquitecto, Analista Ppal) | USD 400 | USD 400 | USD 400 |
| **Claude Pro USD 20** (18 restantes) | USD 360 | USD 360 | USD 360 |
| **OpenCode Go USD 10** (5 Líderes) | USD 50 | USD 50 | USD 200 (para 20) |
| **OpenCode Gratuito** (15 Devs/QA) | USD 0 | USD 0 | USD 0 |
| **Copilot Business USD 19** | +USD 95 (5 líderes) | USD 0 | +USD 380 (20 líderes) |
| **Docker Desktop Team USD 10** (15 usuarios técnicos) | +USD 150 | +USD 150 | +USD 150 |
| **GitHub Packages** (incluido en GitHub Team) | USD 0 | USD 0 | USD 0 |
| **Costo Total Mensual** | **USD 1,055** | **USD 960** | **USD 1,490** |

---

## 4. PLAN DE ARRANQUE, RIESGOS Y PUNTOS DE CONTROL DE COSTOS

### 4.1 Cómo empezamos (mes a mes)

| Mes | Acción | Inversión |
| :-- | :----- | :-------- |
| **Mes 1** | Adquirir GitHub Team + contratar Claude (2×$200 + 18×$20). Instalar OpenCode Go en 5 líderes. Activar Docker Desktop para 15 usuarios. Capacitar al Arquitecto y Analista en BMAD. | USD 960 |
| **Mes 2** | Configurar GitHub Packages (npm, NuGet, GHCR). Publicar primeras bibliotecas internas. Equipo completo usando Claude Pro + OpenCode Gratuito. | USD 960 |
| **Mes 3** | Evaluar si OpenCode Gratuito se satura para los 15 devs/QA. Medir cuántas peticiones usan. Decidir si activar Copilot en mes 4. | USD 960 |
| **Mes 4** | Activar **Copilot Business para 5 líderes** (+USD 95). Iniciar publicación de imágenes Docker vía GHCR. | USD 1,055 |
| **Mes 5** | Evaluar si los 15 devs/QA necesitan Copilot. Si la productividad es baja, presupuestar extensión en Fase 3. | USD 1,055 |
| **Mes 6+** | Estabilización. Monitorear almacenamiento de GitHub Packages. Evaluar si Docker Desktop se justifica o migrar a WSL2 + Docker Engine. | USD 1,055 |

### 4.2 Riesgos y cómo mitigarlos

| Riesgo | Impacto | Probabilidad | Mitigación |
| :----- | :------ | :----------- | :--------- |
| **OpenCode Gratuito se satura** (200 peticiones/5h) | 15 devs/QA sin asistencia IA en horas pico | Alta (en semanas de entrega) | Activar Copilot para los 5 líderes (ya planificado en Fase 2). Si la saturación es general, extender Copilot a todos (+USD 285/mes). |
| **El equipo no adopta las herramientas** | Inversión desperdiciada, código sigue sin control | Media | Capacitación desde el mes 1. El Arquitecto y Analista son los primeros en adoptar y arrastran al resto. Métrica: % de PRs generados con OpenCode. |
| **Claude sube sus precios** (histórico: Anthropic ajusta cada 12-18 meses) | Aumento del 10-30% en USD 760/mes de licencias | Media-Alta | Contrato anual (congela precio 12 meses). Tener identificada alternativa: migrar los 18 Claude Pro a OpenCode Go (USD 180 vs USD 360, ahorro del 50%). |
| **GitHub Copilot sube de precio** | Aumento en USD 95/mes | Media | El autocompletado es prescindible (se pierde velocidad, no capacidad). Se puede desactivar sin afectar Claude ni OpenCode. |
| **Docker Desktop cambia su licencia** (como ya hizo en 2021) | Costo mayor a USD 150/mes o restricciones de uso | Baja | Migrar a WSL2 + Docker Engine (USD 0). Documentado en sección 7.4. |
| **Los add-ons de seguridad (SCM) aumentan** | Impacto en USD 490/mes de Secret + Code Security | Baja | Los add-ons se activan por repositorio, no por usuario. Se pueden desactivar si el costo supera el beneficio. |
| **Hardware insuficiente** (equipos con 16 GB o menos) | Las herramientas IA + Docker + SQL Server se congelan | Alta (equipos actuales) | Inversión única de ~USD 30,000 ya presupuestada. Priorizar renovación de quienes tengan menos de 32 GB. |

### 4.3 Puntos de control de costos (qué monitorear)

| Punto de control | Frecuencia | ¿Qué revisar? | ¿Cuándo actuar? |
| :--------------- | :--------- | :------------ | :-------------- |
| **Uso de OpenCode Gratuito** | Semanal (mes 1-3) | ¿Los 15 devs/QA llegan al límite de 200 peticiones/5h? | Si más de 5 usuarios se saturan en la misma semana, adelantar Copilot a Fase 2. |
| **Almacenamiento GitHub Packages** | Mensual | ¿Cuántos GB consumen las imágenes Docker y paquetes NuGet/npm? | Si supera 1.5 GB, planificar limpieza de versiones antiguas. Límite real: 2 GB. |
| **Adopción de Claude Pro** | Mensual (mes 1-3) | ¿Cada usuario está usando su licencia? Consultar dashboard de Anthropic. | Si hay licencias inactivas por más de 30 días, reasignar. |
| **Costo mensual real vs. presupuestado** | Mensual | Sumar facturas de Claude + OpenCode + Copilot + Docker. Comparar con USD 1,055/mes. | Si la desviación supera el 10%, revisar qué rubro lo causa. |
| **Renovación de hardware** | Anual | ¿Qué equipos tienen menos de 32 GB RAM? | Programar renovación. Sin hardware adecuado, las licencias IA no rinden. |
| **Revisión de precios de proveedores** | Anual (cada junio) | Claude, GitHub, Docker: ¿cambiaron sus precios? ¿Siguen siendo la mejor opción? | Si algún proveedor subió más del 15%, evaluar alternativas documentadas en este informe. |

### 4.4 Árbol de decisión para escalar costos

```
¿OpenCode Gratuito se satura?
  ├── No → Mantener USD 0
  └── Sí → ¿Afecta a más de 5 usuarios?
       ├── No → Capacitar en uso eficiente (horarios, prompts)
       └── Sí → Activar Copilot para los afectados (+USD 19 c/u)

¿Docker Desktop es muy caro?
  ├── No → Mantener USD 150/mes
  └── Sí → Migrar a WSL2 + Docker Engine (USD 0)

¿Claude Pro es muy caro vs. OpenCode Go?
  ├── No → Mantener USD 360/mes
  └── Sí → Migrar 18 usuarios a OpenCode Go (USD 180/mes, ahorra USD 180)

¿GitHub Packages supera 2 GB?
  ├── No → USD 0
  └── Sí → Pagar USD 0.25/GB extra o limpiar versiones antiguas
```

---

## 5. VENTAJAS Y DESVENTAJAS DEL MODELO RECOMENDADO (HÍBRIDO + COPILOT + DOCKER: USD 1,055)

| Ventajas | Desventajas |
| :--- | :--- |
| • **Roles claros:** Claude specs + OpenCode flujos BMAD + Copilot autocompletado. Cada herramienta en lo que mejor hace.<br>• **Cobertura total:** Los 5 líderes tienen las 3 herramientas. Sin cuellos de botella por límites de OpenCode Gratuito.<br>• **Ahorro significativo:** El 75% del equipo usa herramientas gratuitas (OpenCode) o de bajo costo (Claude Pro USD 20).<br>• **Publicación incluida:** GitHub Packages (Docker, NuGet, npm) sin costo adicional con GitHub Team.<br>• **Alineación con BMAD:** OpenCode es el único ejecutor de flujos BMAD. Copilot no puede reemplazarlo. | • **USD 95/mes extra** vs. el Escenario Base.<br>• **Los 15 devs/QA no tienen Copilot** —su autocompletado es manual o con Copilot Free (2,000/mes).<br>• **Gestión descentralizada:** 3 herramientas distintas (Claude, OpenCode, Copilot) = más facturas que administrar.<br>• **Docker Desktop:** USD 150/mes adicional para 15 usuarios técnicos. |

---

## 6. HOJA DE RUTA DE IMPLEMENTACIÓN (EVOLUCIÓN PROGRESIVA)

| Fase | Mes | Acción | Costo |
| :--- | :--- | :--- | :--- |
| **Fase 1** | 1 - 3 | Implementar **Escenario Base (USD 960/mes)** como fase de arranque. Capacitar al Arquitecto y Analista en BMAD + Claude. Los 5 líderes reciben OpenCode Go + Claude Pro + Docker Desktop. Los 15 devs/QA usan OpenCode Gratuito + Claude Pro (+ Docker Desktop para quienes necesiten contenedores). | USD 960/mes |
| **Fase 2** | 4 - 6 | Activar **Copilot Business para los 5 líderes** (+USD 95). Pasar al **Escenario Híbrido + Copilot (USD 1,055/mes)**. Evaluar si los 15 devs/QA necesitan Copilot. Publicar primeras imágenes Docker y paquetes NuGet/npm en GitHub Packages. | USD 1,055/mes |
| **Fase 3** | 7 - 12 | Si los 15 devs/QA reportan baja velocidad por falta de autocompletado, extender Copilot a ellos (+USD 285 = USD 1,490/mes total). Evaluar migración de Docker Desktop a WSL2 + Docker Engine para ahorrar USD 150/mes. | USD 1,055 a 1,490/mes |
| **Fase 4** | >12 | Evaluar migración a OpenCode Black/Go para todos si el uso de BMAD escala. Incorporar Open Design como herramienta de diseño visual si el equipo lo adopta. | Según demanda |

---

## 7. REQUISITOS DE HARDWARE MÍNIMO Y RECOMENDADO PARA ESTACIONES DE TRABAJO

Las herramientas de IA por sí solas no son suficientes: el equipo necesita estaciones Windows capaces de ejecutar **múltiples entornos de desarrollo simultáneamente** (VS Code + Docker + Kubernetes local + SQL Server + Minio + Helm + herramientas de datos + navegador con decenas de pestañas).

| Recurso | Mínimo (navegable) | Recomendado (productivo) | Por qué |
| :------ | :----------------- | :----------------------- | :------ |
| **Procesador** | Intel i5 / AMD Ryzen 5 (12ª gen o superior) | Intel i7 / AMD Ryzen 7 (última gen) | VS Code + Docker + contenedores k8s + SQL Server + Minio compiten por núcleos. Con i5 el equipo se satura al levantar 3 pods locales. |
| **RAM** | 16 GB DDR4 | **32 GB DDR5** | 16 GB se agotan con: Windows 11 (~4 GB) + VS Code (~1.5 GB) + Docker (2-4 GB) + cluster k8s local (minikube/kind, ~1-2 GB adicionales) + SQL Server (~2 GB) + Minio (~1 GB) + navegador (~3 GB). Con 32 GB queda margen para Helm + herramientas de datos + pruebas locales. |
| **Almacenamiento** | 256 GB SSD NVMe | **512 GB SSD NVMe** | Windows + VS Code + SDKs + Docker images + imágenes k8s + Helm charts cacheados + SQL Server data files + Minio buckets locales consumen ~200 GB rápidamente. Con 256 GB se está limpiando discos cada 2 meses. |
| **Docker Desktop** | WSL 2 backend, 4 GB asignados | WSL 2 backend, 8 GB asignados | Minio + SQL Server en contenedor + Kubernetes local + servicios auxiliares (Redis, RabbitMQ) requieren al menos 6-8 GB asignados a WSL. |
| **SQL Server** | LocalDB o Express (10 GB BD) | Developer Edition (sin límite de BD) | LocalDB no soporta múltiples instancias ni conexiones simultáneas de herramientas externas (DBeaver, Azure Data Studio). |
| **Pantalla** | 1 monitor 22" 1080p | 2 monitores 24"+ 1080p o 1 monitor 27" 1440p | VS Code + manifiestos Helm + YAML de k8s + documentación + herramientas de datos + Claude web requieren espacio real de trabajo. Un solo monitor 22" forza cambios de ventana constantes. |
| **Red** | 100 Mbps | 300 Mbps o superior | Las herramientas de IA (Claude, OpenCode, Copilot) son servicios cloud. Descarga de imágenes Docker + Helm charts + sincronización Git + videollamadas técnicas. |

### Carga típica de una estación de desarrollo UNIMAR

```
Procesos simultáneos en un escenario normal:
  • Windows 11 + VS Code con Copilot activo  ~5.5 GB
  • Docker Desktop + 3 contenedores (Minio, SQL, Redis)  ~4.0 GB
  • Cluster k8s local (minikube/kind, 2-3 pods)  ~1.5 GB
  • SQL Server (servicio local)  ~2.0 GB
  • DBeaver o Azure Data Studio  ~1.0 GB
  • Navegador (15-20 pestañas, incluyendo Claude web)  ~3.0 GB
  • OpenCode CLI + terminal + Git  ~0.5 GB
  • Total estimado:  ~17.5 GB
```

Con 16 GB RAM el sistema entra en swap y el rendimiento colapsa. **32 GB no es lujo, es el mínimo para ser productivo** cuando se ejecutan herramientas de IA + contenedores + BD local.

### Estimación de inversión en hardware

| Perfil | Mínimo (16 GB, 256 GB) | Recomendado (32 GB, 512 GB, i7) |
| :----- | :--------------------- | :------------------------------ |
| Líder técnico / Arquitecto | ~USD 800-1,000 | ~USD 1,400-1,800 |
| Desarrollador / QA | ~USD 700-900 | ~USD 1,200-1,500 |
| **Inversión total (20 equipos)** | **~USD 16,000-20,000** | **~USD 26,000-34,000** |

> **Nota para la Dirección:** El hardware es una inversión de una sola vez (cada 3-4 años). Las licencias de IA son un gasto recurrente de USD 905/mes para todo el equipo. No tiene sentido contratar IA si las máquinas no pueden ejecutarla sin congelarse.

### Recomendación

- **Mínimo aceptable:** 16 GB RAM + 256 GB SSD. Viable solo para tareas livianas (consulta de Claude web, edición de archivos pequeños). No corre Docker + SQL Server local sin degradación.
- **Recomendado:** 32 GB RAM + 512 GB SSD + procesador i7/Ryzen 7. Corre la pila completa (VS Code + Docker + SQL + Minio + herramientas de datos) sin swap.

---

## 8. INFRAESTRUCTURA DE PUBLICACIÓN Y APROVISIONAMIENTO: DOCKER, HELM, NUGET, NPM E IaC

UNIMAR necesita un ecosistema de publicación que cubra **tanto el desarrollo local como el despliegue en servidores**. Esto incluye imágenes Docker, charts de Helm, paquetes NuGet para .NET, paquetes npm para frontend y herramientas de Infraestructura como Código (IaC) para aprovisionar entornos.

Con GitHub Team, UNIMAR tiene acceso a **GitHub Packages** sin costo adicional.

### 8.1 Imágenes Docker (GitHub Container Registry)

| Concepto | Costo | Detalle |
| :------- | :---- | :------ |
| **Almacenamiento** | USD 0 (2 GB incluidos) | Sobran para ~50 imágenes de aplicaciones UNIMAR. |
| **Ancho de banda** | USD 0 (1 GB/mes incluido) | Suficiente para pulls de 20 desarrolladores. |
| **Imágenes públicas** | USD 0 | Ilimitadas. |
| **Autenticación** | USD 0 | Mismo token que GitHub. Sin VPN ni credenciales aparte. |
| **Costo extra por GB adicional** | USD 0.25/GB/mes | Solo si UNIMAR supera los 2 GB (poco probable con < 20 personas). |

**Costo mensual estimado: USD 0.** Lo cubre GitHub Team.

### 8.2 Charts de Helm

Los charts de Helm se almacenan como **archivos `.tgz` en GitHub Releases** o en un **repositorio OCI dentro de GHCR** (soportado nativamente desde Helm 3.8+).

| Método | Costo | Ventaja |
| :----- | :---- | :------ |
| **OCI en GHCR** | USD 0 (cuota compartida con imágenes Docker) | Un solo registro para imágenes + charts. Publicación con `helm push`. |
| GitHub Releases + GitHub Pages | USD 0 | Compatible con Helm 3. No requiere OCI. |

**Recomendación:** Usar OCI en GHCR. Estándar moderno, misma autenticación que Docker, sin dependencia de GitHub Pages.

### 8.3 Paquetes NuGet (Bibliotecas .NET internas)

| Concepto | Costo | Detalle |
| :------- | :---- | :------ |
| **Feed privado** | USD 0 | Ilimitado, incluido en GitHub Packages. |
| **Publicación desde CI** | USD 0 | GitHub Actions + token nativo. Sin API key adicional. |
| **Consumo desde VS Studio** | USD 0 | Configurar `nuget.config` apuntando a `https://nuget.pkg.github.com/OWNER/index.json`. |
| **Versiones** | USD 0 | SemVer completo, paquetes listados por repositorio. |

**Costo mensual estimado: USD 0.** Alternativa gratuita sería nuget.org (público) o Azure Artifacts.

### 8.4 Paquetes npm (Bibliotecas front-end internas)

| Concepto | Costo | Detalle |
| :------- | :---- | :------ |
| **Registro privado** | USD 0 | Ilimitado, incluido en GitHub Packages. |
| **Publicación** | USD 0 | `npm publish` con token de GitHub. |
| **Consumo** | USD 0 | `.npmrc` con `@owner:registry=https://npm.pkg.github.com/`. |
| **Scope por organización** | USD 0 | Todo bajo `@unimar/`. Sin colisiones con npm público. |

**Costo mensual estimado: USD 0.** Alternativa gratuita: npm public (sin privados) o Verdaccio (self-hosted).

### 8.5 Infraestructura como Código (IaC)

UNIMAR puede aprovisionar entornos (VM, clústeres k8s, bases de datos, redes) mediante herramientas IaC:

| Herramienta | Propósito | Costo | Integración |
| :---------- | :-------- | :---- | :---------- |
| **OpenTofu** (fork de Terraform) | Aprovisionamiento multi-cloud y on-premise | USD 0 | Estado remoto en GitHub. Ejecución local o en GitHub Actions. |
| **Pulumi** | IaC con C#, TypeScript, Python | USD 0 (OSS), Team < 10 users USD 0 | Ideal para equipo .NET — escribir infraestructura en C#. |
| **Helmfile** | Orquestación declarativa de releases de Helm | USD 0 | Gestiona múltiples charts por ambiente (`helmfile -e staging`). |
| **Kustomize** | Personalización nativa de manifiestos k8s (sin Helm) | USD 0 (incluido en kubectl) | No requiere chart repo. Overlay por ambiente. |

**Recomendación para UNIMAR:**
- **Entornos productivos:** OpenTofu + Helmfile. OpenTofu aprovisiona el clúster k8s; Helmfile despliega las aplicaciones.
- **Entornos locales:** Kind (Kubernetes in Docker) + Helm. Kind levanta un clúster k8s local en segundos con ~1 GB de RAM adicional.
- **Alternativa .NET nativa:** Pulumi en C# si el equipo prefiere no aprender HCL.

> **Impacto en costos:** Todas las herramientas IaC listadas son **USD 0 en licencias**. El costo real está en la infraestructura cloud que aprovisionan, que es independiente de estas licencias.

### 8.6 Alternativa gratuita a Docker Desktop

Si UNIMAR quiere evitar los USD 150/mes de Docker Desktop Team, existen alternativas gratuitas que **incluyen soporte para clústeres k8s locales**:

| Alternativa | Costo | Pros | Contras |
| :---------- | :---- | :--- | :------ |
| **WSL2 + Docker Engine** (Windows) | USD 0 | Misma tecnología subyacente. Docker Engine corre nativo en WSL2. Sin límite de usuarios. k8s vía Kind. | Sin interfaz gráfica. Gestión por comandos. |
| **Rancher Desktop** | USD 0 | Interfaz gráfica similar a Docker Desktop. Open source. k8s integrado (vía k3s). | Menos integración con Windows. Comunidad más pequeña. |
| **Podman Desktop** | USD 0 | Open source. Sin daemon central. k8s vía Kind o Podman Machine. | Curva de aprendizaje. Algunos docker-compose no 100% compatibles. |

**Recomendación:** Arrancar con Docker Desktop Team (USD 150/mes). Evaluar migración a WSL2 + Docker Engine + Kind en Fase 3 si el equipo se siente cómodo con línea de comandos. Kind permite probar Helm y k8s local sin necesidad de Docker Desktop Pro.

---

## 9. CONCLUSIÓN FINAL — VEREDICTO CON COSTOS

**Herramienta** | **Rol** | **Licencias** | **USD/mes**
:--- | :--- | :--- | :---
Claude Arquitecto ($200) | Generar specs BMAD, orquestar agentes, validar estándares | 2 (Arquitecto, Analista Ppal) | 400
Claude Pro ($20) | Razonamiento diario, consultas, revisión de código | 18 (resto del equipo) | 360
OpenCode Go ($10) | Ejecutar flujos BMAD: implementar stories, seguir specs, correr skills | 5 (líderes técnicos) | 50
OpenCode Gratuito ($0) | Tareas BMAD ocasionales | 15 (devs/QA) | 0
Copilot Business ($19) | Autocompletado en VS Code: boilerplate, tests, código repetitivo | 5 (líderes técnicos) | 95
Docker Desktop Team ($10) | Contenedores locales para desarrollo y pruebas | 15 (usuarios técnicos) | 150
GitHub Packages | Publicación Docker, Helm, NuGet, npm (incluido) | — | 0
Claude Design Plugin | Auditoría de diseño, accesibilidad, UX writing (incluido) | — | 0
Open Design | Diseño visual open source (Apache-2.0, BYOK) | — | 0
| | **Total** | **20 personas** | **USD 1,055/mes**

> **USD 53/persona/mes.** Frente a una nómina TI de ~S/ 120,000+/mes, representa el **0.9% del costo laboral**.

**Veredicto del Comité Ejecutivo:**
**Aprobar el Escenario Híbrido + Copilot + Docker (USD 1,055/mes).** Claude como cerebro arquitectónico, OpenCode como ejecutor de flujos BMAD, Copilot como acelerador de código, Docker Desktop + Kind para entornos locales con k8s, GitHub Packages para publicación (Docker, Helm, NuGet, npm) sin costo adicional, y OpenTofu/Helmfile para IaC (USD 0). Claude Design Plugin y Open Design se agregan como herramientas de diseño sin incrementar el gasto mensual.

**Ruta alterna (si el presupuesto es restrictivo):** Aprobar el Escenario Base (USD 960/mes) por máximo 3 meses. Activar Copilot para los 5 líderes en Fase 2 (+USD 95/mes = USD 1,055). Para ahorrar los USD 150 de Docker Desktop, usar WSL2 + Docker Engine (gratuito).
