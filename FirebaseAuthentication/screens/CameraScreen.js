import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [foodItems, setFoodItems] = useState([]);

  const askPermission = async () => {
    const { status } = await Camera.requestPermissionsAsync();
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
    <View style={styles.container}>
      <Camera style={styles.camera} ref={ref => setCamera(ref)} />
      <TouchableOpacity onPress={takePhoto} style={styles.button}>
        <Text style={styles.buttonText}>Take Photo</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      <TextInput
        style={styles.input}
        placeholder="Title"
        onChangeText={setTitle}
        value={title}
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        onChangeText={setCategory}
        value={category}
      />
      <TouchableOpacity onPress={submitFoodItem} style={styles.button}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    width: 200,
    height: 200,
  },
  button: {
    backgroundColor: '#61DAFB',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
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
    width: 200,
    padding: 5,
    marginTop: 10,
    textAlign: 'center',
  },
});
