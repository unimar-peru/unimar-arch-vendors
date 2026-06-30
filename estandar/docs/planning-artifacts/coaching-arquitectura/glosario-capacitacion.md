# Glosario del Plan de Capacitación

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Glosario%20de%20Capacitaci%C3%B3n-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
</p>

Este documento consolida los acrónimos, términos técnicos y conceptos corporativos que se utilizarán intensivamente durante los talleres del SDLC. Es de lectura obligatoria como *Pre-work*.

---

## 1. Conceptos Metodológicos
- **SDLC (Software Development Life Cycle):** Ciclo de Vida de Desarrollo de Software. Es el marco de trabajo estricto que dicta las fases por las que pasa un producto desde su idea hasta su puesta en producción en UNIMAR.
- **Quality Gate (Puerta de Calidad):** Punto de control obligatorio basado en evidencia al final de cada fase del SDLC. Si no se cumple (ej. cobertura de código baja, falta de un documento), el avance se bloquea matemáticamente.
- **Waiver:** Una excepción temporal y formalmente documentada (con fecha de expiración y dueño) que permite saltar un Quality Gate por una urgencia extrema de negocio.
- **RC (Release Candidate):** "Candidato a Lanzamiento". Es la versión empaquetada del software que ya superó las pruebas en ambiente de desarrollo y se envía a QA para certificación E2E.
- **Método BMAD:** Framework corporativo impulsado por IA (con 59 agentes especializados en arquitectura, producto y desarrollo) diseñado para guiar y auditar la creación de software dentro del repositorio `unimar_arch`.

## 2. Artefactos del SDLC
- **PRD (Product Requirements Document):** Documento de Requisitos del Producto. Actúa como el contrato inicial de negocio que define el *qué* y el *por qué* de un sistema.
- **ADR (Architecture Decision Record):** Registro de Decisión Arquitectónica. Documento inmutable que registra por qué se tomó una decisión técnica en un momento dado, las opciones evaluadas y las consecuencias futuras.
- **Test Summary Report:** Reporte ejecutivo emitido por el equipo de QA que consolida las métricas de calidad y aprueba el pase a producción de un *RC*.
- **Runbook:** Guía operativa de troubleshooting paso a paso diseñada para que el soporte Nivel 1 sepa cómo reaccionar ante una falla en producción sin escalar inmediatamente a desarrollo.

## 3. Conceptos de Arquitectura e Ingeniería
- **Bounded Context (Contexto Acotado):** Concepto de *Domain-Driven Design (DDD)* que traza un límite estricto alrededor de un modelo de negocio. Evita que dominios distintos (ej. Facturación vs. Transporte) se mezclen en un monolito gigante.
- **C4 Model:** Framework de notación técnica (Context, Containers, Components, Code) para dibujar arquitecturas de software mediante zoom-in, en lugar de usar cajas y flechas sin estandarizar.
- **Arquitectura Hexagonal (Ports and Adapters):** Patrón de diseño donde la lógica de negocio (el core) está aislada en el centro, y cualquier interacción exterior (base de datos, UI, APIs) ocurre a través de "puertos" estandarizados.
- **BDD (Behavior-Driven Development):** Práctica de desarrollo donde las historias funcionales se escriben en lenguaje natural pero estructurado (Dado que... Cuando... Entonces...) para que sirvan directamente como pruebas.
- **Pirámide de Testing (70/20/10):** Regla corporativa de calidad. 70% de las pruebas deben ser unitarias (muy rápidas), 20% de integración (lentas pero fiables) y 10% E2E (pruebas completas de UI, frágiles y muy lentas).
- **IaC (Infrastructure as Code):** Práctica de aprovisionar nubes (ej. AWS, Azure) escribiendo código en lugar de hacer clics en consolas web.
- **Telemetría / Observabilidad:** Capacidad de entender el estado interno de un sistema basándose en la salida de sus logs, trazas distribuidas y métricas, permitiendo detectar cuellos de botella sin revisar código en producción.

## 4. Patrones Tácticos y Principios de Ingeniería
- **DDD Táctico (ADR-0019):** Aplicación en código del Bounded Context. Utiliza **Aggregates** (grupos de entidades con raíz única), **Value Objects** (objetos inmutables sin identidad) y **Domain Events** (notificaciones de cambio de estado).
- **Principios de Código Limpio:** Reglas del *Manifiesto de Ingeniería* de Unimar. Incluyen **SOLID** (5 principios de diseño orientado a objetos), **DRY** (*Don't Repeat Yourself*), **KISS** (*Keep It Simple, Stupid*) y **YAGNI** (*You Aren't Gonna Need It*).
- **CQRS (Command Query Responsibility Segregation):** Patrón (ADR-0034) que separa estrictamente las operaciones de lectura (Consultas) de las operaciones de escritura (Comandos) para optimizar rendimiento.
- **Transactional Outbox:** Patrón (ADR-0033) para publicar eventos de dominio de manera segura. Guarda el evento en la misma base de datos de la transacción antes de enviarlo al *Message Broker* (XMS).
- **Sagas Distribuidas:** Patrón (ADR-0035) para manejar transacciones largas en microservicios. Si un paso falla, se ejecutan "transacciones de compensación" en lugar de un rollback tradicional de base de datos.
