# INFORME ESTRATÉGICO PARA DECISIÓN EJECUTIVA
## Plataforma SCM y DevSecOps – Análisis de Mercado Completo (V7)
**UNIMAR | 10 DE JUNIO DE 2026**

| Control | Detalle |
| :------ | :------ |
| **Versión** | 1.0 |
| **Fecha** | 18/06/2026 |
| **Autores** | Alberto Arroyo, Cristhian Jara |
| **Aprobador** | Carlos Villanueva |
| **Estado** | Aprobado |

> **Descargar:** `Versión PDF` · [`Versión HTML`](./informe-analisis-scm-devsecops-v7.html)

---

## HOJA 0 — SÍNTESIS EJECUTIVA PARA DECISIÓN INMEDIATA

| Dimensión | Síntesis para la Dirección |
| :-------- | :------------------------- |
| **Problema crítico** | SecurityScorecard **F**, TFS 2012 (obsoleto, sin parches), 50% del código lo escriben proveedores **sin que UNIMAR pueda revisar ni auditar lo que entregan**. Si un proveedor comete un error (exponer una clave de SAP) o es comprometido, UNIMAR no tiene cómo saberlo hasta que el daño está hecho. |
| **¿Por qué ahora?** | Cada mes sin controles, un proveedor puede **exponer accidentalmente** una credencial de SAP o BD en un commit, o su entorno puede ser **comprometido** y usar su acceso legítimo para inyectar código. No es malicia del proveedor —es que UNIMAR no tiene cómo detectarlo hasta que ya es tarde. Un solo incidente (ransomware, filtración) cuesta **USD 50,000–500,000**. |
| **Decisión recomendada** | **Ruta híbrida:** Seguridad Local para el equipo interno + add-ons solo en repos con proveedores. El costo **escala con el riesgo**: ~USD 130/mes sin outsourcers, ~USD 600/mes con 2 proveedores. |
| **Costo del "no hacer nada"** | **USD 50,000–500,000 por incidente.** Frente a eso, los ~USD 600/mes del escenario más probable con 2 proveedores son el precio de una póliza de seguro. |
| **Próximo paso concreto** | 1. Adquirir **GitHub Team** (USD 100/mes). 2. Implementar Seguridad Local (Fase 0, 4 semanas). 3. Activar add-ons solo cuando un proveedor externo contribuya a un repositorio crítico. |

**Las 3 opciones en 30 segundos:**

| Opción | Costo mensual | Para quién |
| :----- | :------------ | :--------- |
| **Híbrida (recomendada)** | **USD 130 → ~600** (escalable según proveedores) | Equipo que empieza con recursos internos y suma proveedores progresivamente |
| Completa (add-ons para todos) | **USD 1,325 fijo** | Quien prefiera un costo predecible desde el día 1 sin gestionar granularidad |
| Solo Seguridad Local | **USD 130 fijo** | Solo viable si no hubiera proveedores externos. Riesgo alto con outsourcing |

> **Decisión del Comité Ejecutivo:** Aprobar **GitHub Team** + **Seguridad Local** como capa base. Activar add-ons incrementalmente cuando entren proveedores. El costo crece con el riesgo real. En el escenario más probable (2 proveedores, 5 committers c/u): **~USD 600/mes**, ahorrando **~USD 725/mes vs. comprar todo upfront**.

---

## 1. RESUMEN EJECUTIVO Y VEREDICTO

