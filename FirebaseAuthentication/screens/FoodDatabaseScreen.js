import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../firebase';

const FoodDatabaseScreen = () => {
  const [foodItems, setFoodItems] = useState([]);

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
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Food Database</Text>
      <FlatList
        data={foodItems}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.category}>Category: {item.category}</Text>
            <Text style={styles.date}>Date: {item.date.toDate().toDateString()}</Text>
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
  }
});
