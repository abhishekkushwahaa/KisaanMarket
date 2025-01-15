import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import logo from '@/assets/images/icon.png';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [logoAnimation, setLogoAnimation] = useState(new Animated.Value(1));
  const [email, setEmail] = useState('');
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

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      if (email === 'test@example.com' && password === 'password123') {
        navigation.navigate('HomeScreen');
      } else {
        Alert.alert('Login Failed', 'Invalid email or password.');
      }
    }, 1000);
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
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
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
        <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')} activeOpacity={0.8}>
          <Text className="text-center text-lg text-[#2D2958]">
            Don't have an account?{' '}
            <Text className="text-green-500 font-bold">Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
