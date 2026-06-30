# Glosario Corporativo

Terminología controlada del corpus Unimar Arch. Para las reglas de validación de términos, ver `../../.harness/rules/terminology-glosario.md`.

---

## Ciclo de Vida (SDLC)

| Término | Definición |
| :------ | :--------- |
| **Fase 1 — Concepción y Descubrimiento** | Validación de mercado, perfilado de personas, alcance, aprobación de negocio. |
| **Fase 2 — Diseño y Arquitectura** | Selección de patrones, esquemas de BD, contratos API y registro de decisiones. |
| **Fase 3 — Construcción** | Codificación, pruebas unitarias, integración continua y merge de PR. |
| **Fase 4 — Validación y QA** | Regresión, pruebas de aceptación, sellado de release candidate. |
| **Fase 5 — Entrega y Operaciones** | Despliegue, monitoreo, runbooks y producción activa. |
| **Gate** | Punto de control basado en evidencia que bloquea el avance entre fases. |
| **Waiver** | Excepción temporal a un gate con owner, fecha de expiración y plan de mitigación. |
| **Artefacto** | Documento, diagrama o definición producido como resultado de una actividad del SDLC. |
| **Hito** | Evento objetivo discreto que marca la finalización absoluta de una fase. |
| **Puerta de Calidad** | Revisión formal que evalúa métricas bloqueantes antes de avanzar de fase. |
| **Definición de Hecho (DoD)** | Checklist no negociable que un entregable debe satisfacer para considerarse completo. |
| **Cadena de Trazabilidad** | Secuencia PRD → FS → US → TS + ADR → PR → TSR → RN que conecta requisito con evidencia de release. |
| **Delta Documental** | Documentación requerida cuando un cambio modifica comportamiento, API u operación. |
| **Evidencia** | Prueba objetiva requerida para aprobar un gate. |

---

## Artefactos del SDLC

| Término | Definición |
| :------ | :--------- |
| **PRD** | _Product Requirements Document_ — documento de requisitos de producto con visión, objetivos y especificaciones. |
| **Épica** | Historia de gran tamaño que agrupa varias historias funcionales con un objetivo de negocio común. |
| **Backlog Ágil** | Agrupación versionada de historias listas para priorización. |
| **FS** | _Functional Story_ — historia funcional: contrato de comportamiento verificable entre Producto y Construcción. |
| **US** | _User Story_ — historia de usuario: requisito atómico con contexto de negocio y criterios BDD. |
| **TS** | _Technical Story_ — historia técnica: descomposición técnica de una historia funcional en tareas de implementación. |
| **ADR** | _Architecture Decision Record_ — registro formal de una decisión arquitectónica con estado, contexto y consecuencia. |
| **PR** | _Pull Request_ — solicitud de integración de cambios que referencia la TS que implementa. |
| **TSR** | _Test Summary Report_ — reporte resumen de pruebas: métricas, umbrales y evidencia del release candidate. |
| **RN** | _Release Notes_ — notas de lanzamiento que documentan cambios, limitaciones y dependencias de una versión. |
| **HF** | _Hotfix_ — parche urgente sobre producción que salta el ciclo SDLC normal. |
| **Lienzo de Descubrimiento** | Registro de iniciativa, dolor del cliente y valor esperado para exploración rápida de problemas. |
| **Caso de Negocio ROI** | Sustento formal de viabilidad financiera y retorno de inversión. |
| **Estimación Preliminar** | Tallas relativas de esfuerzo, duración y costo antes de comprometer capacidad. |

---

## Umbrales de Calidad

| Término | Definición |
| :------ | :--------- |
| **Cobertura de Código** | Mínimo 80 % sobre lógica de negocio. |
| **Complejidad Ciclomática** | Máximo 15 por método o función. |
| **CVEs High/Critical** | Cero tolerados en gates de salida. |
| **Deuda Técnica** | Ratio menor a 5 %. |
| **Pirámide de Pruebas** | Distribución objetivo: 70 % unitarias / 20 % integración / 10 % E2E. |

---

## Pruebas y Testing

