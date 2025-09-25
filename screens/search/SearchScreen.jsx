import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Bell, Settings, HelpCircle, MessageSquare } from "lucide-react-native";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  const crops = [
    { name: "Wheat", image: "https://png.pngtree.com/png-clipart/20240610/original/pngtree-wheate-grains-isolated-png-image_15291790.png" },
    { name: "Rice", image: "https://static.vecteezy.com/system/resources/thumbnails/047/424/372/small_2x/close-up-paddy-rice-ears-isolated-on-transparent-background-free-png.png" },
    { name: "Corn", image: "https://i.pinimg.com/736x/d8/43/ad/d843ad360d8f7615452b80b4bb725019.jpg" },
    { name: "Soybean", image: "https://png.pngtree.com/png-vector/20231014/ourmid/pngtree-close-up-soy-beans-png-image_10160300.png" },
  ];

  const notifications = [
    {
      title: "Customize Alerts",
      description: "Receive SMS alerts for price updates",
      icon: <Bell size={32} color="#4B5563" />,
    },
    {
      title: "Settings",
      description: "Manage notification preferences",
      icon: <Settings size={32} color="#4B5563" />,
    },
    {
      title: "Help",
      description: "Get assistance with app features",
      icon: <HelpCircle size={32} color="#4B5563" />,
    },
    {
      title: "Feedback",
      description: "Share your thoughts with us",
      icon: <MessageSquare size={32} color="#4B5563" />,
    },
  ];

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView contentContainerStyle={{ paddingTop: 40 }} className="flex-1">
        <View className="px-6 rounded-b-2xl">
          <View className="flex-row items-center">
            <TouchableOpacity className="p-2">
              <Ionicons name="arrow-back" size={24} color="black" style={{ marginRight: 4 }} />
            </TouchableOpacity>
            <Text className="text-xl font-semibold ml-2 text-gray-800">Search for Crop</Text>
          </View>
        </View>
        <View className="mt-2 px-6 mb-2">
          <TextInput
            placeholder="Enter crop name or select from the list"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="w-full bg-white p-4 rounded-lg border border-gray-300 text-gray-700 shadow-md pl-14"
            style={{
              paddingLeft: 40,
            }}
          />
          <Ionicons
            name="search"
            size={24}
            color="gray"
            style={{ position: "absolute", left: 30, top: 12 }}
          />
        </View>
        <View className="px-6">
          <Text className="mb-2 text-lg font-semibold text-gray-800">Search Results</Text>
          {crops.length > 0 ? (
            <View className="flex-row flex-wrap justify-between">
              {crops.map((crop, index) => (
                <TouchableOpacity
                  key={index}
                  className="items-center bg-white p-4 rounded-xl shadow-md mb-4"
                  style={{
                    width: "24%",
                  }}
                  activeOpacity={0.7}
                >
                  <Image
                    source={{ uri: crop.image }}
                    className="rounded-full"
                    style={{
                      width: 40,
                      height: 40,
                      marginBottom: 6,
                    }}
                  />
                  <Text className="text-sm font-medium text-gray-700">{crop.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text className="text-gray-500 text-sm">No results found</Text>
          )}
        </View>
        <View className="px-6">
          <Text className="text-lg font-semibold mb-4 text-gray-800">Notifications</Text>
          {notifications.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center bg-white p-4 rounded-xl shadow-md mb-4"
              style={{ elevation: 3 }}
              activeOpacity={0.7}
            >
              {item.icon}
              <View style={{ flex: 1 }}>
                <Text className="font-semibold text-gray-800 ml-3">{item.title}</Text>
                <Text className="text-gray-500 text-sm mt-1 ml-3">{item.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