| **Veredicto** | **Recomendación** |
| :--- | :--- |
| **RUTA HÍBRIDA RECOMENDADA** | **Seguridad Local para el equipo interno + add-ons solo para repos con proveedores**. Arranca en USD 130/mes y escala hasta ~USD 850/mes con 3 proveedores. El costo crece con el riesgo real, no antes. Vea la tabla de costos escalables en la Hoja 0. |
| **ÓPTIMO (COSTO FIJO)** | **GitHub Team + Secret Protection + Code Security** (USD 1,325/mes). Seguridad completa para todos los repositorios desde el día 1. Úselo si la Dirección prefiere un costo fijo predecible y no quiere gestionar la granularidad por repositorio. Cuesta ~USD 725/mes más que la ruta híbrida en el escenario con 2 proveedores. |
| **ALTERNATIVA VÁLIDA** | **Azure DevOps + Secret Protection + Code Security**. Misma capacidad de seguridad que GitHub, con mejor integración nativa si UNIMAR ya tiene compromiso fuerte con el ecosistema Azure. |
| **ALTERNATIVA DE MENOR COSTO** | **GitHub Team + Seguridad Local** (Husky + talisman + SonarQube). Sin add-ons en la nube. Ahorro de USD 1,195/mes vs. la opción óptima, pero sin enforce centralizado sobre outsourcers. Solo viable si UNIMAR no tuviera proveedores externos. |
| **DESCARTAR** | **Azure DevOps Basic** como solución única. Es un "repositorio barato" que no audita el contenido del código, dejando los riesgos de seguridad a revisión manual. |
| **OBJETIVO FUTURO** | **GitHub Enterprise + Seguridad**. Solo cuando UNIMAR requiera SAML/SCIM, auditoría centralizada (SOC2) o IP allow lists. Por ahora, es sobredimensionado y genera costos y complejidad innecesarios. |

**Conclusión financiera clave:**
La ruta híbrida **puede costar desde USD 130/mes** (solo equipo interno) **hasta ~USD 850/mes** (con 3 proveedores), ahorrando **USD 475 a 1,195/mes** vs. comprar todo upfront. En el escenario más probable (2 proveedores, 5 committers c/u), **~USD 600/mes**. La opción de seguridad completa para todos (USD 1,325/mes) es el techo si toda la organización eventualmente externaliza.

---

## 2. CATÁLOGO COMPLETO DE PRODUCTOS Y MODELOS (TODAS LAS VERSIONES)

### 2.1 Ecosistema Azure DevOps (Microsoft)

| Modelo | Costo Base (25 users) | Complementos | Costo Total (25 users) | Pros | Contras |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ADO Basic** | USD 120/mes | Ninguno | USD 120/mes | Menor costo del mercado. Primeros 5 usuarios gratuitos. | No tiene Secret Protection ni Code Security. Los secretos (SAP, BD, APIs) y vulnerabilidades dependen de revisión manual. |
| **ADO + Seguridad Completa** | USD 120/mes | Secret (USD 19) + Code Security (USD 30) | **USD 1,345/mes** | **Misma seguridad preventiva que GitHub**. Integración nativa con Azure Entra ID. | Menor ecosistema de colaboración con terceros. Interfaz menos ágil para revisiones de código externas. |
| **Azure DevOps Server** | On-premise (cotizar) | N/A | Variable | Para entornos con restricción regulatoria de nube. | Obsolescencia tecnológica; no es el futuro de Microsoft. |

### 2.2 Ecosistema GitHub (Microsoft)

| Modelo | Costo Base (25 users) | Complementos | Costo Total (25 users) | Pros | Contras |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GitHub Team** | USD 100/mes (USD 4×25) | Ninguno | USD 100/mes | Colaboración básica, CODEOWNERS, branch protection. | Sin Secret Protection ni Code Security. |
| **GitHub Team + Seguridad Local** | USD 100/mes | SonarQube (~USD 30) + hooks/talisman (USD 0) | **~USD 130/mes** | Costo mínimo. Seguridad auto-gestionada con pre-commit hooks (Husky + talisman/git-secrets), linters y SonarQube auto-hosteado. Sin depender de add-ons de plataforma. | Sin enforce centralizado. Los hooks se bypassan con `--no-verify`. Sin auditoría ni revocación automática de secretos. Sin CodeQL ni Dependabot. |
| **GitHub Team + Seguridad** | USD 100/mes | Secret (USD 19) + Code Security (USD 30) | **USD 1,325/mes** | **ÓPTIMO (COSTO FIJO)**. Misma seguridad que Enterprise. Modelo de pago por committer activo (no por usuario total). Para equipo que prefiere costo fijo. | Sin SAML SSO. Sin Audit Log API centralizado. |
| **GitHub Enterprise + Seguridad** | USD 525/mes (USD 21×25) | Secret (USD 19) + Code Security (USD 30) | **USD 1,750/mes** | Gobierno completo (SAML, SCIM, Audit logs, IP allow lists). | **Sobredimensionado**. Complejidad administrativa (EMU). Costo USD 425/mes más alto que Team. |
| **GitHub + Copilot** | Variable | USD 19/usuario/mes | + USD 228/mes (12 internos) | Asistente IA para cerrar brecha de skill gap. | Licencia separada y opcional. No es un requisito de SCM. |