| Término | Definición |
| :------ | :--------- |
| **Pruebas Unitarias** | Validan una unidad de código de forma aislada (función, método, clase). Sin BD, sin red, sin archivos. Corren en cada commit. Representan el 70% del esfuerzo de pruebas. |
| **Pruebas de Integración** | Validan que los adaptadores funcionan con infraestructura real (BD, caché, bróker, API externa). Usan Testcontainers. Representan el 20% del esfuerzo. |
| **Pruebas E2E (End-to-End)** | Validan flujos completos desde la interfaz hasta la BD. Lentas y frágiles; se ejecutan solo en Release Candidate. Representan el 10% del esfuerzo. |
| **Pruebas Funcionales** | Validan que el sistema se comporta según lo esperado por el usuario y el negocio. Incluyen manuales, exploratorias y de aceptación (UAT). |
| **Pruebas de Contrato (Contract Testing)** | Validan que consumidor y proveedor de una API acuerdan el mismo contrato (request/response). Previenen rupturas silenciosas en integración. Implementado con Pact. |
| **Consumer-Driven Contracts (CDC)** | Enfoque donde el consumidor define las expectativas del contrato y el proveedor verifica que las cumple. Implementado con Pact. |
| **Pruebas de Performance** | Validan requisitos no funcionales (NFRs) de velocidad, capacidad y estabilidad bajo diferentes condiciones de carga. |
| **Pruebas de Carga (Load Testing)** | Validan que el sistema soporta la carga esperada (concurrentes, throughput) dentro de los SLAs. Herramienta: k6. |
| **Pruebas de Stress** | Llevan el sistema más allá de su capacidad esperada para identificar el punto de quiebre y el comportamiento ante fallo. |
| **Pruebas de Caos (Chaos Engineering)** | Disciplina de experimentar en sistemas distribuidos para descubrir debilidades antes de que afecten a producción. Herramientas: Gremlin, Chaos Toolkit. |
| **Smoke Tests** | Pruebas rápidas post-deploy que validan que el sistema desplegado funciona mínimamente (health checks + HTTP 200). |
| **Flaky Test** | Prueba que falla intermitentemente sin cambios de código. Debe corregirse o eliminarse. No se permiten en gates de calidad. |
| **TDD (Test-Driven Development)** | Metodología donde se escribe la prueba antes de implementar el código (ciclo red-green-refactor). |
| **Mock** | Objeto que simula una dependencia y verifica interacciones (métodos llamados, parámetros). |
| **Stub** | Objeto que simula una dependencia y devuelve valores predefinidos sin verificar interacciones. |
| **Testcontainers** | Librería para contenedores Docker desechables en pruebas de integración, garantizando paridad con producción. |
| **Pact** | Framework de consumer-driven contract testing. Estándar de industria (adoptado por Google, Microsoft, Amazon, Spotify). Licencia MIT. |
| **Pact Broker** | Repositorio centralizado de contratos Pact con versionado, comparación y verificación cruzada. |
| **k6** | Herramienta de pruebas de carga y rendimiento, proyecto CNCF incubated. Scripts en JS/TS. CLI gratuita (AGPL 3.0), Cloud (paga). |
| **UAT (User Acceptance Testing)** | Pruebas de aceptación con usuarios reales en entorno pre-producción. Validan que el sistema cumple las expectativas del negocio. |
| **Playwright** | Framework de automatización de navegadores para pruebas E2E web. |
| **Cypress** | Framework de testing front-end para E2E web. |
| **Maestro** | Framework de pruebas E2E declarativas para aplicaciones móviles. |

---

## Dominio de Negocio — Unimar (Logística y Aduanas)

| Término | Definición |
| :------ | :--------- |
| **Sucursal** | Instalación operativa de Unimar habilitada para servicios aduaneros y logísticos. Dimensión transversal del negocio. |
| **Operador** | Usuario interno de Unimar con acceso autenticado al sistema. |
| **Rol** | Conjunto nombrado de permisos asignado a un operador. |
| **Sucursal Autorizada** | Sucursal sobre la que un operador tiene permiso de ejecutar operaciones. |
| **Despacho** | Proceso completo de importación o exportación de una mercancía. Entidad raíz del dominio. |
| **DUA** | Declaración Única de Aduanas — documento oficial SUNAT para importación y exportación. |
| **Numeración** | Acto de SUNAT de asignar número oficial al DUA. |
| **Régimen Aduanero** | Modalidad legal del despacho (importación, exportación, admisión temporal, etc.). |
| **Canal de Control** | Clasificación SUNAT: Verde (documental), Naranja (revisión), Rojo (aforo físico). |
| **Levante** | Autorización de SUNAT para retirar la mercancía del almacén. |
| **Tributos** | Aranceles, IGV y percepciones liquidados en el despacho de importación. |
| **Valor CIF** | Costo + Seguro + Flete — base imponible para el cálculo de tributos. |
| **Contenedor** | Unidad de carga intermodal estándar ISO 6346. |
| **BL** | _Bill of Lading_ — conocimiento de embarque marítimo. |
| **ETA** | _Estimated Time of Arrival_ — fecha estimada de arribo de la nave al puerto. |
| **Transferencia** | Movimiento físico de contenedor entre sucursales. |
| **Almacén Aduanero** | Instalación autorizada por SUNAT para custodia bajo control aduanero. |
| **Depósito Temporal** | Almacén aduanero para custodia desde la descarga hasta la numeración del DUA. |
| **Aforo** | Inspección física de mercancía ordenada por SUNAT (canal rojo). |
| **Ubicación** | Posición física en el almacén con formato [nave-fila-columna-nivel]. |
| **Precinto** | Dispositivo de seguridad del contenedor. |
| **Orden de Transporte** | Instrucción interna de asignación de vehículo, conductor y ruta. |
| **Guía de Remisión** | Documento SUNAT para traslado físico de mercancía. |
| **Ventana de Retiro** | Horario acordado para retiro de carga del almacén. |
| **Cliente** | Empresa con contrato activo de servicios aduaneros con Unimar. |
| **Contrato** | Acuerdo marco de condiciones de servicio entre Unimar y cliente. |
| **Tarifa** | Precio unitario acordado por tipo de servicio. |
| **Liquidación** | Documento de cobro al cierre de un despacho. |
| **Nota de Crédito** | Documento que reduce el importe de una liquidación emitida. |
| **Permiso** | Acción específica del sistema (ej. `despacho:numerarDUA`). |
| **Data Maestra** | Datos de referencia del negocio (clientes, tarifas, catálogos). |
| **Patio** | Instalación de contenedores con control de acceso (garita, balanza). |
| **Depósito Simple** | Almacén para custodia simple no aduanera. |
| **Depósito Autorizado** | Almacén autorizado por SUNAT. |
| **SINTAD** | Sistema de SUNAT para trámite aduanero. |
| **TEU** | _Twenty-foot Equivalent Unit_ — unidad de medida de contenedores. |
| **GRE** | Guía de Remisión Electrónica — documento SUNAT para traslado de mercancía. |
| **IGV** | Impuesto General a las Ventas — impuesto peruano. |
| **OSE** | Operador de Servicios Electrónicos — entidad peruana de facturación electrónica. |
| **RUC** | Registro Único de Contribuyentes — identificador fiscal peruano. |
| **SUNAT** | Superintendencia Nacional de Aduanas y de Administración Tributaria — entidad fiscal peruana. |

