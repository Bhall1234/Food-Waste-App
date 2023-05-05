import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { searchRecipesByIngredients, fetchRecipeDetails } from '../spoonacular';
import { getDocs, query, collection, where } from 'firebase/firestore';
import { firestore, auth } from '../firebase';
import RenderHTML from 'react-native-render-html';

const RecipeRecommendationScreen = () => {
  // Declare state variables
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    const startTime = performance.now();

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
    console.log("Recipes fetched");

    const endTime = performance.now(); 
    console.log(`fetchRecipes took ${endTime - startTime} milliseconds`); // Log the time it took to execute the function
  };

  const handleRecipePress = async (recipeId) => {
    const startTime = performance.now();

    setLoading(true);
    const recipeDetails = await fetchRecipeDetails(recipeId);
    setSelectedRecipe(recipeDetails);
    setLoading(false);

    const endTime = performance.now(); 
    console.log(`handleRecipePress took ${endTime - startTime} milliseconds`); 
  };

  const renderRecipe = ({ item }) => (
    <TouchableOpacity onPress={() => handleRecipePress(item.id)}>
      <View style={styles.recipeCard}>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <Image source={{ uri: item.image }} style={styles.recipeImage} />
      </View>
    </TouchableOpacity>
  );

  // Get the device width to set the contentWidth for RenderHtml
const contentWidth = Dimensions.get('window').width - 20; // Subtracting 20 for the padding in the container style

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={fetchRecipes} style={styles.refreshButton}>
        <Text style={styles.refreshButtonText}>Refresh Recipes</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : selectedRecipe ? (
        <ScrollView contentContainerStyle={styles.recipeCard}>
          <TouchableOpacity onPress={() => setSelectedRecipe(null)}>
            <Text style={styles.backButton}>Go back to recipes</Text>
          </TouchableOpacity>
          <Text style={styles.recipeTitle}>{selectedRecipe.title}</Text>
          <Image source={{ uri: selectedRecipe.image }} style={styles.recipeImage} />
          <Text style={styles.recipeInfo}>Servings: {selectedRecipe.servings}</Text>
          <Text style={styles.recipeInfo}>Ready in: {selectedRecipe.readyInMinutes} minutes</Text>
          <RenderHTML contentWidth={contentWidth} source={{ html: selectedRecipe.instructions }} />
        </ScrollView>
      ) : (
        <FlatList
          data={recipes}
          renderItem={renderRecipe}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
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
    marginBottom: 4,
  },
  recipeInstructions: {
    fontSize: 14,
    textAlign: 'justify',
    marginBottom: 16,
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});