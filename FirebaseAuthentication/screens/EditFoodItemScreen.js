import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import { auth } from '../firebase';
import { firestore } from '../firebase';
import { updateDoc, doc, Timestamp } from 'firebase/firestore';
import notificationManager from '../notificationManager';

const EditFoodItemScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const foodItem = route.params.foodItem;

  const userId = auth.currentUser.uid;

  const [title, setTitle] = useState(foodItem.title);
  const [category, setCategory] = useState(foodItem.category);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(foodItem.date.toDate());
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    if (userId === foodItem.userId) {
      setIsEditable(true);
    } else {
      setIsEditable(false);
      alert("You are not authorized to edit this food item.");
    }
  }, [userId, foodItem.userId]);

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
  
      const notificationId = await notificationManager.scheduleNotification(
        'Item Expiring Soon',
        `${title} will expire in 2 days. Please consume or dispose of it.`,
        {
          seconds: secondsToTrigger, // Set the trigger seconds as a calculated number of seconds
          channelId: 'default', // Set the appropriate channelId if required
        }
      );
      return notificationId;
    } 
    else {
      // Schedule a notification to be triggered 6 hours before the item's expiration
      const triggerDate = new Date(date);
      triggerDate.setHours(triggerDate.getHours() - 6);
  
      const secondsToTrigger = (triggerDate.getTime() - currentDate.getTime()) / 1000;
  
      const notificationId = await notificationManager.scheduleNotification(
          'Item Expiring Soon',
          `${title} will expire in ${Math.ceil(daysUntilExpiry)} day(s). Please consume or dispose of it.`,
        {
          seconds: secondsToTrigger,
          channelId: 'default',
        },
      );
  
      return notificationId;
    }
  };
  
  const submitFoodItem = async () => {
    if (!title || !category) {
      alert('Please enter a title and category for the food item.');
      return;
    }

    const notificationIdentifier = await sendExpiringItemNotifications();

    const updatedFoodItem = {
      title,
      category,
      image: foodItem.image,
      date: Timestamp.fromDate(date),
      notificationIdentifier, // Add the notification identifier to the new food item data
    };

    try {
      await updateDoc(doc(firestore, 'foodItems', foodItem.id), updatedFoodItem);
      console.log('Food item added successfully');
      alert('Item added successfully!');
  
      navigation.goBack();
    } catch (error) {
      console.error('Error adding food item: ', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageBorder}>
        {foodItem.image && <Image source={{ uri: foodItem.image }} style={styles.imagePreview} />}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Title"
        onChangeText={setTitle}
        value={title}
        editable={isEditable}
      />
      <View style={styles.input}>
        <Picker
          selectedValue={category}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
          enabled={isEditable}
        >
          <Picker.Item label="Select a category" value="" />
          <Picker.Item label="Fruit" value="fruit" />
          <Picker.Item label="Vegetable" value="vegetable" />
          <Picker.Item label="Canned Food" value="can" />
          <Picker.Item label="Meat" value="meat" />
          <Picker.Item label="Sea Food" value="sea" />
          <Picker.Item label="Dairy" value="dairy" />
          <Picker.Item label="Drink" value="drink" />
          <Picker.Item label="Snack" value="snack" />
        </Picker>
      </View>
      {category !== '' && (
        <Text style={styles.selectedCategoryText}>Selected Category: {category}</Text>
      )}
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.button}
        disabled={!isEditable}
      >
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
      {isEditable && (
        <TouchableOpacity onPress={submitFoodItem} style={styles.button}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default EditFoodItemScreen;

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
  });