---

## Sistemas de la Suite Unimar

| Término | Definición |
| :------ | :--------- |
| **Depósito Temporal** | Sistema de gestión de mercancías bajo régimen aduanero (núcleo operativo). |
| **Contenedores Vacíos** | Sistema de control de inventario de contenedores (núcleo operativo). |
| **Transportes** | Sistema de planificación y ejecución de transporte (núcleo operativo). |
| **Almacenes** | Sistema de gestión de almacenamiento (núcleo operativo). |
| **Facturación** | Sistema de generación de comprobantes electrónicos (núcleo operativo). |
| **Data Maestra** | Sistema central de datos de referencia (_source of truth_) (apoyo al negocio). |
| **Gestión Comercial** | CRM interno, contratos y tarifas (apoyo al negocio). |
| **Patios** | Sistema de control de acceso y pesaje (apoyo al negocio). |
| **SIL** | Servicios Logísticos — coordinación operativa transversal (apoyo al negocio). |
| **UMS** | _Unified Management System_ — gestión centralizada de identidades, roles y permisos (servicio transversal). |
| **Hub de Notificaciones** | Servicio centralizado de mensajería y alertas (servicio transversal). |
| **Sistema de Integraciones** | Capa de integración con sistemas externos vía ESB / iPaaS (servicio transversal). |
| **Plataforma de Datos** | Capa de datos y analítica: ingesta, almacenamiento, BI (data y analítica). |

---

## Arquitectura — Patrones y Conceptos

| Término | Definición |
| :------ | :--------- |
| **Arquitectura Hexagonal** | Patrón de Puertos y Adaptadores: el dominio permanece puro sin depender de frameworks, BD ni proveedores externos. |
| **Monolito Modular** | Proceso único con módulos lógicamente aislados por contexto acotado. |
| **Microservicios** | Servicios autónomos, desplegables independientemente, cada uno con su propia base de datos. |
| **SOA** | _Service-Oriented Architecture_ — paradigma de integración enterprise con ESB. |
| **Contexto Acotado** | Límite explícito donde un modelo de dominio tiene significado preciso (_Bounded Context_). |
| **Core** | Contexto que genera ventaja competitiva directa (_Core Domain_). |
| **Supporting** | Contexto que apoya al core pero no es diferenciador (_Supporting Domain_). |
| **Generic** | Contexto commodity que puede comprarse o resolverse con OSS (_Generic Domain_). |
| **Lenguaje Ubicuo** | Vocabulario compartido entre el negocio y el código dentro de un contexto acotado. |
| **Puerto** | Contrato explícito (interfaz) entre el dominio y sistemas externos. |
| **Adaptador** | Implementación concreta de un puerto. |
| **ACL** | _Anti-Corruption Layer_ — capa que traduce un modelo externo al lenguaje del dominio. |
| **OHS** | _Open Host Service_ — servicio que publica API estable para múltiples consumidores. |
| **PL** | _Published Language_ — lenguaje de intercambio documentado (OpenAPI, AsyncAPI, Protobuf). |
| **Agregado** | _Aggregate_ — clúster de objetos de dominio tratados como una unidad transaccional. |
| **Value Object** | Objeto inmutable definido por sus atributos, sin identidad propia. |
| **Evento de Dominio** | Algo significativo que ocurrió en el dominio y que otros contextos pueden consumir. |
| **Result Pattern** | Patrón de manejo de errores con tipo `Result<T, E>` que evita excepciones. Usado con OneOf (.NET) y neverthrow (Node.js). |
| **Clean Architecture** | Arquitectura en capas de Robert C. Martin: Domain, Application, Infrastructure, Presentation. |
| **MVVM** | _Model-View-ViewModel_ — patrón de presentación con ViewModel que sobrevive cambios de configuración en Android. |
| **Offline-First** | Patrón donde la aplicación prioriza la operación sin conexión, usando almacenamiento local como Single Source of Truth. |
| **Blueprint de Referencia** | Modelo C4 canónico y topología de referencia corporativa. |
| **Línea Base Agnóstica** | Conjunto de estándares no negociables independientes del runtime que todo producto debe cumplir. |
| **Stack Tecnológico Autorizado** | Lista oficial de tecnologías aprobadas por runtime. |
| **Perfil de Runtime** | Conjunto de decisiones técnicas para un runtime declarado (.NET, Node.js, Android). |
| **Patrón Canónico** | Patrón de implementación reutilizable mapeado a una ADR aceptada (CP-01 a CP-12). |
| **Criterios de Extracción** | Regla «2 de 4» para decidir cuándo extraer un microservicio del monolito. |
| **Evolución Progresiva** | Estrategia: Monolito Simple → Monolito Modular → Microservicios. |
| **Strangler Fig** | Patrón de migración gradual que estrangula el monolito reemplazando funcionalidades una a una. |
| **Transactional Outbox** | Patrón que garantiza la publicación atómica de eventos junto con la transacción de base de datos. |
| **Saga** | Transacción distribuida con pasos de compensación (coreografía u orquestación). |
| **CQRS** | _Command Query Responsibility Segregation_ — separación de modelos de comando (escritura) y consulta (lectura). |
| **BFF** | _Backend for Frontend_ — API de borde especializada por canal cliente (web, móvil). |
| **API Gateway (2 niveles)** | Ingress Edge + NestJS BFF como arquitectura de gateway en dos niveles. |
| **Cache de 4 Niveles** | Cliente → CDN → BFF → Core. |
| **Aislamiento de Doble Capa** | Filtros de aplicación + RLS nativo de base de datos como failsafe de seguridad. |
| **Sucursal como Dimensión** | `sucursal_id` como atributo de negocio, no como tenant. |
| **Feature Flag** | Mecanismo para activar o desactivar funcionalidades sin desplegar código. |