### 2.3 Otras Plataformas (Referencia de Mercado)

| Modelo | Costo Base (25 users) | Complementos | Costo Total (25 users) | Pros | Contras |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GitLab Ultimate** | USD 99/usuario/mes | N/A | **USD 2,475/mes** | Seguridad y compliance avanzados (todo en uno). | **Casi el doble** de la opción recomendada. Curva de aprendizaje pronunciada. |
| **Bitbucket Premium** | USD ~7.53/usuario/mes | N/A | USD ~188/mes | Integración nativa con Jira. Mayor almacenamiento. | No tiene Secret Protection ni Code Security. Descartar por seguridad insuficiente. |

---

## 3. ANÁLISIS FINANCIERO CONSOLIDADO (BASE: 25 CONTRIBUIDORES, 50% OUTSOURCING)

| Escenario | USD/mes (sin IGV) | USD/mes (con IGV 18%) | PEN/mes (con IGV) | Decisión |
| :--- | :--- | :--- | :--- | :--- |
| A. ADO Basic | $120 | $141.60 | S/ 495.32 | **Descartar** |
| B. ADO + Seguridad | $1,345 | $1,587.10 | S/ 5,551.68 | **Alternativa válida** |
| C. GitHub Team + Seguridad | $1,325 | $1,563.50 | S/ 5,469.12 | **Óptimo (costo fijo)** |
| D. GitHub Enterprise + Seguridad | $1,750 | $2,065.00 | S/ 7,223.37 | **Objetivo estratégico futuro** |
| E. GitLab Ultimate | $2,475 | $2,920.50 | S/ 10,215.91 | **Descartar** |
| F. Bitbucket Premium | $188 | $221.84 | S/ 776.40 | **Descartar (sin seguridad)** |
| **G. GitHub Team + Seguridad Local** | **$130** | **$153.40** | **S/ 536.59** | **Alternativa de menor costo (con riesgo operativo)** |
| **H. Ruta híbrida (recomendada)** | **~$130 a ~$600** | **variable** | **variable** | **Costo escala con el riesgo** |

**Comparativa de ahorro con la ruta híbrida:** En el escenario más probable (2 proveedores, 10 committers externos), el costo es ~USD 600/mes, ahorrando **~USD 725/mes vs. la opción de seguridad completa para todos**. Si solo hay equipo interno, el ahorro es de **USD 1,195/mes**.

**Ruta híbrida — costo variable (no fijo):**
| Escenario | USD/mes | ¿Cuándo? |
| :-------- | :------ | :------- |
| Solo equipo interno (~20 personas) | **~130** | Meses 0-3 |
| +1 proveedor (5 committers) | **~360** | Primer outsourcer |
| +2 proveedores (10 committers) | **~600** | Escenario típico con 2 outsourcers |
| +3 proveedores (15 committers) | **~850** | Escalamiento mayor |
| Todos los repositorios con add-ons | **1,325** | Techo máximo |
El ahorro vs. comprar todo upfront es de **USD 475 a 1,195/mes**.

---

## 4. MATRIZ DE DECISIÓN PONDERADA (CON PESOS DINÁMICOS PARA 50% OUTSOURCING)

