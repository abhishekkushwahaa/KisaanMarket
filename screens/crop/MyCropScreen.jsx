import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/FontAwesome";

const MarketScreen = () => {
  const [newCrop, setNewCrop] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [cropList, setCropList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("default"); // default, asc, desc
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const cropAPI = `${process.env.EXPO_PUBLIC_BACKEND_CROP_URL}/api/crop`;
  const reorderAPI = `${process.env.EXPO_PUBLIC_BACKEND_CROP_URL}/api/crop/reorder`;

  // Fetch crops
  const fetchCrops = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${cropAPI}?page=1&limit=20`);
      const data = response.data.data || [];
      const uniqueData = Array.from(
        new Map(data.map((c) => [c.id, c])).values()
      );
      setCropList(uniqueData);
      setPage(2);
      setHasMore(
        response.data.pagination?.currentPage <
          response.data.pagination?.totalPages
      );
    } catch {
      Toast.show({ type: "error", text1: "Failed to fetch crops." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  // Three-state sort button handler
  const handleSortClick = () => {
    if (sortOrder === "default") setSortOrder("asc");
    else if (sortOrder === "asc") setSortOrder("desc");
    else setSortOrder("default");
  };

  // Filter & sort crops
  const filteredAndSortedCrops = useMemo(() => {
    let filtered = cropList.filter((crop) =>
      crop.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortOrder === "asc")
      filtered.sort((a, b) => Number(a.price) - Number(b.price));
    else if (sortOrder === "desc")
      filtered.sort((a, b) => Number(b.price) - Number(a.price));

    return filtered;
  }, [cropList, searchQuery, sortOrder]);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission Denied",
        "You must grant permission to access photos."
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleDragEnd = async ({ data }) => {
    setCropList(data);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const orderedIds = data.map((item) => item.id);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.patch(reorderAPI, { orderedIds }, config);
    } catch {
      Toast.show({ type: "error", text1: "Failed to save order." });
      fetchCrops();
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
      if (image?.startsWith("file://")) {
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
        Toast.show({ type: "success", text1: "Crop updated!" });
      } else {
        await axios.post(cropAPI, formData, config);
        Toast.show({ type: "success", text1: "Crop added!" });
      }
      setIsEditing(false);
      setEditId(null);
      setNewCrop("");
      setNewPrice("");
      setImage(null);
      fetchCrops();
    } catch {
      Toast.show({ type: "error", text1: "Failed to save crop." });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCrop = (id) => {
    Alert.alert("Delete Crop", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            await axios.delete(`${cropAPI}/${id}`);
            setCropList((prev) => prev.filter((c) => c.id !== id));
            Toast.show({ type: "success", text1: "Crop deleted." });
          } catch {
            Toast.show({ type: "error", text1: "Failed to delete crop." });
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const loadMoreCrops = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const response = await axios.get(`${cropAPI}?page=${page}&limit=10`);
      const newData = response.data.data || [];
      const uniqueData = newData.filter(
        (newCrop) => !cropList.some((c) => c.id === newCrop.id)
      );
      if (uniqueData.length) {
        setCropList((prev) => [...prev, ...uniqueData]);
        setPage((prev) => prev + 1);
      } else setHasMore(false);
    } catch {
      Toast.show({ type: "error", text1: "Failed to load more crops." });
    } finally {
      setLoadingMore(false);
    }
  }, [cropList, page, loadingMore, hasMore]);

  const startEditing = (crop) => {
    setIsEditing(true);
    setEditId(crop.id);
    setNewCrop(crop.name);
    setNewPrice(crop.price.toString());
    setImage(crop.image);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setNewCrop("");
    setNewPrice("");
    setImage(null);
  };

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        style={{ flex: 1, justifyContent: "center" }}
      />
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
      <DraggableFlatList
        data={filteredAndSortedCrops}
        onDragEnd={handleDragEnd}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item, drag, isActive }) => (
          <TouchableOpacity
            onLongPress={drag}
            disabled={isActive}
            style={{
              backgroundColor: isActive ? "#ECFDF5" : "#FFFFFF",
              marginHorizontal: 16,
              marginBottom: 12,
              borderRadius: 16,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 5,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
            }}
          >
            <Image
              source={{ uri: item.image || item.image_url }}
              style={{
                width: 64,
                height: 64,
                borderRadius: 12,
                marginRight: 16,
              }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{ fontSize: 16, fontWeight: "bold", color: "#111827" }}
              >
                {item.name}
              </Text>
              <Text
                style={{ color: "#059669", fontWeight: "600", marginTop: 4 }}
              >
                ₹{item.price}/quintal
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() => startEditing(item)}
                style={{ padding: 8 }}
              >
                <Icon name="edit" size={20} color="#34D399" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteCrop(item.id)}
                style={{ padding: 8 }}
              >
                <Icon name="trash" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListHeaderComponent={
          <View
            className="mt-10"
            style={{ paddingHorizontal: 16, paddingVertical: 12 }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              {isEditing ? "Edit Crop" : "Add New Crop"}
            </Text>
            <TextInput
              value={newCrop}
              onChangeText={setNewCrop}
              placeholder="Crop Name"
              style={{
                backgroundColor: "#FFF",
                padding: 12,
                borderRadius: 12,
                marginBottom: 8,
                borderWidth: 1,
                borderColor: "#E5E7EB",
              }}
            />
            <TextInput
              value={newPrice}
              onChangeText={setNewPrice}
              placeholder="Price per Quintal"
              keyboardType="numeric"
              style={{
                backgroundColor: "#FFF",
                padding: 12,
                borderRadius: 12,
                marginBottom: 8,
                borderWidth: 1,
                borderColor: "#E5E7EB",
              }}
            />
            <TouchableOpacity
              onPress={pickImage}
              style={{
                backgroundColor: "#DBEAFE",
                padding: 12,
                borderRadius: 12,
                marginBottom: 8,
                alignItems: "center",
                borderWidth: 1,
                borderStyle: "dashed",
                borderColor: "#60A5FA",
              }}
            >
              <Text style={{ color: "#2563EB", fontWeight: "600" }}>
                {image ? "Change Image" : "Select Image"}
              </Text>
            </TouchableOpacity>
            {image && (
              <Image
                source={{ uri: image }}
                style={{
                  width: "100%",
                  height: 160,
                  borderRadius: 12,
                  marginBottom: 8,
                }}
              />
            )}
            <View style={{ flexDirection: "row", marginBottom: 12 }}>
              <TouchableOpacity
                onPress={handleSaveCrop}
                style={{
                  flex: 1,
                  backgroundColor: "#10B981",
                  padding: 12,
                  borderRadius: 12,
                  marginRight: 6,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#FFF", fontWeight: "600" }}>
                  {isEditing ? "Update Crop" : "Add Crop"}
                </Text>
              </TouchableOpacity>
              {isEditing && (
                <TouchableOpacity
                  onPress={cancelEdit}
                  style={{
                    flex: 1,
                    backgroundColor: "#6B7280",
                    padding: 12,
                    borderRadius: 12,
                    marginLeft: 6,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#FFF", fontWeight: "600" }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Search & Sort */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              {/* Search Input */}
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#F3F4F6",
                  borderRadius: 12,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  marginRight: 8,
                  shadowColor: "#000",
                  shadowOpacity: 0.05,
                  shadowRadius: 5,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 2,
                }}
              >
                <Icon name="search" size={18} color="#9CA3AF" />
                <TextInput
                  style={{ flex: 1, marginLeft: 8, fontSize: 14 }}
                  placeholder="Search crops..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              {/* Sort Button */}
              <TouchableOpacity
                onPress={handleSortClick}
                style={{
                  backgroundColor: "#10B981",
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 12,
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 5,
                  shadowOffset: { width: 0, height: 6 },
                  elevation: 2,
                }}
              >
                <Icon
                  name={
                    sortOrder === "default"
                      ? "sort"
                      : sortOrder === "asc"
                      ? "sort-amount-asc"
                      : "sort-amount-desc"
                  }
                  size={18}
                  color="#FFF"
                />
              </TouchableOpacity>
            </View>
          </View>
        }
        onEndReached={loadMoreCrops}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator style={{ marginVertical: 10 }} />
          ) : null
        }
        ListEmptyComponent={
          <Text
            style={{ textAlign: "center", marginTop: 10, color: "#6B7280" }}
          >
            No crops listed yet.
          </Text>
        }
      />
      <Toast />
    </SafeAreaView>
  );
};

export default MarketScreen;
