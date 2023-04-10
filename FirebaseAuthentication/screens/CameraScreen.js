import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const navigation = useNavigation();

  const askPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const takePhoto = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync();
      navigation.navigate('Photo Screen', { image: photo.uri });
    }
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
});