---

## Estándares Internacionales

| Término | Definición |
| :------ | :--------- |
| **ISO/IEC 25010:2023 (SQuaRE)** | Estándar de calidad de software. Define atributos de eficiencia de rendimiento: Comportamiento Temporal, Capacidad, Utilización de Recursos. |
| **ISO/IEC 29119-4:2015** | Estándar de pruebas de software. Define diseño de pruebas de rendimiento, métricas y perfiles de carga. |
| **IEEE 829-2008** | Estándar de documentación de pruebas. Define la estructura canónica del plan de pruebas (10 secciones). |
| **ISO 27001:2022** | Estándar internacional de Sistema de Gestión de Seguridad de la Información (ISMS). |
| **NIST SP 800-115** | Guía técnica de NIST para pruebas de seguridad y evaluación. |
| **NIST SP 800-53 Rev. 5** | Catálogo de controles de seguridad y privacidad de NIST. |
| **NIST SP 800-161 Rev. 1** | Guía de gestión de riesgos en la cadena de suministro de TI. |
| **PCI DSS v4.0** | Estándar de seguridad de datos para la industria de tarjetas de pago. |
| **OpenAPI 3.1** | Especificación estándar para describir APIs REST. |
| **AsyncAPI 2.6** | Especificación estándar para APIs basadas en eventos asíncronos. |
| **Protobuf** | _Protocol Buffers_ — formato de serialización de datos de Google, usado con gRPC. |
| **gRPC** | Framework de RPC de alto rendimiento sobre HTTP/2 con serialización Protobuf. |
| **SemVer** | _Semantic Versioning_ — versionado semántico (major.minor.patch). Breaking changes requieren major version. |

---

## Resiliencia y Tolerancia a Fallos

| Término | Definición |
| :------ | :--------- |
| **Circuit Breaker** | Mecanismo que detiene llamadas a un servicio fallido para evitar saturación. |
| **Bulkhead** | Aislamiento de recursos (thread pool, conexiones) para evitar fallos en cascada. |
| **Retry with Backoff** | Reintento con retroceso exponencial y jitter. |
| **Timeout** | Límite de tiempo máximo de espera por respuesta. |
| **DLQ** | _Dead Letter Queue_ — cola de mensajes que no pudieron procesarse. |
| **Rate Limiting** | Control de tasa máxima de peticiones a un servicio o API. Previene abusos y garantiza equidad entre consumidores. |
| **Polly** | Librería de resiliencia para .NET: retry, circuit breaker, timeout, bulkhead, fallback. Estándar de facto en el ecosistema .NET. |
| **p-retry** | Librería de reintentos para promesas en Node.js. |
| **opossum** | Librería de circuit breaker para Node.js. |
| **Offline-First** | Patrón donde la aplicación prioriza la operación sin conexión, usando almacenamiento local como Single Source of Truth. |

---

## Seguridad e Identidad

