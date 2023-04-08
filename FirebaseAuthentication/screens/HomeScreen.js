import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {

    const navigation = useNavigation();

    const handleSignOut = () => {
        auth.signOut().then(() => {
          navigation.replace("Login")
            console.log('User signed out!');
        })
        .catch(error => alert(error.message));
    };

    return (
        <View style={styles.container}>
          <Text style={styles.title}>Email: {auth.currentUser?.email}</Text>
          <TouchableOpacity onPress={handleSignOut} style={styles.button}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      );
    };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#282C34',
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
      title: {
        fontSize: 20,
        color: '#61DAFB',
        marginBottom: 40,
      },
    });
    
    export default HomeScreen;