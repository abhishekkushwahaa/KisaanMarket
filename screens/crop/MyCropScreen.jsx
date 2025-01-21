import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';

const MarketScreen = () => {
    const [newCrop, setNewCrop] = useState('');
    const [newPrice, setNewPrice] = useState('');

    const sections = [
        { type: 'header' },
        { type: 'listCrops' },
    ];

    const renderSection = ({ item }) => {
        switch (item.type) {
            case 'header':
                return (
                    <View className="py-6 px-6 mt-2"></View>
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
