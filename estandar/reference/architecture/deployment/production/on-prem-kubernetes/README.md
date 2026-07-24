# Producción On-Premise con Kubernetes

<p align="right">
  <img src="https://img.shields.io/badge/UNIMAR%20S.A.-Operador_Log%C3%ADstico_Aduanero-0f3e67?style=for-the-badge&logoColor=white" alt="Unimar S.A.">
  <img src="https://img.shields.io/badge/Unimar%20Arch-Deployment-003c6b?style=for-the-badge&logoColor=white" alt="Unimar Arch">
  <img src="https://img.shields.io/badge/Estado-Proposed-f39c12?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-1.0.0-042139?style=flat-square" alt="Versión">
</p>

**← [Inicio](../../../../../../README.md) / [Hub de Arquitectura](../../../README.md) / [Deployment Hub](../../hub/deployment-architecture-hub.md) / Producción On-Premise con Kubernetes**

> **Meta:** Desplegar la suite UNIMAR en un datacenter físico propio sobre Kubernetes autogestionado (RKE2), con soberanía de datos absoluta y capacidad air-gapped, para producción soberana y su sitio de recuperación ante desastres.
> **Owner:** Architecture Board · **Fase SDLC:** 5 — Entrega y Operaciones · **Última revisión:** 2026-07-22

---

## Metadatos de gobierno

| Campo | Valor |
| :-- | :-- |
| Architecture ID | `DEPLOY-ONPREM-K8S` |
| Architecture Name | Producción On-Premise con Kubernetes |
| Environment | Producción · DR |
| Type | Kubernetes autogestionado |
| Status | Proposed |
| Owner | Architecture Board |
| Version | 1.0.0 |
| Created / Updated | 2026-07-22 / 2026-07-22 |
| Applicable Products | DT, TMS, WMS, MMS, SIL, UMS, XMS |
| Decision Records | [ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md) · [ADR-0039](../../../adrs/core/0039-switcher-abstraccion-topologia-despliegue.es.md) · [ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md) · [ADR-0010](../../../adrs/core/0010-estrategia-arquitectura-multitenant.es.md) · [ADR-0051](../../../adrs/core/0051-estrategia-motor-base-datos-empresarial.es.md) · [ADR-0106](../../../adrs/core/0106-seguridad-calidad-local-first.es.md) |
| Diagram | [deployment-diagram.md](./deployment-diagram.md) |

## 1. Arquitectura — resumen