| Criterio | Peso | ADO Basic | ADO + Seguridad | GitHub Team + Seguridad | GitHub Team + Seg. Local | GitHub Enterprise + Seguridad | GitLab Ultimate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Seguridad preventiva** | 30% | 1 | 4 | **5** | 3 | 5 | 5 |
| **Control de proveedores** | 20% | 2 | 3 | **5** | 2 | 5 | 4 |
| **Desarrollo del equipo interno** | 15% | 2 | 3 | **5** | 4 | 5 | 3 |
| **Cobertura de código activo** | 15% | 5 | 5 | 5 | 5 | 5 | 5 |
| **Identidad y cumplimiento** | 10% | 5 | 5 | 3 | 3 | 5 | 5 |
| **Costo / TCO** | 10% | 5 | 4 | 4 | **5** | 2 | 1 |
| **Puntaje Ponderado** | **100%** | **2.75** | **3.90** | **4.70** | **3.45** | **4.30** | **3.55** |
| **Ranking** | - | 6º | 3º | **1º** | 5º | 2º | 4º |

**Análisis de la matriz:**
- **GitHub Team + Seguridad (4.70)** gana porque ofrece la máxima seguridad y control sobre proveedores al mismo costo que ADO, pero con una experiencia de colaboración superior y menor complejidad administrativa que Enterprise.
- **GitHub Enterprise (4.30)** es técnicamente superior en gobierno, pero penaliza en costo y complejidad para una empresa pequeña.
- **ADO + Seguridad (3.90)** es una alternativa sólida, especialmente si UNIMAR decide mantener todo en el ecosistema Azure.
- **GitHub Team + Seguridad Local (3.45)** penaliza en seguridad preventiva y control de proveedores porque los hooks locales son bypassables y no hay enforcement centralizado. Su fortaleza es el costo, pero no es recomendable como solución única con 50% outsourcing.

---

## 5. ANÁLISIS DETALLADO: PROS Y CONTRAS POR PRODUCTO (CONTEXTO UNIMAR)

### 5.1 Azure DevOps Basic (USD 120/mes)
- **Pros**: Precio imbatible. Integración con Azure Boards y Pipelines. Familiaridad si vienen de TFS.
- **Contras**: **No audita el código**. No bloquea secretos (SAP, Azure, APIs). No escanea vulnerabilidades. Depende 100% de revisión manual. Con outsourcing, el control se delega a las prácticas de cada agencia.
- **Veredicto**: **Descartar** para código activo o crítico. Solo útil si la Dirección acepta explícitamente el riesgo residual.

### 5.2 Azure DevOps + Secret Protection + Code Security (USD 1,345/mes)
- **Pros**: Misma capacidad de escaneo que GitHub (Secret scanning, CodeQL, Dependabot). Aprovecha la inversión en identidad Entra ID. Alternativa económica frente a GitHub Enterprise.
- **Contras**: La interfaz de revisión de código es menos ágil para colaboración con terceros. La comunidad de desarrolladores es menor. El gobierno de repositorios (CODEOWNERS, reglas) es más rígido.
- **Veredicto**: **Alternativa válida**. Si UNIMAR prioriza el ecosistema Microsoft sobre la experiencia de desarrollador, esta opción es perfectamente defendible.

### 5.3 GitHub Team + Secret Protection + Code Security (USD 1,325/mes) – ÓPTIMO (COSTO FIJO)
- **Pros**:
  - **Costo óptimo**: USD 20/mes más barato que ADO seguro.
  - **Seguridad completa**: Secret protection (evita filtraciones de llaves) + Code Security (CodeQL, Copilot Autofix, Dependabot).
  - **Colaboración superior**: Pull Requests, CODEOWNERS, discusiones por hilos; ideal para que UNIMAR controle el código que entregan los proveedores externos.
  - **Modelo de pago justo**: Se paga solo por los "committers activos" en los repositorios protegidos, no por todos los usuarios con acceso.
  - **Menos complejidad**: No requiere configurar Enterprise Managed Users (EMU), lo cual reduce la curva de aprendizaje del equipo interno.
- **Contras**: Carece de SAML SSO (aunque soporta autenticación OAuth con Entra ID). Carece de audit logs centralizados vía API. Cuesta USD 725/mes más que la ruta híbrida en el escenario más probable.
- **Veredicto**: **Óptimo si se prefiere un costo fijo predecible.** La ruta híbrida es más económica si no todos los repositorios tienen proveedores externos.

