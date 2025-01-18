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

const Register = () => {
  const [logoAnimation, setLogoAnimation] = useState(new Animated.Value(1));
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

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
      handleRegister();
    });
  };

  const handleRegister = async () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      Alert.alert('Error', 'Enter a valid 10-digit phone number.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/auth/register`, {
        name,
        email,
        phone,
        password,
      });
      setLoading(false);

      if (response.status === 201) {
        Alert.alert('Success', 'Registration successful!');
        navigation.navigate('index');
      } else {
        Alert.alert('Error', response.data.error || 'Registration failed.');
      }
    } catch (error) {
      setLoading(false);
      // console.error('API Error:', error);
      const errorMessage =
        error.response?.data?.error || 'Unable to connect to the server. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gradient-to-t from-[#F2F1FE] to-[#B7B7D5] px-6 mb-14">
      <Text className="text-3xl font-bold text-[#2D2958] mb-6">Kisaan Market</Text>
      <Animated.Image
        source={logo}
        className="w-28 h-28 rounded-full mb-8"
        style={{ transform: [{ scale: logoAnimation }] }}
        onLoad={animateLogo}
      />
      <View className="w-full">
        <TextInput
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          className="h-12 px-4 rounded-xl mb-4 bg-white shadow-lg"
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          className="h-12 px-4 rounded-xl mb-4 bg-white shadow-lg"
        />
        <TextInput
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          className="h-12 px-4 rounded-xl mb-4 bg-white shadow-lg"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="h-12 px-4 rounded-xl mb-4 bg-white shadow-lg"
        />
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          className="h-12 px-4 rounded-xl mb-6 bg-white shadow-lg"
        />
        <Animated.View style={{ transform: [{ scale: scaleAnimation }] }}>
          <TouchableOpacity
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={loading}
            activeOpacity={1}
            className={`h-12 ${loading ? 'bg-gray-400' : 'bg-green-500'
              } rounded-xl flex justify-center items-center mb-4`}
          >
            <Text className="text-white text-lg font-semibold">
              {loading ? 'Registering...' : 'Register'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
        <TouchableOpacity onPress={() => navigation.navigate('index')} activeOpacity={0.8}>
          <Text className="text-center text-lg text-[#2D2958]">
            Already have an account?{' '}
            <Text className="text-green-500 font-bold">Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Register;
