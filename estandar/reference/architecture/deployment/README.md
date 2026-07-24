# Deployment Architecture

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Deployment-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Activo-27ae60?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-1.0.0-042139?style=flat-square" alt="Versión">
</p>

**← [Inicio](../../../../README.md) / [Hub de Arquitectura](../README.md) / Deployment Architecture**

> **Meta:** Índice de la arquitectura de despliegue gobernada de la suite UNIMAR.
> **Objetivos:** (1) dar entrada única al catálogo de alternativas de despliegue, (2) enlazar cada propuesta con su documento, diagrama y ADRs, (3) sostener la matriz comparativa por ambiente.
> **Owner:** Architecture Board · **Fase SDLC:** 5 — Entrega y Operaciones · **Última revisión:** 2026-07-22

---

## Punto de entrada

**→ [Deployment Architecture Hub](./hub/deployment-architecture-hub.md)** — página central: objetivo, alcance, principios, catálogo, criterios de selección, costos, requisitos, matriz y trazabilidad de capas.

<details open>
<summary><strong>Estructura</strong></summary>

```text
deployment/
├── README.md                         ← este índice
├── _template-alternativa.md          ← plantilla canónica de cada alternativa
├── hub/
│   └── deployment-architecture-hub.md ← página central del Hub
├── local/
│   ├── docker/       (README + deployment-diagram)
│   ├── kind/         (README + deployment-diagram)
│   └── kubernetes/   (README + deployment-diagram)
├── production/
│   ├── azure-aks/            (README + deployment-diagram)
│   ├── aws-eks/              (README + deployment-diagram)
│   ├── on-prem-kubernetes/   (README + deployment-diagram)
│   ├── azure-serverless/     (README + deployment-diagram)
│   └── aws-serverless/       (README + deployment-diagram)
└── comparison/
    └── deployment-options-matrix.md
```

</details>

## Catálogo

| Grupo | Alternativa | Estado | Documento |
| :-- | :-- | :-- | :-- |
| Local | [Docker](./local/docker/README.md) | Approved | [doc](./local/docker/README.md) |
| Local | [Kind](./local/kind/README.md) | Approved | [doc](./local/kind/README.md) |
| Local | [Kubernetes Local](./local/kubernetes/README.md) | Proposed | [doc](./local/kubernetes/README.md) |
| Producción · K8s | [Azure AKS](./production/azure-aks/README.md) | Proposed | [doc](./production/azure-aks/README.md) |
| Producción · K8s | [AWS EKS](./production/aws-eks/README.md) | Proposed | [doc](./production/aws-eks/README.md) |
| Producción · K8s | [On-Premise K8s](./production/on-prem-kubernetes/README.md) | Proposed | [doc](./production/on-prem-kubernetes/README.md) |
| Producción · Serverless | [Azure Serverless](./production/azure-serverless/README.md) | Proposed | [doc](./production/azure-serverless/README.md) |
| Producción · Serverless | [AWS Serverless](./production/aws-serverless/README.md) | Proposed | [doc](./production/aws-serverless/README.md) |
| Comparación | [Matriz de opciones](./comparison/deployment-options-matrix.md) | Activo | [doc](./comparison/deployment-options-matrix.md) |

## Gobierno

Consolida y referencia (no duplica): [Escenarios multinube](../escenarios-despliegue-multinube.es.md) · [ADR-0013](../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md) · [ADR-0028](../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md) · [ADR-0039](../adrs/core/0039-switcher-abstraccion-topologia-despliegue.es.md) · [Hub de Infraestructura](../../infrastructure/README.md) · [Stack autorizado agnóstico](../stack-tecnologico-autorizado-agnostico.es.md) · [Matriz NFR](../matriz-nfr-suite.es.md).

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-07-22
</p>
