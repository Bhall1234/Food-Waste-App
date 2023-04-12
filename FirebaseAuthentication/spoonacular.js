// spoonacular.js
const API_KEY = 'your_api_key_here'; // Replace with your actual API key from Spoonacular
const BASE_URL = 'https://api.spoonacular.com';

export async function searchRecipes(query) {
  const url = `${BASE_URL}/recipes/complexSearch?apiKey=${API_KEY}&query=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results;
}