### 5.4 GitHub Enterprise + Secret Protection + Code Security (USD 1,750/mes)
- **Pros**: Gobierno total (SAML/SCIM, audit logs, IP allow lists, políticas de repositorio a nivel de organización). Cumple con compliance SOC2/FedRAMP.
- **Contras**: Cuesta USD 425/mes más que Team. La administración de EMU es pesada para equipos pequeños. El equipo interno (< 20 personas) perderá tiempo en configuración en lugar de desarrollar.
- **Veredicto**: **Objetivo estratégico**. Evaluar en 12-18 meses si UNIMAR crece, requiere certificaciones o contrata más proveedores.

### 5.5 GitLab Ultimate (USD 2,475/mes)
- **Pros**: Todo en uno (SCM, CI/CD, Security, Compliance). Muy potente para organizaciones grandes.
- **Contras**: **Casi el doble de costo**. Comunidad más pequeña. El skill gap para adoptarlo es mayor. No justificado para < 20 personas.
- **Veredicto**: **Descartar** por ahora.

### 5.6 Bitbucket Premium (USD ~188/mes)
- **Pros**: Integración perfecta con Jira. Muy barato.
- **Contras**: No tiene Secret Protection ni Code Security. Carece de los controles preventivos que UNIMAR necesita urgentemente.
- **Veredicto**: **Descartar** por seguridad insuficiente.

### 5.7 GitHub Team + Seguridad Local (~USD 130/mes) – ALTERNATIVA DE MENOR COSTO

Este escenario combina GitHub Team base con una capa de seguridad auto-gestionada mediante herramientas open source ejecutadas en local y en CI/CD, sin contratar los add-ons de seguridad de GitHub.

| Componente | Herramienta | Costo | Función |
| :--------- | :---------- | :---- | :------ |
| Pre-commit hooks | Husky + lint-staged | USD 0 | Ejecuta validaciones automáticas antes de cada commit |
| Escaneo de secretos | talisman / git-secrets / detect-secrets | USD 0 | Bloquea commits que contengan credenciales, tokens, llaves |
| Calidad de código | ESLint + Prettier + commitlint | USD 0 | Estandariza estilo, formato y mensajes de commit |
| Análisis estático profundo | SonarQube Community Edition (self-hosted) | ~USD 30/mes (VM) | Code smells, duplicación, cobertura, vulnerabilidades |
| Validación en CI | GitHub Actions (free tier incluido) | USD 0 | Ejecuta los mismos checks en el servidor de CI |

**Costo total estimado: ~USD 130/mes** (GitHub Team USD 100 + VM SonarQube USD 30).

**Pros:**
- **Costo mínimo**: Ahorra USD 1,195/mes frente a la opción recomendada.
- **Independencia de plataforma**: Las reglas funcionan igual en GitHub, GitLab o Azure DevOps.
- **Control total**: El equipo define sus propias reglas de calidad y seguridad.
- **Desarrollo de disciplina**: Fomenta una cultura DevSecOps en el equipo interno.
- **SonarQube Community es gratuito**: Solo se paga la infraestructura (VM pequeña).

**Contras (riesgos explícitos):**
- **Bypassable**: `git commit --no-verify` salta todos los hooks. Con 50% outsourcing, no hay forma de garantizar que los proveedores ejecuten los hooks.
- **Sin enforce centralizado**: GitHub no bloquea el push aunque los hooks fallen en local. El secret ya viajó al remoto antes de que el CI lo detecte.
- **Sin auditoría corporativa**: No hay un registro centralizado de qué secretos se detectaron, quién los ignoró y cuándo.
- **Sin revocación automática**: GitHub Secret Scanning notifica al proveedor (Azure, AWS, SAP) cuando encuentra una key válida. Los hooks locales solo avisan al desarrollador.
- **Carga operativa**: Alguien debe mantener SonarQube (actualizaciones, backups, seguridad del servidor), actualizar reglas de hooks y asegurar que todos los desarrolladores (internos y externos) tengan la configuración correcta.
- **Sin CodeQL**: No hay análisis semántico profundo de vulnerabilidades en el código (SQLi, XSS, RCE). SonarQube cubre parte, pero no al mismo nivel.
- **Sin Dependabot**: No hay alertas automáticas de dependencias vulnerables. Habría que suplirlo con Snyk (costo adicional) o renovación manual.
- **Falso sentido de seguridad**: El equipo puede creer que está protegido cuando en realidad los hooks pueden no estar ejecutándose en todos los entornos.

