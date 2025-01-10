import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from "./login/LoginScreen";
import HomeScreen from "./home/HomeScreen";
import RegisterScreen from "./login/RegisterScreen";

const Stack = createStackNavigator();

const ScreenNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#F2F1FE',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#2D2958',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: {
          backgroundColor: '#F2F1FE',
        },
        headerBackTitleVisible: false,
        headerTitleAlign: 'left',
      }}
    >
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: null,
          headerLeft: null,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{ title: 'Back' }}
      />
    </Stack.Navigator>
  );
};

export default ScreenNavigator;
