
import { obtenerPaises } from './api/countriesApi.js';

import {
  mostrarCargando,
  mostrarError,
  renderPaises,
  actualizarContador,
  
  mostrarDetalle,
  cerrarDetalle,
  mostrarFavoritosVacios,
} from './ui/ui.js';


import { procesarPaises } from './utils/filters.js';

import { crearMapa, destruirMapa } from './ui/mapUI.js';

import {
  obtenerFavoritos,
  agregarFavorito,
  eliminarFavorito,
  esFavorito,
} from './services/favoritesService.js';

let paises = [];

let vistaActual = 'explorar';

const destinationsContainer = document.querySelector('#destinations-container');
const resultsCount = document.querySelector('#results-count');

const searchInput = document.querySelector('#search-input');
const continentFilter = document.querySelector('#continent-filter');
const sortFilter = document.querySelector('#sort-filter');

const detailModal = document.querySelector('#detail-modal');
const detailModalContent = document.querySelector('#detail-modal-content');

const btnExplorar = document.querySelector('#btn-explorar');
const btnFavoritos = document.querySelector('#btn-favoritos');
const sectionTitle = document.querySelector('#section-title');
const searchForm = document.querySelector('#search-form');

function obtenerPaisCodigo(codigo) {
  return paises.find((pais) => pais.codes?.alpha_3 === codigo);
}

function actualizarNavegacion() {
  const clasesActivas = ['bg-blue-600', 'text-white'];
  const clasesInactivas = [
    'bg-white',
    'text-slate-700',
    'border',
    'border-slate-300',
  ];

  if (vistaActual === 'explorar') {
    btnExplorar.className = `
        px-4
        py-2
        bg-blue-600
        text-white
        rounded-lg
        font-medium
        cursor-pointer
        hover:bg-blue-700
        transition
    `;

    btnFavoritos.className = `
        px-4
        py-2
        bg-white
        text-slate-700
        border
        border-slate-300
        rounded-lg
        font-medium
        cursor-pointer
        hover:bg-slate-100
        transition
    
    `;
  } else {
    btnExplorar.className = `
        px-4
        py-2
        bg-white
        text-slate-700
        border
        border-slate-300
        rounded-lg
        font-medium
        cursor-pointer
        hover:bg-slate-100
        transition
    
    `;

    btnFavoritos.className = `
        px-4
        py-2
        bg-blue-600
        text-white
        rounded-lg
        font-medium
        cursor-pointer
        hover:bg-blue-700
        transition
    
    `;
  }
}


function aplicarFiltros() {
  
  if (vistaActual !== 'explorar') {
    return;
  }


  const texto = searchInput.value;
  const continente = continentFilter.value;
  const criterioOrden = sortFilter.value;

  const resultados = procesarPaises(paises, texto, continente, criterioOrden);

  
  renderPaises(resultados, destinationsContainer);

  actualizarContador(resultados.length, resultsCount);
}

function mostrarExplorar() {
  vistaActual = 'explorar';

  sectionTitle.textContent = 'Destinos';

  searchForm.classList.remove('hidden');

  actualizarNavegacion();

  aplicarFiltros();
}


function mostrarFavoritos() {
  vistaActual = 'favoritos';

  sectionTitle.textContent = 'Mis favoritos';

  searchForm.classList.add('hidden');

  actualizarNavegacion();

  const favoritos = obtenerFavoritos();

  if (favoritos.length === 0) {
    mostrarFavoritosVacios(destinationsContainer);

    actualizarContador(0, resultsCount);

    return;
  }

  renderPaises(favoritos, destinationsContainer, 'favoritos');
}
function manejarAgregarFavoritos(codigo) {
  
  const pais = obtenerPaisCodigo(codigo);


  if (!pais) {
    return;
  }

  if (esFavorito(codigo)) {

    Swal.fire({
      icon: 'info',
      title: 'Ya está en favoritos',
      text: 'Este destino ya había sido guardado.',
    });

    return;
  }

  const agregado = agregarFavorito(pais);

  if (agregado) {
    Swal.fire({
      icon: 'success',
      title: 'Destino guardado',
      text: `${pais.names?.common ?? 'El destino fur agregado a favoritos'}`,
      timer: 1800,
      showConfirmButton: false,
    });
  }
}

async function manejarEliminarFavorito(codigo) {
  //Buscamos elpais
  const pais = obtenerPaisCodigo(codigo);

  if (!pais) {
    return;
  }

  const resultado = await Swal.fire({
    icon: 'warning',
    title: 'Eliminar favorito',
    text: `¿Deseas eliminar ${pais.names?.common ?? 'este destino'} de tus favoritos`,
    showCancelButton: true,
    confirmButtonText: 'Eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#dc2626',
  });

  if (!resultado.isConfirmed) {
    return;
  }

  eliminarFavorito(codigo);

  mostrarFavoritos();

  Swal.fire({
    icon: 'success',
    title: 'Favorito eliminado',
    timer: 1500,
    showConfirmButton: false,
  });
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
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
  });

  searchInput.addEventListener('input', aplicarFiltros);

  continentFilter.addEventListener('change', aplicarFiltros);

  sortFilter.addEventListener('change', aplicarFiltros);

  btnExplorar.addEventListener('click', mostrarExplorar);

  btnFavoritos.addEventListener('click', mostrarFavoritos);

  destinationsContainer.addEventListener('click', (event) => {
    const boton = event.target.closest('[data-action]');

    if (!boton) {
      return;
    }

    const accion = boton.dataset.action;
    const codigo = boton.dataset.countryCode;

    if (accion === 'detail') {
      abrirDetalle(codigo);
      return;
    }
    if (accion === 'favorite') {
      manejarAgregarFavoritos(codigo);
      return;
    }

    if (accion === 'remove-favorite') {
      manejarEliminarFavorito(codigo);
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

  actualizarNavegacion();

  registrarEventos();
}

init();
