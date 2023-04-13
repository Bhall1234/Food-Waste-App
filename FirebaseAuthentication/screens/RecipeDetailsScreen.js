import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet } from 'react-native';

const RecipeDetailsScreen = ({ route }) => {
  const { recipe } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.recipeTitle}>{recipe.title}</Text>
      <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
      <Text style={styles.recipeInfo}>Servings: {recipe.servings}</Text>
      <Text style={styles.recipeInfo}>Ready in: {recipe.readyInMinutes} minutes</Text>
      <Text style={styles.recipeInstructions}>{recipe.instructions}</Text>
    </ScrollView>
  );
};

export default RecipeDetailsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  recipeTitle: {
    fontSize: 24,
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
    fontSize: 16,
    marginBottom: 4,
  },
  recipeInstructions: {
    fontSize: 14,
    lineHeight: 22,
  },
});
