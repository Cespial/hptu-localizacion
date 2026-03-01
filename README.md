# Estudio de Localizacion — HPTU Nueva Sede

Plataforma web interactiva para el estudio de localizacion de una nueva sede del **Hospital Pablo Tobon Uribe (HPTU)** en el area metropolitana de Medellin. Analisis geoespacial multicriterio con 2.6M+ registros de 15 fuentes primarias oficiales, sin datos estimados.

**Live:** [hptu-localizacion.vercel.app](https://hptu-localizacion.vercel.app)

## Metodologia

Modelo de **"Nodos y Flujos de Valor"** en 4 fases:

1. **Mapeo de Demanda** — Analisis catastral barrio por barrio del corredor Las Palmas (1M+ registros, POT, DANE)
2. **Flujos y Nodos** — Velocidades de trafico (682K observaciones MEData), capacidad hospitalaria (REPS MinSalud)
3. **Competencia y Regulacion** — Zonificacion POT, infraestructura de salud existente
4. **Sintesis MCDA** — Multi-Criteria Decision Analysis: `Score = (A x 0.35) + (D x 0.30) + (C x 0.20) + (V x 0.15)`

### Resultado

5 zonas candidatas evaluadas. **Recomendacion: Las Palmas Bajo (88/100)** — unica zona con >80 en las 4 dimensiones.

## Secciones de la Plataforma

- Gradiente de demanda por barrios con datos catastrales reales
- Velocidades de trafico por hora (5 corredores) y volumenes vehiculares (79K vehiculos)
- Brecha de salud: capacidad hospitalaria, cobertura camas/poblacion vs benchmarks OMS
- **Mapa interactivo Mapbox** con capas toggleables: estratos (GeoJSON), 28+ POIs, isocronas reales (10/20/30 min), corredor Las Palmas
- Comparacion MCDA: radar chart, barras de scores, tabla comparativa completa
- Analisis DENSURBAM (URBAM/EAFIT/AMVA): IRS de salud, proyecciones 2017-2037, deficit por barrio
- Catalogo de 15 fuentes primarias con IDs de dataset y portales
- Diagrama de arquitectura de datos y cronograma del proyecto

## Hallazgo Critico

El Poblado tiene el IRS de salud mas bajo del Valle de Aburra (0.27). 10 barrios con 100% de deficit de infraestructura de salud (103,913 habitantes proyectados a 2037 sin cobertura).

## Stack

| Capa | Tecnologia |
|------|-----------|
| Framework | Next.js 14.2 (App Router) |
| UI | React 18, Tailwind CSS 3.4, Radix UI, shadcn/ui |
| Animaciones | Framer Motion 12 |
| Graficas | Recharts 3.7 |
| Mapas | Mapbox GL JS 3.18 (isocronas, GeoJSON, POIs) |
| Procesamiento geoespacial | QGIS, PostGIS, Python/GeoPandas, Mapbox APIs |
| Deploy | Vercel |

## Desarrollo Local

```bash
git clone https://github.com/Cespial/hptu-localizacion.git
cd hptu-localizacion
npm install
npm run dev
```

## Fuentes de Datos

15 fuentes primarias (2.6M+ registros): Catastro Municipal, Censo DANE 2018, REPS MinSalud, MEData trafico, POT Medellin, Mapbox APIs, OpenStreetMap, DENSURBAM (URBAM/EAFIT/AMVA), EPM, GeoMedellin ArcGIS.
