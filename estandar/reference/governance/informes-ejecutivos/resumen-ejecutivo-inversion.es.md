# Resumen Ejecutivo de Inversión
## Consolidado de Herramientas IA, SCM e Infraestructura de Desarrollo
**UNIMAR | JUNIO 2026**

| Control | Detalle |
| :------ | :------ |
| **Versión** | 1.0 |
| **Fecha** | 18/06/2026 |
| **Autores** | Alberto Arroyo, Cristhian Jara |
| **Aprobador** | Carlos Villanueva |
| **Estado** | Aprobado |

> **Descargar:** `Versión PDF` · [`Versión HTML`](./resumen-ejecutivo-inversion.html)

> **Propósito:** Unificar la decisión de inversión en herramientas de IA, plataforma SCM y recursos asociados en un solo documento estratégico para la Dirección. Costos expresados en USD, basados en un equipo de 20 personas con esquema de adopción progresiva (Fase 1 → Fase 2).

---

## HOJA 0 — DECISIÓN EN UNA PÁGINA

| Dimensión | Síntesis para la Dirección |
| :-------- | :------------------------- |
| **Problema** | SecurityScorecard **F**, TFS 2012 obsoleto, 50% del código escrito por proveedores sin control. Equipo de 20 personas sin herramientas IA ni automatización. |
| **Solución** | **GitHub Team** como SCM corporativo + **Seguridad Local** como capa base + **add-ons de seguridad** para repos con proveedores. **Claude** como cerebro arquitectónico, **OpenCode** como ejecutor BMAD, **Copilot** como autocompletado para líderes, **Docker Desktop** para entornos locales. |
| **Costo mensual (estabilizado)** | **~USD 1,655/mes** a partir del mes 4, cuando los add-ons de seguridad y Copilot están activos. |
| **Costo primer año** | **~USD 19,740** (incluye fases progresivas). |
| **Costo 4 años** | **~USD 79,860** (USD 1,655/mes × 36 meses + USD 19,740 año 1). |
| **Hardware (una sola vez)** | **~USD 30,000** para renovar equipos con 32 GB RAM y 512 GB SSD. |
| **Inversión total 4 años + hardware** | **~USD 109,860.** |

---

## 1. METODOLOGÍA Y SUPUESTOS

- **Equipo:** 20 personas (Arquitecto, Analista, 5 líderes técnicos, 13 desarrolladores/QA).
- **Adopción progresiva:**
  - **Fase 1 (meses 1-3):** Sin Copilot, sin add-ons de seguridad para proveedores.
  - **Fase 2 (meses 4+):** Copilot para 5 líderes, add-ons activados para ~10 committers externos.
- **Proveedores externos:** Se estiman 2 proveedores con 5 committers activos cada uno a partir del mes 4.
- **Hardware:** Renovación de equipos cada 4 años. Inversión única en 2026 y nuevamente en 2030.
- **Tipo de cambio referencial:** S/ 3.50 por USD (aproximado).
- **No incluye:** IGV, descuentos por volumen, costos de electricidad/connectividad.

---

## 2. RUBROS DE INVERSIÓN — DETALLE MENSUAL

### 2.1 Licencias de IA y Herramientas

| Rubro | Detalle | Unidades | Costo Unitario | USD/mes (estabilizado) |
| :---- | :------ | :------- | :------------- | :-------------------- |
| Claude Arquitecto/Analista | Plan USD 200 | 2 | USD 200 | USD 400 |
| Claude Pro | Plan USD 20 | 18 | USD 20 | USD 360 |
| OpenCode Go | Suscripción premium | 5 | USD 10 | USD 50 |
| OpenCode Gratuito | Plan free | 15 | USD 0 | USD 0 |
| GitHub Copilot Business (líderes) | Autocompletado VS Code | 5 | USD 19 | USD 95 |
| Docker Desktop Team | Contenedores locales | 15 | USD 10 | USD 150 |
| **Subtotal IA + Herramientas** | | | | **USD 1,055/mes** |

### 2.2 Plataforma SCM y Seguridad

| Rubro | Detalle | Costo Base | Costo Variable | USD/mes (estabilizado) |
| :---- | :------ | :--------- | :------------- | :-------------------- |
| GitHub Team | Plataforma SCM (25 users) | USD 100 | — | USD 100 |
| SonarQube (self-hosted) | Análisis estático de código | USD 30 | — | USD 30 |
| Secret Protection + Code Security | Add-ons para 10 committers externos | — | USD 49/committer | USD 490 |
| **Subtotal SCM + Seguridad** | | | | **USD 620/mes** |

### 2.3 Infraestructura de Publicación (incluida)

