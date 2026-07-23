# Escenarios de Despliegue Multi-Nube y Cumplimiento

Este documento detalla las arquitecturas de despliegue aprobadas para la Arquitectura Corporativa, considerando controles rigurosos de soberanía de datos y seguridad. El control de acceso por sucursal se resuelve siempre en la capa de aplicación ([ADR-0010](./adrs/core/0010-estrategia-arquitectura-multitenant.es.md)), de modo que es idéntico en los tres escenarios y no depende del proveedor.

---

## 1. Introducción al Cumplimiento Operativo

Cualquier implementación física de la arquitectura debe satisfacer las directrices del **RGPD** (Reglamento General de Protección de Datos) y la norma **ISO/IEC 27001:2022**, específicamente en los dominios de A.8 (Seguridad de los Activos) y A.10 (Criptografía).

| Vector de Control | Estándar Corporativo | Enfoque en Arquitectura Hexagonal |
| :--- | :--- | :--- |
| **Soberanía** | Restricción geográfica física. | Adaptadores de persistencia específicos por región legal. |
| **Cifrado** | En reposo (AES-256) y tránsito (TLS 1.3). | Terminado en TLS de Gateway, encriptación nativa de BD. |
| **Segregación** | Control de Acceso Basado en Atributos (ABAC). | Lógica resuelta en la capa de aplicación, igual en todo proveedor ([ADR-0010](./adrs/core/0010-estrategia-arquitectura-multitenant.es.md)). |

---

## 2. Escenario AZURE: Cumplimiento Estricto Empresarial

Orientado a sectores altamente regulados (Banca, Salud) que requieren auditoría exhaustiva y cifrado "hardware-backed".

### 2.1 Blueprint de Red y Seguridad
```mermaid
graph TD
 subgraph VNet["Azure Virtual Network (Hub and Spoke)"]
 subgraph DMZ["DMZ Subnet"]
 AFD["Azure Front Door (WAF v2)"]
 AGW["App Gateway (TLS Term)"]
 end
 subgraph AppTier["AKS Cluster Subnet"]
 AKS["AKS Pods"]
 ACFG["App Config + Key Vault"]
 end
 subgraph DataTier["Private Link Subnet"]
 SQL["Azure SQL Hyperscale\n(Always Encrypted)"]
 end
 end

 Internet((Usuarios)) --> AFD
 AFD --> AGW
 AGW --> AKS
 AKS -.-> ACFG
 AKS -->|Private Link| SQL
```

### 2.2 Implementación de Seguridad

- **Acceso por sucursal:** validación de autorización en la capa de aplicación ([ADR-0010](./adrs/core/0010-estrategia-arquitectura-multitenant.es.md)). No se usan políticas RLS de SQL Server: UNIMAR no es multi-tenant y el aislamiento estricto impediría operaciones cross-sucursal legítimas.
- **Protección frente al administrador de BD:** **Always Encrypted** con claves en Key Vault — el DBA sin la clave maestra no lee los datos sensibles. Este control es de cifrado, no de aislamiento por sucursal, y es independiente de la autorización.

### 2.3 Infraestructura como Código (Bicep Sample)
```bicep
// Habilitación de Cifrado Avanzado en Azure SQL
resource sqlServer 'Microsoft.Sql/servers@2023-05-01-preview' = {
 name: 'sql-bmad-prod'
 location: 'westeurope' // Cumplimiento de Región UE
 properties: {
 administratorLogin: 'sysadmin'
 // Restringir a Microsoft Entra Auth solo
 minimalTlsVersion: '1.2'
 publicNetworkAccess: 'Disabled'
 }
}

resource sqlDB 'Microsoft.Sql/servers/databases@2023-05-01-preview' = {
 parent: sqlServer
 name: 'sqldb-tenants'
 location: 'westeurope'
 sku: {
 name: 'GP_Gen5_4'
 }
 properties: {
 zoneRedundant: true
 }
}

// Azure Policy para restringir Regiones (Soberanía)
resource policyAssignment 'Microsoft.Authorization/policyAssignments@2023-04-01' = {
 name: 'restrict-to-europe'
 properties: {
 policyDefinitionId: '/providers/Microsoft.Authorization/policyDefinitions/e56962a6-4747-49cd-b67b-bf8b01975c4c'
 parameters: {
 listOfAllowedLocations: {
 value: [
 'westeurope'
 'northeurope'
]
 }
 }
 }
}
```

### 2.4 Matrices Operativas
**Matriz de Cumplimiento:**
| Control ISO 27001 | Requisito | Solución Azure |
| :--- | :--- | :--- |
| **A.10.1.1** | Política Criptográfica | Cifrado Determinístico Always Encrypted gestionado en Key Vault. |
| **A.8.1.3** | Uso Aceptable de Activos | Azure Policy impide aprovisionar recursos fuera de fronteras de la UE. |

**Análisis CAP:**
- **Resultado:** **CP** (Consistencia y Tolerancia a Particiones).
- **Impacto:** Azure SQL con redundancia de zona garantiza consistencia fuerte en transacciones concurrentes, a costa de latencia imperceptible en escrituras síncronas inter-zona.

