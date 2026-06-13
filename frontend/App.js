import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import AgendaScreen from './src/screens/AgendaScreen';
import CreateCompromissoScreen from './src/screens/CreateCompromissoScreen';
import EditCompromissoScreen from './src/screens/EditCompromissoScreen';
import { Platform } from 'react-native';

if (Platform.OS === 'web') {
  const style = document.createElement('style');
  style.textContent = `
    input[type="password"]::-ms-reveal,
    input[type="password"]::-ms-clear {
      display: none;
    }
    input {
      outline: none !important;
    }
  `;
  document.head.appendChild(style);
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Agenda" component={AgendaScreen} />
        <Stack.Screen name="CreateCompromisso" component={CreateCompromissoScreen} />
        <Stack.Screen name="EditCompromisso" component={EditCompromissoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
