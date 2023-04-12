import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { useNavigation } from '@react-navigation/native';

const FoodDatabaseScreen = () => {
  const navigation = useNavigation();

  const [foodItems, setFoodItems] = useState([]);

  // Search and Category Filter
  const [search, setSearch] = useState('');
  const [filteredFoodItems, setFilteredFoodItems] = useState([]);
  const [showCategories, setShowCategories] = useState(false);

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

  const getItemBackgroundColor = (expiryDate) => {
    return isExpired(expiryDate) ? 'red' : 'green';
  };

  const navigateToEditFoodItem = (item) => {
    navigation.navigate('EditFoodItem', { foodItem: item });
  };

  // For statistics
  const getTotalItems = () => {
    return foodItems.length;
  };

  const getItemsByCategory = () => {
    const categoriesCount = {};
    foodItems.forEach((item) => {
      if (!categoriesCount[item.category]) {
        categoriesCount[item.category] = 0;
      }
      categoriesCount[item.category]++;
    });
    return categoriesCount;
  };

  const getExpiredItems = () => {
    const currentDate = new Date();
    return foodItems.filter((item) => item.date.toDate() < currentDate).length;
  };

  const itemsByCategory = getItemsByCategory();

  const toggleCategories = () => {
    setShowCategories(!showCategories);
  };

  // Use Effect for search and filter, filters based on the search input
  useEffect(() => {
    setFilteredFoodItems(foodItems);
  }, [foodItems]);

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <Text style={styles.stat}>Total Items: {getTotalItems()}</Text>
        <Text style={styles.stat}>Expired Items: {getExpiredItems()}</Text>
      </View>
      <TouchableOpacity onPress={toggleCategories} style={styles.categoryButton}>
        <Text style={styles.categoryButtonText}>Toggle Categories</Text>
      </TouchableOpacity>
      {showCategories && (
        <View style={styles.categoriesContainer}>
          <Text style={styles.subHeader}>Items by Category:</Text>
          {Object.entries(itemsByCategory).map(([category, count]) => (
            <Text key={category} style={styles.categoryStat}>
              {category}: {count}
            </Text>
          ))}
        </View>
      )}
      <TextInput
        style={styles.searchBar}
        placeholder="Search virtual pantry..."
        onChangeText={(text) => filterFoodItems(text)}
        value={search}
      />
      <FlatList
         data={filteredFoodItems}
         renderItem={({ item }) => (
           <View
             style={[
               styles.itemContainer,
               { backgroundColor: getItemBackgroundColor(item.date) },
             ]}
           >
             <Image source={{ uri: item.image }} style={styles.image} />
             <Text style={styles.title}>{item.title}</Text>
             <Text style={styles.category}>Category: {item.category}</Text>
             <Text style={styles.date}>Expiration Date: {item.date.toDate().toDateString()}</Text>
             <TouchableOpacity onPress={() => deleteFoodItem(item.id)} style={styles.deleteButton}>
               <Text style={styles.deleteButtonText}>Delete</Text>
             </TouchableOpacity>
             <TouchableOpacity onPress={() => navigateToEditFoodItem(item)} style={styles.editButton}>
                <Text style={styles.editButtonText}>Edit</Text>
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#61DAFB',
    borderRadius: 5,
    padding: 10,
  },
  stat: {
    fontSize: 16,
    fontWeight: 'bold',
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
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
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
    marginBottom: 35,
  },
  deleteButton: {
    backgroundColor: '#ff4757',
    padding: 5,
    borderRadius: 5,
    position: 'absolute',
    bottom: 5,
    right: 5,
  },
  editButton: {
    backgroundColor: '#1e0ff7',
    padding: 5,
    borderRadius: 5,
    position: 'absolute',
    bottom: 5,
    left: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  categoryButton: {
    backgroundColor: '#61DAFB',
    borderRadius: 5,
    padding: 5,
    marginBottom: 20,
  },
  categoryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  categoriesContainer: {
    borderWidth: 1,
    borderColor: '#61DAFB',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryStat: {
    fontSize: 14,
    marginBottom: 5,
    minWidth: '45%',
  },
});