| Rubro | Costo | Nota |
| :---- | :---- | :--- |
| GitHub Container Registry (Docker) | USD 0 | 2 GB almacenamiento incluido en GitHub Team |
| GitHub Packages (NuGet) | USD 0 | Ilimitado, incluido en GitHub Team |
| GitHub Packages (npm) | USD 0 | Ilimitado, incluido en GitHub Team |

### 2.4 Hardware (inversión única)

| Rubro | Cantidad | Costo Unitario | Total |
| :---- | :------- | :------------- | :---- |
| Estación de trabajo (32 GB RAM, 512 GB SSD, i7/Ryzen 7) | 20 | ~USD 1,500 | ~USD 30,000 |

---

## 3. PROYECCIÓN MENSUAL 2026

### Fase 1 (Meses 1-3): Sin Copilot, sin add-ons de seguridad

| Rubro | Ene | Feb | Mar | Total Q1 |
| :---- | :-: | :-: | :-: | :------: |
| Claude Arquitecto | 400 | 400 | 400 | 1,200 |
| Claude Pro | 360 | 360 | 360 | 1,080 |
| OpenCode Go | 50 | 50 | 50 | 150 |
| OpenCode Gratuito | 0 | 0 | 0 | 0 |
| GitHub Copilot | 0 | 0 | 0 | 0 |
| Docker Desktop | 150 | 150 | 150 | 450 |
| GitHub Team | 100 | 100 | 100 | 300 |
| SonarQube | 30 | 30 | 30 | 90 |
| Add-ons seguridad | 0 | 0 | 0 | 0 |
| **Total mes** | **1,090** | **1,090** | **1,090** | **3,270** |

### Fase 2 (Meses 4-12): Con Copilot + add-ons activos

| Rubro | Abr | May | Jun | Jul | Ago | Sep | Oct | Nov | Dic | Total Q2-Q4 |
| :---- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :---------: |
| Claude Arquitecto | 400 | 400 | 400 | 400 | 400 | 400 | 400 | 400 | 400 | 3,600 |
| Claude Pro | 360 | 360 | 360 | 360 | 360 | 360 | 360 | 360 | 360 | 3,240 |
| OpenCode Go | 50 | 50 | 50 | 50 | 50 | 50 | 50 | 50 | 50 | 450 |
| OpenCode Gratuito | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| GitHub Copilot | 95 | 95 | 95 | 95 | 95 | 95 | 95 | 95 | 95 | 855 |
| Docker Desktop | 150 | 150 | 150 | 150 | 150 | 150 | 150 | 150 | 150 | 1,350 |
| GitHub Team | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 900 |
| SonarQube | 30 | 30 | 30 | 30 | 30 | 30 | 30 | 30 | 30 | 270 |
| Add-ons seguridad (10 committers) | 490 | 490 | 490 | 490 | 490 | 490 | 490 | 490 | 490 | 4,410 |
| **Total mes** | **1,655** | **1,655** | **1,655** | **1,655** | **1,655** | **1,655** | **1,655** | **1,655** | **1,655** | **14,895** |

### Hardware

| Rubro | Ene | Feb–Dic | Total |
| :---- | :-: | :-----: | :---: |
| Equipos 20 estaciones | 30,000 | 0 | 30,000 |

### Totales 2026

| Concepto | USD |
| :------- | :-: |
| Fase 1 (Q1) | 3,270 |
| Fase 2 (Q2-Q4) | 14,895 |
| **Total licencias 2026** | **18,165** |
| Hardware (una sola vez) | 30,000 |
| **Gran Total 2026** | **48,165** |

---

## 4. PROYECCIÓN 2027-2029

A partir de 2027, el costo se estabiliza en **USD 1,655/mes** (sin hardware, que se renueva cada 4 años).

| Rubro | 2027 | 2028 | 2029 |
| :---- | :--: | :--: | :--: |
| Claude Arquitecto (400 × 12) | 4,800 | 4,800 | 4,800 |
| Claude Pro (360 × 12) | 4,320 | 4,320 | 4,320 |
| OpenCode Go (50 × 12) | 600 | 600 | 600 |
| OpenCode Gratuito | 0 | 0 | 0 |
| GitHub Copilot (95 × 12) | 1,140 | 1,140 | 1,140 |
| Docker Desktop (150 × 12) | 1,800 | 1,800 | 1,800 |
| GitHub Team (100 × 12) | 1,200 | 1,200 | 1,200 |
| SonarQube (30 × 12) | 360 | 360 | 360 |
| Add-ons seguridad (490 × 12) | 5,880 | 5,880 | 5,880 |
| **Total anual** | **20,100** | **20,100** | **20,100** |
| Hardware (renovación 2030) | — | — | — |

