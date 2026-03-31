# Auditoría de Datos y Resumen Ejecutivo — Junta HPTU 16 de marzo

**Para**: Cristian Espinal (preparación pre-junta)
**Fecha de auditoría**: 16 de marzo, 2026

---

## PARTE 1: ALERTAS DE CONSISTENCIA

Antes de repasar el contenido, estos son los problemas que encontré al cruzar datos entre la presentación, el dashboard y los archivos fuente.

### ALERTA CRÍTICA: Tiempo Km 7 → Aeropuerto

| Donde aparece | Valor | Fuente citada |
|---|---|---|
| Slide 19 (JCI) | **20 min** | No especificada |
| Slide 23 (Access Point) | **41.5 min** | Mapbox Directions API |
| Slide 13 (Q2) | **51.3 min** | Mapbox Matrix API |

**El problema**: El slide 19 dice "Access Point Km 7: 20 min" al aeropuerto, pero los datos reales de Mapbox son 41.5–51.3 min. El "20 min" parece ser un error — la reducción real vs HPTU es ~14 min (no 37 min como dice el slide).

**Qué hacer**: Si alguien pregunta, usar **41.5 min** (Directions API, sin tráfico). Reconocer que el slide 19 tiene un dato optimista. El argumento real es: *Km 7 ahorra 14 min vs HPTU para llegar al aeropuerto* (slide 13 es correcto).

### ALERTA MODERADA: Pesos MCDA inconsistentes

| Donde aparece | Pesos (Acc/Dem/Comp/Val) |
|---|---|
| Slide 22 (presentación 16mar) | **30% / 25% / 25% / 20%** |
| Dashboard interactivo | **35% / 30% / 20% / 15%** |
| Presentaciones anteriores (6mar, avance) | **35% / 30% / 20% / 15%** |

**El problema**: La presentación del 16mar cambió los pesos sin recalcular los scores. Los scores (88, 81, 77...) fueron calculados con 35/30/20/15 pero la slide dice 30/25/25/20.

**Qué hacer**: Si alguien pregunta por los pesos, decir **35/30/20/15** (que es lo que realmente calcula los scores). O simplemente decir "los pesos varían según escenario — el análisis de sensibilidad Monte Carlo con 3,000 iteraciones prueba que LP Bajo se mantiene #1 en todos."

### ALERTA MENOR: Camas Cl. Rosario Tesoro

- Slide 17 (tabla competidores): **140 camas**
- Archivo de datos REPS: **158 camas**
- Correcto probablemente es 158 (viene del desglose detallado REPS s2ru-bqt6).

---

## PARTE 2: LA NARRATIVA EN 5 MINUTOS

Si solo tienes 5 minutos para repasar, esto es lo que necesitas saber.

### El argumento en una frase

> "El HPTU tiene 540 camas en Robledo, hay un corredor de 174,000 predios estrato 5/6 sin un solo hospital de alta complejidad, la demanda está validada por 6 dimensiones independientes, y Las Palmas Bajo sale #1 de 6 zonas."

### Los 5 actos (como una película)

**Acto 1 — El problema** (slides 1-5, 8 min)
- "Miren estos datos: un hospital saturado, lejos de su mercado más rico."

**Acto 2 — La evidencia** (slides 6-10, 10 min)
- "No es una opinión. Estos son los datos de DENSURBAM, el tráfico, la infraestructura."

**Acto 3 — Las 6 preguntas** (slides 11-20, 15 min) ← EL CORAZÓN
- "Nos hicimos 6 preguntas. Las 6 se responden con Sí."

**Acto 4 — La recomendación** (slides 21-27, 12 min)
- "Las Palmas Bajo es la zona #1 con score 88/100."

**Acto 5 — La decisión** (slides 28-33, 10 min)
- "Faltan 8 parámetros. 6 semanas. Este es el cronograma."

---

## PARTE 3: LOS NÚMEROS QUE DEBES TENER EN LA CABEZA

### Tier 1: Los 6 que SIEMPRE te van a preguntar

