
import { obtenerPaises } from './api/countriesApi.js';

// Imoportacion
import {
  mostrarCargando,
  mostrarError,
  renderPaises,
  actualizarContador,
} from './ui/ui.js';


let paises = [];
const destinationsContainer = document.querySelector('#destinations-container');
const resultsCount = document.querySelector('#results-count');


async function init() {
  console.log('Explorador de Viajes iniciado...');
  resultsCount.textContent = '0 destinos';

  mostrarCargando(destinationsContainer);

  paises = await obtenerPaises();
  console.log('Paises obtenidos: ', paises);

  if (paises.length === 0) {
    mostrarError(destinationsContainer);

    actualizarContador(0, resultsCount);

    return;
  }

  renderPaises(paises, destinationsContainer);

  actualizarContador(paises.length, resultsCount);
}

init();
