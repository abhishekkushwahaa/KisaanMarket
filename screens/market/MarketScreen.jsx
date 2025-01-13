import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const cropsAvailable = [
    { id: '1', name: 'Wheat', price: '₹2000/quintal', vendor: 'Vendor A' },
    { id: '2', name: 'Rice', price: '₹2500/quintal', vendor: 'Vendor B' },
    { id: '3', name: 'Corn', price: '₹1500/quintal', vendor: 'Vendor C' },
];

const trendingCrops = [
    { id: '1', name: 'Soybean', farmers: 12 },
    { id: '2', name: 'Barley', farmers: 8 },
    { id: '3', name: 'Cotton', farmers: 15 },
];

const MarketScreen = () => {
    const [newCrop, setNewCrop] = useState('');
    const [newPrice, setNewPrice] = useState('');

    const sections = [
        { type: 'header' },
        { type: 'listCrops' },
        { type: 'vendorPrices' },
        { type: 'trendingCrops' },
        { type: 'didYouKnow' },
    ];

    const renderSection = ({ item }) => {
        switch (item.type) {
            case 'header':
                return (
                    <View className="py-6 px-6 bg-green-50 mb-3">
                        <Text className="text-green-700 text-2xl font-bold text-center mt-6">FARMER'S MARKET</Text>
                        <Text className="text-green-800 text-sm text-center">
                            Connect with vendors, explore trends, and list your crops
                        </Text>
                    </View>
                );
            case 'listCrops':
                return (
                    <View className="ml-4 mr-4 p-4 mb-3 bg-white rounded-lg">
                        <Text className="text-lg font-semibold mb-3">List Your Crops</Text>
                        <TextInput
                            value={newCrop}
                            onChangeText={setNewCrop}
                            className="bg-gray-100 px-4 py-3 rounded-lg mb-4 text-gray-700"
                            placeholder="Crop name"
                            placeholderTextColor="#9CA3AF"
                        />
                        <TextInput
                            value={newPrice}
                            onChangeText={setNewPrice}
                            className="bg-gray-100 px-4 py-3 rounded-lg mb-4 text-gray-700"
                            placeholder="Price per quintal"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="numeric"
                        />
                        <TouchableOpacity className="bg-green-500 py-3 rounded-lg">
                            <Text className="text-white text-center font-medium">Add Crop</Text>
                        </TouchableOpacity>
                    </View>
                );
            case 'vendorPrices':
                return (
                    <View className="ml-4 mr-4 p-4 bg-white rounded-lg mb-3">
                        <Text className="text-lg font-semibold mb-3">Vendor Crop Prices</Text>
                        {cropsAvailable.map((item) => (
                            <TouchableOpacity key={item.id} className="p-4 border-b border-gray-200">
                                <View className="flex-row justify-between items-center">
                                    <View>
                                        <Text className="text-sm font-medium text-gray-800">{item.name}</Text>
                                        <Text className="text-xs text-gray-500">Offered by: {item.vendor}</Text>
                                    </View>
                                    <Text className="text-sm font-medium text-gray-500">{item.price}</Text>
                                </View>
                                <Text className="text-xs text-blue-500 mt-2">View More</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                );
            case 'trendingCrops':
                return (
                    <View className="ml-4 mr-4 p-4 bg-white rounded-lg mb-3">
                        <Text className="text-lg font-semibold mb-3">Trending Crops</Text>
                        {trendingCrops.map((item) => (
                            <TouchableOpacity key={item.id} className="p-4 border-b border-gray-200">
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-sm font-medium text-gray-800">{item.name}</Text>
                                    <View className="flex-row items-center">
                                        <FontAwesome name="users" size={16} color="#6B7280" />
                                        <Text className="text-sm text-gray-500 ml-2">{item.farmers} farmers</Text>
                                    </View>
                                </View>
                                <Text className="text-xs text-blue-500 mt-2">View More</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                );
            case 'didYouKnow':
                return (
                    <View className="ml-4 mr-4 p-4 mb-3 bg-green-100 rounded-lg shadow-md">
                        <Text className="text-lg font-semibold mb-3">Did You Know?</Text>
                        <Text className="text-sm text-gray-700">
                            Farmers using precision agriculture techniques have increased efficiency by 30%.
                        </Text>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <FlatList
            data={sections}
            keyExtractor={(item, index) => `${item.type}-${index}`}
            renderItem={renderSection}
        />
    );
};

export default MarketScreen;
