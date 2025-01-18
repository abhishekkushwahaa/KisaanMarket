import React, { useState, useEffect } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('userToken');
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
  }, []);

  if (isLoggedIn === null) {
    return null;
  }

  return <Redirect href={isLoggedIn ? "/(tabs)" : "/(auth)"} />;
}
