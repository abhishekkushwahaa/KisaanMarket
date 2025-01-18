import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import axios from 'axios';
import logo from '@/assets/images/icon.png';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const [logoAnimation, setLogoAnimation] = useState(new Animated.Value(1));
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  const animateLogo = () => {
    Animated.sequence([
      Animated.timing(logoAnimation, { toValue: 0.8, duration: 300, useNativeDriver: true }),
      Animated.timing(logoAnimation, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  const handlePressIn = () => {
    Animated.timing(scaleAnimation, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnimation, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      handleLogin();
    });
  };

  const isEmail = (input) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  const isPhoneNumber = (input) => /^\d{10}$/.test(input);

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert('Error', 'Please enter both email/phone and password.');
      return;
    }

    if (!isEmail(identifier) && !isPhoneNumber(identifier)) {
      Alert.alert('Error', 'Enter a valid email or 10-digit phone number.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/auth/login`, {
        identifier,
        password,
      });
      setLoading(false);

      if (response.status === 200) {
        const { token, user } = response.data;
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userId', user.id.toString());
        Alert.alert('Success', `Welcome, ${user.name}`);
        navigation.reset({
          index: 0,
          routes: [{ name: '(tabs)', params: { user, token } }],
        });
      } else {
        Alert.alert('Login Failed', response.data.error || 'Unknown error occurred.');
      }
    } catch (error) {
      setLoading(false);
      // console.error('API Error:', error.response || error.message);

      // Handle different error scenarios
      const errorMessage =
        error.response?.data?.error || 'Unable to connect to the server. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gradient-to-t from-[#F2F1FE] to-[#B7B7D5] px-6">
      <Text className="text-3xl text-[#2D2958] mb-6 font-bold">Kisaan Market</Text>
      <Animated.Image
        source={logo}
        className="w-28 h-28 rounded-full mb-8"
        style={{ transform: [{ scale: logoAnimation }] }}
        onLoad={animateLogo}
      />
      <View className="w-full">
        <TextInput
          placeholder="Email or Phone Number"
          keyboardType="default"
          value={identifier}
          onChangeText={setIdentifier}
          className="h-12 px-4 rounded-xl mb-4 bg-white shadow-lg"
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          className="h-12 px-4 rounded-xl mb-6 bg-white shadow-lg"
        />
        <Animated.View style={{ transform: [{ scale: scaleAnimation }] }}>
          <TouchableOpacity
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={loading}
            activeOpacity={1}
            className={`h-12 rounded-xl flex justify-center items-center mb-4 ${loading ? 'bg-gray-400' : 'bg-green-500'
              }`}
          >
            <Text className="text-white text-lg font-semibold">
              {loading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
        <TouchableOpacity onPress={() => navigation.navigate('register')} activeOpacity={0.8}>
          <Text className="text-center text-lg text-[#2D2958]">
            Don't have an account?{' '}
            <Text className="text-green-500 font-bold">Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
