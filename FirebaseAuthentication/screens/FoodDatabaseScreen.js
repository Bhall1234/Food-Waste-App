import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { Picker } from "@react-native-picker/picker";

const FoodDatabaseScreen = () => {
  const [foodItems, setFoodItems] = useState([]);

  // Search and Category Filter
  const [search, setSearch] = useState('');
  const [filteredFoodItems, setFilteredFoodItems] = useState([]);
  const categories = ['all', 'fruits', 'vegetables', 'canned food', 'meat', 'sea food', 'drink'];

  useEffect(() => {
    const q = query(collection(firestore, 'foodItems'));
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

  const deleteFoodItem = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'foodItems', id));
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const filterFoodItems = (searchText) => {
    setSearch(searchText);
    if (searchText.length === 0) {
      setFilteredFoodItems(foodItems);
    } else {
      const filteredItems = foodItems.filter((item) =>
        item.title.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredFoodItems(filteredItems);
    }
  };

  const isExpired = (itemDate) => {
    const currentDate = new Date();
    return itemDate.toDate() < currentDate;
  };
  
  // Use Effect for search and filter, filters based on the search input
  useEffect(() => {
    setFilteredFoodItems(foodItems);
  }, [foodItems]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search food items..."
        onChangeText={(text) => filterFoodItems(text)}
        value={search}
      />
      <FlatList
        data={filteredFoodItems}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={[styles.title, isExpired(item.date) ? styles.expiredTitle : {}]}>
              {item.title}
            </Text>
            <Text style={styles.category}>Category: {item.category}</Text>
            <Text style={styles.date}>Expiration Date: {item.date.toDate().toDateString()}</Text>
            <TouchableOpacity onPress={() => deleteFoodItem(item.id)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default FoodDatabaseScreen;

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
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  category: {
    fontSize: 16,
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#ff4757',
    padding: 5,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  searchBar: {
    borderWidth: 1,
    borderColor: '#61DAFB',
    borderRadius: 5,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 16,
    marginBottom: 20,
  },
  picker: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#61DAFB",
    borderRadius: 5,
    height: 40,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  expiredTitle: {
    color: 'red', 
  },
});