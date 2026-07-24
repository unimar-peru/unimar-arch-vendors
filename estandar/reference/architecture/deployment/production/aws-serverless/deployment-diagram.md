# AWS Serverless — Diagrama de despliegue

<p align="right">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Deployment_Diagram-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Proposed-f39c12?style=flat-square" alt="Estado">
</p>

**← [Volver a la alternativa AWS Serverless](./README.md)**

> Diagrama **Mermaid por capas** (de arriba hacia abajo): Internet/Usuarios → Edge/Security → Application → Service → Messaging → Data → External Systems. El color de la ejecución distingue **contenedor** (App Runner/Fargate) de **serverless puro** (Lambda).

## Topología serverless / PaaS

```mermaid
flowchart TD
    subgraph L0["Internet / Usuarios"]
        U(("Usuarios / Integradores"))
        DNS["Route 53 (failover regional)"]
    end

    subgraph L1["Edge / Security"]
        CF["CloudFront (CDN · TLS 1.3)"]
        WAF["AWS WAF (OWASP · rate-limit)"]
    end

    subgraph L2["Application Layer"]
        FE["Frontend React estático<br/>(S3 + CloudFront)"]
        APIGW["Amazon API Gateway<br/>(HTTP API · authz JWT · throttling)"]
    end

    subgraph L3["Service Layer"]
        AR["App Runner — BFF/Servicios<br/>(MISMO contenedor OCI)"]
        LMB["AWS Lambda<br/>(event-driven · scheduled)"]
        FAR["ECS Fargate<br/>(background largo > 15 min)"]
    end

    subgraph L4["Messaging"]
        EB["EventBridge (bus + scheduler)"]
        SNS["SNS (fan-out)"]
        SQS["SQS (colas)"]
    end

    subgraph L5["Data Layer"]
        RDS[("RDS / Aurora PostgreSQL<br/>+ RDS Proxy")]
        DDB[("DynamoDB<br/>solo clave-valor a escala")]
        REDIS[("ElastiCache Redis")]
        S3[("Amazon S3 · S3-API")]
    end

    subgraph SEC["Plataforma / Seguridad"]
        IAM["IAM execution roles (mín. privilegio)"]
        SM["Secrets Manager"]
        KMS["KMS (CMK · AES-256)"]
        OTEL["OpenTelemetry + CloudWatch / X-Ray"]
        ECR["Amazon ECR"]
    end

    subgraph EXT["External Systems"]
        MMS["MMS"]
        UMS["UMS (IdP/IAM nativo)"]
        XMS["XMS"]
    end

    U --> DNS --> CF --> WAF
    WAF --> FE
    WAF --> APIGW
    APIGW --> AR
    APIGW --> LMB
    AR --> EB
    LMB --> EB
    EB --> SNS
    EB --> SQS
    EB -. scheduler cron .-> LMB
    SQS --> LMB
    SQS --> FAR
    AR --> RDS
    LMB --> RDS
    FAR --> RDS
    AR --> REDIS
    AR --> DDB
    LMB --> DDB
    AR --> S3
    FE --> S3
    AR -. autoriza sucursal en app .-> UMS
    AR --> MMS
    AR --> XMS

    AR -. rol de ejecución .-> IAM
    LMB -. rol de ejecución .-> IAM
    AR -. secretos .-> SM
    RDS -. cifrado en reposo .-> KMS
    DDB -. cifrado en reposo .-> KMS
    S3 -. cifrado en reposo .-> KMS
    AR -. logs/métricas/trazas .-> OTEL
    LMB -. logs/métricas/trazas .-> OTEL
    ECR -. pull imagen .-> AR
    ECR -. pull imagen .-> FAR
```

## Notas del diagrama

- **Contenedor vs serverless puro:** App Runner y Fargate ejecutan **los mismos contenedores OCI** que EKS/Kind; Lambda cubre lo event-driven y programado. El frontend es estático en S3/CloudFront.
- **Protección de RDS:** las funciones y servicios acceden a PostgreSQL vía **RDS Proxy** para no agotar el pool de conexiones bajo alta concurrencia serverless.
- **DynamoDB por excepción:** solo donde el patrón clave-valor y la escala elástica lo justifican; el motor relacional del stack sigue siendo PostgreSQL.
- **Autorización por sucursal:** en la capa de aplicación contra UMS ([ADR-0010](../../../adrs/core/0010-estrategia-arquitectura-multitenant.es.md)); sin RLS.

---

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-07-22
</p>
