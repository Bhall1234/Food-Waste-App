import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from './screens/LoginScreen';
//import HomeScreen from './screens/HomeScreen';
import PasswordResetScreen from './screens/PasswordResetScreen';

import CameraScreen from './screens/CameraScreen';
import FoodDatabaseScreen from './screens/FoodDatabaseScreen';
import RecipeRecommendationScreen from './screens/RecipeRecommendationScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Camera" component={CameraScreen} />
      <Tab.Screen name="Food Database" component={FoodDatabaseScreen} />
      <Tab.Screen name="Recipes" component={RecipeRecommendationScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Password Reset" component={PasswordResetScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282C34',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  headerStyle: {
    backgroundColor: '#282C34',
  },
});
