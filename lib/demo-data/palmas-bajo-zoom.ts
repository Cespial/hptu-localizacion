// Ultra-zoom data for Palmas Bajo zone
// Source: Google Places API + Google Directions API (March 2026)

export const palmasBajoZoom = {
  zone: "Palmas Bajo",
  center: { lat: 6.2111, lng: -75.5622 },
  polygon: [
    { name: "Transversal intermedia", lat: 6.215323, lng: -75.562567 },
    { name: "Calle 10", lat: 6.209103, lng: -75.564763 },
    { name: "Transversal inferior", lat: 6.208965, lng: -75.559180 },
  ],

  poisComparison: {
    palmasBajo: {
      totalPOIs: 281,
      gastronomia: 75,
      financiero: 13,
      farmacias: 11,
      retail: 31,
      bienestar: 55,
      parqueaderos: 8,
      healthFacilities: 44,
      walkabilityScore: 142,
    },
    millaDeOro: {
      totalPOIs: 396,
      gastronomia: 80,
      financiero: 40,
      farmacias: 23,
      retail: 57,
      bienestar: 54,
      parqueaderos: 20,
      healthFacilities: 69,
      walkabilityScore: 199,
    },
  },

  walkingDistances: [
    { destination: "Parque El Poblado", minutes: 13, km: 1.0 },
    { destination: "Torre Oviedo", minutes: 14, km: 1.0 },
    { destination: "Club El Rodeo", minutes: 18, km: 1.0 },
    { destination: "CC Oviedo", minutes: 19, km: 1.3 },
    { destination: "Milla de Oro", minutes: 19, km: 1.5 },
    { destination: "CC El Tesoro", minutes: 33, km: 2.0 },
  ],

  drivingTimes: [
    { destination: "Parque El Poblado", minutes: 5, km: 1.7 },
    { destination: "CC El Tesoro", minutes: 6, km: 2.3 },
    { destination: "CC Oviedo", minutes: 6, km: 2.7 },
    { destination: "Milla de Oro", minutes: 9, km: 2.3 },
    { destination: "Laureles", minutes: 18, km: 8.4 },
    { destination: "Envigado Centro", minutes: 23, km: 9.0 },
    { destination: "HPTU Robledo", minutes: 24, km: 11.4 },
    { destination: "Itagui Centro", minutes: 26, km: 9.4 },
    { destination: "Aeropuerto JMC", minutes: 46, km: 27.0 },
    { destination: "Rionegro", minutes: 58, km: 30.8 },
  ],

  streetDensity: "20 POIs por cada 150m de Calle 10 — zona extremadamente caminable",

  keyFindings: [
    "281 POIs en 500m — zona con servicios consolidados",
    "Milla de Oro 1.4x mas densa (396 POIs) — sobre todo en bancos y farmacias",
    "Palmas Bajo lidera en bienestar (55 gyms/spas vs 54 en MdO)",
    "Caminable a Parque El Poblado (13 min), Torre Oviedo (14 min), CC Oviedo (19 min)",
    "6 min en carro a CC El Tesoro y CC Oviedo",
    "44 facilities de salud en 500m — competencia ambulatoria ALTA",
  ],
};
