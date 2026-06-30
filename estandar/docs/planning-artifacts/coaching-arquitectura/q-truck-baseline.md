# Caso de Estudio Oficial: Q-Truck (Gestor de Colas)

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Caso%20de%20Estudio-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
</p>

## ¿Por qué Q-Truck?
Para asegurar que este plan de capacitación SDLC no sea meramente teórico, **construiremos un producto de software 100% real desde cero** durante las sesiones prácticas. Este producto ha sido elegido porque es logístico, simple y puede atravesar la totalidad del ciclo de vida del desarrollo.

## Contexto del Negocio
Actualmente, las operaciones logísticas en el almacén de UNIMAR sufren de desorden al momento del ingreso de transportistas. Los camiones llegan a la garita y no existe un sistema unificado que dictamine **quién tiene la prioridad** para entrar al patio a descargar/cargar, generando congestión en las afueras.

## El Producto: Monolito Progresivo (Fase 1)
Crearemos **Q-Truck (Gestor Rápido de Colas de Camiones)**. Siguiendo estrictamente las directivas de arquitectura de UNIMAR, el sistema nacerá bajo el patrón de **Monolito Progresivo (Fase 1)**. Esto asegura simplicidad operativa inicial y evita la complejidad prematura, mientras permite a nuestros equipos mixtos colaborar en un entorno altamente modularizado:

1. **Frontend (React):** Una SPA (*Single Page Application*) simple que mostrará un Dashboard al operador de garita para visualizar y gestionar la cola.
2. **Backend Modular (Node.js & .NET):** Un único artefacto lógico/desplegable que encapsula dos módulos fuertemente cohesionados: un BFF en Node.js para orquestar la UI, y un motor pesado en .NET para la lógica de cola FIFO y persistencia usando **Shells transversales**.

### Reglas Técnicas y de Negocio
1. **Flujo de Negocio:** Un camión (placa) se registra vía React, pasa por Node.js y llega a .NET, donde ingresa a una cola estricta FIFO.
2. **Estrategia de Ramas (GitFlow):** Es **obligatorio** usar GitFlow. El desarrollo fluirá desde ramas `feature/` hacia `develop` usando Pull Requests.
3. **Calidad y Mocks:** Todos los repositorios exigirán **Unit Testing** intensivo con un Gate de cobertura >80%. Para lograrlo sin dependencias lentas, los equipos deberán inyectar **Mocks** en las capas de infraestructura (Ej. Jest para Node, Moq/xUnit para .NET).

### Nuestro Objetivo durante la Capacitación
- **En el Módulo 1 (Requisitos):** Escribiremos juntos el Documento de Requisitos de este producto y su Backlog.
- **En el Módulo 2 (Arquitectura):** Utilizaremos la IA para debatir y tomar una Decisión de Arquitectura (ADR) sobre qué base de datos usar para la cola, y lo modelaremos en C4.
- **En el Módulo 3 (Desarrollo):** Escribiremos la lógica del dominio (`EnqueueTruck`) aplicando Arquitectura Hexagonal y pasaremos por *Code Review*.
- **En el Módulo 4 (Testing):** Haremos pruebas automatizadas de extremo a extremo conectando la API a una base de datos efímera real usando Testcontainers.
- **En los Módulos 5 y 6:** Veremos cómo diagnosticar si la API de Q-Truck se cae en producción usando logs.

> ⚠️ **Nota:** A lo largo de todo el taller interactuaremos con el **Método BMAD** (Agentes de Inteligencia Artificial en VS Code) para que construyan con nosotros. ¡Preparen sus teclados!
