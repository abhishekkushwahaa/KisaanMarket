import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";

const MarketScreen = () => {
  const [newCrop, setNewCrop] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [cropList, setCropList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const cropAPI = `${process.env.EXPO_PUBLIC_BACKEND_CROP_URL}/api/crop`;

  const fetchCrops = async () => {
    try {
      setLoading(true);
      const response = await axios.get(cropAPI);
      setCropList(response.data.data || []);
    } catch (err) {
      Toast.show({ type: "error", text1: "Failed to fetch crops." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Denied",
        "You must grant permission to access your photos."
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSaveCrop = async () => {
    if (!newCrop || !newPrice) {
      Alert.alert("Incomplete Form", "Please enter a crop name and price.");
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Not Authenticated", "Please log in again.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("name", newCrop);
      formData.append("price", newPrice);

      if (image && image.startsWith("file://")) {
        const uriParts = image.split(".");
        const fileType = uriParts[uriParts.length - 1];
        formData.append("cropImage", {
          uri: image,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      if (isEditing) {
        await axios.patch(`${cropAPI}/${editId}`, formData, config);
        Toast.show({ type: "success", text1: "Crop updated successfully!" });
      } else {
        await axios.post(cropAPI, formData, config);
        Toast.show({ type: "success", text1: "Crop added successfully!" });
      }

      // Reset form and reload data
      setIsEditing(false);
      setEditId(null);
      setNewCrop("");
      setNewPrice("");
      setImage(null);
      fetchCrops();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Something went wrong.";
      Toast.show({ type: "error", text1: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCrop = (id) => {
    Alert.alert("Delete Crop", "Are you sure you want to delete this crop?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setLoading(true);

          try {
            const response = await axios.delete(`${cropAPI}/${id}`);

            if (response.status === 200) {
              Toast.show({
                type: "success",
                text1: "Crop deleted successfully.",
                visibilityTime: 1500,
                position: "top",
                topOffset: 10,
              });

              fetchCrops();
            } else {
              Toast.show({
                type: "error",
                text1: "Failed to delete crop. Please try again.",
                visibilityTime: 1500,
                position: "top",
                topOffset: 10,
              });
            }
          } catch (err) {
            console.error("Error deleting crop:", err);

            Toast.show({
              type: "error",
              text1: "Failed to delete crop. Please try again.",
              visibilityTime: 1500,
              position: "top",
              topOffset: 10,
            });
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const startEditing = (crop) => {
    setIsEditing(true);
    setEditId(crop.id);
    setNewCrop(crop.name);
    setNewPrice(crop.price.toString());
    setImage(crop.image_url);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setNewCrop("");
    setNewPrice("");
    setImage(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="p-5 mt-10">
        <Text className="text-3xl font-bold text-center text-gray-800 mb-5">
          {isEditing ? "Edit Your Crop" : "Add a New Crop"}
        </Text>

        {/* Form Inputs */}
        <TextInput
          value={newCrop}
          onChangeText={setNewCrop}
          className="bg-white p-4 rounded-lg mb-3 text-base border border-gray-200"
          placeholder="Crop Name (e.g., Wheat)"
        />
        <TextInput
          value={newPrice}
          onChangeText={setNewPrice}
          className="bg-white p-4 rounded-lg mb-4 text-base border border-gray-200"
          placeholder="Price per Quintal"
          keyboardType="numeric"
        />

        {/* Image Picker Button and Preview */}
        <TouchableOpacity
          onPress={pickImage}
          className="bg-blue-100 p-4 rounded-lg items-center mb-4 border border-dashed border-blue-400"
        >
          <Text className="text-blue-600 font-semibold">
            {image ? "Change Image" : "Select an Image"}
          </Text>
        </TouchableOpacity>
        {image && (
          <Image
            source={{ uri: image }}
            className="w-full h-48 rounded-lg mb-4"
            resizeMode="cover"
          />
        )}

        {/* Action Buttons */}
        <View className="flex-row">
          <TouchableOpacity
            onPress={handleSaveCrop}
            className="flex-1 bg-green-500 p-4 rounded-lg items-center shadow-md mr-1"
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-base">
                {isEditing ? "Update Crop" : "Add Crop"}
              </Text>
            )}
          </TouchableOpacity>
          {isEditing && (
            <TouchableOpacity
              onPress={cancelEdit}
              className="flex-1 bg-gray-500 p-4 rounded-lg items-center shadow-md ml-1"
            >
              <Text className="text-white font-bold text-base">Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Divider */}
      <View className="h-px bg-gray-300 mx-5 my-2" />

      {/* List of Crops */}
      <FlatList
        data={cropList}
        keyExtractor={(item) => item.id.toString()}
        className="px-5"
        renderItem={({ item }) => (
          <View className="bg-white p-4 mb-3 rounded-lg shadow-sm flex-row items-center">
            <Image
              source={{ uri: item.image }} // IMPORTANT: Use item.image_url here
              className="w-16 h-16 rounded-lg mr-4"
            />
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900">
                {item.name}
              </Text>
              <Text className="text-base text-green-700">
                ₹{item.price}/quintal
              </Text>
            </View>
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => startEditing(item)}
                className="p-2"
              >
                <Icon name="edit" size={24} color="#34D399" />
              </TouchableOpacity>
              {/* Add Delete functionality here if needed */}
              <TouchableOpacity
                onPress={() => handleDeleteCrop(item.id)}
                className="p-2"
              >
                <Icon name="trash" size={24} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-10">
            No crops listed yet.
          </Text>
        }
      />
      <Toast />
    </SafeAreaView>
  );
};

export default MarketScreen;
