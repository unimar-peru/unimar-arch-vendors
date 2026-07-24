# Matriz de opciones de despliegue

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Deployment_Comparison-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Activo-27ae60?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-0.1.0-042139?style=flat-square" alt="Versión">
</p>

**← [Inicio](../../../../../README.md) / [Hub de Arquitectura](../../README.md) / [Deployment Hub](../hub/deployment-architecture-hub.md) / Comparación**

> **Meta:** Comparar las 8 alternativas de despliegue y recomendar una arquitectura por ambiente.
> **Owner:** Architecture Board · **Fase SDLC:** 5 — Entrega y Operaciones · **Última revisión:** 2026-07-22

---

## 1. Matriz comparativa

Escala: 🟢 bajo/simple · 🟡 medio · 🟠 alto · 🔴 muy alto. «Time to Market» = tiempo hasta un despliegue productivo operable.

| Alternativa | Complejidad | Escalabilidad | Alta disponibilidad | Costo | Operación | Time to Market |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| [Docker Local](../local/docker/README.md) | 🟢 Baja | 🔴 N/A (una máquina) | 🔴 Ninguna | 🟢 ~0 | 🟢 Trivial | 🟢 Minutos |
| [Kind](../local/kind/README.md) | 🟡 Media | 🟡 Simulada (nodos en Docker) | 🟠 Simulada | 🟢 ~0 | 🟡 Baja | 🟢 Horas |
| [Kubernetes Local](../local/kubernetes/README.md) | 🟡 Media | 🟡 Local | 🟠 Simulada | 🟢 ~0 | 🟡 Baja | 🟡 Horas |
| [Azure AKS](../production/azure-aks/README.md) | 🟠 Alta | 🟢 Alta (HPA/Cluster Autoscaler) | 🟢 Multi-AZ | 🟠 Medio-alto (OPEX) | 🟠 Media (gestionado) | 🟡 Semanas |
| [AWS EKS](../production/aws-eks/README.md) | 🟠 Alta | 🟢 Alta (HPA/Karpenter) | 🟢 Multi-AZ | 🟠 Medio-alto (OPEX) | 🟠 Media (gestionado) | 🟡 Semanas |
| [On-Premise K8s](../production/on-prem-kubernetes/README.md) | 🔴 Muy alta | 🟡 Limitada por hardware | 🟠 Requiere diseño HA propio | 🔴 CAPEX + OPEX | 🔴 Alta (equipo plataforma) | 🔴 Meses |
| [Azure Serverless](../production/azure-serverless/README.md) | 🟡 Media | 🟢 Elástica automática | 🟢 Gestionada por plataforma | 🟡 Pago por uso | 🟢 Baja (managed) | 🟢 Días-semanas |
| [AWS Serverless](../production/aws-serverless/README.md) | 🟡 Media | 🟢 Elástica automática | 🟢 Gestionada por plataforma | 🟡 Pago por uso | 🟢 Baja (managed) | 🟢 Días-semanas |

> **Nota de portabilidad:** por [ADR-0028](../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md) y [ADR-0039](../../adrs/core/0039-switcher-abstraccion-topologia-despliegue.es.md), el mismo artefacto (contenedor + Helm chart parametrizado) se mueve entre Docker → Kind → AKS/EKS/On-Prem sin refactor; el serverless es el único que reempaqueta el workload (funciones/PaaS) y por eso exige re-evaluar los puertos de infraestructura.

## 2. Ejes de decisión

- **Fase del sistema** — Fase 1–2 favorece Docker/Compose y serverless; Fase 3+ habilita Kubernetes ([ADR-0013](../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md)).
- **Soberanía de datos** — PII air-gapped ⇒ On-Premise; de lo contrario cloud gestionado.
- **Perfil de carga** — event-driven / picos impredecibles ⇒ serverless; carga sostenida ⇒ Kubernetes.
- **Capacidad operativa** — sin equipo de plataforma ⇒ gestionado (AKS/EKS/serverless); con equipo ⇒ On-Premise viable.
- **Compliance** — RGPD/ISO 27001 estricto ⇒ ver [escenarios multinube](../../escenarios-despliegue-multinube.es.md).

## 3. Recomendación por ambiente

| Ambiente | Recomendación primaria | Alternativa | Justificación |
| :-- | :-- | :-- | :-- |
| **Desarrollo** | [Docker](../local/docker/README.md) | [Kind](../local/kind/README.md) | Ciclo rápido; Kind cuando se necesita validar manifests/Helm reales |
| **QA** | [Kind](../local/kind/README.md) | [Kubernetes Local](../local/kubernetes/README.md) | Mismos manifests/Helm que producción, reproducible y efímero |
| **Staging** | [Azure AKS](../production/azure-aks/README.md) / [AWS EKS](../production/aws-eks/README.md) | según nube objetivo | Paridad con producción; valida IaC y observabilidad reales |
| **Producción** | [AKS](../production/azure-aks/README.md) / [EKS](../production/aws-eks/README.md) (carga sostenida) · [Serverless](../production/azure-serverless/README.md) (event-driven) | [On-Premise](../production/on-prem-kubernetes/README.md) (soberanía) | Se elige por perfil de carga, compliance y soberanía |
| **Disaster Recovery** | Región secundaria warm-standby de la misma nube | On-Premise ⇒ sitio DR físico | Multi-AZ activo-activo + región secundaria ([ADR-0013](../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md)) |

> Cada producto registra su elección en el `DECISIONS.md` del satélite (o del core si es transversal). El estado `Approved`/`Active` de una alternativa exige ADR aceptado + un despliegue verificado.

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-07-22
</p>
