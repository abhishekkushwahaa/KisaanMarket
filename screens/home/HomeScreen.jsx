import React, { useState, useEffect } from "react";
import {
    ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity,
    TextInput,
    Modal,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import avatar from "@/assets/images/avatar.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";
import { MotiView } from "moti"; // Ensure this import

const HomeScreen = () => {
    const [userName, setUsername] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredPreferences, setFilteredPreferences] = useState([]);
    const [preferences, setPreferences] = useState([
        "Wheat prices",
        "Rice prices",
        "Market prices for wheat",
        "Track barley prices",
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [newPreference, setNewPreference] = useState("");

    const fetchUserData = async () => {
        try {
            setIsLoading(true);
            const token = await AsyncStorage.getItem("userToken");
            if (token) {
                const userId = await AsyncStorage.getItem("userId");
                const response = await axios.get(
                    `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/users/${userId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (response.data && response.data.user) {
                    setUsername(response.data.user.name);
                    setIsLoggedIn(true);
                }
            }
        } catch (error) {
            console.error("Error fetching user data", error);
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Failed to fetch user data. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim()) {
            const filtered = preferences.filter((item) =>
                item.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredPreferences(filtered);
        } else {
            setFilteredPreferences([]);
        }
    };

    const handleSMSAlert = (title) => {
        Toast.show({
            type: "success",
            text1: "SMS Alert Set",
            text2: `You will be notified about ${title}.`,
        });
    };

    const handleAddPreference = () => {
        if (newPreference.trim()) {
            setPreferences([...preferences, newPreference]);
            setNewPreference("");
            setModalVisible(false);
            Toast.show({
                type: "success",
                text1: "Preference Added",
                text2: "Your preference has been successfully added.",
            });
        } else {
            Toast.show({
                type: "error",
                text1: "Invalid Input",
                text2: "Preference cannot be empty.",
            });
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        console.log("Modal visible: ", modalVisible);
    }, [modalVisible]);

    return (
        <View className="flex-1 bg-gray-100">
            {isLoading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#2D2958" />
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={{
                        paddingHorizontal: 20,
                        paddingTop: 45,
                        paddingBottom: 20,
                    }}
                >
                    <Header userName={userName} />
                    <SearchBar searchQuery={searchQuery} onSearch={handleSearch} />
                    <PriceTrends />
                    <TrendCard
                        title="Crop comparison"
                        description="Analyze crop price variations"
                        onSetAlert={() => handleSMSAlert("Crop comparison")}
                    />
                    <TrendCard
                        title="Price update notifications"
                        description="Stay informed, act quickly"
                        onSetAlert={() => handleSMSAlert("Price update notifications")}
                    />
                    <Preferences
                        preferences={
                            searchQuery.trim() ? filteredPreferences : preferences
                        }
                        onSetAlert={handleSMSAlert}
                    />
                    <FooterButton onPress={() => setModalVisible(true)} />
                </ScrollView>
            )}

            <Modal
                animationType="fade"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View
                    className="flex-1 justify-center items-center bg-black/50"
                    style={{ zIndex: 9999 }}
                >
                    <View className="bg-white p-6 rounded-2xl w-4/5 shadow-lg">
                        <Text className="text-lg font-semibold text-gray-800 mb-4">
                            Add New Preference
                        </Text>
                        <TextInput
                            className="bg-gray-100 p-4 rounded-lg mb-4"
                            placeholder="Enter preference"
                            value={newPreference}
                            onChangeText={setNewPreference}
                        />
                        <View className="flex-row justify-end space-x-4">
                            <TouchableOpacity
                                className="bg-red-500 px-4 py-2 rounded-lg"
                                onPress={() => setModalVisible(false)}
                            >
                                <Text className="text-white font-medium">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="bg-green-500 px-4 py-2 rounded-lg"
                                onPress={handleAddPreference}
                            >
                                <Text className="text-white font-medium">Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Toast />
        </View>
    );
};

const Header = ({ userName }) => (
    <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center">
            <Image source={avatar} className="w-14 h-14 rounded-full mr-3" />
            <Text className="text-xl font-extrabold text-gray-800">
                Welcome, {userName || "User"}!
            </Text>
        </View>
        <TouchableOpacity activeOpacity={0.9} onPress={() => {}}>
            <Ionicons name="notifications-outline" size={28} color="#2D2958" />
        </TouchableOpacity>
    </View>
);

const SearchBar = ({ searchQuery, onSearch }) => (
    <View className="flex-row items-center bg-white p-2 rounded-full shadow-sm mb-2">
        <Ionicons name="search-outline" size={22} color="#2D2958" className="ml-2"/>
        <TextInput
            placeholder="Search crops or preferences"
            className="flex-1 ml-2 text-gray-800"
            value={searchQuery}
            onChangeText={onSearch}
        />
    </View>
);

const PriceTrends = () => (
    <View className="mb-4">
        <Text className="text-xl font-semibold text-gray-800 mb-2">
            Price Trends
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {["Wheat", "Rice", "Barley"].map((crop, index) => (
                <MotiView
                    from={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "timing", duration: 300, delay: index * 100 }}
                    key={index}
                    className="bg-green-100 p-4 rounded-2xl mr-2 shadow-sm"
                >
                    <Text className="text-lg font-medium text-gray-800">{crop}</Text>
                    <Text className="text-sm text-gray-600">Trending this week</Text>
                </MotiView>
            ))}
        </ScrollView>
    </View>
);

const TrendCard = ({ title, description, onSetAlert }) => (
    <TouchableOpacity
        activeOpacity={0.9}
        className="bg-white p-4 rounded-2xl mb-2 shadow-sm"
        onPress={onSetAlert}
    >
        <Text className="text-lg font-medium text-gray-800">{title}</Text>
        <Text className="text-sm text-gray-600 mb-2">{description}</Text>
        <Text className="text-sm text-green-500">Set SMS alert for tomorrow</Text>
    </TouchableOpacity>
);

const Preferences = ({ preferences, onSetAlert }) => (
    <View>
        <Text className="text-xl font-semibold text-gray-800 mb-2 mt-1">
            My Preferences
        </Text>
        {preferences.map((title, index) => (
            <PreferenceItem key={index} title={title} onSetAlert={onSetAlert} />
        ))}
    </View>
);

const PreferenceItem = ({ title, onSetAlert }) => (
    <TouchableOpacity
        activeOpacity={0.9}
        className="bg-white p-4 rounded-2xl mb-2 shadow-sm flex-row justify-between items-center"
        onPress={() => onSetAlert(title)}
    >
        <Text className="text-lg text-gray-800">{title}</Text>
        <Ionicons name="chevron-forward" size={22} color="#2D2958" />
    </TouchableOpacity>
);

const FooterButton = ({ onPress }) => (
    <TouchableOpacity
        activeOpacity={0.9}
        className="bg-green-500 p-2 rounded-full shadow-sm flex items-center justify-between mb-4 mt-2"
        onPress={onPress}
    >
        <Ionicons name="add" size={28} color="white" />
        <Text className="text-white font-semibold text-sm mt-1">Add Preference</Text>
    </TouchableOpacity>
);

export default HomeScreen;
