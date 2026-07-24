# ADRs · dotnet

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-ADRs%20%C2%B7%20dotnet-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Activo-27ae60?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-1.0.0-042139?style=flat-square" alt="Versión">
</p>

Catálogo runtime-específico de ADRs de Unimar Arch para `dotnet`. Hub padre: [`../README.md`](../README.md).

## ADRs

| ADR | Título | Propósito |
|---|---|---|
| [ADR-0041](0041-arquitectura-backend-canonica-dotnet.es.md) | Arquitectura de Backend Canónica para .NET (C#) | Define la arquitectura hexagonal canónica para servicios .NET: capas, inyección de dependencias, patrones y convenciones. |
| [ADR-0064](0064-contexto-observabilidad-scope-request-dotnet.es.md) | Propagación del Contexto de Observabilidad en .NET | Establece cómo propagar CorrelationId y contexto de trazabilidad a través del scope de request en .NET. |
| [ADR-0065](0065-pipeline-serilog-seguro-pii-dotnet.es.md) | Pipeline de Logging Seguro de PII con Serilog | Define el pipeline de logging estructurado con Serilog garantizando anonimización de datos personales (PII). |

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-06-05
</p>
