# Plan de Pruebas de Seguridad

> **Estándares de Referencia:** [OWASP ASVS v4.0](https://owasp.org/www-project-application-security-verification-standard/) (Application Security Verification Standard), [OWASP WSTG v5.0](https://owasp.org/www-project-web-security-testing-guide/) (Web Security Testing Guide), [OWASP MASTG v2.0](https://mas.owasp.org/) (Mobile App Security Testing Guide), [NIST SP 800-115](https://csrc.nist.gov/publications/detail/sp/800-115/final) (Technical Guide to Information Security Testing), [NIST SP 800-53](https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final) (Security Controls), [ISO 27001](https://www.iso.org/standard/27001) (ISMS).
> **Propósito:** Definir la estrategia de pruebas de seguridad segmentada por tipo de producto (web, mobile, servicios API, base de datos), con herramientas, estándares y criterios de aceptación claros.

---

## 1. Estructura del Plan de Pruebas de Seguridad

Todo plan de pruebas de seguridad DEBE segmentarse por tipo de producto, aplicando el estándar internacional correspondiente:

| Tipo de Producto | Estándar Principal | Estándar Complementario | Herramientas |
| :--------------- | :----------------- | :---------------------- | :----------- |
| **Web** | OWASP ASVS v4.0 (nivel L2+) | OWASP WSTG v5.0, NIST SP 800-115 | OWASP ZAP, Burp Suite, CodeQL, SonarQube |
| **Mobile (Android/iOS)** | OWASP MASVS v2.0 | OWASP MASTG v2.0, NIST SP 800-163 | MobSF, Drozer, Frida, Objection |
| **Servicios API (REST/gRPC)** | OWASP API Security Top 10 2023 | OWASP ASVS v4.0 (cap. 13), NIST SP 800-115 | OWASP ZAP, Postman, k6 (seguridad), CodeQL |
| **Base de Datos** | CIS Benchmarks | NIST SP 800-53 (AC, IA, SC), ISO 27001 A.9, A.10 | Trivy, SQLMap, Detect (auditoría), proveedores cloud |

---

## 2. Formato Canónico del Plan

> Instrucciones: Crear en el repositorio del producto como `docs/planning-artifacts/security/plan-seguridad-<producto>-<NNN>.es.md`.

```markdown
---
id: PS-<producto>-<NNN>
producto: <Nombre del producto>
versión: <X.Y.Z>
fecha: <YYYY-MM-DD>
autor: <Nombre>
estado: Borrador | Aprobado | Ejecutado
estándar: OWASP ASVS v4.0 | OWASP MASVS v2.0 | OWASP API Top 10 2023 | CIS Benchmarks
nivel: L1 | L2 | L3
---

# Plan de Pruebas de Seguridad: <título>

## 1. Alcance

| Componente | Tipo | Versión | Estándar Aplicable |
| :--------- | :--- | :------ | :----------------- |
| <Portal Web de Clientes> | Web | 2.1.0 | OWASP ASVS L2 + WSTG |
| <API de Órdenes> | API REST | 1.2.0 | OWASP API Top 10 |
| <App Móvil Operador> | Android | 3.0.0 | OWASP MASVS L2 |
| <Base de Datos SQL Server> | BD | 2022 | CIS SQL Server Benchmark |

## 2. Controles por Tipo de Producto

### Web

| Categoría OWASP ASVS | Controles a Verificar | Herramienta | Criterio de Aceptación |
| :------------------- | :-------------------- | :---------- | :--------------------- |
| V2 — Autenticación | ¿Requiere MFA? ¿Bloqueo por intentos? ¿Session management seguro? | Burp Suite, CodeQL | Sin vulnerabilidades críticas/altas |
| V3 — Gestión de Sesión | ¿Cookies Secure/HttpOnly? ¿Rotación de tokens? | OWASP ZAP | Sin vulnerabilidades medias+ |
| V4 — Control de Acceso | ¿RBAC implementado? ¿Pruebas de omisión vertical/horizontal? | Burp Suite | Sin ByPass de autorización |
| V5 — Validación de Entrada | ¿XSS? ¿SQLi? ¿SSRF? | OWASP ZAP + CodeQL | Cero XSS/SQLi reflejados |
| V8 — Protección de Datos | ¿Cifrado en tránsito (TLS 1.3)? ¿Campos PII en logs? | CodeQL + Serilog audit | Sin exposición de PII |
| V11 — Lógica de Negocio | ¿Rate limiting? ¿Business logic abuse? | Burp Suite | Límites configurados y probados |

### Mobile (Android)

| Categoría OWASP MASVS | Controles a Verificar | Herramienta | Criterio de Aceptación |
| :-------------------- | :-------------------- | :---------- | :--------------------- |
| V2 — Almacenamiento de Datos | ¿SQLCipher activo? ¿KeyStore? ¿No datos sensibles en SharedPrefs? | MobSF, Frida | Sin datos PII en texto plano |
| V3 — Comunicación | ¿Certificate pinning? ¿TLS 1.2+? ¿No HTTP plano? | Objection, proxying Burp | Sin tráfico no cifrado |
| V4 — Autenticación | ¿Biométrica? ¿MFA? ¿Tokens almacenados seguros? | Drozer, Frida | Tokens en KeyStore/EncryptedSharedPrefs |
| V5 — Código | ¿Ofuscación? ¿Root detection? ¿Debugging deshabilitado? | MobSF, APKTool | Protecciones activas en release build |
| V6 — Resiliencia | ¿Respuesta ante tampering? ¿Integridad de APK verificada? | Frida, Objection | App detecta y responde ante modificación |

### Servicios API (REST / gRPC)

| Categoría OWASP API Top 10 | Controles a Verificar | Herramienta | Criterio de Aceptación |
| :------------------------- | :-------------------- | :---------- | :--------------------- |
| API1 — Broken Object Level Auth | ¿Un usuario puede acceder a datos de otro? | Burp Suite (Autorization testing) | Cero Broken ACL |
| API2 — Broken Authentication | ¿Tokens débiles? ¿Sin rate limiting en login? | OWASP ZAP | Autenticación robusta + rate limit |
| API3 — Excessive Data Exposure | ¿La API devuelve más campos de los necesarios? | CodeQL + revisión manual | Solo campos del DTO expuestos |
| API4 — Lack of Resources & Rate Limiting | ¿Sin límite de requests? ¿Sin paginación forzada? | k6 + ZAP | Rate limiting configurado en API Gateway |
| API5 — Broken Function Level Auth | ¿Endpoint admin accesible desde rol user? | Burp Suite | RBAC verificado por endpoint |
| API8 — Injection | ¿SQLi, NoSQLi, command injection en parámetros? | OWASP ZAP + CodeQL | Cero injection vulnerabilities |
| API9 — Improper Assets Management | ¿Versiones antiguas de API expuestas? ¿Documentación Swagger accesible? | Revisión manual + ZAP | Solo versiones activas, Swagger restringido |

### Base de Datos

| Categoría CIS Benchmark | Controles a Verificar | Herramienta | Criterio de Aceptación |
| :---------------------- | :-------------------- | :---------- | :--------------------- |
| Autenticación y Acceso | ¿Cuentas por defecto eliminadas? ¿Principio de mínimo privilegio? | Trivy, auditoría manual | Sin cuentas default, permisos mínimos |
| Cifrado | ¿TDE activo? ¿Conexiones cifradas (TLS)? ¿Backups cifrados? | Auditoría DBA | Cifrado en reposo y tránsito |
| Auditoría | ¿Audit logs activos? ¿Retención configurada? | SQL Server Audit / PostgreSQL Audit | Todos los accesos críticos auditados |
| Parches | ¿Último CU/parche de seguridad aplicado? | Trivy | Sin CVEs críticos/altos sin parche |
| Network Security | ¿Firewall de BD activo? ¿Sin acceso desde internet? | Revisión de red | BD accesible solo desde servicios autorizados |

## 3. Herramientas de Seguridad — Guía de Referencia

| Herramienta | Tipo | Propósito | ¿Cuándo usarla? | Estándar | Instalación | Uso | Licencia |
| :---------- | :--- | :-------- | :-------------- | :------- | :---------- | :-- | :------- |
| [OWASP ZAP](https://www.zaproxy.org/) | DAST | Escaneo de seguridad dinámico de aplicaciones web y APIs | RC antes de sellar | OWASP WSTG | [guía](https://www.zaproxy.org/download/) | [docs](https://www.zaproxy.org/docs/desktop/start/) | Apache 2.0 — Open Source gratuita |
| [Burp Suite](https://portswigger.net/burp) | DAST + Manual | Pruebas de penetración manuales, autorización, lógica de negocio | Anual o pre-release mayor | OWASP ASVS | [Community](https://portswigger.net/burp/communitydownload) / [Professional](https://portswigger.net/burp/pro) | [docs](https://portswigger.net/burp/documentation/desktop/getting-started) | Community (gratuita) / Professional (paga) |
| [CodeQL](https://codeql.github.com/) | SAST | Análisis estático de código en CI/CD | Cada push (pipeline) | OWASP ASVS, CWE | [CLI](https://docs.github.com/en/code-security/codeql-cli/getting-started-with-the-codeql-cli) | [docs](https://codeql.github.com/docs/) | Gratuito en repos públicos; licencia para privados |
| [SonarQube](https://www.sonarsource.com/products/sonarqube/) | SAST | Calidad de código + security hotspots | Cada push (quality gate) | OWASP, CWE, MISRA | [server](https://docs.sonarsource.com/sonarqube/latest/setup-and-upgrade/install-the-server/) | [guía](https://docs.sonarsource.com/sonarqube/latest/user-guide/) | Community (LGPL, gratuita) / Developer+Enterprise (paga) |
| [Snyk](https://snyk.io/) | SCA | Escaneo de dependencias contra CVE database | Cada push, bloquea CVEs | OWASP Top 10, NVD | [CLI](https://docs.snyk.io/snyk-cli/install-the-snyk-cli) | [docs](https://docs.snyk.io/) | Free (limitado) / Team+Enterprise (paga) |
| [Dependency Check](https://owasp.org/www-project-dependency-check/) | SCA | Escaneo de dependencias OSS contra NVD | Cada push, bloquea CVEs | OWASP Top 10, NVD | [instalación](https://owasp.org/www-project-dependency-check/) | [docs](https://owasp.org/www-project-dependency-check/documentation/) | Apache 2.0 — Open Source gratuita |
| [Trivy](https://trivy.dev/) | SCA + Container | Escaneo de imágenes Docker, IaC, dependencias | CI/CD, pre-deploy | NVD, CIS Benchmarks | [instalación](https://trivy.dev/latest/getting-started/installation/) | [docs](https://trivy.dev/latest/docs/) | Apache 2.0 — Open Source gratuita |
| [MobSF](https://mobsf.github.io/Mobile-Security-Framework-MobSF/) | SAST + DAST Mobile | Análisis estático y dinámico de apps Android/iOS | Pre-release mobile | OWASP MASVS | [guía](https://mobsf.github.io/Mobile-Security-Framework-MobSF/#installation) | [docs](https://mobsf.github.io/Mobile-Security-Framework-MobSF/#usage) | GPL 3.0 — Open Source gratuita |
| [Frida](https://frida.re/) | Dynamic Mobile | Instrumentación dinámica para pruebas de runtime | Pentest mobile | OWASP MASTG | [instalación](https://frida.re/docs/installation/) | [ejemplos](https://frida.re/docs/examples/) | wxWindows — Open Source gratuita |
| [SQLMap](http://sqlmap.org/) | DAST BD | Detección y explotación automatizada de SQLi | Pentest específico | OWASP WSTG | [guía](https://sqlmap.org/#installation) | [wiki](https://github.com/sqlmapproject/sqlmap/wiki/Usage) | GPL 2.0 — Open Source gratuita |
| [k6](https://k6.io/) | Load + Security | Carga con rate limiting y brute force | RC | OWASP API Top 10 | [instalación](https://k6.io/docs/getting-started/installation/) | [docs](https://k6.io/docs/using-k6/) | AGPL 3.0 (CLI gratuita) / Cloud (paga) |
| [GitLeaks](https://gitleaks.io/) | Secret Scanning | Prevención de secretos en código | Pre-commit hook | — | [instalación](https://github.com/gitleaks/gitleaks#installing) | [uso](https://github.com/gitleaks/gitleaks#usage) | MIT — Open Source gratuita |
| [TruffleHog](https://trufflesecurity.com/) | Secret Scanning | Escaneo de secretos en repos e imágenes | Pre-commit / CI | — | [instalación](https://github.com/trufflesecurity/trufflehog#installation) | [uso](https://github.com/trufflesecurity/trufflehog#usage) | AGPL 3.0 — Open Source gratuita |

---

## 4. Frecuencia y Responsabilidades

| Tipo de Prueba | Frecuencia | Responsable | Integración en SDLC |
| :------------- | :--------- | :---------- | :------------------ |
| **SAST (CodeQL + SonarQube)** | Por push (automático) | Desarrollador | F3 — Construcción |
| **SCA (Snyk / Dependency Check)** | Por push (automático) | Desarrollador | F3 — Construcción |
| **DAST (OWASP ZAP)** | Por release candidate | QA / DevOps | F4 — Validación |
| **Pruebas de penetración manual (Burp Suite)** | Anual o cambio mayor de arquitectura | Auditor externo | F4 — Validación |
| **Mobile SAST (MobSF)** | Por release candidate mobile | QA Mobile | F4 — Validación |
| **Mobile DAST (Frida + Objection)** | Anual o cambio mayor | Auditor externo | F4 — Validación |
| **Escaneo de infraestructura (Trivy)** | Por deploy (CD) | DevOps | F5 — Entrega |
| **Auditoría de BD (CIS Benchmarks)** | Trimestral | DBA / DevOps | Transversal |

---

## 5. Criterios de Aceptación de Seguridad

La prueba de seguridad PASA solo si TODOS los siguientes criterios se cumplen:

| Criterio | Medición | ¿Qué pasa si falla? |
| :------- | :------- | :------------------ |
| **Cero vulnerabilidades críticas** | SAST + SCA + DAST | ❌ Bloquea el RC. No puede sellarse. |
| **Cero vulnerabilidades altas** | SAST + SCA + DAST | ❌ Bloquea el RC. No puede sellarse. |
| **Máximo N vulnerabilidades medias** | SAST + SCA + DAST | ⚠️ Las medias existentes tienen plan de mitigación documentado. |
| **TLS 1.2+ en todas las comunicaciones** | ZAP + revisión de red | ❌ Bloquea el RC. |
| **Sin secretos en código** | GitLeaks / TruffleHog en CI | ❌ Bloquea el commit. |
| **Sin dependencias con CVEs conocidos** | Snyk / Dependency Check | ❌ Bloquea el RC. |
| **OWASP ASVS L2 cumplido** (Web) | Test suite OWASP ZAP | ❌ Bloquea el RC. |
| **OWASP MASVS L2 cumplido** (Mobile) | MobSF + pruebas manuales | ❌ Bloquea el RC. |
| **Principio de mínimo privilegio en BD** | Auditoría de roles | ⚠️ Se documenta y planifica. |

---

## 6. Ejemplo de Reporte de Seguridad

```markdown
---
id: RS-UMS-001
producto: UMS — Módulo de Órdenes
versión: 1.2.0
fecha: 2026-06-15
estándar: OWASP ASVS L2, OWASP API Top 10
---

# Reporte de Pruebas de Seguridad

## Resultados por Tipo

| Tipo de Producto | Herramienta | Vulnerabilidades | Resultado |
| :--------------- | :---------- | :--------------- | :-------- |
| Web (Portal Clientes) | OWASP ZAP + Burp Suite | 0 críticas, 0 altas, 2 medias | ✅ PASA |
| API REST (Órdenes) | CodeQL + OWASP ZAP | 0 críticas, 0 altas, 0 medias | ✅ PASA |
| Mobile (App Operador) | MobSF + Frida | 0 críticas, 0 altas, 1 media | ✅ PASA |
| Base de Datos | Trivy + CIS Benchmark | 0 críticas, 1 alta (CU pendiente), 0 medias | ❌ FALLA |

## Detalle de Hallazgos

### Alta — BD: Cumulative Update pendiente (CU2026-05)
- **Componente:** SQL Server 2022
- **Riesgo:** Vulnerabilidad conocida sin parche
- **Mitigación:** Aplicar CU en ventana de mantenimiento del 20/06/2026
- **Plan:** TS-UMS-089 asignada, DevOps ejecutará el parche antes del release

### Media — Web: Cabecera X-Content-Type-Options ausente
- **Componente:** Portal Web
- **Riesgo:** MIME sniffing (bajo riesgo con CSP activo)
- **Mitigación:** Agregar cabecera en configuración de nginx
- **Plan:** Se corrige en el próximo sprint

## Decisión

**APROBADO CON CONDICIONES.** Las vulnerabilidades altas tienen plan de mitigación documentado y fecha de ejecución antes del release. Las medias se corrigen en el siguiente sprint.

Firma: _________________________  Fecha: _______________
QA Lead / Security Lead
```

---

## 7. Referencias y Estándares

| Estándar | Versión | ¿Qué cubre? | URL |
| :------- | :------ | :---------- | :-- |
| OWASP ASVS | v4.0 | Verification standard para aplicaciones web — 14 categorías, 3 niveles | https://owasp.org/www-project-application-security-verification-standard/ |
| OWASP WSTG | v5.0 | Guía de pruebas de seguridad web — 12 capítulos | https://owasp.org/www-project-web-security-testing-guide/ |
| OWASP MASVS | v2.0 | Verification standard para aplicaciones móviles | https://mas.owasp.org/ |
| OWASP MASTG | v2.0 | Guía de pruebas de seguridad móvil | https://mas.owasp.org/MASTG/ |
| OWASP API Top 10 | 2023 | Riesgos de seguridad específicos de APIs | https://owasp.org/www-project-api-security/ |
| NIST SP 800-115 | 2008 | Guía técnica para pruebas de seguridad | https://csrc.nist.gov/publications/detail/sp/800-115/final |
| NIST SP 800-53 | Rev. 5 | Controles de seguridad y privacidad | https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final |
| CIS Benchmarks | 2026 | Guías de configuración segura por tecnología | https://www.cisecurity.org/cis-benchmarks/ |
| ISO 27001 | 2022 | Sistema de gestión de seguridad de la información | https://www.iso.org/standard/27001 |
| PCI DSS | v4.0 | Seguridad de datos de tarjetas de pago (si aplica) | https://www.pcisecuritystandards.org/ |

---

## 8. ADRs Relacionados

| ADR | Título | ¿Qué define? |
| :-- | :----- | :----------- |
| ADR-0005 | Pipeline CI/CD con CodeQL | SAST automatizado en cada push |
| ADR-0009 | Gestión de Vulnerabilidades | Política de CVEs, SCA obligatorio |
| ADR-0012 | Autorización RBAC/ABAC | Control de acceso basado en roles |
| ADR-0020 | Abstracción de Identidad | OIDC, OAuth 2.0, SAML 2.0 |
| ADR-0044 | Seguridad Configurable en Persistencia | RLS, cifrado, aislamiento por sucursal |

---

[Volver a Estrategia de Pruebas](../../sdlc/estrategia-pruebas.es.md)
