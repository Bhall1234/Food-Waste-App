import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';
import { Camera } from 'expo-camera';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [foodItems, setFoodItems] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const askPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const takePhoto = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync();
      setImage(photo.uri);
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

    setFoodItems([...foodItems, newFoodItem]);
    setTitle('');
    setCategory('');
    setImage(null);

    console.log('Food items:', foodItems);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={askPermission} style={styles.button}>
          <Text style={styles.buttonText}>Request Camera Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera style={styles.camera} ref={ref => setCamera(ref)} />
      </View>
      <TouchableOpacity onPress={takePhoto} style={styles.button}>
        <Text style={styles.buttonText}>Take Photo</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
      <TextInput
        style={styles.input}
        placeholder="Title"
        onChangeText={setTitle}
        value={title}
      />
      <DropDownPicker
        items={[
          { label: 'Select a category', value: '' },
          { label: 'Fruit', value: 'fruit' },
          { label: 'Vegetable', value: 'vegetable' },
          { label: 'Grain', value: 'grain' },
        ]}
        defaultValue={category}
        containerStyle={styles.dropdownContainer}
        style={styles.dropdown}
        itemStyle={styles.dropdownItem}
        dropDownStyle={styles.dropdownList}
        onChangeItem={item => setCategory(item.value)}
      />
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
    </ScrollView>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  cameraContainer: {
    alignSelf: 'stretch',
    alignItems: 'center',
    marginBottom: 60,
  },
  camera: {
    width: '100%',
    height: 200,
  },
  button: {
    backgroundColor: '#61DAFB',
    padding: 10,
    borderRadius: 5,
    marginTop: 60,
    marginBottom: 60,
  },
  buttonText: {
    color: '#282C34',
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#61DAFB',
    borderRadius: 5,
    width: '100%',
    padding: 5,
    marginTop: 60,
    textAlign: 'center',
  },
  dropdown: {
    backgroundColor: '#fafafa',
    borderColor: '#61DAFB',
    borderRadius: 5,
  },
  dropdownItem: {
    justifyContent: 'flex-start',
  },
  dropdownList: {
    backgroundColor: '#fafafa',
    borderColor: '#61DAFB',
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginBottom: 60,
  },
  dateText: {
    marginBottom: 60,
  },
});
