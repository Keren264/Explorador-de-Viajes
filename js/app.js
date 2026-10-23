
import { obtenerPaises } from './api/countriesApi.js';

import {
  mostrarCargando,
  mostrarError,
  renderPaises,
  actualizarContador,
} from './ui/ui.js';

import { procesarPaises } from './utils/filters.js';

let paises = [];

const destinationsContainer = document.querySelector('#destinations-container');
const resultsCount = document.querySelector('#results-count');

const searchInput = document.querySelector('#search-input');
const continentFilter = document.querySelector('#continent-filter');
const sortFilter = document.querySelector('#sort-filter');


function aplicarFiltros() {
  
  const texto = searchInput.value;
  const continente = continentFilter.value;
  const criterioOrden = sortFilter.value;

  const resultados = procesarPaises(paises, texto, continente, criterioOrden);


  actualizarContador(resultados.length, resultsCount);
}
function registrarEventos() {

  searchInput.addEventListener('input', aplicarFiltros);

  continentFilter.addEventListener('change', aplicarFiltros);
  sortFilter.addEventListener('change', aplicarFiltros);
}

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

  aplicarFiltros();

  registrarEventos();
}

init();
