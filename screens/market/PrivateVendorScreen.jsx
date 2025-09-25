import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MotiView, AnimatePresence } from "moti";
import { useNavigation } from "@react-navigation/native";

const mockVendors = [
    {
        id: 1,
        name: "AgroMart Pvt Ltd",
        address: "Sector 45, Gurugram",
        phone: "+91 9876543210",
        buyingCrops: [
            { name: "Soybean", price: "₹2700/quintal" },
            { name: "Cotton", price: "₹5000/quintal" },
        ],
    },
    {
        id: 2,
        name: "Farm Fresh Traders",
        address: "MG Road, Delhi",
        phone: "+91 9123456789",
        buyingCrops: [
            { name: "Pulses", price: "₹3200/quintal" },
            { name: "Sugarcane", price: "₹350/quintal" },
        ],
    },
];

const PrivateVendorScreen = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredVendors, setFilteredVendors] = useState(mockVendors);
    const [expandedVendor, setExpandedVendor] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const filtered = mockVendors.filter((vendor) =>
            vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredVendors(filtered);
    }, [searchQuery]);

    const toggleExpand = (vendorId) => {
        setExpandedVendor(expandedVendor === vendorId ? null : vendorId);
    };

    const handleCall = (phoneNumber) => {
        Linking.openURL(`tel:${phoneNumber}`);
    };

    const handleChat = (vendorName) => {
        navigation.navigate("ChatScreen", { vendor: vendorName });
    };

    return (
        <View className="flex-1 bg-gray-100 px-4 py-2">
            <View className="flex-row items-center mb-2">
                <Text className="text-xl font-bold text-gray-800 ml-2">Private Market</Text>
            </View>

            <View className="flex-row items-center bg-white p-2 rounded-full shadow-sm mb-4">
                <Ionicons name="search-outline" size={22} color="#2D2958" className="ml-2"/>
                <TextInput
                    placeholder="Search vendors..."
                    className="flex-1 ml-2 text-gray-800"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {filteredVendors.map((vendor) => (
                    <View key={vendor.id} className="mb-2">
                        {/* Vendor Card */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => toggleExpand(vendor.id)}
                            className="bg-white p-4 rounded-2xl shadow-sm flex-row justify-between items-center"
                        >
                            <Text className="text-lg font-semibold text-gray-800">{vendor.name}</Text>
                            <Ionicons
                                name={expandedVendor === vendor.id ? "chevron-up" : "chevron-down"}
                                size={22}
                                color="#2D2958"
                            />
                        </TouchableOpacity>

                        <AnimatePresence>
                            {expandedVendor === vendor.id && (
                                <MotiView
                                    from={{ opacity: 0, scaleY: 0 }}
                                    animate={{ opacity: 1, scaleY: 1 }}
                                    exit={{ opacity: 0, scaleY: 0 }}
                                    transition={{ type: "timing", duration: 300 }}
                                    className="bg-gray-50 p-4 rounded-2xl mt-2 shadow-sm"
                                >
                                    {/* Address */}
                                    <Text className="text-gray-700 font-medium">
                                        📍 Address: {vendor.address}
                                    </Text>

                                    {/* Phone Number */}
                                    <Text className="text-gray-800 font-semibold mt-2 mb-2">
                                        📞 Contact: {vendor.phone}
                                    </Text>
                                    {vendor.buyingCrops.map((crop, idx) => (
                                        <View key={idx} className="flex-row justify-between mb-1">
                                            <Text className="text-gray-600">{crop.name}</Text>
                                            <Text className="text-green-600 font-semibold">{crop.price}</Text>
                                        </View>
                                    ))}

                                    <View className="flex-row justify-between mt-2">
                                        <TouchableOpacity
                                            className="bg-green-500 px-4 py-2 rounded-lg flex-row items-center"
                                            activeOpacity={1}
                                            onPress={() => handleCall(vendor.phone)}
                                        >
                                            <Ionicons name="call-outline" size={24} color="white" />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            className="bg-green-500 px-4 py-2 rounded-lg flex-row items-center"
                                            activeOpacity={1}
                                            onPress={() => handleChat(vendor.name)}
                                        >
                                            <Ionicons name="chatbubble-outline" size={24} color="white"/>
                                        </TouchableOpacity>
                                    </View>
                                </MotiView>
                            )}
                        </AnimatePresence>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default PrivateVendorScreen;
