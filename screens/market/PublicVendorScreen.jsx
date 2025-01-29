import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MotiView, AnimatePresence } from "moti";

const mockVendors = [
    {
        id: 1,
        name: "Jaipur Mandi",
        address: "Mandi Road, Jaipur",
        buyingCrops: [
            { name: "Wheat", price: "₹2200/quintal" },
            { name: "Rice", price: "₹2500/quintal" },
            { name: "Corn", price: "₹2000/quintal" },
        ],
    },
    {
        id: 2,
        name: "Gurgaon Mandi",
        address: "NH-48, Gurugram",
        buyingCrops: [
            { name: "Barley", price: "₹1800/quintal" },
            { name: "Mustard", price: "₹2600/quintal" },
            { name: "Lentils", price: "₹3000/quintal" },
        ],
    },
];

const PublicVendorScreen = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredVendors, setFilteredVendors] = useState(mockVendors);
    const [expandedVendor, setExpandedVendor] = useState(null);

    useEffect(() => {
        const filtered = mockVendors.filter((vendor) =>
            vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredVendors(filtered);
    }, [searchQuery]);

    const toggleExpand = (vendorId) => {
        setExpandedVendor(expandedVendor === vendorId ? null : vendorId);
    };

    return (
        <View className="flex-1 bg-gray-100 px-4 py-2">
            <View className="flex-row items-center mb-2">
                <Text className="text-xl font-bold text-gray-800 ml-2">Public Market</Text>
            </View>

            <View className="flex-row items-center bg-white p-2 rounded-full shadow-sm mb-4">
                <Ionicons name="search-outline" size={20} color="#2D2958" className="ml-2"/>
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
                                    <Text className="text-gray-700 font-medium mb-2">
                                        📍 Address: {vendor.address}
                                    </Text>
                                    {vendor.buyingCrops.map((crop, idx) => (
                                        <View key={idx} className="flex-row justify-between mb-1">
                                            <Text className="text-gray-600">{crop.name}</Text>
                                            <Text className="text-green-600 font-semibold">{crop.price}</Text>
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

export default PublicVendorScreen;
