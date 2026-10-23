
import { obtenerPaises } from './api/countriesApi.js';

import {
  mostrarCargando,
  mostrarError,
  renderPaises,
  actualizarContador,
  
  mostrarDetalle,
  cerrarDetalle,
} from './ui/ui.js';

import { procesarPaises } from './utils/filters.js';

import { crearMapa, destruirMapa } from './ui/mapUI.js';

let paises = [];

const destinationsContainer = document.querySelector('#destinations-container');
const resultsCount = document.querySelector('#results-count');

const searchInput = document.querySelector('#search-input');
const continentFilter = document.querySelector('#continent-filter');
const sortFilter = document.querySelector('#sort-filter');

const detailModal = document.querySelector('#detail-modal');
const detailModalContent = document.querySelector('#detail-modal-content');

function obtenerPaisCodigo(codigo) {
  return paises.find((pais) => pais.codes?.alpha_3 === codigo);
}

function aplicarFiltros() {
  
  const texto = searchInput.value;
  const continente = continentFilter.value;
  const criterioOrden = sortFilter.value;

  const resultados = procesarPaises(paises, texto, continente, criterioOrden);

  renderPaises(resultados, destinationsContainer);

  actualizarContador(resultados.length, resultsCount);
}

function abrirDetalle(codigo) {
  const pais = obtenerPaisCodigo(codigo);

  if (!pais) {
    console.warn('Pais no encontrado');
    return;
  }

  
  const datosMapa = mostrarDetalle(pais, detailModal, detailModalContent);

  setTimeout(() => {
    crearMapa(datosMapa.latitud, datosMapa.longitud, datosMapa.nombre);
  }, 0);
}

function registrarEventos() {

  searchInput.addEventListener('input', aplicarFiltros);

  continentFilter.addEventListener('change', aplicarFiltros);

  sortFilter.addEventListener('change', aplicarFiltros);

  destinationsContainer.addEventListener('click', (event) => {
  
    const boton = event.target.closest('[data-action]');

    if (!boton) {
      return;
    }

    const accion = boton.dataset.action;
    const codigo = boton.dataset.countryCode;

    if (accion === 'detail') {
      abrirDetalle(codigo);
    }
  });


  detailModal.addEventListener('click', (event) => {
    if (event.target.id === 'btn-close-detail') {
      cerrarModalDetalle();
    }

    if (event.target === detailModal) {
      cerrarModalDetalle();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !detailModal.classList.contains('hidden')) {
      cerrarModalDetalle();
    }
  });
}

function cerrarModalDetalle() {
  destruirMapa();

  cerrarDetalle(detailModal, detailModalContent);
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
