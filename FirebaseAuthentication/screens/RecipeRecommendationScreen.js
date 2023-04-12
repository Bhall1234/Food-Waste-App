import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet  } from 'react-native';
import { searchRecipesByIngredients } from '../spoonacular';
import { firestore } from '../firebase';
import { collection, where, getDocs, query } from 'firebase/firestore';
import { auth } from '../firebase';

const RecipeRecommendationScreen = () => {
  const [recipes, setRecipes] = useState([]);

  const fetchRecipes = async () => {
    // Fetch the ingredients from the user's virtual pantry
    const userId = auth.currentUser ? auth.currentUser.uid : null;
    const foodItemsRef = collection(firestore, 'foodItems');
    const userPantryQuery = query(foodItemsRef, where('userId', '==', userId));
    const userPantrySnapshot = await getDocs(userPantryQuery);
  
    if (!userPantrySnapshot.empty) {
      // Build a list of ingredients from the user's pantry documents
      const ingredientsList = userPantrySnapshot.docs.map(doc => doc.data().title.toString()).join(',');
  
      // Then, call searchRecipesByIngredients() with the ingredients list
      const results = await searchRecipesByIngredients(ingredientsList);
      setRecipes(results);
    } else {
      console.log('User pantry not found');
    }
  };

  // Fetch recipes when the component is mounted
  useEffect(() => {
    fetchRecipes();
  }, []);
  
  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        renderItem={({ item }) => (
          <View style={styles.recipeCard}>
            <Text style={styles.recipeTitle}>{item.title}</Text>
            <Image
              source={{ uri: item.image }}
              style={styles.recipeImage}
            />
            <Text style={styles.recipeInfo}>Servings: {item.servings}</Text>
            <Text style={styles.recipeInfo}>Ready in: {item.readyInMinutes} minutes</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default RecipeRecommendationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  recipeCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  recipeImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 8,
  },
  recipeInfo: {
    fontSize: 14,
  },
});