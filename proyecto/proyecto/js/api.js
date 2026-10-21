// Acceso a la API pública.
const API_URL = 'https://fakestoreapi.com/products';

async function fetchProducts() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Error HTTP ' + response.status);
  return response.json();
}