---

## 3. Escenario AWS: Resiliencia Global y Privacidad Total

Orientado a escalado global con aislamiento total de red, donde las llaves de cifrado pertenecen y son rotadas exclusivamente por el cliente (CMK).

### 3.1 Blueprint de Red y Seguridad
```mermaid
graph TD
 subgraph VPC["AWS VPC (Sin salida directa a IGW)"]
 subgraph PublicSubnets["Public / NAT (Opcional)"]
 ALB["AWS ALB (TLS 1.3)"]
 end
 subgraph PrivateAppSubnets["App Subnets (Multi-AZ)"]
 EKS["EKS Node Groups\n(Pods w/ IAM Roles for SA)"]
 end
 subgraph PrivateDataSubnets["Data Subnets"]
 Aurora["Amazon Aurora Postgres\n(Multi-AZ Cluster)"]
 end
 VPCE["VPC Endpoints\n(KMS, Secrets Mgr, S3)"]
 end

 Users((Tráfico)) --> ALB
 ALB --> EKS
 EKS --> Aurora
 EKS -.-> VPCE
```

### 3.2 Implementación de Seguridad
- **Privacidad de Red:** Los pods de la aplicación no tienen acceso directo a Internet. Toda comunicación con servicios AWS (KMS para llaves de cifrado) se realiza mediante **VPC Endpoint Services (PrivateLink)**.
- **Portabilidad:** el control de acceso vive en la capa de aplicación ([ADR-0010](./adrs/core/0010-estrategia-arquitectura-multitenant.es.md)), de modo que el modelo funciona igual sobre bases de datos secundarias NoSQL (como DynamoDB) sin depender de capacidades nativas del motor. El cifrado transparente se mantiene vía CMK.

### 3.3 Infraestructura como Código (Terraform Sample)
```hcl
# Definición de Cluster Aurora con CMK de Cliente
resource "aws_kms_key" "db_encryption_key" {
 description = "KMS Key for Customer Data Compliance"
 deletion_window_in_days = 7
 enable_key_rotation = true # ISO 27001 A.10.1.2
}

resource "aws_rds_cluster" "aurora_cluster" {
 cluster_identifier = "bmad-aurora-cluster"
 engine = "aurora-postgresql"
 database_name = "corporate_db"
 master_username = "admin"
 master_password = var.db_password

 storage_encrypted = true
 kms_key_id = aws_kms_key.db_encryption_key.arn

 vpc_security_group_ids = [aws_security_group.data_sg.id]
 db_subnet_group_name = aws_db_subnet_group.private_subnets.name

 # Resiliencia Multi-AZ
 availability_zones = ["us-east-1a", "us-east-1b", "us-east-1c"]
 backtrack_window = 259200 # 72 Horas de recuperación de desastres
}
```

### 3.4 Matrices Operativas
**Matriz de Cumplimiento:**
| Control ISO 27001 | Requisito | Solución AWS |
| :--- | :--- | :--- |
| **A.13.1.1** | Controles de Red | El tráfico no cruza Internet Pública gracias a PrivateLink Endpoints. |
| **RGPD Art. 32** | Seudonimización | Separación física de llaves KMS y datos PostgreSQL encriptados. |

**Análisis CAP:**
- **Resultado:** **AP** (Disponibilidad y Tolerancia a Particiones).
- **Impacto:** Configurado con Aurora Reader Endpoints, el sistema prioriza responder lecturas desde cualquier AZ activa, manejando una réplica eventual sub-10ms.

---

## 4. Escenario ON-PREMISE: Control Total y Soberanía Extrema

Diseñado para implementaciones gubernamentales o instalaciones locales aisladas (Air-Gapped) donde la soberanía física es absoluta.

### 4.1 Blueprint de Red y Seguridad
```mermaid
graph TD
 subgraph Datacenter["Datacenter Físico Corporativo"]
 FW["Hardware Firewall (NGFW)"]
 subgraph K8sCluster["Kubernetes Cluster (RKE2)"]
 AppPods["Pods de Aplicación\n(Carga Dinámica)"]
 Vault["HashiCorp Vault (Cluster Local)"]
 end
 subgraph BareMetalData["Persistencia Física"]
 PostgresHAP["PostgreSQL Bare Metal\n(Patroni / Repmgr)"]
 Backup["Veeam / Backup Inmutable"]
 end
 end

 CorporateNetwork((Red Corporativa)) --> FW
 FW --> AppPods
 AppPods -.-> Vault
 AppPods --> PostgresHAP
 PostgresHAP --> Backup
```

### 4.2 Implementación de Seguridad
- **Acceso por sucursal:** validación de autorización en la capa de aplicación ([ADR-0010](./adrs/core/0010-estrategia-arquitectura-multitenant.es.md)), con secretos inyectados mediante **HashiCorp Vault**. Al resolverse en capas superiores, la auditoría criptográfica de accesos ocurre antes de llegar al motor de base de datos y no depende de sus capacidades nativas.
- **Respaldo:** Estrategia de backups inmutables con retención estricta de 5 años localmente para cumplir con leyes de auditoría de datos financieros.

