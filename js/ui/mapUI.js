
let mapaActual = null;

export function destruirMapa() {
 
  if (mapaActual) {
    mapaActual.remove();
    mapaActual = null;
  }
}

export function crearMapa(latitud, longitud, nombre) {
 
  if (typeof latitud !== 'number' || typeof longitud !== 'number') {
    console.warn('Coordenadas no disponibles');
    return;
  }

  destruirMapa();

  mapaActual = L.map('destination-map').setView([latitud, longitud], 4);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(mapaActual);

  L.marker([latitud, longitud])
    .addTo(mapaActual)
    .bindPopup(/*html*/ `<strong>${nombre}</strong>`)
    .openPopup();
}
