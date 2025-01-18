import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import avatar from "@/assets/images/avatar.png";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const HomeScreen = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [userName, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        const userId = await AsyncStorage.getItem("userId");
        const response = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.user) {
          setUsername(response.data.user.name);
          setIsLoggedIn(true);
        }
      }
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 45,
          paddingBottom: 20,
        }}
      >
        <Header userName={userName} />
        <PriceTrends />
        <TrendCard title="Crop comparison" description="Analyze crop price variations" />
        <TrendCard title="Price update notifications" description="Stay informed, act quickly" />
        <Preferences />
        <FooterButton />
      </ScrollView>
    </View>
  );
};

const Header = ({ userName }) => (
  <View className="flex-row justify-between items-center mb-6">
    <View className="flex-row items-center">
      <Image
        source={avatar}
        className="w-14 h-14 rounded-full mr-3"
      />
      <Text className="text-xl font-extrabold text-gray-800">
        Welcome, {userName || "User"}!
      </Text>
    </View>
    <TouchableOpacity onPress={() => { }}>
      <Ionicons name="notifications-outline" size={28} color="#2D2958" />
    </TouchableOpacity>
  </View>
);

const PriceTrends = () => (
  <View className="flex-row justify-between items-center mb-4">
    <Text className="text-xl font-semibold text-gray-800">
      Price trends this week
    </Text>
    <TouchableOpacity>
      <Text className="text-sm text-green-500 font-semibold">View calendar</Text>
    </TouchableOpacity>
  </View>
);

const TrendCard = ({ title, description }) => (
  <TouchableOpacity className="bg-white p-4 rounded-2xl mb-4 shadow-sm">
    <Text className="text-lg font-medium text-gray-800">{title}</Text>
    <Text className="text-sm text-gray-800 mb-2">{description}</Text>
    <Text className="text-sm text-green-500">Set SMS alert for tomorrow</Text>
  </TouchableOpacity>
);

const Preferences = () => (
  <View>
    <Text className="text-xl font-semibold text-gray-800 mb-4">
      My Preferences
    </Text>
    <PreferenceItem title="Wheat prices" />
    <PreferenceItem title="Rice prices" />
    <PreferenceItem title="Market prices for wheat" />
    <PreferenceItem title="Track barley prices" />
  </View>
);

const PreferenceItem = ({ title }) => (
  <TouchableOpacity
    className="bg-white p-4 rounded-2xl mb-4 shadow-sm flex-row justify-between items-center"
  >
    <Text className="text-lg text-gray-800">{title}</Text>
    <Ionicons name="chevron-forward" size={22} color="#2D2958" />
  </TouchableOpacity>
);

const FooterButton = () => (
  <TouchableOpacity className="bg-green-500 p-4 rounded-full shadow-sm items-center justify-center mb-6">
    <Ionicons name="add" size={28} color="white" />
  </TouchableOpacity>
);

export default HomeScreen;