### 4.3 Infraestructura como Código (Terraform for Vault)
```hcl
# Configuración de inyección de secretos y Flags mediante Vault
resource "vault_mount" "kvv2" {
 path = "secret"
 type = "kv"
 options = { version = "2" }
 description = "Secret storage for App Settings"
}

resource "vault_kv_secret_v2" "app_config" {
 mount = vault_mount.kvv2.path
 name = "production/application-settings"

 data_json = jsonencode({
 DB_ENCRYPTION_KEY = var.master_onprem_key
 })
}

# Regla de acceso para el Pod ServiceAccount
resource "vault_policy" "app_reader" {
 name = "app-policy"
 policy = <<EOT
path "secret/data/production/application-settings" {
 capabilities = ["read"]
}
EOT
}
```

### 4.4 Matrices Operativas
**Matriz de Cumplimiento:**
| Requisito Legal | Control | Solución On-Premise |
| :--- | :--- | :--- |
| **Soberanía Absoluta** | Localización Física | Los datos nunca salen de la propiedad física de la empresa. |
| **ISO 27001 A.12.3** | Respaldos | Estrategia de Respaldo en Cinta / Almacenamiento Objeto S3 Local Inmutable. |

**Análisis CAP:**
- **Resultado:** **CP** (Foco extremo en consistencia local).
- **Impacto:** Latencias ultrabajas (< 1ms) al estar la computación y los datos en la misma red física cableada. Riesgo de disponibilidad ante desastres naturales a menos que se despliegue un sitio de réplica DR secundario.

---

## 5. Escenario HÍBRIDO: Emergencia y Transición Elástica

Orientado a absorber picos de tráfico repentinos o cuando la regulación permite computación en nube pero exige persistencia local (Leyes de Protección de Datos restrictivas).

### 5.1 Blueprint de Red y Seguridad
```mermaid
graph TD
 subgraph PublicCloud["Nube Pública (AWS/Azure)"]
 LB["Cloud Load Balancer"]
 AppNodes["Compute Nodes (Front-end / BFF)\n(App-Layer Logic)"]
 end
 subgraph Conex["Conectividad Segura"]
 VPN["Site-to-Site VPN / DirectConnect"]
 end
 subgraph OnPrem["Datacenter On-Premise"]
 SecFW["Firewall Perimetral"]
 CoreDB[("Base de Datos Maestra\n(Datos PII)")]
 end

 Internet((Internet)) --> LB
 LB --> AppNodes
 AppNodes --> VPN
 VPN --> SecFW
 SecFW --> CoreDB
```

### 5.2 Flujo de Datos y Optimización de Latencia
Al operar en un entorno híbrido, la latencia de red introduce cuellos de botella significativos en el intercambio de datos SQL.

**Optimización del filtrado:**
1. El adaptador de infraestructura de la aplicación en la nube **no** realiza consultas genéricas seguidas de filtrado en memoria (lo cual inundaría la VPN con datos innecesarios).
2. El adaptador traslada el contexto de acceso (`sucursales_autorizadas`, `user_roles`) directamente a la cláusula `WHERE` de la sentencia SQL enviada. La autorización ya se validó antes en el caso de uso: esto es optimización de transporte, no un control de seguridad.
3. **Beneficio de Latencia:** Solo viaja por la VPN el set de datos estrictamente filtrado y autorizado. La auditoría se realiza en la capa de aplicación Cloud y se escribe asíncronamente a un log local redundante.

### 5.3 Matrices Operativas
**Matriz de Cumplimiento:**
| Control ISO 27001 | Requisito | Solución Híbrida |
| :--- | :--- | :--- |
| **RGPD Art. 44** | Transferencias Internacionales | Los datos residen en territorio nacional (On-Prem), solo se procesan volatilmente en la nube mediante túneles IPSec. |

**Análisis CAP:**
- **Impacto de Red:** El sistema está altamente expuesto a la **P** (Partición de red). Una caída de la conexión DirectConnect/VPN deja inoperativa la nube.
- **Estrategia de Mitigación:** Se requiere un patrón de Circuit Breaker local en la nube con caché distribuida de solo-lectura (ej. Valkey/Redis) para mantener la disponibilidad degradada ante caídas de enlace.

---

## 6. Resumen Directivo para la Toma de Decisiones

| Variable | Azure | AWS | On-Premise | Híbrido |
| :--- | :--- | :--- | :--- | :--- |
| **Complejidad Ops** | Media | Media-Alta | Alta | Máxima |
| **Flexibilidad de Flag** | Recomendado `INFRA` | Mixto | Recomendado `APP` | Recomendado `APP` |
| **Agilidad de Escala** | Máxima | Limitada | Alta (Compute) |
| **Compliance Overhead** | Bajo (Out-of-the-box) | Medio | Alto (Manual) | Muy Alto |

---
[Volver al Índice](README.md)
