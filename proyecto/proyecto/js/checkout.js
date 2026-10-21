// checkout.js - Página de "Finalizar compra".
// Usa initCart() y getCartItems() de cart.js (el carrito está guardado en localStorage).

// Datos falsos para el botón "Autorrellenar"
const datosPrueba = {
  name: 'Laura Gómez',
  email: 'laura.gomez@correo.com',
  phone: '300 123 4567',
  docType: 'CC',
  docNumber: '1023456789',
  country: 'Colombia',
  state: 'Cundinamarca',
  city: 'Bogotá',
  zip: '110111',
  address: 'Calle 10 # 5-20',
  extra: 'Torre 2, apto 301'
};

// Ids de los campos que se validan (los demás son opcionales)
const camposObligatorios = ['name', 'email', 'phone', 'docType', 'docNumber', 'state', 'city', 'address'];

function formatMoney(value) {
  return '$' + value.toFixed(2);
}

// Devuelve el mensaje de error de un campo, o '' si está bien
function getError(id, value) {
  value = value.trim();

  if (id === 'name' && value.length < 3) {
    return 'Escribe tu nombre completo.';
  }
  if (id === 'email' && !/^\S+@\S+\.\S+$/.test(value)) {
    return 'Escribe un correo válido.';
  }
  if (id === 'phone') {
    const numeros = value.replace(/\D/g, ''); // deja solo los dígitos
    if (numeros.length < 5 || numeros.length > 10) {
      return 'Escribe un teléfono válido (9 a 10 dígitos).';
    }
  }
  if (id === 'docType' && value === '') {
    return 'Selecciona un tipo de documento.';
  }
  if (id === 'docNumber' && !/^[A-Za-z0-9]{5,15}$/.test(value)) {
    return 'Entre 5 y 15 letras o números, sin espacios.';
  }
  if ((id === 'state' || id === 'city') && value.length < 2) {
    return 'Este campo es obligatorio.';
  }
  if (id === 'address' && value.length < 5) {
    return 'Escribe tu dirección.';
  }
  return '';
}

// Valida un campo y muestra u oculta su mensaje de error
function validateField(id) {
  const input = document.getElementById(id);
  const error = document.getElementById(id + '-error');
  const mensaje = getError(id, input.value);

  if (mensaje !== '') {
    input.classList.add('invalid');
    error.textContent = mensaje;
    return false;
  }
  input.classList.remove('invalid');
  error.textContent = '';
  return true;
}

// Valida todos los campos. Devuelve true si todo está bien
function validateForm() {
  let todoBien = true;
  let primerError = null;

  for (let i = 0; i < camposObligatorios.length; i++) {
    const id = camposObligatorios[i];
    if (!validateField(id)) {
      todoBien = false;
      if (primerError === null) primerError = id;
    }
  }

  if (primerError !== null) {
    document.getElementById(primerError).focus();
  }
  return todoBien;
}

// Dibuja los productos del carrito en el resumen del pedido
function renderSummary() {
  const lista = document.getElementById('summary-items');
  const items = getCartItems();
  lista.innerHTML = '';

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    const li = document.createElement('li');

    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.title;

    const info = document.createElement('div');
    const titulo = document.createElement('p');
    titulo.className = 'item-title';
    titulo.textContent = item.title;
    const detalle = document.createElement('p');
    detalle.className = 'item-sub';
    detalle.textContent = item.qty + ' × ' + formatMoney(item.price);
    info.appendChild(titulo);
    info.appendChild(detalle);

    const precio = document.createElement('span');
    precio.className = 'item-price';
    precio.textContent = formatMoney(item.price * item.qty);

    li.appendChild(img);
    li.appendChild(info);
    li.appendChild(precio);
    lista.appendChild(li);
  }

  const total = formatMoney(getCartTotal());
  document.getElementById('subtotal').textContent = total;
  document.getElementById('total').textContent = total;
  document.getElementById('pay').textContent = 'Pagar ' + total;
}

// Llena el formulario con los datos falsos
function fillDemoData() {
  for (const id in datosPrueba) {
    document.getElementById(id).value = datosPrueba[id];
  }
  validateForm();
}

// Termina la compra (simulada): guarda el pedido, vacía el carrito y muestra el mensaje final
function completeOrder() {
  const total = formatMoney(getCartTotal());
  const nombre = document.getElementById('name').value.trim();
  const correo = document.getElementById('email').value.trim();
  const numeroPedido = '#FS-' + Date.now().toString().slice(-6);

  // Guardamos el último pedido por si se quiere mostrar después
  const pedido = { numero: numeroPedido, cliente: nombre, correo: correo, productos: getCartItems(), total: getCartTotal() };
  localStorage.setItem('fakestore_ultimo_pedido', JSON.stringify(pedido));

  clearCart();

  document.getElementById('layout').hidden = true;
  document.getElementById('success-text').textContent = 'Gracias, ' + nombre + '. Enviaremos la confirmación a ' + correo + '.';
  document.getElementById('order-number').textContent = numeroPedido;
  document.getElementById('order-total').textContent = total;
  document.getElementById('success').hidden = false;
  window.scrollTo(0, 0);
}

function initCheckout() {
  initCart();

  // Si el carrito está vacío no hay nada que pagar
  if (getCartItems().length === 0) {
    document.getElementById('layout').hidden = true;
    document.getElementById('empty').hidden = false;
    return;
  }

  renderSummary();

  // Validar cada campo al salir de él y limpiar el error mientras se corrige
  camposObligatorios.forEach(function (id) {
    const input = document.getElementById(id);
    input.addEventListener('blur', function () { validateField(id); });
    input.addEventListener('input', function () {
      if (input.classList.contains('invalid')) validateField(id);
    });
  });

  document.getElementById('autofill').addEventListener('click', fillDemoData);

  document.getElementById('checkout-form').addEventListener('submit', function (e) {
    e.preventDefault(); // evita que la página se recargue
    if (validateForm()) {
      completeOrder();
    }
  });
}

initCheckout();
