import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {

    // Declare state variables
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Get the navigation object
    const navigation = useNavigation();
    
    // Check if the user is already logged in
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                navigation.replace('Main');
            }
        })
        // Unsuscribe from the listener when unmounting
        return unsubscribe; 
    }, []);
    
    // Handle the login and register
    const handleSignup = async () => {
      setLoading(true);
      setError('');
      const startTime = performance.now();
      try {
          // Create a new user account
          const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredentials.user;
          console.log('Registered with: ', user.email);
      } catch (error) {
          setError(error.message);
      }
      setLoading(false);
      const endTime = performance.now();
      console.log(`Signup time: ${endTime - startTime} ms`);
  }

    // Handle the login and register
    const handleLogin = async () => {
      setLoading(true);
      setError('');
      const startTime = performance.now();
      try {
          // login with email and password
          const userCredentials = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredentials.user;
          console.log('Logged in with: ', user.email);
      } catch (error) {
          setError(error.message);
      }
      setLoading(false);
      const endTime = performance.now();
      console.log(`Login time: ${endTime - startTime} ms`);
  }

    // Handle the password 
    const handlePasswordReset = async () => {
      const startTime = performance.now();
      navigation.navigate('Password Reset');
      const endTime = performance.now();
      console.log(`Password Reset navigation time: ${endTime - startTime} ms`);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Foodwaste Prototype</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={text => setEmail(text)}
            style={styles.input}
            keyboardType="email-address"
            placeholderTextColor="#61DAFB"
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={text => setPassword(text)}
            style={styles.input}
            secureTextEntry
            placeholderTextColor="#61DAFB"
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleLogin}
            style={styles.button}
            disabled={loading}
            activeOpacity={0.6}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSignup}
            style={styles.buttonOutline}
            disabled={loading}
            activeOpacity={0.6}
          >
            <Text style={styles.buttonOutlineText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handlePasswordReset}
            activeOpacity={0.6}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        {loading && <ActivityIndicator size="large" color="#61DAFB" />}
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
  title:{
    fontSize: 30,
    color: '#61DAFB',
    marginBottom: 40,
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  forgotPasswordText: {
    textAlign: 'center',
    color: '#61DAFB',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});