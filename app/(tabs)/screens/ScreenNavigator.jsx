import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from "./Login";
import Home from "./Home";
import Register from "./Register";

const Stack = createStackNavigator();

const ScreenNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Login"
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
                name="Login"
                component={Login}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Home"
                component={Home}
                options={{
                    title: null,
                    headerLeft: null,
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Register"
                component={Register}
                options={{ title: 'Back' }}
            />
        </Stack.Navigator>
    );
};

export default ScreenNavigator;