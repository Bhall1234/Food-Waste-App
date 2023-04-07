import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';

const LoginScreen = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');  

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <View style={styles.innerContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={text => setEmail(text) }
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={text => setPassword(text)}
            style={styles.input}
            secureTextEntry
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => { }} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { }} style={styles.buttonOutline}>
            <Text style={styles.buttonOutlineText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282C34',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: 300,
    padding: 15,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#61DAFB',
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: 'rgba(97, 218, 251, 0.1)',
    color: '#61DAFB',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '90%',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#61DAFB',
  },
  buttonText: {
    textAlign: 'center',
    color: '#282C34',
    fontWeight: 'bold',
    fontSize: 18,
  },
  buttonOutline: {
    width: '90%',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#61DAFB',
  },
  buttonOutlineText: {
    textAlign: 'center',
    color: '#61DAFB',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
