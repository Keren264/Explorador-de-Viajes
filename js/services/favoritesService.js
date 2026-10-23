
const FAVORITES_KEY = 'explorador_viajes_favoritos';

export function obtenerFavoritos() {
  const favoritosGuardados = localStorage.getItem(FAVORITES_KEY);

  if (!favoritosGuardados) {
    return [];
  }
  try {
    return JSON.parse(favoritosGuardados);
  } catch (error) {
    console.error('Error al leer favoritos: ', error);

    return [];
  }
}
function guardarFavoritos(favoritos) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritos));
}
export function esFavorito(codigo) {
  const favoritos = obtenerFavoritos();

  return favoritos.some((pais) => pais.codes?.alpha_3 === codigo);
}
export function agregarFavorito(pais) {
  
  const favoritos = obtenerFavoritos();

  const codigo = pais.codes?.alpha_3;

  if (!codigo) {
    return false;
  }
  const yaExiste = favoritos.some(
    (favorito) => favorito.codes?.alpha_3 === codigo,
  );
  if (yaExiste) {
    return false;
  }
  favoritos.push(pais);

  guardarFavoritos(favoritos);

  return true;
}

export function eliminarFavorito(codigo) {
  const favoritos = obtenerFavoritos();

  const favoritosActualizados = favoritos.filter(
    (pais) => pais.codes?.alpha_3 !== codigo,
  );

  guardarFavoritos(favoritosActualizados);

  return favoritosActualizados;
}