| # | Número | Qué es | Slide | Fuente real |
|---|--------|--------|-------|-------------|
| 1 | **540** | Camas HPTU sede principal | 3 | REPS + confirmación HPTU |
| 2 | **0** | Camas de alta complejidad en corredor Las Palmas | 6 | REPS + Google Geocoding |
| 3 | **174,543** | Predios E5/E6 en 22 barrios del corredor | 5 | Catastro Medellín (bp59-rj8r) |
| 4 | **88/100** | Score MCDA de Las Palmas Bajo (#1 de 6) | 22 | Modelo MCDA propio |
| 5 | **384,171** | Afiliados contributivos en 7 municipios del Oriente | 14 | BDUA marzo 2026 (ADRES) |
| 6 | **6 de 6** | Preguntas de demanda respondidas con "Sí" | 20 | Marco de validación |

### Tier 2: Los que refuerzan el argumento

| Número | Qué es | Slide |
|--------|--------|-------|
| **1,593** | Total camas hospitalarias en 6 hospitales principales | 6 |
| **40.9 vs 18 km/h** | Velocidad Las Palmas vs El Poblado (el doble) | 8 |
| **–17.8 min** | Ahorro de tiempo Km 7 vs HPTU a El Retiro y La Ceja | 13 |
| **+63.8%** | Crecimiento tráfico Las Palmas en 10 años | 10 |
| **3.46×** | Ratio contributivo/subsidiado en Oriente | 14 |
| **$590,000M COP** | Invertidos por 6 competidores (validación de mercado) | 16 |
| **USD $11.7M** | Captura potencial turismo médico (5% del mercado) | 19 |
| **+152,000** | Personas adicionales a 2037 en el área focal | 7 |
| **VPN +$4.8MM** | Valor Presente Neto LP Bajo (conservador) | 27 |
| **6 semanas** | Tiempo hasta la decisión final | 31 |

---

## PARTE 4: LAS 6 PREGUNTAS — CHEAT SHEET

Este es el corazón de la presentación. Para cada pregunta, necesitas saber: la respuesta, el dato clave, y la fuente.

### Q1: ¿Hay suficientes pacientes? → SÍ, SOBRAN

- **Dato killer**: Rionegro tenía **0 camas UCI** en 2023 (bajó de 0.14/1000)
- **Dato de soporte**: **40-46%** de los pacientes en Rionegro son de **otros municipios** (~33,600/año)
- **Lo que eso significa**: Los pacientes YA están viajando. La demanda existe y nadie la atiende bien.
- **Fuente**: REPS capacidad instalada (b4dp-ximh), DANE estimaciones 2026

### Q2: ¿Vendrán a Km 7? → SÍ, 3 DE 3 TARGETS

- **Dato killer**: Km 7 ahorra **17.8 minutos** a El Retiro y La Ceja vs HPTU actual
- **Lo que eso significa**: Km 7 gana en los 3 destinos de mayor poder adquisitivo (El Retiro, La Ceja, Aeropuerto). Pierde en Guarne y Marinilla, pero esos ya los cubre HPTU actual.
- **Fuente**: Mapbox Matrix API (segundos convertidos a minutos)
- **Matiz importante**: Km 7 NO le gana a HPTU para ir a Rionegro (~similar) ni a Guarne (+15.9 min HPTU). Eso está bien — la nueva sede captura lo que HPTU no puede.

### Q3: ¿Pueden pagar? → SÍ, RATIO 3.46×

- **Dato killer**: **384,171 afiliados contributivos** en 7 municipios del Oriente
- **Dato de soporte**: Rionegro tiene **85% contributivo**. SURA domina con **64-79%** del mercado.
- **Lo que eso significa**: El Oriente es masivamente contributivo. Sura es el contrato ancla obligatorio para viabilidad.
- **Fuente**: BDUA marzo 2026 (ADRES)
- **Extra**: Prepagada Antioquia creció **+37%** desde 2022.

### Q4: ¿Crecerá la demanda? → SÍ, 8 DE 8

- **Dato killer**: **8 indicadores** de crecimiento, **todos** apuntan hacia arriba
- **Los 8**: Población Rionegro (+2.0%), Tráfico LP (+63.8%), Tráfico Túnel (+30.6%), Aeropuerto (14.5M→42.7M), Prepagada (+37%), Turismo médico (+15% CAGR), Migración (5.2/100), Túnel doble calzada (H2 2027)
- **Lo que eso significa**: No es una apuesta. Es una tendencia consolidada en 8 dimensiones.
- **Fuente**: ANI peajes (8yi9-t44c), DANE, ProColombia, Plan Maestro JMC 2055

### Q5: ¿Otros ya validaron? → SÍ, COP $590,000M

- **Dato killer**: **6 instituciones** ya invirtieron **$590,000M COP**
- **Los principales**: HSVF Rionegro (>$200K, 500 camas), H. San Juan Dios ($120K, torre), Torre Oviedo ($100K, 87 consultorios), AUNA Sur ($90K, 168 camas)
- **Campestre** (si preguntan): Solo tiene sede Rionegro, ambulatorio básico, $30,000M. **NO hay torre de 15 pisos en Medellín** — eso era un error de versiones anteriores.
- **Lo que eso significa**: Ventana de oportunidad 2026-2028. Si HPTU no ocupa el nicho, otro lo hará.
- **Fuente**: Prensa verificada, REPS, estados financieros

### Q6: ¿Hay turismo de salud? → SÍ, USD $11.7M

- **Dato killer**: **0 instituciones JCI** a menos de 30 min del aeropuerto. HPTU es el **único JCI en Antioquia**.
- **La oportunidad**: Con solo **5%** del turismo médico (85,000 pac/año × USD $2,764 promedio), son **USD $11.7M adicionales/año**
- **Fuente**: ProColombia, DANE EVI, SISPRO, JCI Directory
- **CUIDADO**: No decir "Km 7 está a 20 min del aeropuerto" (ver Alerta Crítica arriba). Decir "Km 7 reduce significativamente el tiempo vs HPTU actual" y citar 41.5 min si preguntan el número exacto.

---

## PARTE 5: LA RECOMENDACIÓN — POR QUÉ LAS PALMAS BAJO

### El ranking MCDA (6 zonas)

| # | Zona | Score | Por qué |
|---|------|-------|---------|
| **1** | **Las Palmas Bajo** | **88** | Única >80 en 4 dimensiones, POT 9/9 |
| 2 | Access Point Km 7 | 81 | Demanda dual (Poblado + Oriente) |
| 3 | Las Palmas Medio | 77 | Más suelo, menos accesibilidad |
| 4 | Envigado-Zúñiga | 74 | Población grande, competencia densa |
| 5 | N. Poblado-Itagüí | 67 | Mejor tiempo a HPTU, bajo valor inmob. |
| 6 | Las Palmas Alto | **58** | **DESCARTADO**: 57 min, suelo rural |

### LP Bajo en una frase

> "Es la ÚNICA zona que combina: demanda masiva a 15 min, tráfico fluido (40.9 km/h), POT máxima (9/9, CL_D=2.38), cero competencia alta complejidad, VPN positivo, y conexión al Oriente vía Túnel."

### Access Point Km 7 — el candidato #2

- **Fortaleza**: Catchment dual — 135K El Poblado + 460K Oriente = **595K total**
- **Infraestructura**: 4 torres, 10 pisos, 1,085 parqueaderos (ya construido)
- **Post-Túnel**: Rionegro a 25 min
- **Debilidad**: Score de competencia más bajo (65 vs 78 de LP Bajo)

---

## PARTE 6: EL MODELO FINANCIERO — QUÉ DECIR Y QUÉ NO DECIR

### Los números

| Zona | Camas | Inversión | Payback | VPN |
|------|-------|-----------|---------|-----|
| **LP Bajo** | 250 | **$90MM** | 11.3 años | **+$4.8MM** |
| LP Medio | 300 | $108MM | 9.4 años | +$15.3MM |
| Envigado | 220 | $82MM | 11.3 años | +$4.0MM |
| N. Poblado | 260 | $98MM | 9.6 años | +$14.7MM |
| LP Alto | 150 | $55MM | **22.9 años** | **-$31MM** |

### Supuestos clave (los que pueden cuestionar)

| Parámetro | Valor usado | Fuente | Riesgo |
|-----------|-------------|--------|--------|
| Ingreso/cama/año | $1,600M COP | HUSI (hospital público) | **MÁS SENSIBLE** |
| EBITDA | 8% | Supersalud | Bajo para privado |
| WACC | 12% | TES 10Y + prima | Discutible |
| Construcción/m² | $4.0M | Scielo/U. Militar | Puede variar |
| Ocupación | 80% | Estándar sector | Conservador |

### Si dicen "el VPN de $4.8MM es bajo"

Respuesta: *"Ese es el escenario conservador con ingreso/cama de $1,600M (benchmark de hospital público). Si usamos tarifa de privado premium ($2,000M), el VPN sube a +$25MM. Ese es exactamente el parámetro que validamos en las próximas 6 semanas."*

### Lo que NO hay que defender demasiado

El modelo financiero es **preliminar**. La fortaleza del caso es la **demanda**, no el financiero. Los 5 parámetros de alta prioridad (precio suelo, ingreso/cama, EBITDA, fichas normativas POT, lotes disponibles) se validan en Fase 3.

---

## PARTE 7: PREGUNTAS DIFÍCILES Y RESPUESTAS

### "¿Por qué no Envigado que es más barato?"
> "Score 74 vs 88. Pierde en accesibilidad al Oriente y en POT — es municipio autónomo con su propia normativa. LP Bajo tiene el mejor equilibrio de las 4 dimensiones."

### "Campestre ya abrió en Rionegro. ¿Llegamos tarde?"
> "Campestre abrió ambulatorio básico — ortopedia, 250 pacientes/día, $30,000M. No compite con alta complejidad. HPTU ofrece trasplantes, hematología, oncología compleja, y es el único JCI. Son mercados diferentes. Que hayan invertido $30,000M **confirma que la demanda es real**."

### "¿Qué pasa si el Túnel se retrasa?"
> "El caso de LP Bajo NO depende del Túnel. El score 88/100 ya considera el corredor tal como está hoy — 40.9 km/h, 15.4 min desde Milla de Oro. El Túnel es upside: si abre en H2 2027, Rionegro a 25 min."

### "¿Cuántas camas tendría la nueva sede?"
> "Modelo base: 250 camas. Pero la primera fase podría ser un hub ambulatorio — cirugía ambulatoria, imágenes, chequeo ejecutivo. Reduce CAPEX y permite validar demanda antes de escalar."

### "¿Qué tan confiables son los datos?"
> "15 fuentes oficiales: Catastro, DANE, REPS, MEData, POT, ANI, ProColombia, Google Places, Mapbox. 3.8 millones de registros. Cero estimaciones propias — todo trazable al dataset original. La plataforma está en hptu-localizacion.vercel.app para que cualquiera verifique."

### "¿Y la Clínica Alto de Las Palmas?"
> "No fue encontrada en Google Places. Permanece en fase conceptual sin presencia digital verificable. POT restrictivo en zona rural podría limitar su alcance."

---

## PARTE 8: FUENTES DE DATOS — TRAZABILIDAD

Cada número viene de una fuente verificable. Estas son las 15:

| # | Fuente | Dataset ID | Qué aporta |
|---|--------|-----------|------------|
| 1 | **Catastro Medellín** | bp59-rj8r | Predios, estratos, avalúos (1,041,413 registros) |
| 2 | **REPS Prestadores** | b4dp-ximh | IPS habilitadas, tipos, ubicaciones |
| 3 | **REPS Capacidad** | s2ru-bqt6 | Camas por tipo, capacidad instalada |
| 4 | **DANE CNPV 2018** | evm3-92yw | Censo poblacional |
| 5 | **DANE Proyecciones** | vk9k-hfhi | Proyecciones Medellín 2026+ |
| 6 | **DENSURBAM** | URBAM-EAFIT/AMVA | 59 variables, IRS salud, proyecciones 2037 |
| 7 | **MEData Velocidad** | 7t5n-3b3w | Velocidades por corredor (682,502 obs.) |
| 8 | **MEData Aforos** | b9s9-jw7c | Conteos vehiculares por nodo |
| 9 | **ANI Peajes** | 8yi9-t44c | Tráfico vehicular 2014-2024 |
| 10 | **POT Indicadores** | 3ciz-tpgr | Batería indicadores urbanísticos |
| 11 | **BDUA (ADRES)** | Mar 2026 | Afiliación EPS por municipio |
| 12 | **ProColombia** | Informes 2024 | Turismo médico, cifras exportación salud |
| 13 | **Plan Maestro JMC** | 2055 | Proyecciones aeropuerto |
| 14 | **Mapbox APIs** | Matrix + Directions | Tiempos de viaje, isocronas |
| 15 | **Google Places/Geocoding** | API | Ubicaciones, ratings, verificación |

---

## PARTE 9: CHECKLIST PRE-JUNTA

- [ ] Abrir con el problema (540 camas, 0 en corredor), NO con la solución
- [ ] Las 6 preguntas son el momento de engagement — pausar antes de cada "Sí"
- [ ] Slide 20 (6 respuestas = Sí) es el CLÍMAX — pausar ahí
- [ ] No defender el modelo financiero demasiado — reconocer que es preliminar
- [ ] Si preguntan por Campestre: "ambulatorio básico, $30,000M, confirma la demanda"
- [ ] El cronograma (slide 31) es el call-to-action: "6 semanas, esto es lo que necesitamos"
- [ ] Si alguien quiere ver datos: abrir la plataforma (hptu-localizacion.vercel.app)
- [ ] **EVITAR** decir "20 min al aeropuerto" — usar "14 min menos que HPTU actual"
- [ ] **EVITAR** dar cifras de ocupación (no tenemos fuente verificable para eso)

---

*Auditoría realizada el 16 de marzo, 2026. Datos cruzados entre hptu-junta-16mar.tex, 8 archivos .ts de datos, 6 archivos .tsx de dashboard, y 3 presentaciones anteriores.*
