// spoonacular.js
import axios from 'axios';
import { REACT_APP_SPOONOCULAR_KEY } from '@env';


const API_KEY = REACT_APP_SPOONOCULAR_KEY;

export const searchRecipesByIngredients = async (ingredients) => {
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${API_KEY}&ingredients=${ingredients}&number=10&ranking=1&ignorePantry=true&instructionsRequired=true`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch data from Spoonacular API');
    }

    const data = await response.json();

    // Map the fetched data to an array containing the required fields
    return data.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchRecipeDetails = async (recipeId) => {
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch recipe details from Spoonacular API');
    }

    const data = await response.json();

    return {
      id: data.id,
      title: data.title,
      image: data.image,
      servings: data.servings,
      readyInMinutes: data.readyInMinutes,
      instructions: data.instructions,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};