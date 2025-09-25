import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import PrivateVendorScreen from "@/screens/market/PrivateVendorScreen";
import PublicVendorScreen from "@/screens/market/PublicVendorScreen";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ServiceScreen from "@/screens/market/ServiceScreen";

const Tab = createMaterialTopTabNavigator();

export default function MarketScreen() {
  return (
    <View className="flex-1 mt-5">
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            shadowColor: "transparent",
            elevation: 0,
            marginTop: 25,
            backgroundColor: "transparent",
          },
          tabBarIndicatorStyle: {
            backgroundColor: "green",
            borderRadius: 1,
            width: 60,
            marginLeft: 35,
          },
          tabBarLabelStyle: {
            display: "none",
          },
          tabBarActiveTintColor: "green",
          tabBarInactiveTintColor: "gray",
        }}
      >
        <Tab.Screen
          name="Public"
          component={PublicVendorScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="storefront-outline" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Service"
          component={ServiceScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="construct-outline" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Private"
          component={PrivateVendorScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="business-outline" size={24} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
}
