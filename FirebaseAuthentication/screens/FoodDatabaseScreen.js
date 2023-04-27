import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, deleteDoc, doc, where, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { auth, firestore, storage } from '../firebase';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import notificationManager from '../notificationManager';

const FoodDatabaseScreen = () => {
  const navigation = useNavigation();

  const [foodItems, setFoodItems] = useState([]);

  // Search and Category Filter
  const [search, setSearch] = useState('');
  const [filteredFoodItems, setFilteredFoodItems] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showColorKey, setShowColorKey] = useState(false);

  useEffect(() => {
    // Get the current user's ID
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    // Update the query to filter items by the userId
    const q = query(collection(firestore, 'foodItems'), where('userId', '==', userId));
  
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setFoodItems(items);
      console.log('Filtered items by userId:', items);
    });
  
    // Clean up the listener when the component is unmounted
    return () => unsubscribe();
  }, []);

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
    const currentDate = new Date();
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(currentDate.getDate() + 2);
  
    if (isExpired(expiryDate)) {
      return 'red';
    } else if (expiryDate.toDate() <= twoDaysFromNow) {
      return 'orange';
    } else {
      return 'green';
    }
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

  const deleteFoodItem = async (id, imageUrl) => {
    try {
      // Get the food item document and its data
      const foodItemDocRef = doc(firestore, 'foodItems', id);
      const foodItemDoc = await getDoc(foodItemDocRef);
      const foodItemData = foodItemDoc.data();
  
      // Cancel the scheduled notification if it exists
      if (foodItemData.notificationIdentifier) {
        await notificationManager.cancelScheduledNotification(foodItemData.notificationIdentifier);
      }
  
      // Delete the document from Firestore
      await deleteDoc(doc(firestore, 'foodItems', id));
      
      // Delete the image from Firebase Storage
      await deleteImageFromStorage(imageUrl);
  
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };
  
  const getItemsExpiringInTwoDays = () => {
    const currentDate = new Date();
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(currentDate.getDate() + 2);
  
    return foodItems.filter(
      (item) => item.date.toDate() > currentDate && item.date.toDate() <= twoDaysFromNow
    ).length;
  }; 
  
  const toggleStats = () => {
    setShowStats(!showStats);
  };

  const toggleColorKey = () => {
    setShowColorKey(!showColorKey);
  };

  const deleteImageFromStorage = async (imageUrl) => {
    try {
      const imagePath = imageUrl.split('/o/')[1].split('?')[0];
      const imageRef = ref(storage, decodeURIComponent(imagePath));
      await deleteObject(imageRef);
      console.log('Image deleted from Firebase Storage:', imagePath);
    } catch (error) {
      console.error('Error deleting image from Firebase Storage:', error);
    }
  };
  
  const ColorKey = () => {
    return (
      <View style={styles.colorKeyContainer}>
        <View style={styles.colorKeyItem}>
          <View style={[styles.colorKeyIndicator, { backgroundColor: 'green' }]} />
          <Text style={styles.colorKeyDescription}>Not expired</Text>
        </View>
        <View style={styles.colorKeyItem}>
          <View style={[styles.colorKeyIndicator, { backgroundColor: 'orange' }]} />
          <Text style={styles.colorKeyDescription}>Expiring in 2 days</Text>
        </View>
        <View style={styles.colorKeyItem}>
          <View style={[styles.colorKeyIndicator, { backgroundColor: 'red' }]} />
          <Text style={styles.colorKeyDescription}>Expired</Text>
        </View>
      </View>
    );
  };

  // Use Effect for search and filter, filters based on the search input
  useEffect(() => {
    setFilteredFoodItems(foodItems);
  }, [foodItems]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleColorKey} style={styles.categoryButton}>
        <Text style={styles.categoryButtonText}>Toggle Color Key</Text>
      </TouchableOpacity>
      {showColorKey && <ColorKey />}
      <TouchableOpacity onPress={toggleStats} style={styles.categoryButton}>
        <Text style={styles.categoryButtonText}>Toggle Stats</Text>
      </TouchableOpacity>
      {showStats && (
      <View style={styles.categoriesContainer}>
        <Text style={styles.subHeader}>Statistics:</Text>
        <Text style={styles.categoryStat}>Total Items: {getTotalItems()}</Text>
        <Text style={styles.categoryStat}>Expired Items: {getExpiredItems()}</Text>
        <Text style={styles.categoryStat}>Expiring in two Days: {getItemsExpiringInTwoDays()}</Text>
      </View>
      )}
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
            <TouchableOpacity onPress={() => deleteFoodItem(item.id, item.image)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigateToEditFoodItem(item)} style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
        initialNumToRender={10} // Initial number of items to render
        maxToRenderPerBatch={10} // Maximum number of items to render per batch during scrolling
        windowSize={10} // Number of items rendered in the viewport and the specified buffer around it
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
    fontSize: 8,
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
  colorKeyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 10,
  },
  colorKeyItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorKeyIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
  },
  colorKeyDescription: {
    fontSize: 12,
  },
});