| Término | Definición |
| :------ | :--------- |
| **Zero Trust** | Principio de no confiar en nada ni dentro ni fuera de la red. |
| **OAuth 2.0** | Framework de autorización delegada. |
| **OIDC** | _OpenID Connect_ — protocolo de autenticación federada sobre OAuth 2.0. |
| **SAML 2.0** | Protocolo de autenticación federada basado en XML. |
| **JWT** | _JSON Web Token_ — token de autenticación firmado (RS256). |
| **JWKS** | _JSON Web Key Set_ — conjunto de claves públicas para verificar JWT. |
| **RBAC** | _Role-Based Access Control_ — control de acceso basado en roles. |
| **ABAC** | _Attribute-Based Access Control_ — control de acceso basado en atributos. |
| **MFA** | _Multi-Factor Authentication_ — autenticación multifactor. |
| **Passkeys** | Claves de acceso FIDO2 / WebAuthn sin contraseña. |
| **WebAuthn** | API web de autenticación con llave pública. |
| **TOTP** | _Time-based One-Time Password_ — código temporal de un solo uso. |
| **mTLS** | TLS mutuo — autenticación bidireccional entre servicios. |
| **PII** | _Personally Identifiable Information_ — datos personales sensibles. |
| **CVE** | _Common Vulnerabilities and Exposures_ — vulnerabilidad de seguridad pública conocida. |
| **CVSS** | _Common Vulnerability Scoring System_ — sistema de puntuación de severidad de vulnerabilidades (v3.1). |
| **NVD** | _National Vulnerability Database_ — base de datos del gobierno de EE.UU. que almacena CVEs. |
| **RLS** | _Row-Level Security_ — seguridad a nivel de fila en base de datos. |
| **SAST** | _Static Application Security Testing_ — análisis estático de seguridad en CI, detecta vulnerabilidades en código fuente sin ejecutarlo. |
| **DAST** | _Dynamic Application Security Testing_ — análisis dinámico que ejecuta ataques simulados contra la aplicación en funcionamiento. |
| **SCA** | _Software Composition Analysis_ — análisis de dependencias que detecta CVEs conocidos en librerías de terceros. |
| **Secret Scanning** | Prevención de secretos (credenciales, tokens, API keys) en repositorios. Herramientas: GitLeaks, TruffleHog. |
| **Threat Modeling** | Modelado de amenazas para identificar riesgos de seguridad antes de codificar. Usa metodologías STRIDE y DREAD. |
| **STRIDE** | Metodología de categorización de amenazas: Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege. |
| **DREAD** | Sistema de priorización de riesgos: Damage, Reproducibility, Exploitability, Affected Users, Discoverability. |
| **Pentest (Pruebas de Penetración)** | Pruebas manuales de seguridad que simulan ataques reales para descubrir vulnerabilidades que las herramientas automatizadas no detectan. |
| **VRA (Vendor Risk Assessment)** | Evaluación de Riesgo de Proveedor. Sistema de puntuación (0-100) para decidir si una dependencia o servicio externo puede incorporarse al ecosistema. |
| **WAF** | _Web Application Firewall_ — firewall de aplicaciones web que filtra tráfico malicioso. |
| **CSP** | _Content Security Policy_ — cabecera HTTP que controla qué recursos puede cargar el navegador. |
| **HSTS** | _HTTP Strict Transport Security_ — cabecera HTTP que fuerza conexiones HTTPS. |
| **CodeQL** | Motor de análisis semántico de código para SAST integrado en GitHub. Gratuito en repos públicos. |
| **OWASP Top 10** | Las 10 vulnerabilidades web más críticas según OWASP. |
| **OWASP ASVS** | _Application Security Verification Standard_ — estándar de verificación de seguridad para aplicaciones web, 14 categorías, 3 niveles (L1, L2, L3). v4.0. |
| **OWASP MASVS** | _Mobile Application Security Verification Standard_ — estándar de verificación de seguridad para aplicaciones móviles. v2.0. |
| **OWASP WSTG** | _Web Security Testing Guide_ — guía de pruebas de seguridad web (12 capítulos). v5.0. |
| **OWASP MASTG** | _Mobile App Security Testing Guide_ — guía de pruebas de seguridad móvil. v2.0. |
| **OWASP API Top 10** | Lista de los 10 riesgos de seguridad más críticos en APIs. Versión 2023. |
| **OWASP ZAP** | _Zed Attack Proxy_ — escáner de seguridad dinámico (DAST) gratuito y open-source (Apache 2.0). |
| **Burp Suite** | Herramienta de pruebas de penetración manual y automática. Community (gratuita), Professional (paga). |
| **Snyk** | Plataforma SCA freemium para escaneo de dependencias contra CVE database. |
| **Dependency Check** | Herramienta OWASP SCA gratuita que escanea dependencias contra NVD (Apache 2.0). |
| **Trivy** | Escáner de vulnerabilidades para contenedores, IaC y dependencias (Apache 2.0, gratuita). |
| **MobSF** | _Mobile Security Framework_ — framework de análisis estático y dinámico para apps Android/iOS (GPL 3.0). |
| **Frida** | Toolkit de instrumentación dinámica para pruebas de runtime en mobile (wxWindows, gratuita). |
| **SQLMap** | Herramienta automatizada de detección y explotación de SQLi (GPL 2.0). |
| **GitLeaks** | Herramienta de detección de secretos en repositorios git (MIT, gratuita). |
| **TruffleHog** | Herramienta de escaneo de secretos en repos e imágenes (AGPL 3.0, gratuita). |
| **SQLi** | _SQL Injection_ — vulnerabilidad de inyección de código SQL malicioso. |
| **XSS** | _Cross-Site Scripting_ — vulnerabilidad de inyección de scripts en el navegador. |
| **CSRF** | _Cross-Site Request Forgery_ — vulnerabilidad de falsificación de petición entre sitios. |
| **SSRF** | _Server-Side Request Forgery_ — vulnerabilidad de falsificación de petición del lado del servidor. |
| **IDOR** | _Insecure Direct Object Reference_ — vulnerabilidad de referencia directa a objetos no autorizada. |
| **Certificate Pinning** | Técnica que asocia un certificado TLS específico a un host para prevenir ataques MITM. |
| **Root / Jailbreak Detection** | Detección de dispositivo rooteado (Android) o con jailbreak (iOS) en aplicaciones móviles. |
| **CIS Benchmarks** | Guías de configuración segura del Center for Internet Security, por tecnología (SQL Server, Docker, Kubernetes, etc.). |
| **Supply Chain Security** | Seguridad de la cadena de suministro de software (dependencias, imágenes base, proveedores). |
| **Threat Dragon** | Herramienta gratuita de modelado de amenazas de OWASP. |
| **Objection** | Herramienta de exploración de runtime para aplicaciones móviles. |
| **Drozer** | Herramienta de pruebas de seguridad para Android. |
| **TDE** | _Transparent Data Encryption_ — cifrado de datos en reposo en SQL Server. |

