// ============================================================
// storage.js  →  Guarda y lee el carrito en localStorage
// ============================================================
// localStorage es una "cajita" del navegador donde se guardan datos
// aunque cierres o recargues la página. Solo guarda TEXTO, por eso
// usamos JSON.stringify (objeto → texto) y JSON.parse (texto → objeto).

// Nombre con el que guardamos el carrito dentro de localStorage
const CART_KEY = 'fakestore_cart';

// Lee el carrito guardado. Si no hay nada, devuelve un carrito vacío {}
function loadCartFromStorage() {
  try {
    const text = localStorage.getItem(CART_KEY); // texto guardado (o null si no existe)
    if (text === null) {
      return {};                                  // todavía no hay carrito guardado
    }
    return JSON.parse(text);                      // texto → objeto
  } catch (error) {
    // Si el texto está dañado, empezamos con un carrito vacío
    console.log('No se pudo leer el carrito guardado', error);
    return {};
  }
}

// Guarda el carrito en localStorage
function saveCartToStorage(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart)); // objeto → texto
}
