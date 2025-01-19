import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Modal } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const sections = [
  {
    title: "Account",
    items: [
      { id: "1", icon: "user", label: "Profile" },
      { id: "2", icon: "play-circle", label: "Subscription details" },
    ],
  },
  {
    title: "Settings",
    items: [
      { id: "3", icon: "cog", label: "General settings" },
      { id: "4", icon: "shield", label: "Privacy settings" },
      { id: "5", icon: "bell", label: "Notification preferences" },
      { id: "6", icon: "moon-o", label: "Theme settings" },
      { id: "7", icon: "lightbulb-o", label: "Advanced options" },
    ],
  },
  {
    title: "Support",
    items: [
      { id: "8", icon: "question-circle", label: "Support" },
      { id: "9", icon: "sign-out", label: "Sign out" },
    ],
  },
];

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setIsModalVisible(true);
  };

  const confirmSignOut = async () => {
    try {
      setLoading(true);
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userId");

      const tokenAfter = await AsyncStorage.getItem("userToken");

      if (!tokenAfter) {
        setIsModalVisible(false);
        navigation.navigate("(auth)");
      }
    } catch (error) {
      console.error("Error during sign-out:", error);
      setLoading(false);
    }
  };

  const cancelSignOut = () => {
    setIsModalVisible(false);
  };

  const renderSection = (section) => (
    <View key={section.title} className="mb-4">
      <Text className="text-lg font-semibold">{section.title}</Text>
      {section.items.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => {
            if (item.label === "Sign out") {
              handleSignOut();
            }
          }}
          activeOpacity={0.7}
          className="flex-row items-center justify-between bg-gray-100 p-4 mt-2 rounded-lg shadow-sm border border-gray-100"
        >
          <View className="flex-row items-center">
            <FontAwesome name={item.icon} size={20} color="black" className="mr-4" />
            <Text className="text-base font-medium">{item.label}</Text>
          </View>
          <FontAwesome name="chevron-right" size={16} color="black" />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <View className="flex-row justify-between items-center bg-gray-100 mt-6 ml-6 mr-6">
        <TouchableOpacity activeOpacity={0.7}>
          <FontAwesome name="arrow-left" size={20} color="black" className="mt-6" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-800 mt-6">Profile Settings</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <FontAwesome name="bars" size={20} color="black" className="mt-6" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={sections}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => renderSection(item)}
        contentContainerStyle={{ padding: 16 }}
      />

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelSignOut}
      >
        <View className="flex-1 justify-center items-center bg-gray-100 bg-opacity-50">
          <View className="w-80 p-6 bg-white rounded-lg shadow-lg">
            <Text className="text-xl font-semibold mb-4">Sign Out</Text>
            <Text className="mb-4">Are you sure you want to sign out?</Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={cancelSignOut}
                activeOpacity={0.7}
                className="bg-gray-300 py-2 px-6 rounded-lg"
              >
                <Text className="text-black">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmSignOut}
                disabled={loading}
                activeOpacity={0.7}
                className={`py-2 px-6 rounded-lg ${loading ? 'bg-red-400' : 'bg-red-500'}`}
              >
                <Text className="text-white">{loading ? 'Signing out...' : 'Sign Out'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileScreen;