---

## Observabilidad y Operaciones

| Término | Definición |
| :------ | :--------- |
| **OpenTelemetry (OTel)** | Estándar de instrumentación de telemetría (logs, trazas, métricas). |
| **W3C Trace Context** | Estándar de propagación de contexto de traza distribuida (header `traceparent`). |
| **TraceId** | Identificador único de una traza distribuida. |
| **SpanId** | Identificador de un span dentro de una traza. |
| **Grafana** | Plataforma de dashboards y visualización. |
| **Grafana Loki** | Agregador de logs estructurados. |
| **Grafana Tempo** | Almacén de trazas distribuidas. |
| **Grafana Mimir** | Almacén de métricas escalable. |
| **Prometheus** | Sistema de recolección de métricas. |
| **RED** | _Rate, Errors, Duration_ — patrón de métricas para servicios. |
| **USE** | _Utilization, Saturation, Errors_ — patrón de métricas para infraestructura. |
| **Logs Estructurados** | Logs en formato JSON con metadatos (traceId, spanId, contexto). |
| **Health Check** | Endpoint de verificación de salud (readiness / liveness). |
| **Readiness Probe** | Sonda de preparación (Kubernetes). |
| **Liveness Probe** | Sonda de vida (Kubernetes). |
| **MTTR** | _Mean Time to Recover_ — tiempo medio de recuperación ante incidentes. |
| **RTO** | _Recovery Time Objective_ — tiempo máximo aceptable para recuperar el servicio. |
| **RPO** | _Recovery Point Objective_ — pérdida de datos máxima aceptable. |
| **Runbook** | Guía operativa paso a paso para la resolución de incidentes. |

---

## Infraestructura y DevOps

| Término | Definición |
| :------ | :--------- |
| **Docker Compose** | Orquestación de contenedores para desarrollo. |
| **Kubernetes (K8s)** | Orquestador de contenedores para producción. |
| **Helm v3** | Gestor de paquetes de Kubernetes. |
| **OCI Container** | Estándar de empaquetado de contenedores. |
| **Distroless** | Imagen base minimalista (Google) sin shell ni gestor de paquetes. |
| **Multi-stage build** | Compilación multi-etapa para imágenes Docker optimizadas. |
| **Ingress Controller** | API Gateway de borde basado en NGINX / OpenResty. |
| **MinIO** | Almacenamiento de objetos compatible con S3. |
| **HashiCorp Vault** | Gestor de secretos y credenciales. |
| **RabbitMQ** | Broker de mensajes AMQP. |
| **Kafka** | Broker de mensajes de alta escala y throughput. |
| **Redis** | Cache distribuida en memoria. |
| **PostgreSQL** | Base de datos relacional. |
| **SQL Server** | Base de datos relacional (perfil .NET). |
| **Dapr** | _Distributed Application Runtime_ — runtime para aplicaciones distribuidas. |
| **IaC** | _Infrastructure as Code_ — infraestructura como código. |
| **Sidecar** | Patrón de contenedor auxiliar (Dapr, Vault). |
| **Init-Container** | Contenedor de inicialización en Kubernetes. |
| **Blue/Green** | Estrategia de despliegue sin tiempo de inactividad. |
| **Multi-AZ** | Multi-Zona de Disponibilidad. |
| **Air-gapped** | Entorno desconectado sin acceso a internet. |
| **Nx** | Herramienta de orquestación de monorepo. |
| **SWC** | _Speedy Web Compiler_ — compilador Rust para TypeScript. |
| **GitFlow** | Estrategia de ramificación. |
| **GitHub Actions** | Plataforma de CI/CD de GitHub. |
| **Docker** | Plataforma de contenedores. Estándar de empaquetado de aplicaciones. |
| **Serilog** | Librería de logging estructurado JSON para .NET con enriquecimiento de contexto y sanitización PII. |
| **pino** | Logger estructurado JSON de alta velocidad para Node.js (5-10x más rápido que Winston). |
| **Sentry** | Plataforma de crash reporting con contexto enriquecido y breadcrumbs. Stack: .NET y Android. |
| **Husky** | Herramienta de Git hooks para automatizar verificaciones pre-commit. |
| **lint-staged** | Ejecuta linters solo en archivos en stage de git. |
| **Detekt** | Analizador estático de código Kotlin (complejidad, estilo, rendimiento). |
| **CSharpier** | Formateador de código C#. |
| **ktlint** | Formateador obligatorio de código Kotlin. |
| **ESLint v8** | Linter estricto para JavaScript/TypeScript. |
| **Prettier v3** | Formateador automático de código multi-lenguaje. |
| **Gradle Kotlin DSL + Version Catalog** | Sistema de build type-safe para Android/Kotlin con catálogo centralizado de dependencias. |
| **NestJS** | Framework opinado para Node.js con decoradores, DI nativo y modular. Lider empresarial en el ecosistema TypeScript. |
| **Dapper** | Micro-ORM para .NET de alta performance sin tracking. Hasta 10x más rápido en lecturas simples que EF Core. |
| **Hilt (Dagger)** | Inyección de dependencias automatizada para Android con scopes. |
| **Retrofit + OkHttp** | Cliente HTTP type-safe para Android con interceptors, caching y timeouts. |
| **Room** | ORM local de Android con Flow reactivo, migraciones y soporte SQLCipher. |
| **Coil** | Librería de carga de imágenes nativa para Jetpack Compose (Android). |
| **WorkManager** | API de Android para tareas en segundo plano con garantía de ejecución incluso si la app se cierra. |
| **DataStore** | Almacenamiento de preferencias en Android con Flow y type safety. Reemplazo definitivo de SharedPreferences. |
| **Jetpack Compose** | Toolkit de UI declarativa reactiva para Android. Estándar desde 2023. |
| **Maestro** | Framework de pruebas E2E declarativas para aplicaciones móviles (Android/iOS). |
| **MockWebServer** | Servidor HTTP mock de OkHttp para pruebas de integración Android. |
| **Turbine** | Librería de testing para Kotlin Flow. |
| **WireMock** | Servidor HTTP mock para pruebas de integración. |
| **ProGuard / R8 / DexGuard** | Herramientas de ofuscación y optimización de código Android. |

