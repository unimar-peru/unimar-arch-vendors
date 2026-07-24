# AWS EKS — Diagrama de despliegue

<p align="right">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Deployment_Diagram-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Proposed-f39c12?style=flat-square" alt="Estado">
</p>

**← [Volver a la alternativa AWS EKS](./README.md)**

> Diagrama **Mermaid por capas** (de arriba hacia abajo): Internet/Usuarios → Edge/Security → Application → Service → Messaging → Data → External Systems. Consolida el [Escenario 3 AWS](../../../escenarios-despliegue-multinube.es.md#3-escenario-aws-resiliencia-global-y-privacidad-total) de los escenarios multinube.

## Topología Multi-AZ activo-activo

```mermaid
flowchart TD
    subgraph L0["Internet / Usuarios"]
        U(("Usuarios / Integradores"))
        DNS["Route 53<br/>(routing latencia + failover)"]
    end

    subgraph L1["Edge / Security"]
        CF["CloudFront (CDN · TLS 1.3)"]
        WAF["AWS WAF (OWASP · rate-limit)"]
        ALB["Application Load Balancer<br/>(TLS term · L7 · Multi-AZ)"]
    end

    subgraph VPC["AWS VPC — subredes privadas Multi-AZ (sin salida directa a IGW)"]
        subgraph L2["Application Layer — EKS Services"]
            FE["Frontend React<br/>(Deployment + HPA)"]
            BFF["BFF / API Gateway NestJS<br/>(Deployment + HPA)"]
        end
        subgraph L3["Service Layer — EKS Services"]
            SVC["Servicios de dominio<br/>(DT/TMS/WMS/MMS/SIL/UMS/XMS)"]
            WRK["Workers · Background/Scheduled"]
        end
        subgraph L4["Messaging"]
            MQ["Amazon MQ (RabbitMQ)<br/>AMQP / CloudEvents"]
            SQS["SQS / SNS (fan-out opcional)"]
        end
        subgraph L5["Data Layer"]
            AUR[("Aurora PostgreSQL<br/>Multi-AZ + Reader")]
            REDIS[("ElastiCache Redis<br/>Multi-AZ")]
            S3[("Amazon S3 · S3-API<br/>versioning + CRR")]
        end
        VPCE["VPC Endpoints / PrivateLink<br/>(KMS · Secrets Mgr · S3 · ECR)"]
    end

    subgraph SEC["Plataforma / Seguridad"]
        IRSA["IAM Roles for SA (IRSA)"]
        SM["Secrets Manager + sidecar"]
        KMS["KMS (CMK cliente · AES-256)"]
        OTEL["OpenTelemetry Collector → CloudWatch"]
        ECR["Amazon ECR (imágenes OCI)"]
    end

    subgraph EXT["External Systems"]
        MMS["MMS"]
        UMS["UMS (IdP/IAM nativo)"]
        XMS["XMS"]
    end

    U --> DNS --> CF --> WAF --> ALB
    ALB --> FE
    ALB --> BFF
    BFF --> SVC
    SVC --> WRK
    SVC --> MQ
    WRK --> MQ
    SVC --> SQS
    SVC --> AUR
    SVC --> REDIS
    SVC --> S3
    SVC -. autoriza sucursal en app .-> UMS
    SVC --> MMS
    SVC --> XMS

    FE -. credenciales por pod .-> IRSA
    SVC -. credenciales por pod .-> IRSA
    SVC -. secretos .-> SM
    AUR -. cifrado en reposo .-> KMS
    S3 -. cifrado en reposo .-> KMS
    SVC -. tráfico privado .-> VPCE
    FE -. logs/métricas/trazas .-> OTEL
    SVC -. logs/métricas/trazas .-> OTEL
    ECR -. pull imágenes .-> FE
    ECR -. pull imágenes .-> SVC
```

## Notas del diagrama

- **Sin salida directa a Internet:** los pods alcanzan servicios AWS (KMS, Secrets Manager, S3, ECR) por **VPC Endpoints (PrivateLink)**; el tráfico no cruza Internet pública (ISO 27001 A.13.1.1).
- **Entrada de red global:** Route 53 con health-checks habilita el failover a la región secundaria ([ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md)).
- **Autorización por sucursal:** se resuelve en la capa de aplicación contra UMS ([ADR-0010](../../../adrs/core/0010-estrategia-arquitectura-multitenant.es.md)); no hay RLS de base de datos.
- **Mismo chart:** cada Deployment proviene del chart agnóstico [`ums-helm`](../../local/kind/README.md); IRSA sustituye a las llaves estáticas.

---

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-07-22
</p>
