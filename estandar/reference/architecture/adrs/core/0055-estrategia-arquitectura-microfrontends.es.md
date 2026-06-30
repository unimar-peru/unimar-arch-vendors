# ADR-0055: Estrategia de Arquitectura de Microfrontends

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-ADR-0055%3A%20Estrategia%20de%20Arquite%E2%80%A6-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Activo-27ae60?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-0.1.0-042139?style=flat-square" alt="Versión">
</p>

## Estado

Propuesto (Preparacion para Fase 3)

## Contexto

La arquitectura de Monolito Progresivo prioriza primero la modularidad y luego la distribución. El mismo principio aplica al frontend web: los productos DEBERÍAN iniciar con una **UI monolítica modular**, no con microfrontends distribuidos.

Empezar con microfrontends demasiado pronto introduce complejidad operativa y arquitectónica evitable:
* configuración de shell/orquestador antes de que exista una necesidad real de escala,
* múltiples pipelines CI/CD frontend antes de requerir despliegue independiente,
* coordinación de dependencias compartidas y versiones runtime,
* complejidad de routing y gestión de estado entre MFEs,
* mayor riesgo de inconsistencia visual si se omite el sistema de diseño.

A medida que el sistema alcanza la Fase 3 (Servicios Distribuidos), la aplicación frontend puede enfrentar desafíos similares:
* **Contención de Despliegue**: Múltiples equipos necesitando desplegar cambios en la misma UI monolítica.
* **Bloqueo Tecnológico**: Dificultad para actualizar partes de la UI a versiones más recientes de frameworks.
* **Complejidad de Escala**: Un solo bundle grande se vuelve difícil de gestionar y optimizar.

## Decisión

Adoptaremos una estrategia de **Microfrontends (MFE)** solo como **estrategia de extracción de Fase 3+**, no como línea base inicial del frontend.

Los productos DEBEN seguir esta progresión:

| Fase | Modelo de entrega UI | Guía |
|---|---|---|
| Fase 1 | Aplicación web monolítica modular | Usar una sola aplicación React desplegable con límites internos claros por feature, ruta y bounded context. |
| Fase 2 | UI modular con mayor ownership de dominio | Mantener una sola UI desplegable mientras se fortalece lazy loading por ruta, gobierno del sistema de diseño, fronteras API y mapeo de referencia aplicada. |
| Fase 3+ | Microfrontends por excepción | Extraer MFEs solo cuando la escala de equipos, la contención de despliegues o los ciclos de vida independientes justifiquen la complejidad adicional. |

Los microfrontends NO DEBEN usarse como arquitectura inicial por defecto, decisión por moda o sustituto de un buen diseño frontend modular.

### Principios Clave:

1. **Empezar Modular, No Distribuido**: Construir primero una sola aplicación React modular. La distribución es una decisión de extracción, no un default.
2. **Propiedad Vertical**: Los equipos que poseen un servicio de dominio backend pueden poseer el fragmento UI correspondiente cuando la extracción de Fase 3 esté justificada.
3. **Integración en Tiempo de Ejecución**: Usar **Module Federation** (Vite o Webpack 5) como mecanismo principal solo después de aprobar la extracción MFE.
4. **Sistema de Diseño Compartido**: Todos los MFEs DEBEN utilizar el sistema de diseño corporativo (Variables CSS, Componentes Compartidos) para asegurar consistencia visual.
5. **Alineación con BFF**: Cada MFE de cara al cliente debe comunicarse a través de su BFF (Backend-for-Frontend) específico o un Gateway unificado.

### Disparadores de Extracción (Cuando pasar a MFEs):

* El tamaño del equipo supera los 15-20 desarrolladores frontend.
* La frecuencia de despliegue de módulos específicos supera la tolerancia del ciclo de lanzamiento principal.
* Requisito de ciclos de vida tecnológicos independientes en secciones aisladas de la UI.
* Un área UI acotada tiene ownership claro, contratos estables y necesidades medibles de independencia de release.

## Consecuencias

* **Positivo**: Desplegabilidad independiente, opciones tecnológicas localizadas y mayor autonomía del equipo cuando la organización alcanza escala de Fase 3.
* **Negativo**: Mayor complejidad de infraestructura (pipelines CI/CD por MFE), riesgo de inconsistencia visual si se ignora el sistema de diseño y sobrecarga inicial en la configuración del orquestador.
* **Neutral**: Requiere una aplicación "Shell" u "Orquestador" centralizada para gestionar routing y estado compartido.
* **Gobernanza**: Cualquier producto que introduzca MFEs antes de Fase 3 DEBE documentar una desviación ADR explícita con evidencia de negocio, escala de equipo y despliegue.

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-06-05
</p>
