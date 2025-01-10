import React, { useState } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import avatar from "@/assets/images/avatar.png";

const HomeScreen = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchClick = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleSearchChange = (text) => {
    setSearchQuery(text);
  };

  return (
    <View className="flex-1 bg-[#F2F1FE]">
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 45,
          paddingBottom: 20,
        }}
      >
        <Header onSearchClick={handleSearchClick} />
        {isSearchVisible && (
          <SearchInput searchQuery={searchQuery} onSearchChange={handleSearchChange} />
        )}
        <PriceTrends />
        <TrendCard title="Crop comparison" description="Analyze crop price variations" />
        <TrendCard title="Price update notifications" description="Stay informed, act quickly" />
        <Preferences />
        <FooterButton />
      </ScrollView>
    </View>
  );
};

const Header = ({ onSearchClick }) => (
  <View className="flex-row justify-between items-center mb-6">
    <View className="flex-row items-center">
      <Image
        source={avatar}
        className="w-14 h-14 rounded-full mr-3"
      />
      <Text className="text-xl font-extrabold text-[#2D2958]">
        Welcome, Abhi!
      </Text>
    </View>
    <TouchableOpacity onPress={onSearchClick}>
      <Ionicons name="search" size={28} color="#2D2958" />
    </TouchableOpacity>
  </View>
);

const SearchInput = ({ searchQuery, onSearchChange }) => (
  <View className="bg-white p-3 rounded-2xl shadow-sm mb-6">
    <TextInput
      value={searchQuery}
      onChangeText={onSearchChange}
      placeholder="Search crop prices"
      placeholderTextColor="#888"
      className="h-12 text-lg text-[#2D2958] px-4 rounded-lg"
    />
  </View>
);

const PriceTrends = () => (
  <View className="flex-row justify-between items-center mb-4">
    <Text className="text-xl font-semibold text-[#2D2958]">
      Price trends this week
    </Text>
    <TouchableOpacity>
      <Text className="text-sm text-green-500 font-semibold">View calendar</Text>
    </TouchableOpacity>
  </View>
);

const TrendCard = ({ title, description }) => (
  <TouchableOpacity className="bg-white p-4 rounded-2xl mb-4 shadow-sm">
    <Text className="text-lg font-medium text-[#2D2958]">{title}</Text>
    <Text className="text-sm text-[#2D2958] mb-2">{description}</Text>
    <Text className="text-sm text-green-500">Set SMS alert for tomorrow</Text>
  </TouchableOpacity>
);

const Preferences = () => (
  <View>
    <Text className="text-xl font-semibold text-[#2D2958] mb-4">
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
    <Text className="text-lg text-[#2D2958]">{title}</Text>
    <Ionicons name="chevron-forward" size={22} color="#2D2958" />
  </TouchableOpacity>
);

const FooterButton = () => (
  <TouchableOpacity className="bg-[#2D2958] p-4 rounded-full shadow-sm items-center justify-center mb-6">
    <Ionicons name="add" size={28} color="white" />
  </TouchableOpacity>
);

export default HomeScreen;
