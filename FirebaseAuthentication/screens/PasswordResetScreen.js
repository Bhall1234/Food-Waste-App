import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

const PasswordResetScreen = () => {
  const [email, setEmail] = useState('');

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Password Reset', 'A password reset link has been sent to your email.');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Reset Password</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
          keyboardType="email-address"
          placeholderTextColor="#61DAFB"
        />
        <TouchableOpacity onPress={handlePasswordReset} style={styles.button}>
          <Text style={styles.buttonText}>Send Password Reset Link</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default PasswordResetScreen;

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
});