**Veredicto**: **Alternativa viable solo para el equipo interno** como capa adicional de seguridad, pero **no como única defensa** para el modelo 50% outsourcing. Si se adopta, debe combinarse con controles en el servidor de CI (GitHub Actions) que rechacen PRs con secretos o vulnerabilidades críticas. Recomendable como estrategia complementaria a la opción óptima, no sustitutiva.

---

## 6. DIAGNÓSTICO CRÍTICO DE LA REALIDAD AS-IS Y MITIGACIÓN

| Dolor AS-IS | Riesgo con ADO Basic | Mitigación con **GitHub Team + Seguridad** (nube) | Mitigación parcial con **GitHub Team + Seguridad Local** |
| :--- | :--- | :--- | :--- |
| **Legacy (TFS 2012)** | Migrar deuda técnica sin auditoría. | Escaneo automático (CodeQL) y reglas de branch obligatorias. | SonarQube escanea deuda técnica, pero sin CodeQL. Sin enforce automático en push. |
| **SecurityScorecard F** | Seguridad reactiva y manual. | Secret scanning bloquea push de contraseñas + Code scanning bloquea vulnerabilidades. | talisman/git-secrets en pre-commit (bypasseable). SonarQube detecta vulnerabilidades post-commit. |
| **Outsourcing 50%** | Depender de las prácticas de cada agencia. | Pull Requests con CODEOWNERS y Quality Gates con **evidencia corporativa** automática. | **Sin enforce sobre outsourcers**. Los hooks son responsabilidad de cada agencia. El control se delega. |
| **Skill gap interno** | Revisión manual por un equipo en aprendizaje. | CodeQL + Copilot Autofix incluyen explicaciones y parches automáticos. | SonarQube reporta code smells, pero sin explicaciones contextuales ni autofix. Curva de aprendizaje más alta. |
| **Criticidad logística** | Cambios sin barreras suficientes. | Branch protection + trazabilidad completa + rollback inmediato. | Branch protection funciona (es de GitHub, no del add-on), pero sin escaneo automático en merge. |

---

## 7. CONTROLES MÍNIMOS NO NEGOCIABLES (APLICABLES A CUALQUIER PLATAFORMA)

- Todo repositorio debe tener **propietario técnico y de negocio interno**.
- Los proveedores **no administran unilateralmente** repositorios corporativos.
- Ningún cambio llega a producción sin **Pull Request y revisiones definidas**.
- Las ramas productivas no permiten **push directo**.
- Los secretos detectados se **revocan y rotan** (eliminarlos del commit no es suficiente).
- Las vulnerabilidades **críticas bloquean el release**.
- Los accesos externos son **nominativos**, con caducidad y offboarding < 4 horas.
- Las excepciones quedan **justificadas, aprobadas y con vencimiento**.

---

## 8. HOJA DE RUTA INCREMENTAL (HORIZONTE RELATIVO)

| Fase | Horizonte | Hitos | Costo mensual estimado | Trigger |
| :--- | :--- | :--- | :--- | :--- |
| **0. Inventario y Gobierno** | 0-4 semanas | Inventario TFS; dueños; SSO/MFA; piloto 3-5 repos. **Implementar seguridad local (Husky + talisman + SonarQube) como capa base del equipo interno.** | **USD 130** (solo GitHub Team USD 100 + hosting SonarQube) | 100% repos críticos inventariados. |
| **1. Código Interno Seguro** | Meses 1-3 | GitHub para todo desarrollo nuevo; ADO Boards transitorio; branch protection. Seguridad Local operativa para el equipo interno. | **USD 130** | 100% proyectos nuevos con branch protection; 0 falsos positivos críticos en SonarQube. |
| **2. Activación por Proveedor** | Meses 3-6 | **Por cada repositorio donde un proveedor externo contribuya, activar Secret Protection + Code Security** para esos committers. Migrar repos activos/críticos de TFS. | **USD 130 a ~850** (escala con cada proveedor) | Primer commit de un proveedor externo en un repositorio marcado como crítico. |
| **3. Escalamiento controlado** | Meses 6-9 | Mantener add-ons solo en repos con outsourcers. Archivar repos inactivos de TFS. Piloto Copilot para equipo interno. | **~USD 360 a 1,000** (depende del número de outsourcers activos) | Exposición residual < 25%; cero secretos válidos expuestos. |
| **4. Consolidación** | Meses 9-12 | Evaluar cobertura: si todos los repositorios tienen outsourcers, el costo alcanza el tope de **USD 1,325/mes**. Evaluar retiro total de TFS. | **USD 130 a 1,325** (techo natural si toda la organización externaliza) | Todo código activo bajo controles. |