> **Nota:** El hardware se renueva cada 4 años. La próxima inversión de ~USD 30,000 corresponde a 2030, fuera de esta proyección.

---

## 5. RESUMEN DE INVERSIÓN 4 AÑOS (2026-2029)

| Rubro | 2026 | 2027 | 2028 | 2029 | Total 4 años | % Participación |
| :---- | :--: | :--: | :--: | :--: | :----------: | :-------------: |
| Claude Arquitecto | 4,800 | 4,800 | 4,800 | 4,800 | **19,200** | 21.3% |
| Claude Pro | 4,320 | 4,320 | 4,320 | 4,320 | **17,280** | 19.2% |
| OpenCode Go | 600 | 600 | 600 | 600 | **2,400** | 2.7% |
| GitHub Copilot | 855 | 1,140 | 1,140 | 1,140 | **4,275** | 4.7% |
| Docker Desktop | 1,800 | 1,800 | 1,800 | 1,800 | **7,200** | 8.0% |
| GitHub Team | 1,200 | 1,200 | 1,200 | 1,200 | **4,800** | 5.3% |
| SonarQube | 360 | 360 | 360 | 360 | **1,440** | 1.6% |
| Add-ons seguridad | 4,410 | 5,880 | 5,880 | 5,880 | **22,050** | 24.5% |
| **Subtotal licencias** | **18,165** | **20,100** | **20,100** | **20,100** | **78,465** | 87.2% |
| **Hardware (una vez)** | **30,000** | — | — | — | **30,000** | 12.8% |
| **Gran Total** | **48,165** | **20,100** | **20,100** | **20,100** | **108,465** | 100% |

### Distribución del gasto total (4 años)

```
Add-ons seguridad         24.5%  ████████████████
Claude Arquitecto         21.3%  ██████████████
Claude Pro                19.2%  ████████████
Hardware (una vez)        12.8%  ████████
Docker Desktop             8.0%  █████
GitHub Team                5.3%  ███
GitHub Copilot             4.7%  ███
OpenCode Go                2.7%  ██
SonarQube                  1.6%  █
```

---

## 6. ANÁLISIS EJECUTIVO

### Indicadores Clave

| Indicador | Valor |
| :-------- | :---- |
| **Costo mensual estabilizado** | USD 1,655 |
| **Costo por persona/mes** | USD 83 |
| **Inversión total 4 años (con hardware)** | USD 108,465 |
| **Costo de un solo incidente de seguridad** | USD 50,000 – 500,000 |
| **Retorno estimado (incidente evitado vs. inversión 4 años)** | 0.5× a 5× |

### Notas para la Dirección

1. **El mayor costo son los add-ons de seguridad** (24.5% del total). Refleja que el 50% del código lo escriben proveedores externos. Si UNIMAR internalizara el desarrollo, este costo desaparece.
2. **Claude representa el 40.5%** combinando Arquitecto + Pro. Es la herramienta más cara, pero también la que garantiza calidad arquitectónica y alineación con BMAD.
3. **Hardware es inversión, no gasto.** Los USD 30,000 se distribuyen en 4 años (~USD 625/persona/año). Sin equipos adecuados, las herramientas de IA + Docker + SQL Server no funcionan sin degradación.
4. **Hardware es inversión, no gasto.** Los USD 30,000 se distribuyen en 4 años (~USD 625/persona/año). Sin equipos adecuados, las herramientas de IA + Docker + SQL Server no funcionan sin degradación.

---

## 7. VEREDICTO FINAL

**El Comité Ejecutivo aprueba:**

1. **GitHub Team** como plataforma SCM corporativa (USD 100/mes).
2. **Seguridad Local** (Husky + talisman + SonarQube) como capa base para el equipo interno.
3. **Add-ons de seguridad** (Secret Protection + Code Security) activados incrementalmente para repositorios con proveedores externos.
4. **Claude Arquitecto/Analista** (2 licencias USD 200) + **Claude Pro** (18 licencias USD 20) para todo el equipo.
5. **OpenCode Go** (5 líderes) para ejecución de flujos BMAD.
6. **GitHub Copilot Business** (5 líderes) para autocompletado en VS Code.
7. **Docker Desktop Team** (15 usuarios) para entornos contenedorizados locales.
8. **Renovación de hardware** para equipos con menos de 32 GB RAM.

**Inversión total: USD 108,465 en 4 años** (incluyendo hardware).

---

*Documento generado en junio 2026. Costos basados en precios públicos sin descuentos corporativos. Los precios de las plataformas (Claude, GitHub, Docker) están sujetos a cambios por parte de los proveedores. Se recomienda revisión anual de esta proyección.*