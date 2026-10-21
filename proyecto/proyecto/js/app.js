// ============================================================
// app.js  →  El "cerebro": junta todos los demás archivos
// ============================================================
// Orden en que se cargan los archivos (ver index.html):
//   api.js → storage.js → cart.js → filters.js → ui.js → carousel.js → app.js
// Por eso app.js puede usar las funciones de todos los anteriores.

// ---------- 1. Estado: lo que la página "recuerda" mientras está abierta ----------
const state = {
  products: [],       // todos los productos que llegaron de la API
  search: '',         // texto escrito en el buscador
  category: 'all',    // categoría elegida
  sort: 'featured'    // orden elegido
};

// ---------- 2. Mostrar productos ----------

// Calcula qué productos mostrar (según buscador, categoría y orden) y los dibuja
function showProducts() {
  const list = getVisibleProducts(state.products, state.search, state.category, state.sort);

  if (list.length === 0) {
    // No hay resultados: mostramos un mensaje con botón para limpiar filtros
    renderMessage('No encontramos productos con esos criterios.', 'Limpiar filtros', resetFilters);
  } else {
    renderProducts(list);
  }

  setStatus('Mostrando ' + list.length + ' de ' + state.products.length + ' productos');
}

// Pide los productos a la API (con manejo de errores)
async function loadProducts() {
  setStatus('Cargando productos…');
  renderSkeletons();

  try {
    state.products = await fetchProducts();
  } catch (error) {
    console.log('Error al pedir los productos:', error);
    setStatus('');
    renderMessage('No se pudieron cargar los productos. Revisa tu conexión.', 'Reintentar', loadProducts);
    return;
  }

  renderCategoryOptions(getCategories(state.products));
  showProducts();
  initCarousel(state.products);
}

// Vuelve buscador, categoría y orden a su valor inicial
function resetFilters() {
  state.search = '';
  state.category = 'all';
  state.sort = 'featured';

  document.getElementById('search').value = '';
  categorySelect.value = 'all';
  document.getElementById('sort').value = 'featured';

  showProducts();
}

// ---------- 3. Acciones del carrito ----------
function handleAdd(product) {
  addToCart(product);
  renderCart();
  setStatus('«' + product.title + '» agregado al carrito');
}

function handleChangeQty(id, change) {
  changeQty(id, change);
  renderCart();
}

function handleRemove(id) {
  removeFromCart(id);
  renderCart();
}

// ---------- 4. Eventos ----------
function setupEvents() {
  document.getElementById('search').addEventListener('input', function (event) {
    state.search = event.target.value;
    showProducts();
  });

  categorySelect.addEventListener('change', function (event) {
    state.category = event.target.value;
    showProducts();
  });

  document.getElementById('sort').addEventListener('change', function (event) {
    state.sort = event.target.value;
    showProducts();
  });

  cartToggleButton.addEventListener('click', openCart);
  cartCloseButton.addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeCart();
    }
  });

  cartClearButton.addEventListener('click', function () {
    clearCart();
    renderCart();
  });

  cartCheckoutButton.addEventListener('click', function () {
    window.location.href = 'checkout.html';
  });
}

function init() {
  initCart();
  renderCart();
  setupEvents();
  loadProducts();
}

init();