import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { auth, firestore, storage } from '../firebase';
import notificationManager from '../notificationManager';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const PhotoScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const image = route.params.imageUri;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const uploadImageAndGetDownloadURL = async (imageUri) => {
    const response = await fetch(imageUri);
    const blob = await response.blob();
  
    const userId = auth.currentUser.uid;
    const imageRef = ref(storage, `foodImages/${userId}/${Date.now()}`);
  
    await uploadBytes(imageRef, blob);
    const downloadURL = await getDownloadURL(imageRef);
  
    return downloadURL;
  };
  
  const isDateExpired = (selectedDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today;
    };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      if (isDateExpired(selectedDate)) {
        alert('Please select a valid expiry date.');
      } else {
        setDate(selectedDate);
      }
    }
  };

  const sendExpiringItemNotifications = async () => {
    const currentDate = new Date();
    
    // Calculate the difference in days between the expiry date and the current date
    const daysUntilExpiry = (date - currentDate) / (1000 * 60 * 60 * 24);
  
    // Check if the item has more than 2 days until expiry
    if (daysUntilExpiry > 2) {
      const triggerDate = new Date(date);
      triggerDate.setDate(triggerDate.getDate() - 2);
      
      const secondsToTrigger = (triggerDate.getTime() - currentDate.getTime()) / 1000;
  
      await notificationManager.scheduleNotification(
        'Item Expiring Soon',
        `${title} will expire in 2 days. Please consume or dispose of it.`,
        {
          seconds: secondsToTrigger, // Set the trigger seconds as a calculated number of seconds
          channelId: 'default', // Set the appropriate channelId if required
        }
      );
    } else {
      // Schedule a notification to be triggered 6 hours before the item's expiration
      const triggerDate = new Date(date);
      triggerDate.setHours(triggerDate.getHours() - 6);
  
      const secondsToTrigger = (triggerDate.getTime() - currentDate.getTime()) / 1000;
  
      await notificationManager.scheduleNotification(
        'Item Expiring Soon',
        `${title} will expire in ${Math.ceil(daysUntilExpiry)} day(s). Please consume or dispose of it.`,
        {
          seconds: secondsToTrigger,
          channelId: 'default',
        }
      );
    }
  };
  
  const submitFoodItem = async () => {
    if (!title || !category) {
      alert('Please enter a title and category for the food item.');
      return;
    }
  
    setLoading(true);
  
    try {
      // Upload the image to Firebase Storage and get the download URL
      const imageUrl = await uploadImageAndGetDownloadURL(image);
  
      // Get the current user's ID
      const userId = auth.currentUser.uid;
  
      const newFoodItem = {
        title,
        category,
        image: imageUrl, // Use the download URL instead of the local image URI
        date: Timestamp.fromDate(date),
        userId, // Add the user ID to the new food item data
      };
  
      await addDoc(collection(firestore, 'foodItems'), newFoodItem);
      console.log('Food item added successfully');
      alert('Item added successfully!');
  
      // Send notifications for expiring items
      sendExpiringItemNotifications();
  
      setLoading(false);
      navigation.goBack();
    } catch (error) {
      console.error('Error adding food item: ', error);
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.imageBorder}>
          {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
        </View>
        <TextInput
          style={styles.input}
          placeholder="Title"
          onChangeText={setTitle}
          value={title}
        />
        <View style={styles.input}>
          <Picker
            selectedValue={category}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
          >
            <Picker.Item label="Select a category" value="" />
            <Picker.Item label="Fruit" value="fruit" />
            <Picker.Item label="Vegetable" value="vegetable" />
            <Picker.Item label="Canned Food" value="can" />
            <Picker.Item label="Meat" value="meat" />
            <Picker.Item label="Sea Food" value="sea" />
            <Picker.Item label="Dairy" value="dairy" />
            <Picker.Item label="Drink" value="drink" />
            <Picker.Item label="Bread" value="bread" />
            <Picker.Item label="Snack" value="snack" />
          </Picker>
        </View>
        {category !== '' && (
          <Text style={styles.selectedCategoryText}>Selected Category: {category}</Text>
        )}
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.button}>
          <Text style={styles.buttonText}>Select Expiration Date</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
            textColor="#61DAFB"
            style={styles.dateTime}
          />
        )}
        <Text style={styles.dateText}>{`Expiration Date: ${date.toDateString()}`}</Text>
        <TouchableOpacity onPress={submitFoodItem} style={styles.button}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
      {loading && (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
      )}
    </View>
  );
};

export default PhotoScreen;

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    },
    imagePreview: {
      width: 200,
      height: 200,
    },
    input: {
      borderWidth: 1,
      borderColor: '#61DAFB',
      borderRadius: 5,
      width: '100%',
      padding: 5,
      marginTop: 20,
      textAlign: 'center',
    },
    picker: {
      width: '100%',
      marginBottom: 20
    },
    button: {
      backgroundColor: '#61DAFB',
      padding: 10,
      borderRadius: 5,
      marginTop: 20,
      marginBottom: 20,
    },
    buttonText: {
      color: '#282C34',
      fontWeight: 'bold',
      fontSize: 16,
    },
    dateText: {
      marginBottom: 40,
    },
    selectedCategoryText: {
      marginTop: 10,
      marginBottom: 20,
    },
    dateTime: {
      marginTop: 20,
      marginBottom: 20,
    },
    imageBorder: {
      borderWidth: 1,
      borderColor: '#61DAFB',
      borderRadius: 5,
      padding: 5,
      marginTop: 20,
    },
    loadingIndicator: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginLeft: -12, // Half of the ActivityIndicator size
      marginTop: -12, // Half of the ActivityIndicator size
    },    
  });