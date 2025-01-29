import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MotiView, AnimatePresence } from "moti";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";

const servicesData = [
    {
        category: "Tractors",
        providers: [
            {
                name: "Agro Rent",
                address: "Sector 12, Gurugram",
                phone: "9876543210",
                price: "₹1500/day",
                machinery: ["John Deere 5050D", "Mahindra Arjun 605"],
                rating: "4.8",
            },
            {
                name: "Farm Tools",
                address: "Palwal, Haryana",
                phone: "8765432109",
                price: "₹1400/day",
                machinery: ["Swaraj 744 FE", "New Holland 3630"],
                rating: "4.5",
            },
        ],
    },
    {
        category: "Harvesters",
        providers: [
            {
                name: "Krishi Rentals",
                address: "Rewari, Haryana",
                phone: "7654321098",
                price: "₹5000/day",
                machinery: ["Kubota Harvester DC-68G", "Preet 987"],
                rating: "4.7",
            },
            {
                name: "Farming Hub",
                address: "Faridabad, Haryana",
                phone: "6543210987",
                price: "₹4800/day",
                machinery: ["Mahindra Arjun 605", "John Deere W70"],
                rating: "4.9",
            },
        ],
    },
];

const ServicesScreen = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [expandedProvider, setExpandedProvider] = useState(null);
    const navigation = useNavigation();

    const filteredServices = servicesData.filter((service) =>
        service.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleCategory = (index) => {
        setExpandedCategory(expandedCategory === index ? null : index);
    };

    const toggleProvider = (index) => {
        setExpandedProvider(expandedProvider === index ? null : index);
    };

    const handleCall = (phoneNumber) => {
        Linking.openURL(`tel:${phoneNumber}`);
    };

    const handleChat = (providerName) => {
        navigation.navigate("ChatScreen", { provider: providerName });
    };

    return (
        <View className="flex-1 bg-gray-100 px-4 py-2">
            <View className="flex-row items-center mb-2">
                <Text className="text-xl font-bold text-gray-800 ml-2">Service Market</Text>
            </View>

            <View className="flex-row items-center bg-white p-2 rounded-full shadow-sm mb-4">
                <Ionicons name="search-outline" size={20} color="#2D2958" className="ml-2" />
                <TextInput
                    placeholder="Search tractors, harvesters..."
                    className="flex-1 ml-2 text-gray-800"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {filteredServices.map((service, index) => (
                    <View key={index} className="mb-2">
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => toggleCategory(index)}
                            className="bg-white p-4 rounded-2xl shadow-sm flex-row justify-between items-center"
                        >
                            <View className="flex-row items-center">
                                <Text className="text-lg font-semibold text-gray-800 ml-2">{service.category}</Text>
                            </View>
                            <Ionicons
                                name={expandedCategory === index ? "chevron-up" : "chevron-down"}
                                size={22}
                                color="#2D2958"
                            />
                        </TouchableOpacity>

                        <AnimatePresence>
                            {expandedCategory === index && (
                                <MotiView
                                    from={{ opacity: 0, scaleY: 0 }}
                                    animate={{ opacity: 1, scaleY: 1 }}
                                    exit={{ opacity: 0, scaleY: 0 }}
                                    transition={{ type: "timing", duration: 300 }}
                                    style={{ backgroundColor: "#f0fdf4" }}
                                    className="p-4 rounded-2xl shadow-sm mt-2"
                                >
                                    {service.providers.map((provider, pIndex) => (
                                        <View key={pIndex} className="mb-2">
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                onPress={() => toggleProvider(pIndex)}
                                                className="flex-row justify-between items-center bg-gray-200 p-4 rounded-2xl shadow-sm"
                                            >
                                                <View className="flex-1">
                                                    <View className="flex-row items-center">
                                                        <Text className="text-lg font-semibold text-gray-800">{provider.name}</Text>
                                                        <View className="flex-row items-center ml-2">
                                                            <Ionicons name="star" size={16} color="#FFC107" />
                                                            <Text className="ml-1 text-gray-600">{provider.rating}</Text>
                                                        </View>
                                                    </View>
                                                    <Text className="text-green-600 font-bold">{provider.price}</Text>
                                                </View>
                                                <Ionicons
                                                    name={expandedProvider === pIndex ? "chevron-up" : "chevron-down"}
                                                    size={22}
                                                    color="#2D2958"
                                                />
                                            </TouchableOpacity>

                                            <AnimatePresence>
                                                {expandedProvider === pIndex && (
                                                    <MotiView
                                                        from={{ opacity: 0, scaleY: 0 }}
                                                        animate={{ opacity: 1, scaleY: 1 }}
                                                        exit={{ opacity: 0, scaleY: 0 }}
                                                        transition={{ type: "timing", duration: 300 }}
                                                        style={{ backgroundColor: "#E8F5E9" }}
                                                        className="p-2 rounded-2xl mt-2 shadow-sm"
                                                    >
                                                        <Text className="text-gray-700 font-medium mb-2">
                                                            📍 Address: {provider.address}
                                                        </Text>
                                                        <Text className="text-gray-700 font-medium">
                                                            📞 Contact: {provider.phone}
                                                        </Text>

                                                        <View className="flex-row justify-between mt-2">
                                                            <TouchableOpacity
                                                                className="bg-green-500 px-4 py-2 rounded-lg flex-row items-center"
                                                                activeOpacity={1}
                                                                onPress={() => handleCall(provider.phone)}
                                                            >
                                                                <Ionicons name="call-outline" size={24} color="white" />
                                                            </TouchableOpacity>

                                                            <TouchableOpacity
                                                                className="bg-green-500 px-4 py-2 rounded-lg flex-row items-center"
                                                                activeOpacity={1}
                                                                onPress={() => handleChat(provider.name)}
                                                            >
                                                                <Ionicons name="chatbubble-outline" size={24} color="white"/>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </MotiView>
                                                )}
                                            </AnimatePresence>
                                        </View>
                                    ))}
                                </MotiView>
                            )}
                        </AnimatePresence>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default ServicesScreen;