---

## 9. CONCLUSIÓN DIRECTIVA FINAL

El error del informe anterior fue asumir que la única alternativa segura a ADO Basic era GitHub Enterprise. **Esto omitió que GitHub Team permite contratar Secret Protection y Code Security desde abril de 2025.**

Para UNIMAR, una empresa con un equipo TI de menos de 20 personas y un modelo de desarrollo 50% externalizado:

1. **No se necesita GitHub Enterprise hoy**. El gobierno corporativo (SAML, audit logs) es valioso, pero su costo y complejidad administrativa no se justifican para el tamaño actual.
2. **ADO Basic es un falso ahorro**. No compra controles preventivos, trasladando el riesgo al equipo interno y a los proveedores.
3. **La clave no es elegir entre "todo caro" o "todo barato".** La plataforma GitHub permite activar los add-ons de seguridad **por repositorio y por committer**. Esto cambia completamente la ecuación financiera.

**La decisión inteligente: empezar con Seguridad Local y escalar los add-ons solo donde haya proveedores.**

| Escenario | Costo mensual | ¿Cuándo aplica? |
| :-------- | :------------ | :-------------- |
| Solo equipo interno (20 personas) | **USD 130/mes** | Meses 1-3, mientras se configura el gobierno de repositorios |
| Equipo + 1 proveedor (5 committers externos) | **~USD 360/mes** | Cuando el primer proveedor comienza a contribuir |
| Equipo + 3 proveedores (15 committers externos) | **~USD 850/mes** | Escalamiento normal con múltiples outsourcers |
| Todos los repositorios con add-ons (25 committers) | **USD 1,325/mes** | Escenario máximo: toda la organización bajo seguridad completa |

**¿Por qué esta ruta híbrida es superior a comprar todo upfront?**
- **El riesgo con outsourcers se mitiga porque los add-ons se activan justo cuando ellos entran**, no antes. No hay ventana de exposición.
- **El equipo interno se beneficia de la Seguridad Local** (Husky, talisman, SonarQube), que además fomenta disciplina DevSecOps.
- **El ahorro es real y tangible**: si hoy solo hay 2 proveedores con 5 committers cada uno, el costo es ~USD 600/mes, no USD 1,325. **Ahorro de ~USD 725/mes (S/ 2,536/mes)**.
- **Si UNIMAR decide internalizar el desarrollo mañana**, los add-ons simplemente se desactivan y el costo vuelve a USD 130/mes.

**Veredicto final del Comité Ejecutivo:**
**Aprobar GitHub Team como plataforma SCM (USD 100/mes). Implementar Seguridad Local como capa base para todo el equipo interno. Activar Secret Protection + Code Security de forma incremental, repositorio por repositorio, solo cuando un proveedor externo comience a contribuir. Esta ruta híbrida asegura que el costo crece con el riesgo real, no antes.**

---

**Anexo:** Modelo Excel dinámico (`UNIMAR_Modelo_Dinamico_SCM_DevSecOps_v7.xlsx`) con parámetros editables (licencias, outsourcing, repositorios legacy, TCO) y análisis de sensibilidad.

**Fuentes oficiales:** Microsoft Azure DevOps Pricing; GitHub Pricing; GitLab Pricing; Bitbucket Pricing; SBS Perú (TC 08/06/2026: S/ 3.498). Precios públicos sin descuentos, sin consumo variable y sin IGV. Cotización final sujeta a contrato comercial.
