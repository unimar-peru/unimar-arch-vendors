# Fase 4 — Validación y QA

> **Gate de salida:** RC Sellado

## Objetivo

Validar que el release candidate cumple las métricas de calidad, cobertura, seguridad y aceptación antes de sellar el RC para su promoción a producción.

<details>
<summary><strong>Reportes y Evidencia</strong></summary>

| Documento | Tipo | R/O | Propósito |
| :-------- | :--- | :-: | :-------- |
| [Plantilla de Reporte de Resumen de Pruebas](../../governance/sdlc/04-plantillas-artefactos/plantilla-reporte-resumen-pruebas.es.md) | Plantilla | **R** | Reporte de alcance, métricas y resultados de pruebas |
| [Gates de Calidad SDLC](../../governance/sdlc/gates-calidad.es.md) | Estándar | **R** | Umbrales: cobertura, complejidad, CVEs, deuda técnica |

</details>

<details>
<summary><strong>Estrategias de Prueba</strong></summary>

| Documento | Tipo | R/O | Propósito |
| :-------- | :--- | :-: | :-------- |
| [Estrategia de Pruebas](../../governance/sdlc/estrategia-pruebas.es.md) | Guía | **R** | Estrategias para pruebas **funcionales**, **automatizadas** (unitarias/integración/E2E/contrato) y de **performance** (carga/stress/caos): propósito, cuándo, por qué, dónde, plantillas, análisis de resultados |

#### Pruebas Funcionales

| Documento | Tipo | R/O/C | Propósito | Cuándo usarlo |
| :-------- | :--- | :---- | :-------- | :------------ |
| [Caso de Prueba Funcional](../../governance/standards/testing/formato-caso-prueba-funcional.es.md) | Plantilla | C | Documentar escenarios funcionales, pasos y resultados esperados | Validación de aceptación en F4 |
| [Historias Funcionales](../../governance/sdlc/04-plantillas-artefactos/plantilla-historia-funcional.es.md) | Plantilla | **R** | Definen criterios de aceptación que guían las pruebas | F2 — Diseño |

#### Pruebas Automatizadas

| Documento | Tipo | R/O/C | Propósito | Cuándo usarlo |
| :-------- | :--- | :---- | :-------- | :------------ |
| [Guía de Pruebas de Contrato](../../governance/standards/engineering/guia-pruebas-contrato.es.md) | Estándar | C | Contract testing con Pact entre servicios | APIs entre servicios |

#### Pruebas de Performance

| Documento | Tipo | R/O/C | Propósito | Cuándo usarlo |
| :-------- | :--- | :---- | :-------- | :------------ |
| [Plan de Pruebas de Performance (ISO 25000)](../../governance/standards/testing/plantilla-plan-performance.es.md) | Plantilla | **R** | Plan canónico con criterios de aceptación, perfiles de carga, métricas, matriz de decisión y validación con k6 | Release candidate |
| [Ejemplo Script k6](../../governance/standards/testing/ejemplo-carga-k6.es.md) | Ejemplo | O | Script de carga de referencia para k6 | Release candidate o antes de alta demanda |

> Las decisiones arquitectónicas específicas se consultan como referencia en [ADR-0018](../../architecture/adrs/core/0018-piramide-pruebas-gates-calidad.es.md) (pirámide 70/20/10), [ADR-0052](../../architecture/adrs/core/0052-estrategia-aislamiento-pruebas-unitarias.es.md) (aislamiento unitario) y [ADR-0053](../../architecture/adrs/core/0053-estrategia-pruebas-integracion-e2e.es.md) (Testcontainers y E2E).

</details>

<details>
<summary><strong>Seguridad</strong></summary>