Esta alternativa materializa el **Escenario 4 — On-Premise, Soberanía Extrema** de los [escenarios de despliegue multinube](../../../escenarios-despliegue-multinube.es.md#4-escenario-on-premise-control-total-y-soberanía-extrema): la suite corre íntegramente dentro del datacenter físico corporativo, sin dependencia de ninguna nube pública, apta para operación desconectada (air-gapped). No sustituye ese material: lo **consolida** como arquitectura de despliegue gobernada.

*(¿Dónde corre?)* Sobre un **clúster Kubernetes autogestionado con distribución RKE2** montado en servidores físicos (bare metal) o virtualizados propios. El mismo Helm chart agnóstico que corre en AKS/EKS corre aquí sin refactorización ([stack agnóstico §7](../../../stack-tecnologico-autorizado-agnostico.es.md)), y la topología se selecciona con `DEPLOYMENT_TOPOLOGY=ON_PREMISE_ISOLATED` en el contenedor DI de arranque ([ADR-0039](../../../adrs/core/0039-switcher-abstraccion-topologia-despliegue.es.md)).

*(¿Con qué?)* Todo el plano de infraestructura es 100% open-source autohospedable, tras **Puertos** de dominio ([ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md)): PostgreSQL/SQL Server/MongoDB para persistencia, RabbitMQ como bus, Redis como caché, MinIO como almacenamiento S3-compatible, HashiCorp Vault para secretos y Keycloak/UMS para identidad.

*(¿Cómo se conecta?)* El tráfico entra desde la red corporativa a través de un **firewall de nueva generación (NGFW)** y VPN, atraviesa un **Load Balancer de borde (MetalLB + HAProxy)** hacia el **Ingress Controller** del clúster, y de ahí a los pods de aplicación. La persistencia vive en un tier de datos con alta disponibilidad (Patroni para PostgreSQL, Always On para SQL Server, replica set para MongoDB). El control de acceso por sucursal se resuelve **siempre en la capa de aplicación** ([ADR-0010](../../../adrs/core/0010-estrategia-arquitectura-multitenant.es.md)), idéntico a los escenarios cloud.

La topología recomendada es de **doble sitio**: un **Sitio Primario** activo y un **Sitio DR** físico secundario en warm-standby, replicando datos de forma asíncrona, para preservar el compromiso 24/7 ([ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md)) sin depender de zonas de disponibilidad de proveedor.

## 2. Diagrama de despliegue

Ver **[deployment-diagram.md](./deployment-diagram.md)** — Mermaid por capas: Usuarios/Red corporativa → Edge/Security (NGFW · VPN · LB · Ingress) → Application → Service → Messaging → Data → External Systems, con el Sitio DR físico y la observabilidad transversal.

## 3. Componentes requeridos

Anclado al [stack tecnológico autorizado agnóstico §7](../../../stack-tecnologico-autorizado-agnostico.es.md) y a [ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md) / [ADR-0051](../../../adrs/core/0051-estrategia-motor-base-datos-empresarial.es.md).

| Componente | Tecnología (autorizada) | Propósito | Alternativa | Nota DR |
| :-- | :-- | :-- | :-- | :-- |
| Orquestador | **RKE2 (Kubernetes v1.28+)** | Clúster autogestionado hardened, apto air-gap | K3s · MicroK8s · OpenShift | Segundo clúster RKE2 en Sitio DR |
| Gestión de flota | Rancher (opcional) | Consola multi-clúster, RBAC, catálogos | Headless (kubectl + GitOps) | Gestiona primario + DR |
| Load Balancer | **MetalLB + HAProxy** | VIP de servicio y del API-server (`:6443`) | keepalived + NGINX | LB replicado por sitio |
| Ingress | Ingress-NGINX / Traefik | Enrutamiento HTTP(S) L7, terminación TLS | Contour | Manifiestos idénticos por sitio |
| Storage de bloque/archivo | **Longhorn** (referencia) | Volúmenes persistentes replicados | Ceph (Rook) · NFS empresarial | Réplica de volúmenes al Sitio DR |
| Object storage | **MinIO** (S3-API) | Documentos, backups lógicos, artefactos | Ceph RGW | Replicación de bucket cross-site |
| BD relacional (.NET) | **Microsoft SQL Server** (Always On AG) | Persistencia perfil .NET ([ADR-0051](../../../adrs/core/0051-estrategia-motor-base-datos-empresarial.es.md)) | — | Réplica secundaria en DR |
| BD relacional (Node) | **PostgreSQL v16+ (Patroni/etcd)** bare metal | Persistencia perfil Node ([ADR-0051](../../../adrs/core/0051-estrategia-motor-base-datos-empresarial.es.md)) | Repmgr | Standby streaming a DR |
| BD documental | **MongoDB (replica set)** | Persistencia documental perfil Node ([ADR-0051](../../../adrs/core/0051-estrategia-motor-base-datos-empresarial.es.md)) | — | Miembro oculto en DR |
| Bus de mensajería | **RabbitMQ (cluster + quorum queues)** | Comunicación asíncrona AMQP/CloudEvents | — | Shovel/federation a DR |
| Caché distribuida | **Redis** (Sentinel/Cluster) | Caché, rate-limit, estado efímero | Valkey | Réplica de solo-lectura en DR |
| Secretos | **HashiCorp Vault** (cluster local) | Inyección de secretos vía sidecar | — | Réplica DR (Raft/Performance) |
| Identidad / IAM | **UMS / Keycloak (OIDC)** | Autenticación, roles, SSO de la suite | — | IdP replicado |
| Observabilidad | **Prometheus · Grafana · Loki · Tempo** vía OpenTelemetry Collector | Métricas, logs, trazas, alertas | — | Stack observabilidad en DR |
| Backup | **Velero** (clúster) + **Veeam** (VM/BD/inmutable) | Respaldo de manifiestos, PV y datos | Restic | Backup inmutable off-site 3-2-1 |
| IaC | **Terraform** + **Helm v3** | Aprovisionamiento y despliegue declarativo | Ansible (config) | Un solo código, dos targets |

## 4. Requerimientos técnicos

- **Infraestructura:** servidores físicos o virtualizados propios; separación en tiers de cómputo (worker nodes), control plane y datos. Ver **estimación de capacidad** en §5. Red de datacenter redundante (bonding NIC, switches en par), almacenamiento local NVMe/SSD para el tier de datos y almacenamiento replicado (Longhorn/Ceph) para PV de aplicación.
- **Software:** RKE2 (Kubernetes v1.28+), contenedores OCI Distroless ([stack agnóstico §7](../../../stack-tecnologico-autorizado-agnostico.es.md)), Helm v3, SQL Server / PostgreSQL+Patroni / MongoDB, RabbitMQ, Redis, MinIO.
- **Seguridad:** identidad OIDC vía UMS/Keycloak; secretos exclusivamente por sidecar de **Vault** (prohibido texto plano en charts/Git/ConfigMaps); cifrado en reposo (AES-256) y tránsito (TLS 1.3); perímetro NGFW + VPN site-to-site + segmentación de red (DMZ / App / Data); *NetworkPolicies* entre namespaces; RLS nativa prohibida — aislamiento por sucursal en aplicación ([ADR-0010](../../../adrs/core/0010-estrategia-arquitectura-multitenant.es.md)).
- **Observabilidad:** logs JSON estructurados a Loki, métricas a Prometheus, trazas a Tempo, todo vía **OpenTelemetry Collector** (W3C Trace Context); dashboards y alertas en Grafana.
- **DevOps:** CI/CD con puertas **local-first** ([ADR-0106](../../../adrs/core/0106-seguridad-calidad-local-first.es.md)); **registro de contenedores privado** dentro del perímetro (Harbor/registry) obligatorio para air-gap; IaC en Terraform + Helm; GitOps opcional (Argo CD/Flux) con repositorio Git interno.
- **Operación:** equipo de plataforma/SRE con guardia; backup 3-2-1 con copia inmutable; DR con sitio físico secundario; runbooks de incidentes y de failover; ventanas de parcheo de nodos y motores (la sobrecarga administrativa es la contrapartida declarada en [ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md)).

## 5. Escalabilidad y alta disponibilidad

*(¿Cómo escala? ¿Cómo se recupera?)*

**Alta disponibilidad del clúster:**
- **Control plane:** 3 nodos (número impar) para **quórum de etcd** — tolera la caída de 1 nodo manteniendo escritura de estado. El **API-server** se publica tras una VIP con MetalLB/HAProxy (o keepalived), de modo que ningún nodo de control es punto único de fallo.
- **Worker nodes:** ≥ 3, con `PodDisruptionBudgets` y *anti-affinity* para distribuir réplicas de cada servicio. El escalado horizontal es por **HPA** (CPU/memoria/métricas custom); el escalado vertical del clúster se hace **añadiendo nodos físicos** (no hay autoscaler de nube — es capacidad aprovisionada).
- **Datos:** PostgreSQL con **Patroni** (líder + réplicas, failover automático vía etcd); SQL Server **Always On AG**; MongoDB **replica set** (elección automática de primario); RabbitMQ **quorum queues**; Redis **Sentinel**. Storage replicado con Longhorn/Ceph (factor de réplica ≥ 3).

**Objetivos NFR** (contra [matriz NFR §Recuperación](../../../matriz-nfr-suite.es.md), sistemas C1 como DT/TMS/Facturación):
- **Disponibilidad:** objetivo 24/7 con HA intra-sitio; la disponibilidad total queda limitada por el sitio físico salvo failover a DR ([ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md)).
- **RTO:** minutos para fallo de nodo/pod (self-healing de K8s); horas para failover a Sitio DR (warm-standby). Debe **probarse antes de producción** para C1.
- **RPO:** cercano a cero intra-sitio (réplica síncrona/streaming); minutos hacia DR (réplica asíncrona), según ancho de banda del enlace inter-sitio.

### Estimación de capacidad inicial

> Rangos con supuestos. **Supuestos:** 500–1500 usuarios internos concurrentes, 7 sistemas de la suite, 3 ambientes lógicos (Prod, Staging, DR), carga transaccional media logístico-aduanera (picos en horario de despacho), storage inicial 5–15 TB útiles con crecimiento ~30–50 %/año.

| Recurso | Sitio Primario (inicial) | Supuesto / nota |
| :-- | :-- | :-- |
| Nodos control plane | 3 servidores | Quórum etcd; 8–16 vCPU · 16–32 GB RAM c/u |
| Worker nodes | 4–6 servidores | 16–32 vCPU · 64–128 GB RAM c/u; crecer añadiendo nodos |
| Nodos de datos (BD) | 3–6 servidores/VM dedicados | Fuera del pool de workers; NVMe local; SQL Server + Patroni + MongoDB |
| CPU total (cómputo) | ~96–192 vCPU | Reserva 30–40 % headroom para picos y HPA |
| RAM total (cómputo) | ~320–768 GB | — |
| Storage replicado (PV app) | 5–15 TB útiles (×3 réplica bruto) | Longhorn/Ceph; crecer por discos/nodos |
| Object storage (MinIO) | 5–20 TB | Documentos + backups lógicos |
| Red | 10 GbE redundante (bonding) | Enlace dedicado ≥ 1 GbE a Sitio DR |
| Sitio DR | ~50–70 % de la capacidad primaria | Warm-standby; escala a full ante desastre |
| Backup | Repositorio inmutable ≥ 2× datos productivos | Retención hasta 5 años (auditoría financiera) |

## 6. Estimated Infrastructure Cost

> Estimación en **RANGOS**. Región: **Perú (datacenter corporativo propio, Lima)** · Supuestos: los de §5 (500–1500 usuarios, 7 sistemas, doble sitio Primario+DR, 5–15 TB útiles). **No se inventan precios exactos**; los rangos dependen fuertemente de negociación de hardware, uso o no de virtualización con licencia, y dotación de personal.

| Concepto | Estimación |
| :-- | :-- |
| Costo mensual estimado (OPEX) | USD 8k–25k / mes |
| Costo anual estimado (OPEX) | USD 100k–300k / año |
| Costo de implementación inicial (CAPEX) | USD 250k–700k (una vez) |
| Costo operativo estimado | Dominado por personal de plataforma/SRE + soporte + energía |

**Desglose On-Premise** (rangos, doble sitio):

| Rubro | Rango | Supuestos que lo mueven |
| :-- | :-- | :-- |
| **CAPEX — Hardware** | USD 200k–550k | 12–20 servidores (control+worker+datos, ×2 sitios), storage NVMe/SSD, switches 10 GbE redundantes, cabinas de backup |
| **CAPEX — Instalación/red/UPS** | USD 30k–100k | Racks, UPS, refrigeración, cableado, firewall NGFW, enlace inter-sitio |
| **Licenciamiento** | USD 15k–120k / año | K8s/Longhorn/PostgreSQL/MongoDB/RabbitMQ/Vault/Keycloak = **open-source (USD 0 de licencia)** por [ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md); el costo lo introducen **SQL Server** (por core) y, si se usa, **Veeam** y soporte comercial de RKE2/Rancher (SUSE) u OpenShift |
| **Energía** | USD 6k–24k / año | Consumo de 12–20 servidores + refrigeración; tarifa industrial local; ×2 con DR encendido |
| **Soporte** | USD 10k–60k / año | Contratos de soporte de hardware, SUSE (RKE2/Rancher) y/o SQL Server; opcional para OSS |
| **Renovación (refresh)** | ~15–25 % del CAPEX / año amortizado | Ciclo de renovación de hardware 4–5 años; discos y baterías UPS antes |
| **Personal** | USD 60k–180k / año | Equipo de plataforma/SRE (2–4 FTE) con guardia; es el rubro estructural mayor de esta alternativa |

**Lectura directiva:** frente a las alternativas cloud, el On-Premise cambia **OPEX variable por CAPEX alto + OPEX de personal**, y elimina la factura opaca por transacción ([ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md)). Se justifica cuando la soberanía de datos y la operación air-gapped son requisitos duros, no cuando prima el time-to-market.

## 7. Operación, monitoreo, seguridad, recuperación

*(¿Quién la opera? ¿Cómo se monitorea/protege/recupera?)*

- **Operación:** equipo de **plataforma/SRE** interno con guardia; despliegues por Helm/GitOps desde registro y repositorio internos; parcheo de nodos por *cordon/drain* rolling.
- **Monitoreo:** Prometheus (métricas de clúster, nodos y motores vía exporters), Loki (logs JSON), Tempo (trazas), Grafana (dashboards + alertas → correo/chat corporativo). Alertas de saturación de nodos, quórum de etcd, lag de réplica de BD y ocupación de storage.
- **Seguridad:** perímetro **NGFW + VPN**; DMZ para el borde; *NetworkPolicies* por namespace; **mTLS** al activar malla (Fase 3+); identidad OIDC (UMS/Keycloak); secretos por **Vault** (sidecar, único patrón aprobado); cifrado en reposo y tránsito; escaneo de imágenes en el registro interno.
- **Recuperación:** backup **3-2-1** con copia **inmutable** (Velero para clúster/PV + Veeam para VM/BD); retención hasta **5 años** por auditoría financiera; **DR** con Sitio físico secundario en warm-standby y replicación asíncrona; runbook de failover ensayado (promoción de standby Patroni/Always On/replica set, repunte de MinIO/RabbitMQ, reapuntado de DNS/VIP interno).

## 8. Cuándo usar / Ventajas y desventajas

**Cuándo conviene:** cuando la **soberanía de datos física es un requisito duro** (mandato regulatorio, PII que no puede salir del país o de la propiedad de la empresa), en instalaciones **air-gapped**, o cuando la organización ya posee datacenter y equipo de plataforma y quiere transparencia total de costos evitando la factura variable de la nube. Es el Escenario 4 de los [escenarios multinube](../../../escenarios-despliegue-multinube.es.md#4-escenario-on-premise-control-total-y-soberanía-extrema).

| Ventajas | Desventajas |
| :-- | :-- |
| Soberanía y control físico absolutos; datos nunca salen de la propiedad | CAPEX inicial alto y ciclo de renovación de hardware a cargo del cliente |
| 100% open-source autohospedable; sin lock-in de proveedor ([ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md)) | Máxima sobrecarga operativa: réplica, backups y parches son responsabilidad interna |
| Latencia ultrabaja (< 1 ms) cómputo-datos en la misma red física | HA ante desastre exige un segundo sitio físico (duplica infraestructura) |
| Capacidad air-gapped real; transparencia total de costos | Requiere equipo de plataforma/SRE maduro con guardia |
| Mismo Helm chart y binario que cloud ([ADR-0039](../../../adrs/core/0039-switcher-abstraccion-topologia-despliegue.es.md)) | Escalado no es elástico: es capacidad aprovisionada (añadir nodos) |

### Evaluación de alternativas tecnológicas del orquestador

| Distribución | Fortalezas | Debilidades | Veredicto |
| :-- | :-- | :-- | :-- |
| **RKE2** | Hardened (CIS/STIG por defecto, FIPS), ligero, **air-gap friendly**, soporte comercial opcional SUSE, agnóstico de hardware | Ecosistema de add-ons menos "todo incluido" que OpenShift | **Recomendada** |
| Rancher | Excelente consola multi-clúster y RBAC; complementa RKE2 | No es un runtime en sí (gestiona clústeres); añade componente a operar | Complemento opcional de RKE2 |
| OpenShift | Plataforma integral (CI/CD, registry, consola) | **Licenciamiento por core costoso**, más pesado, mayor lock-in de plataforma | Descartada por costo/soberanía |
| Kubernetes vanilla | Máximo control y neutralidad | Todo el hardening, air-gap y HA del control plane es trabajo manual; mayor riesgo operativo | Descartada por sobrecarga |

**Selección: RKE2** (justificación). Es la distribución del Escenario 4 y la que mejor equilibra los principios del Hub: viene **hardened** de fábrica (reduce el trabajo de seguridad manual), es **ligero** (menor huella que OpenShift, cabe en hardware modesto), es **air-gap friendly** (instalación por *tarball* sin salida a Internet, requisito de la operación soberana), mantiene el chart **agnóstico al sabor** ([stack §7](../../../stack-tecnologico-autorizado-agnostico.es.md)) y ofrece **soporte comercial opcional** de SUSE sin imponer licencia por core como OpenShift. Rancher se adopta solo como consola de flota si se justifica gestionar Primario+DR.

## 9. Relación con el SDLC de UNIMAR-ARCH

- **Fase SDLC:** 5 — Entrega y Operaciones. Kubernetes se adopta desde **Fase 3+** ([ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md), [stack §7](../../../stack-tecnologico-autorizado-agnostico.es.md)); antes basta Compose/VM.
- **ADRs que la gobiernan:** [ADR-0028](../../../adrs/core/0028-infraestructura-hibrida-autogestionada.es.md) (open-source autohospedable, infra como puerto), [ADR-0039](../../../adrs/core/0039-switcher-abstraccion-topologia-despliegue.es.md) (`DEPLOYMENT_TOPOLOGY=ON_PREMISE_ISOLATED`), [ADR-0013](../../../adrs/core/0013-topologia-infraestructura-cloud-dr.es.md) (DR y 24/7), [ADR-0010](../../../adrs/core/0010-estrategia-arquitectura-multitenant.es.md) (multi-tenant en aplicación), [ADR-0051](../../../adrs/core/0051-estrategia-motor-base-datos-empresarial.es.md) (motores de BD), [ADR-0106](../../../adrs/core/0106-seguridad-calidad-local-first.es.md) (local-first).
- **Adopción por producto:** cada satélite registra la decisión de adoptar esta alternativa en su `DECISIONS.md` y cualquier hallazgo en su `GAPS.md`.
- **Hallazgo abierto relacionado:** **G-063** (verificado por ejecución) — la app de referencia ya corre en K8s sobre PostgreSQL, pero **sin autenticación ni respaldo** (ningún `CronJob` de backup). Esta alternativa cierra la brecha en el papel (Vault + OIDC + Velero/Veeam + retención); su cierre efectivo se prueba al implementarla. Queda como pendiente hasta la verificación.

---

<p align="center">
  <img src="https://img.shields.io/badge/Licencia-MIT-0f3e67?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/Mantenedor-Architecture_Board-042139?style=flat-square" alt="Mantenedor">
</p>

<p align="center">
  <strong>© Unimar S.A.</strong> · RUC 20100412447 · Operador Logístico Aduanero desde 1978<br>
  Última revisión: 2026-07-22
</p>
</content>
</invoke>
