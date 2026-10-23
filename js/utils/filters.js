
export function buscarPaises(paises, texto) {
  
  const textoNormalizado = texto.trim().toLowerCase();

  if (!textoNormalizado) {
    return paises;
  }

  return paises.filter((pais) => {
    const nombre = pais.names?.common?.toLowerCase() ?? '';
    return nombre.includes(textoNormalizado);
  });
}


export function filtrarPorContinente(paises, continente) {
  // RETORNAR LOSPAISES CON FILTER
  if (continente === 'all') {
    return paises;
  }
  return paises.filter((pais) => pais.region === continente);
}

export function ordenarPaises(paises, criterio) {
  const paisesOrdenados = [...paises];

  if (criterio === 'az') {
    return paisesOrdenados.sort((a, b) => {
      const nombreA = a.names?.common ?? '';
      const nombreB = b.names?.common ?? '';

      return nombreA.localeCompare(nombreB);
    });
  }

  if (criterio === 'za') {
    return paisesOrdenados.sort((a, b) => {
      const nombreA = a.names?.common ?? '';
      const nombreB = b.names?.common ?? '';

      return nombreB.localeCompare(nombreA);
    });
  }

  return paisesOrdenados;
}

export function procesarPaises(paises, texto, continente, criterioOrden) {
  let resultado = buscarPaises(paises, texto);

  resultado = filtrarPorContinente(resultado, continente);

  resultado = ordenarPaises(resultado, criterioOrden);

  return resultado;
}
