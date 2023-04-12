import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { searchRecipes } from './spoonacular';

const RecipeSearchScreen = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);

  const handleSearch = async () => {
    const results = await searchRecipes(query);
    setRecipes(results);
  };

  return (
    <View>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search for a recipe"
        // Add any additional TextInput styles you want
      />
      <TouchableOpacity onPress={handleSearch}>
        <Text>Search</Text>
      </TouchableOpacity>
      <FlatList
        data={recipes}
        renderItem={({ item }) => (
          <View>
            <Text>{item.title}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default RecipeSearchScreen;