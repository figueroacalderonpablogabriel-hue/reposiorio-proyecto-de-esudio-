// ============================================================
// filters.js  →  Búsqueda, filtro por categoría y orden
// ============================================================
// Estas funciones NO cambian la lista original: siempre devuelven una nueva.

// Pasa el texto a minúsculas y le quita las tildes, para que
// "ANILLO" y "anillo" (o "café" y "cafe") se consideren iguales.
// (Si prefieres algo más simple, puedes dejar solo text.toLowerCase())
function cleanText(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Saca la lista de categorías sin repetirlas (para llenar el select)
function getCategories(products) {
  const categories = [];
  for (let i = 0; i < products.length; i++) {
    const category = products[i].category;
    if (!categories.includes(category)) { // solo agregamos si todavía no está
      categories.push(category);
    }
  }
  return categories;
}

// Ordena una lista según la opción elegida en el select "Ordenar por"
function sortProducts(list, sortType) {
  // slice() hace una copia, así no desordenamos la lista original
  const sorted = list.slice();

  // sort() recibe una función que compara dos productos (a y b):
  //   si da número negativo → a va primero, si da positivo → b va primero
  if (sortType === 'price-asc') {
    sorted.sort(function (a, b) { return a.price - b.price; });
  } else if (sortType === 'price-desc') {
    sorted.sort(function (a, b) { return b.price - a.price; });
  } else if (sortType === 'name-asc') {
    sorted.sort(function (a, b) { return a.title.localeCompare(b.title); });
  } else if (sortType === 'name-desc') {
    sorted.sort(function (a, b) { return b.title.localeCompare(a.title); });
  } else if (sortType === 'rating-desc') {
    sorted.sort(function (a, b) { return b.rating.rate - a.rating.rate; });
  }
  // Si es "featured" (destacados) no ordenamos: queda el orden original de la API

  return sorted;
}

// Aplica búsqueda + categoría + orden y devuelve los productos que se deben mostrar
function getVisibleProducts(products, search, category, sortType) {
  const searchText = cleanText(search.trim());
  const result = [];

  for (let i = 0; i < products.length; i++) {
    const product = products[i];

    // ¿Cumple la categoría? ("all" significa todas)
    const matchCategory = (category === 'all' || product.category === category);

    // ¿El texto buscado aparece en el título o en la descripción?
    const productText = cleanText(product.title + ' ' + product.description);
    const matchSearch = productText.includes(searchText);

    // Si cumple las dos cosas, lo agregamos al resultado
    if (matchCategory && matchSearch) {
      result.push(product);
    }
  }

  return sortProducts(result, sortType);
}