| Documento | Tipo | R/O | Propósito |
| :-------- | :--- | :-: | :-------- |
| [Plan de Pruebas de Seguridad](../../governance/standards/testing/plan-seguridad.es.md) | Plantilla | **R** | Controles por tipo de producto, herramientas con instalación/uso/licencia, criterios de aceptación, ejemplo de reporte |
| [Estrategia de Pruebas de Seguridad](../../governance/sdlc/estrategia-seguridad.es.md) | Guía | **R** | Flujo paso a paso con diagramas Mermaid: threat modeling → secret scanning → SAST → SCA → DAST → pentest → mobile → compliance. Checklist ejecutable, matriz de decisión para RC, KPIs |

#### Seguridad Web

| Herramienta | Propósito | Cuándo | Estándar | Instalación | Uso | Licencia |
| :---------- | :-------- | :----- | :------- | :---------- | :-- | :------- |
| [OWASP ZAP](https://www.zaproxy.org/) | DAST automatizado — escaneo de vulnerabilidades web/API | RC | OWASP ASVS L2 | [guía](https://www.zaproxy.org/download/) | [docs](https://www.zaproxy.org/docs/desktop/start/) | Apache 2.0 — gratuita |
| [Burp Suite](https://portswigger.net/burp) | Pentest manual (autorización, lógica de negocio) | Anual | OWASP ASVS | [Community](https://portswigger.net/burp/communitydownload) | [docs](https://portswigger.net/burp/documentation/desktop/getting-started) | Community (gratuita) / Pro (paga) |
| [CodeQL](https://codeql.github.com/) | SAST en CI/CD (vulnerabilidades en código) | Cada push | OWASP ASVS, CWE | [CLI](https://docs.github.com/en/code-security/codeql-cli/getting-started-with-the-codeql-cli) | [docs](https://codeql.github.com/docs/) | Gratuito repos públicos; licencia privados |
| [SonarQube](https://www.sonarsource.com/products/sonarqube/) | Calidad código + security hotspots | Cada push | OWASP, MISRA | [server](https://docs.sonarsource.com/sonarqube/latest/setup-and-upgrade/install-the-server/) | [guía](https://docs.sonarsource.com/sonarqube/latest/user-guide/) | Community (gratuita) / Dev+Enterprise (paga) |

#### Seguridad Mobile (Android)

| Herramienta | Propósito | Cuándo | Estándar | Instalación | Uso | Licencia |
| :---------- | :-------- | :----- | :------- | :---------- | :-- | :------- |
| [MobSF](https://mobsf.github.io/) | SAST+DAST móvil — análisis APK, permisos, almacenamiento | Pre-release mobile | OWASP MASVS L2 | [guía](https://mobsf.github.io/Mobile-Security-Framework-MobSF/#installation) | [docs](https://mobsf.github.io/Mobile-Security-Framework-MobSF/#usage) | GPL 3.0 — gratuita |
| [Frida](https://frida.re/) | Instrumentación dinámica — runtime, SSL pinning, root detection | Anual | OWASP MASTG | [instalación](https://frida.re/docs/installation/) | [ejemplos](https://frida.re/docs/examples/) | wxWindows — gratuita |

#### Seguridad de Servicios API

| Herramienta | Propósito | Cuándo | Estándar | Instalación | Uso | Licencia |
| :---------- | :-------- | :----- | :------- | :---------- | :-- | :------- |
| [OWASP ZAP](https://www.zaproxy.org/) | Escaneo APIs REST/gRPC contra OWASP API Top 10 | RC | OWASP API Top 10 | [guía](https://www.zaproxy.org/download/) | [docs](https://www.zaproxy.org/docs/desktop/start/) | Apache 2.0 — gratuita |
| [Postman](https://www.postman.com/) | Pruebas manuales de autorización y autenticación | Pre-release mayor | OWASP API Top 10 | [descarga](https://www.postman.com/downloads/) | [docs](https://learning.postman.com/docs/getting-started/introduction/) | Free (limitado) / Team+Enterprise (paga) |
| [Burp Suite](https://portswigger.net/burp) | Pentest manual de autorización y rate limiting | Pre-release mayor | OWASP API Top 10 | [Community](https://portswigger.net/burp/communitydownload) | [docs](https://portswigger.net/burp/documentation/desktop/getting-started) | Community (gratuita) / Pro (paga) |

#### Seguridad de Base de Datos

| Herramienta | Propósito | Cuándo | Estándar | Instalación | Uso | Licencia |
| :---------- | :-------- | :----- | :------- | :---------- | :-- | :------- |
| [Trivy](https://trivy.dev/) | Escaneo imágenes Docker, dependencias, IaC | Cada deploy | CIS Benchmarks | [instalación](https://trivy.dev/latest/getting-started/installation/) | [docs](https://trivy.dev/latest/docs/) | Apache 2.0 — gratuita |
| [SQLMap](http://sqlmap.org/) | Detección automatizada de SQLi | Pentest | OWASP WSTG | [guía](https://sqlmap.org/#installation) | [wiki](https://github.com/sqlmapproject/sqlmap/wiki/Usage) | GPL 2.0 — gratuita |

#### Seguridad Transversal

| Herramienta | Propósito | Cuándo | Estándar | Instalación | Uso | Licencia |
| :---------- | :-------- | :----- | :------- | :---------- | :-- | :------- |
| [Snyk](https://snyk.io/) | SCA — escaneo dependencias contra CVE database | Cada push | OWASP Top 10, NVD | [CLI](https://docs.snyk.io/snyk-cli/install-the-snyk-cli) | [docs](https://docs.snyk.io/) | Free (limitado) / Team+Enterprise (paga) |
| [Dependency Check](https://owasp.org/www-project-dependency-check/) | SCA — escaneo dependencias OSS | Cada push | OWASP Top 10, NVD | [guía](https://owasp.org/www-project-dependency-check/) | [docs](https://owasp.org/www-project-dependency-check/documentation/) | Apache 2.0 — gratuita |
| [Trivy](https://trivy.dev/) | Escaneo contenedores y configuraciones IaC | Cada deploy | CIS Benchmarks | [instalación](https://trivy.dev/latest/getting-started/installation/) | [docs](https://trivy.dev/latest/docs/) | Apache 2.0 — gratuita |
| [GitLeaks](https://gitleaks.io/) | Prevención de secretos en código | Pre-commit hook | — | [instalación](https://github.com/gitleaks/gitleaks#installing) | [uso](https://github.com/gitleaks/gitleaks#usage) | MIT — gratuita |
| [TruffleHog](https://trufflesecurity.com/) | Escaneo de secretos en repos e imágenes | Pre-commit / CI | — | [instalación](https://github.com/trufflesecurity/trufflehog#installation) | [uso](https://github.com/trufflesecurity/trufflehog#usage) | AGPL 3.0 — gratuita |

> Las decisiones arquitectónicas sobre seguridad se consultan en el [Hub de ADRs](../../architecture/adrs/README.md) como referencia complementaria.

</details>

<details>
<summary><strong>Opcionales</strong></summary>

| Documento | Tipo | R/O/C | Propósito | Cuándo usarlo | Estándar |
| :-------- | :--- | :---- | :-------- | :------------ | :------- |
| [Guía de Pruebas de Contrato](../../governance/standards/engineering/guia-pruebas-contrato.es.md) | Estándar | C | Contract testing (REST/gRPC/eventos): flujo Pact + OpenAPI + Protobuf + AsyncAPI, integración CI/CD, reglas por tipo de contrato, relación con seguridad | APIs entre servicios, F2 — Diseño / F3 — Construcción | Pact, OpenAPI 3.1, Protobuf, AsyncAPI 2.6 |
| [Evaluación de Riesgo de Proveedor](../../governance/standards/engineering/evaluacion-riesgo-proveedor.es.md) | Plantilla | O | Vendor Risk Assessment: cuestionario VRA (seguridad/licencia/operativo/SCA), flujo de decisión, integración con SCA y estrategia de seguridad | Evaluación de dependencias nuevas, pre-release con terceros | NIST SP 800-161, ISO 27001 A.15 |

</details>

---

[Volver al README principal](../../../README.md)
