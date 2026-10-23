

const API_URL =
  'https://juancognitus.github.io/explorador-viajes-api/paises.json';

export async function obtenerPaises() {
  try {
    
    const respose = await fetch(API_URL);

    
    if (!respose.ok) {
      throw new Error(`Error HTTP: ${respose.status}`);
    }

    const result = await respose.json();

    const paises = result;

    return paises;
  } catch (error) {
    
    console.log('Error al obtener los paises: ', error);
    return [];
  }
}
