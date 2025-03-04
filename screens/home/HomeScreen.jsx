import React, { useState, useEffect } from "react";
import {
    ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity,
    Modal,
    ActivityIndicator,
    TextInput,
    FlatList
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import avatar from "@/assets/images/avatar.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";
import { MotiView } from "moti";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";

const WeatherCard = () => {
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [location, setLocation] = useState(null);

    const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

    useEffect(() => {
        const fetchLocationAndWeather = async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    setError("Location permission denied");
                    setLoading(false);
                    return;
                }

                let loc = await Location.getCurrentPositionAsync({});
                setLocation(loc.coords);

                const response = await axios.get(
                    `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${loc.coords.latitude},${loc.coords.longitude}&days=5&aqi=no&alerts=no`
                );

                setWeather(response.data);
                setForecast(response.data.forecast.forecastday.slice(1, 5));
            } catch (error) {
                console.error("Error fetching weather data:", error);
                setError("Unable to fetch weather data");
            } finally {
                setLoading(false);
            }
        };

        fetchLocationAndWeather();
    }, []);

    return (
        <View className="bg-white p-5 rounded-2xl mb-2">
            {loading ? (
                <ActivityIndicator size="large" color="#4A90E2" />
            ) : error ? (
                <Text className="text-red-600 text-sm">{error}</Text>
            ) : weather ? (
                <>
                    <View className="flex-row items-center mb-4">
                        <Image
                            source={{ uri: `https:${weather.current.condition.icon}` }}
                            style={{ width: 60, height: 60, marginRight: 10 }}
                        />
                        <View className="flex-1">
                            <Text className="text-xl font-bold text-gray-900">
                                {weather.location.name} |{" "}
                                {new Date(weather.location.localtime).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "short",
                                })}
                            </Text>
                            <Text className="text-2xl font-extrabold text-green-600 mt-1">
                                {weather.current.temp_c}°C
                            </Text>
                            <Text className="text-lg text-gray-700 mt-1">
                                {weather.current.condition.text} | 🌧{" "}
                                {weather.forecast.forecastday[0].day.daily_chance_of_rain}%
                            </Text>
                        </View>
                    </View>

                    <Text className="text-lg font-medium text-gray-700 mb-2">Next 4 Days</Text>
                    <FlatList
                        data={forecast}
                        keyExtractor={(item) => item.date}
                        horizontal
                        renderItem={({ item }) => (
                            <View className="bg-green-100 p-3 rounded-lg mx-2 items-center">
                                <Text className="text-md font-medium text-gray-700">
                                    {new Date(item.date).toLocaleDateString("en-US", {
                                        weekday: "short",
                                        day: "numeric",
                                        month: "short",
                                    })}
                                </Text>
                                <Image
                                    source={{ uri: `https:${item.day.condition.icon}` }}
                                    style={{ width: 40, height: 40 }}
                                />
                                <Text className="text-sm font-semibold text-gray-800">
                                    {item.day.avgtemp_c}°C | 🌧 {item.day.daily_chance_of_rain}%
                                </Text>
                            </View>
                        )}
                        showsHorizontalScrollIndicator={false}
                    />
                </>
            ) : (
                <Text className="text-gray-600 text-sm">No data available</Text>
            )}
        </View>
    );
};


const HomeScreen = () => {
    const [userName, setUsername] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [preferences, setPreferences] = useState([
        "Wheat prices",
        "Rice prices",
        "Market prices for wheat",
        "Track barley prices",
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [newPreference, setNewPreference] = useState("");
    const navigation = useNavigation();

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

    useEffect(() => {
        fetchUserData();
    }, []);

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
                    <Header userName={userName} navigation={navigation} />
                    <PriceTrends />
                    <TrendCard
                        title="Crop comparison"
                        description="Analyze crop price variations"
                    />
                    <TrendCard
                        title="Price update notifications"
                        description="Stay informed, act quickly"
                    />
                    <WeatherCard/>
                    <Preferences preferences={preferences} />
                    <FooterButton onPress={() => setModalVisible(true)} />
                </ScrollView>
            )}

            {/* Add Preference Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/50">
                    <MotiView
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "timing", duration: 300 }}
                        className="bg-white p-6 rounded-2xl w-4/5"
                    >
                        <Text className="text-lg font-semibold text-gray-800 mb-4">
                            Add New Preference
                        </Text>
                        <TextInput
                            className="bg-gray-100 p-4 rounded-lg mb-4"
                            placeholder="Enter crop or market name"
                            value={newPreference}
                            onChangeText={setNewPreference}
                            autoFocus={true}
                        />
                        <View className="flex-row justify-end space-x-4 gap-2">
                            <TouchableOpacity
                                className="bg-red-100 px-4 py-2 rounded-lg"
                                onPress={() => setModalVisible(false)}
                            >
                                <Text className="text-red-600 font-medium">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="bg-green-600 px-4 py-2 rounded-lg"
                                onPress={handleAddPreference}
                            >
                                <Text className="text-white font-medium ">Add</Text>
                            </TouchableOpacity>
                        </View>
                    </MotiView>
                </View>
            </Modal>

            <Toast />
        </View>
    );
};

const Header = ({ userName, navigation }) => {
    const handleSearchNavigation = () => {
        try {
            navigation.navigate("SearchScreen");
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Navigation Error",
                text2: "Search screen is not available.",
            });
        }
    };

    return (
        <View className="flex-row justify-between items-center mb-2">
            <View className="flex-row items-center">
                <Image source={avatar} className="w-14 h-14 rounded-full mr-3" />
                <Text className="text-xl font-extrabold text-gray-800">
                    Welcome, {userName || "User"}!
                </Text>
            </View>
            <View className="flex-row space-x-4 gap-2">
                <TouchableOpacity activeOpacity={0.9} onPress={handleSearchNavigation}>
                    <Ionicons name="search-outline" size={28} color="#2D2958" />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.9} onPress={() => {}}>
                    <Ionicons name="notifications-outline" size={28} color="#2D2958" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

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

const TrendCard = ({ title, description }) => (
    <View className="bg-white p-4 rounded-2xl mb-2 shadow-sm">
        <Text className="text-lg font-medium text-gray-800">{title}</Text>
        <Text className="text-sm text-gray-600 mb-2">{description}</Text>
    </View>
);

const Preferences = ({ preferences }) => (
    <View>
        <Text className="text-xl font-semibold text-gray-800 mb-2 mt-1">
            My Preferences
        </Text>
        {preferences.map((title, index) => (
            <PreferenceItem key={index} title={title} />
        ))}
    </View>
);

const PreferenceItem = ({ title }) => (
    <View className="bg-white p-4 rounded-2xl mb-2 shadow-sm">
        <Text className="text-lg text-gray-800">{title}</Text>
    </View>
);

const FooterButton = ({ onPress }) => (
    <TouchableOpacity
        activeOpacity={0.9}
        className="bg-green-500 p-3 rounded-full shadow-sm flex-row items-center justify-center mb-4 mt-2"
        onPress={onPress}
    >
        <Ionicons name="add" size={28} color="white" />
        <Text className="text-white font-semibold text-lg ml-2">Add Preference</Text>
    </TouchableOpacity>
);

export default HomeScreen;
