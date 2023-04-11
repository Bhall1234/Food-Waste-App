import React, { useState } from 'react';
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
import { firestore } from '../firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';

const PhotoScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const image = route.params.imageUri;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  //const onDateChange = (event, selectedDate) => {
    //setShowDatePicker(false);
    //if (selectedDate) {
      //setDate(selectedDate);
    //}
 // };

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

  const submitFoodItem = async () => {
    if (!title || !category) {
      alert('Please enter a title and category for the food item.');
      return;
    }
  
    const newFoodItem = {
      title,
      category,
      image,
      date: Timestamp.fromDate(date),
    };
  
    try {
      await addDoc(collection(firestore, 'foodItems'), newFoodItem);
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
          style = {styles.dateTime}
        />
      )}
      <Text style={styles.dateText}>{`Expiration Date: ${date.toDateString()}`}</Text>
      <TouchableOpacity onPress={submitFoodItem} style={styles.button}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
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
  });