---

## Estándares de Ingeniería

| Término | Definición |
| :------ | :--------- |
| **Manifiesto de Ingeniería** | Los 7 principios que definen la cultura técnica del equipo. |
| **Tecnología Aburrida** | Preferir tecnología estable y predecible sobre novedades no probadas. |
| **Test-First** | Escribir la prueba antes del código (red-green-refactor). |
| **Fronteras Explícitas** | Separar conceptualmente antes de separar físicamente. |
| **Estándares sobre Heroísmo** | Reglas aplicadas en CI, no vigilancia individual. |
| **Evidencia sobre Opinión** | Decisiones respaldadas por datos y evidencia ejecutable. |
| **Higiene Open Source** | Reconocer y contribuir a proyectos de código abierto. |
| **SOLID** | Principios de diseño orientado a objetos. |
| **DRY** | _Don't Repeat Yourself_ — no repetir lógica. |
| **KISS** | _Keep It Simple, Stupid_ — mantener la simplicidad. |
| **YAGNI** | _You Ain't Gonna Need It_ — no añadir funcionalidad innecesaria. |
| **Contract First** | Definir el contrato (OpenAPI, Protobuf, AsyncAPI) antes de implementar. |
| **Cero SDKs en Dominio** | La capa de dominio no puede importar SDKs cloud, ORMs, HTTP ni ningún framework externo. |
| **kebab-case** | Convención de nomenclatura para archivos y directorios. |

---

## Método BMAD

| Término | Definición |
| :------ | :--------- |
| **BMAD Method** | Metodología de desarrollo dirigida por IA (v6.8.0). Capa de planificación y orquestación con inteligencia artificial. |
| **Skill** | Comando o habilidad de BMAD. 59 skills disponibles en `.opencode/commands/`. |
| **Elicitación** | Extracción estructurada de requisitos mediante técnicas de cuestionamiento profundo. |
| **PRFAQ** | _Press Release + FAQ_ — artefacto de visión de producto que describe el futuro como si ya hubiera sido lanzado. |
| **Spec** | Especificación canónica generada por BMAD que sirve como contrato máquina para el trabajo downstream. |
| **AI-DD** | _AI-Driven Development_ — desarrollo dirigido por inteligencia artificial. |
| **Spec-driven AI-DD** | Flujo de desarrollo impulsado por especificaciones generadas y validadas por IA. |

---

## Gobernanza del Repositorio

| Término | Definición |
| :------ | :--------- |
| **Architecture Board** | Ente rector de las decisiones arquitectónicas corporativas. |
| **Operación de Herencia** | Etiqueta de registro (Adopt / Extend / Override / N/A) usada en `DECISIONS.md` para anotar el triage local de Unimar. |
| **Adopt** | Tomar la regla o plantilla sin modificaciones. |
| **Extend** | Tomar la regla y añadir extensiones locales sin contradecirla. |
| **Override** | Reemplazar la regla con justificación respaldada por una ADR local. |
| **N/A** | La regla no aplica al contexto de Unimar. |
| **Unimar Arch** | Repositorio de arquitectura de producto de Unimar, corpus corporativo de estándares, ADRs y patrones. |
| **Repositorio Satélite** | Repositorio que deriva de `unimar_arch` (ej. `unimar-sil`, `unimar-ops`). |
| **Evolith** | Proyecto base que inspiró la estructura de `unimar_arch`. Ver `license/NOTICE.md`. |
| **TOGAF ACMM** | Marco de evaluación de madurez de capacidades arquitectónicas. |
| **WAF** | _Well-Architected Framework_ — framework de AWS de buenas prácticas arquitectónicas (5 pilares). |

