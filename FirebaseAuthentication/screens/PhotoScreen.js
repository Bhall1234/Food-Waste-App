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

const PhotoScreen = ({ image, onBack }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const submitFoodItem = () => {
    if (!title || !category) {
      alert('Please enter a title and category for the food item.');
      return;
    }

    const newFoodItem = {
      title,
      category,
      image,
    };

    console.log('Food item:', newFoodItem);
    onBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
      <TextInput
        style={styles.input}
        placeholder="Title"
        onChangeText={setTitle}
        value={title}
      />
      <Picker
        selectedValue={category}
        style={styles.picker}
        onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
      >
        <Picker.Item label="Select a category" value="" />
        <Picker.Item label="Fruit" value="fruit" />
        <Picker.Item label="Vegetable" value="vegetable" />
        <Picker.Item label="Grain" value="grain" />
      </Picker>
      {category !== '' && (
        <Text style={styles.selectedCategoryText}>Selected Category: {category}</Text>
      )}
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.button}>
        <Text style={styles.buttonText}>Select Date</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
          textColor="#61DAFB"
        />
      )}
      <Text style={styles.dateText}>{`Selected Date: ${date.toDateString()}`}</Text>
      <TouchableOpacity onPress={submitFoodItem} style={styles.button}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onBack} style={styles.button}>
        <Text style={styles.buttonText}>Back</Text>
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
      marginBottom: 20,
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
      marginBottom: 20,
    },
    selectedCategoryText: {
      marginTop: 10,
      marginBottom: 20,
    },
  });