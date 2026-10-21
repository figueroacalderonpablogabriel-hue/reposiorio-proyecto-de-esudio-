// ============================================================
// cart.js  →  La lógica del carrito (sin tocar la pantalla)
// ============================================================
// El carrito es un OBJETO donde cada producto se guarda usando su id como llave:
//
//   cart = {
//     "1": { id: 1, title: "Mochila", price: 109.95, image: "...", qty: 2 },
//     "5": { id: 5, title: "Anillo",  price: 695,    image: "...", qty: 1 }
//   }
//
// Ventaja: para encontrar un producto solo escribimos cart[id], sin recorrer nada.

let cart = {};

// Se llama una vez al abrir la página: recupera el carrito guardado
function initCart() {
  cart = loadCartFromStorage();
}

// Agrega un producto. Si ya estaba en el carrito, le suma 1 a la cantidad
function addToCart(product) {
  if (cart[product.id]) {
    // Ya existe: aumentamos la cantidad
    cart[product.id].qty = cart[product.id].qty + 1;
  } else {
    // No existe: lo creamos con cantidad 1
    cart[product.id] = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      qty: 1
    };
  }
  saveCartToStorage(cart); // guardamos cada vez que algo cambia
}

// Cambia la cantidad de un producto. "change" será +1 o -1
function changeQty(id, change) {
  if (!cart[id]) {
    return; // si el producto no está en el carrito, no hacemos nada
  }
  cart[id].qty = cart[id].qty + change;

  // Si la cantidad llega a 0, quitamos el producto del carrito
  if (cart[id].qty <= 0) {
    delete cart[id];
  }
  saveCartToStorage(cart);
}

// Quita un producto completo del carrito (botón BORRAR)
function removeFromCart(id) {
  delete cart[id];
  saveCartToStorage(cart);
}

// Vacía todo el carrito
function clearCart() {
  cart = {};
  saveCartToStorage(cart);
}

// Convierte el objeto del carrito en una lista (arreglo) para poder recorrerla
function getCartItems() {
  const items = [];
  for (const id in cart) {   // "for...in" recorre las llaves de un objeto
    items.push(cart[id]);
  }
  return items;
}

// Cuenta cuántas unidades hay en total (es el número rojo del header)
function getCartCount() {
  const items = getCartItems();
  let count = 0;
  for (let i = 0; i < items.length; i++) {
    count = count + items[i].qty;
  }
  return count;
}

// Calcula el total a pagar: precio × cantidad de cada producto
function getCartTotal() {
  const items = getCartItems();
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total = total + items[i].price * items[i].qty;
  }
  return total;
}