---

## Diagramación y Documentación

| Término | Definición |
| :------ | :--------- |
| **C4** | Modelo de diagramación arquitectónica en 4 niveles: Contexto, Contenedor, Componente, Código. |
| **Mermaid** | Herramienta de diagramas en Markdown basada en texto. |
| **BOM** | _Byte Order Mark_ — marca de orden de bytes, prohibida en archivos UTF-8 del corpus. |

---

## Acrónimos Técnicos (Conservados Verbatim)

| Término | Significado |
| :------ | :---------- |
| **ACL** | Anti-Corruption Layer |
| **API** | Application Programming Interface |
| **APM** | Application Performance Monitoring |
| **BFF** | Backend for Frontend |
| **CI/CD** | Continuous Integration / Continuous Deployment |
| **CLS** | Continuation Local Storage |
| **CORS** | Cross-Origin Resource Sharing |
| **CQRS** | Command Query Responsibility Segregation |
| **CRUD** | Create, Read, Update, Delete |
| **DDD** | Domain-Driven Design |
| **DI** | Dependency Injection |
| **DLQ** | Dead Letter Queue |
| **DR** | Disaster Recovery |
| **DTO** | Data Transfer Object |
| **E2E** | End-to-End |
| **EDA** | Event-Driven Architecture |
| **ELT/ETL** | Extract, Load, Transform / Extract, Transform, Load |
| **ESB** | Enterprise Service Bus |
| **FIFO** | First In, First Out |
| **gRPC** | gRPC Remote Procedure Calls |
| **HTTP/HTTPS** | Hypertext Transfer Protocol |
| **IAM** | Identity and Access Management |
| **IdP** | Identity Provider |
| **JSON** | JavaScript Object Notation |
| **K8s** | Kubernetes |
| **KMS** | Key Management Service |
| **KPI** | Key Performance Indicator |
| **mTLS** | Mutual TLS |
| **MVP** | Minimum Viable Product |
| **NFR** | Non-Functional Requirement |
| **OHS** | Open Host Service |
| **ORM** | Object-Relational Mapping |
| **OTel** | OpenTelemetry |
| **P95 / P99** | Percentil 95 / 99 |
| **PL** | Published Language |
| **REST** | Representational State Transfer |
| **SaaS** | Software as a Service |
| **SDK** | Software Development Kit |
| **SLA / SLI / SLO** | Service Level Agreement / Indicator / Objective |
| **SSO** | Single Sign-On |
| **TLS** | Transport Layer Security |
| **SAST** | Static Application Security Testing |
| **SCA** | Software Composition Analysis |
| **DAST** | Dynamic Application Security Testing |
| **CVE** | Common Vulnerabilities and Exposures |
| **CVSS** | Common Vulnerability Scoring System |
| **NVD** | National Vulnerability Database |
| **IDOR** | Insecure Direct Object Reference |
| **XSS** | Cross-Site Scripting |
| **SSRF** | Server-Side Request Forgery |
| **SQLi** | SQL Injection |
| **CSRF** | Cross-Site Request Forgery |
| **HSTS** | HTTP Strict Transport Security |
| **CSP** | Content Security Policy |
| **WAF** | Web Application Firewall |
| **TDE** | Transparent Data Encryption |
| **VRA** | Vendor Risk Assessment |
| **MTTR** | Mean Time to Recover / Resolve |
| **RTO** | Recovery Time Objective |
| **RPO** | Recovery Point Objective |
| **RGPD** | Reglamento General de Protección de Datos (GDPR) |
| **SOC** | System and Organization Controls |
| **UAT** | User Acceptance Testing |
| **UI / UX** | User Interface / User Experience |
| **UUID** | Universally Unique Identifier |
| **XML** | eXtensible Markup Language |
| **YAML** | YAML Ain't Markup Language |

---

## Antipatrones

| Término | Definición |
| :------ | :--------- |
| **Monolito Distribuido** | Servicios separados físicamente pero acoplados sincrónicamente: lo peor de ambos mundos. |
| **Nanoservicios** | Descomposición atómica excesiva que genera sobrecarga de comunicaciones. |
| **God Module** | Módulo que absorbe demasiada lógica y responsabilidades. |
| **Fat Controller / Smart Pipe** | Lógica de negocio en gateway o bus en lugar de en el dominio. |
| **CV-Driven Development** | Elegir tecnología por moda o para engrosar el currículum. |
| **Big Bang Rewrite** | Reescritura completa del sistema de golpe (evitar con Strangler Fig). |
| **Gran Bola de Lodo** | Sistema sin arquitectura coherente, donde todo depende de todo. |
| **Leaky Shared Library** | Librería compartida que filtra lógica de dominio entre contextos no relacionados. |

---

> **Nota:** Para reglas automatizadas de validación de términos, ver `../../.harness/rules/terminology-glosario.md`. Para añadir un nuevo término, actualizar este archivo y la regla de validación simultáneamente.
