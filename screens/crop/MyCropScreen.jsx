import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // For navigation
import Icon from 'react-native-vector-icons/FontAwesome';

const MarketScreen = () => {
    const navigation = useNavigation();  // Hook for navigation
    const [newCrop, setNewCrop] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [cropList, setCropList] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);

    const cropAPI = `${process.env.EXPO_PUBLIC_BACKEND_CROP_URL}/api/crop`;

    const fetchCrops = async () => {
        setLoading(true);
        try {
            const response = await axios.get(cropAPI);
            setCropList(response.data.data);
        } catch (err) {
            Toast.show({
                type: 'error',
                text1: 'Failed to fetch crops. Please try again later.',
                visibilityTime: 1500,
                position: 'top',
                topOffset: 10,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCrops();
    }, []);

    const handleSaveCrop = async () => {
        if (!newCrop || !newPrice) {
            Toast.show({
                type: 'error',
                text1: 'Please enter both crop name and price.',
                visibilityTime: 1500,
                position: 'top',
                topOffset: 10,
            });
            return;
        }

        setLoading(true);
        try {
            const userid = await AsyncStorage.getItem('userid');
            if (isEditing) {
                const response = await axios.patch(`${cropAPI}/${editId}`, {
                    name: newCrop,
                    price: newPrice,
                    userid: String(userid),
                });
                if (response.status === 200) {
                    Toast.show({
                        type: 'success',
                        text1: 'Crop updated successfully.',
                        visibilityTime: 1500,
                        position: 'top',
                        topOffset: 10,
                    });
                    setIsEditing(false);
                    setEditId(null);
                }
            } else {
                const response = await axios.post(cropAPI, {
                    name: newCrop,
                    price: newPrice,
                    userid: String(userid),
                });
                if (response.status === 201) {
                    Toast.show({
                        type: 'success',
                        text1: 'Crop added successfully.',
                        visibilityTime: 1500,
                        position: 'top',
                        topOffset: 10,
                    });
                }
            }
            setNewCrop('');
            setNewPrice('');
            fetchCrops();
        } catch (err) {
            Toast.show({
                type: 'error',
                text1: 'Something went wrong. Please try again.',
                visibilityTime: 1500,
                position: 'top',
                topOffset: 10,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCrop = (id) => {
        Alert.alert(
            'Delete Crop',
            'Are you sure you want to delete this crop?',
            [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setLoading(true); // Set loading state to true during deletion
                        try {
                            const response = await axios.delete(`${cropAPI}/${id}`);
                            if (response.status === 200) {
                                Toast.show({
                                    type: 'success',
                                    text1: 'Crop deleted successfully.',
                                    visibilityTime: 1500,
                                    position: 'top',
                                    topOffset: 10,
                                });
                                fetchCrops();  // Refresh the list after deletion
                            } else {
                                Toast.show({
                                    type: 'error',
                                    text1: 'Failed to delete crop. Please try again.',
                                    visibilityTime: 1500,
                                    position: 'top',
                                    topOffset: 10,
                                });
                            }
                        } catch (err) {
                            console.error('Error deleting crop:', err);
                            Toast.show({
                                type: 'error',
                                text1: 'Failed to delete crop. Please try again.',
                                visibilityTime: 1500,
                                position: 'top',
                                topOffset: 10,
                            });
                        } finally {
                            setLoading(false);  // Set loading state to false after completion
                        }
                    },
                },
            ]
        );
    };

    const startEditing = (crop) => {
        setNewCrop(crop.name);
        setNewPrice(crop.price.toString());
        setIsEditing(true);
        setEditId(crop.id);
    };

    const cancelEdit = () => {
        setNewCrop('');
        setNewPrice('');
        setIsEditing(false);
        setEditId(null);
    };

    return (
        <View className="flex-1 p-6 bg-gray-50">
            {/* Heading Section */}
            <View className="mb-8"></View>

            {/* Form Section */}
            <View className="mb-6">
                <TextInput
                    value={newCrop}
                    onChangeText={setNewCrop}
                    className="bg-white p-5 rounded-lg mb-4 text-gray-800 shadow-md"
                    placeholder="Enter crop name"
                    placeholderTextColor="#888"
                />
                <TextInput
                    value={newPrice}
                    onChangeText={setNewPrice}
                    className="bg-white p-5 rounded-lg mb-6 text-gray-800 shadow-md"
                    placeholder="Enter price per quintal"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                />
                <View className="flex-row justify-between">
                    <TouchableOpacity
                        onPress={handleSaveCrop}
                        activeOpacity={0.8}
                        className="bg-green-500 p-5 rounded-lg flex items-center shadow-md flex-1 mr-2">
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff"/>
                        ) : (
                            <Text className="text-white font-semibold">
                                {isEditing ? 'Update Crop' : 'Add Crop'}
                            </Text>
                        )}
                    </TouchableOpacity>
                    {isEditing && (
                        <TouchableOpacity
                            onPress={cancelEdit}
                            className="bg-gray-500 p-5 rounded-lg flex items-center shadow-md flex-1 ml-2">
                            <Text className="text-white font-semibold">Cancel</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Crop List Section */}
            <View className="flex-1 justify-end">
                {loading ? (
                    <ActivityIndicator size="large" color="#000"/>
                ) : (
                    <FlatList
                        data={cropList}
                        keyExtractor={(crop) => crop.id.toString()}
                        renderItem={({item}) => (
                            <View className="bg-white p-5 mb-2 rounded-lg shadow-sm flex-row justify-between items-center">
                                {/* Crop Name and Price in a single line */}
                                <View className="flex-1">
                                    <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
                                    <Text className="text-sm text-gray-600">₹{item.price}/quintal</Text>
                                </View>

                                {/* Action Buttons (Edit and Delete) */}
                                <View className="flex-row space-x-4">
                                    <TouchableOpacity onPress={() => startEditing(item)}>
                                        <Icon name="edit" size={24} color="green" className="mr-4"/>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleDeleteCrop(item.id)}>
                                        <Icon name="trash" size={24} color="red" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    />
                )}
            </View>

            <Toast/>
        </View>
    );
}
    export default MarketScreen;
