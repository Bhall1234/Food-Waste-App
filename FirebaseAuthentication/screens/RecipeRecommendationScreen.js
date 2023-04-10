import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { db } from '../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';

const SPOONACULAR_API_KEY = 'your_api_key_here';

const RecipeRecommendationScreen = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'foodItems'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setFoodItems(items);
    });

    // Clean up the listener when the component is unmounted
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    getRecommendedRecipes();
  }, [foodItems]);

  const getRecommendedRecipes = async () => {
    const ingredients = foodItems.map((item) => item.title).join(',');

    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=10&apiKey=${SPOONACULAR_API_KEY}`,
      );

      if (response.ok) {
        const data = await response.json();
        setRecommendedRecipes(data);
      } else {
        console.error('Failed to fetch recipes: ', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recommended Recipes</Text>
      <FlatList
        data={recommendedRecipes}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.title}>{item.title}</Text>
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
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#61DAFB',
    borderRadius: 5,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
