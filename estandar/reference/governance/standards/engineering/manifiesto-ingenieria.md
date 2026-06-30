# Manifiesto de Ingeniería

> **Fase SDLC:** Transversal (requerido en todas las fases)
> **Puerta de salida:** Aplica a todos los gates
> **Padre:** [Hub de Gobernanza](../../README.md)
> **Audiencia:** Todos los desarrolladores, Tech Leads, Architecture Board
> **Estado:** Estándar local aprobado | **Owner:** Architecture Board | **Última revisión:** 2026-06-08

Ver también: [Glosario de Arquitectura](../../glosario.md) — terminología controlada del repositorio.

## Principios

La cultura de ingeniería de Unimar se construye sobre los siguientes principios, adaptados de principios de ingeniería de referencia. Estos principios guían nuestras decisiones técnicas y nos ayudan a construir software sostenible, mantenible y alineado con los objetivos de negocio.

### 1. Tecnología Probada para Estabilidad de Producción

**Propósito:** Priorizamos la estabilidad y confiabilidad del sistema sobre la novedad tecnológica.

Seleccionamos tecnologías madura, bien documentadas y ampliamente adoptadas en la industria. Este enfoque nos permite:

- **Reducir riesgo operativo:** Tecnologías probadas tienen menos sorpresas en producción
- **Facilitar el mantenimiento:** Hay más recursos, documentación y profesionales disponibles
- **Acelerar el desarrollo:** El equipo puede enfocarse en resolver problemas de negocio en lugar de luchar con herramientas inmaduras
- **Garantizar continuidad:** Menor dependencia de individuos con conocimiento especializado

Cuando evaluamos una nueva tecnología, preguntamos: ¿Resuelve un problema real que las tecnologías actuales no pueden resolver? ¿El beneficio justifica el costo de aprendizaje y riesgo operacional?

### 2. La Experiencia del Desarrollador es Prioridad Arquitectónica

**Propósito:** Reconocemos que las herramientas, procesos y ergonomía de desarrollo impactan directamente la calidad del software entregado.

Invertimos en:

- **Tooling eficiente:** Builds rápidos, feedback inmediato de tests, hot-reload cuando es posible
- **Automatización inteligente:** Scripts que eliminan trabajo repetitivo y reducen errores humanos
- **Documentación accesible:** Guías claras, ejemplos ejecutables y convenciones bien definidas
- **Ambientes consistentes:** Desarrollo, testing y producción se comportan de manera predecible

Un desarrollador que puede iterar rápidamente, recibir feedback claro y confiar en sus herramientas produce software de mayor calidad en menos tiempo. La productividad del equipo es una métrica de salud arquitectónica.

### 3. Disciplina Test-First como Especificación Ejecutable

**Propósito:** Los tests automatizados son la documentación más confiable y actualizada del comportamiento del sistema.

Adoptamos el ciclo red-green-refactor como práctica fundamental:

- **Red:** Escribir un test que falle, definiendo el comportamiento esperado antes de la implementación
- **Green:** Implementar el código mínimo necesario para hacer pasar el test
- **Refactor:** Mejorar la claridad y estructura del código manteniendo los tests en verde

Beneficios de este enfoque:

- **Documentación viva:** Los tests describen qué hace el sistema y se actualizan con cada cambio
- **Diseño emergente:** El código tiende a ser más modular y con responsabilidades bien definidas
- **Confianza para refactorizar:** Los tests detectan regresiones antes de llegar a producción
- **Especificación ejecutable:** El comportamiento del sistema se valida automáticamente en cada cambio

### 4. Fronteras Explícitas entre Componentes

**Propósito:** Definir límites claros entre componentes reduce el acoplamiento y facilita la evolución del sistema.

Priorizamos:

- **Bounded contexts bien definidos:** Cada componente tiene responsabilidad única y vocabulario propio
- **Contratos explícitos:** APIs, eventos y esquemas de datos documentados y versionados
- **Extracción progresiva:** Separar conceptualmente antes de separar físicamente en repositorios o servicios
- **Acoplamiento consciente:** Las dependencias entre componentes son intencionales, no accidentales

Este enfoque nos permite escalar el sistema y el equipo sin introducir complejidad prematura.

### 5. Estándares Compartidos sobre Heroísmo Individual

**Propósito:** La calidad del software depende de procesos repetibles, no de esfuerzos extraordinarios individuales.

Construimos sistemas que:

- **Automatizan la calidad:** Linting, tests y validaciones se ejecutan en CI sin intervención humana
- **Documentan convenciones:** Las reglas de codificación, estructura y procesos están escritas y accesibles
- **Validan en CI:** Si una regla importa, está codificada en el pipeline, no depende de revisión manual
- **Facilitan el cumplimiento:** Herramientas y scripts hacen que seguir el estándar sea el camino de menor resistencia

El objetivo es que cualquier miembro del equipo pueda producir trabajo de calidad siguiendo los estándares establecidos.

### 6. Evidencia Ejecutable sobre Opinión

**Propósito:** Las decisiones técnicas se basan en datos y experimentación, no en preferencias personales o jerarquía.

Practicamos:

- **Prototipos para explorar:** Código ejecutable en `docs/` o repositorios de experimentación para validar hipótesis
- **Métricas objetivas:** Performance, cobertura, tiempo de build y otras métricas guían las decisiones
- **ADRs documentados:** Las decisiones arquitectónicas registran contexto, alternativas y consecuencias
- **Debate informado:** Las discusiones técnicas se resuelven con evidencia, no con argumentos de autoridad

Un prototipo que demuestra una solución es más valioso que cualquier argumento teórico.

### 7. Higiene y Reconocimiento Open Source

**Propósito:** Reconocemos y respetamos el ecosistema open source del cual dependemos, contribuyendo de vuelta cuando es posible.

Nuestras prácticas:

- **Atribución adecuada:** Mantenemos el archivo [`NOTICE.md`](../../../../license/NOTICE.md) con créditos a proyectos utilizados
- **Respeto de licencias:** Verificamos compatibilidad de licencias antes de incorporar dependencias
- **Contribuciones de vuelta:** Reportamos bugs, proponemos mejoras y contribuimos código cuando es razonable
- **Evaluación de madurez:** Preferimos proyectos con mantenimiento activo, documentación clara y comunidad saludable

Reconocemos que nuestro trabajo se construye sobre el esfuerzo de miles de desarrolladores en todo el mundo.

