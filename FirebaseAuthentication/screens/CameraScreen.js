import React, { useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Camera } from 'expo-camera';

const CameraScreen = ({ navigation }) => {
  const cameraRef = useRef(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true, skipProcessing: true };
      const data = await cameraRef.current.takePictureAsync(options);
      const uri = data.uri;
      if (uri) {
        navigation.navigate('Photo Screen', { imageUri: uri });
      }
    }
  };

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={cameraRef} type={Camera.Constants.Type.back} />
      <TouchableOpacity onPress={takePicture} style={styles.button}>
        <Text style={styles.buttonText}>Capture</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  button: {
    backgroundColor: '#61DAFB',
    padding: 10,
    borderRadius: 5,
    position: 'absolute',
    bottom: 20,
  },
  buttonText: {
    color: '#282C34',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
