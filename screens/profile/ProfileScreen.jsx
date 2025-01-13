import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

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
    const renderSection = (section) => (
        <View key={section.title} className="mb-4">
            <Text className="text-lg font-semibold">{section.title}</Text>
            {section.items.map((item) => (
                <TouchableOpacity
                    key={item.id}
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
                <TouchableOpacity>
                    <FontAwesome name="arrow-left" size={20} color="black" className="mt-6"/>
                </TouchableOpacity>
                <Text className="text-2xl font-bold text-gray-800 mt-6">Profile Settings</Text>
                <TouchableOpacity>
                    <FontAwesome name="bars" size={20} color="black" className="mt-6"/>
                </TouchableOpacity>
            </View>
            <FlatList
                data={sections}
                keyExtractor={(item) => item.title}
                renderItem={({ item }) => renderSection(item)}
                contentContainerStyle={{ padding: 16 }}
            />
        </View>
    );
};

export default ProfileScreen;
