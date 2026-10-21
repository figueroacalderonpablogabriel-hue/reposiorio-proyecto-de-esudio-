// ============================================================
// ui.js  →  Dibuja cosas en la pantalla (el DOM)
// ============================================================
// Aquí solo se "pinta". Cuando el usuario hace click en un botón,
// estas funciones llaman a las de app.js (handleAdd, handleChangeQty, handleRemove).

const productsGrid = document.getElementById('products');
const statusText = document.getElementById('status');
const categorySelect = document.getElementById('category');
const cartPanel = document.getElementById('cart');
const cartList = document.getElementById('cart-items');
const cartTotalText = document.getElementById('cart-total');
const cartCountText = document.getElementById('cart-count');
const cartToggleButton = document.getElementById('cart-toggle');
const cartCloseButton = document.getElementById('cart-close');
const cartClearButton = document.getElementById('cart-clear');
const cartCheckoutButton = document.getElementById('cart-checkout');
const overlay = document.getElementById('overlay');

function formatPrice(value) {
  return '$' + value.toFixed(2);
}

function crearElemento(tag, className, text) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (text !== undefined) {
    element.textContent = text;
  }
  return element;
}

function setStatus(text) {
  statusText.textContent = text;
}

function renderCategoryOptions(categories) {
  for (let i = 0; i < categories.length; i++) {
    const option = document.createElement('option');
    option.value = categories[i];
    option.textContent = categories[i];
    categorySelect.appendChild(option);
  }
}

function createProductCard(product) {
  const card = crearElemento('article', 'card');

  const image = crearElemento('img', 'card__img');
  image.src = product.image;
  image.alt = product.title;

  const category = crearElemento('p', 'card__category', product.category);
  const title = crearElemento('h3', 'card__title', product.title);
  const rating = crearElemento('p', 'card__rating', '★ ' + product.rating.rate + ' (' + product.rating.count + ')');
  const price = crearElemento('p', 'card__price', formatPrice(product.price));

  const button = crearElemento('button', 'btn', 'Agregar');
  button.type = 'button';
  button.addEventListener('click', function () {
    handleAdd(product);
  });

  card.appendChild(image);
  card.appendChild(category);
  card.appendChild(title);
  card.appendChild(rating);
  card.appendChild(price);
  card.appendChild(button);
  return card;
}

function renderProducts(list) {
  productsGrid.innerHTML = '';
  for (let i = 0; i < list.length; i++) {
    productsGrid.appendChild(createProductCard(list[i]));
  }
}

function renderMessage(text, buttonLabel, onClick) {
  const box = crearElemento('div', 'message');
  box.appendChild(crearElemento('p', '', text));

  const button = crearElemento('button', 'btn', buttonLabel);
  button.type = 'button';
  button.addEventListener('click', onClick);
  box.appendChild(button);

  productsGrid.innerHTML = '';
  productsGrid.appendChild(box);
}

function renderSkeletons() {
  productsGrid.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    productsGrid.appendChild(crearElemento('div', 'skeleton'));
  }
}

function createCartItem(item) {
  const li = crearElemento('li', 'cart-item');

  const image = document.createElement('img');
  image.src = item.image;
  image.alt = item.title;

  const info = document.createElement('div');
  info.appendChild(crearElemento('p', 'cart-item__title', item.title));
  info.appendChild(crearElemento('p', 'cart-item__price', formatPrice(item.price) + ' c/u'));

  const quantity = crearElemento('div', 'qty');

  const minusButton = crearElemento('button', '', '-1');
  minusButton.type = 'button';
  minusButton.setAttribute('aria-label', 'Quitar una unidad');
  minusButton.addEventListener('click', function () {
    handleChangeQty(item.id, -1);
  });

  const plusButton = crearElemento('button', '', '+1');
  plusButton.type = 'button';
  plusButton.setAttribute('aria-label', 'Agregar una unidad');
  plusButton.addEventListener('click', function () {
    handleChangeQty(item.id, 1);
  });

  quantity.appendChild(minusButton);
  quantity.appendChild(crearElemento('span', '', String(item.qty)));
  quantity.appendChild(plusButton);
  info.appendChild(quantity);

  const side = crearElemento('div', 'cart-item__side');
  side.appendChild(crearElemento('span', 'cart-item__sub', formatPrice(item.price * item.qty)));

  const removeButton = crearElemento('button', 'link-btn', 'Borrar');
  removeButton.type = 'button';
  removeButton.addEventListener('click', function () {
    handleRemove(item.id);
  });
  side.appendChild(removeButton);

  li.appendChild(image);
  li.appendChild(info);
  li.appendChild(side);
  return li;
}

function renderCart() {
  const items = getCartItems();
  cartList.innerHTML = '';

  if (items.length === 0) {
    cartList.appendChild(crearElemento('li', 'cart__empty', 'Tu carrito está vacío.'));
  } else {
    for (let i = 0; i < items.length; i++) {
      cartList.appendChild(createCartItem(items[i]));
    }
  }

  cartTotalText.textContent = formatPrice(getCartTotal());
  cartCountText.textContent = getCartCount();

  const isEmpty = (items.length === 0);
  cartClearButton.disabled = isEmpty;
  cartCheckoutButton.disabled = isEmpty;
}

function openCart() {
  cartPanel.classList.add('open');
  overlay.classList.add('open');
  cartToggleButton.setAttribute('aria-expanded', 'true');
  cartCloseButton.focus();
}

function closeCart() {
  cartPanel.classList.remove('open');
  overlay.classList.remove('open');
  cartToggleButton.setAttribute('aria-expanded', 'false');
  cartToggleButton.focus();
}