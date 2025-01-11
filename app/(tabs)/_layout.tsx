import { Feather, Ionicons, Octicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function _layout() {
  return (
      <Tabs
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
              backgroundColor: "#f7f7f7",
              marginBottom: 5,
              paddingTop: 10,
              height: 70,
              justifyContent: 'center',
            },
            tabBarIcon: ({ color, size }) => {
              if (route.name === "index") {
                return <Feather name="home" color={color} size={24} />;
              } else if (route.name === "search/index") {
                return <Feather name="search" color={color} size={24} />;
              } else if (route.name === "market/index") {
                return (
                    <View
                        style={{
                          width: 70,
                          height: 50,
                          marginBottom: 15,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                    >
                      <Ionicons
                          name="add"
                          color={color}
                          size={50}
                      />
                    </View>
                );
              } else if (route.name === "chat/index") {
                return <Ionicons name="chatbubble" color={color} size={24} />;
              } else if (route.name === "profile/index") {
                return <Octicons name="person" color={color} size={24} />;
              }
            },
          })}
      >
        <Tabs.Screen name="index" options={{ tabBarLabel: "Home" }} />
        <Tabs.Screen name="search/index" options={{ tabBarLabel: "Search" }} />
        <Tabs.Screen name="market/index" options={{ tabBarLabel: "Market" }} />
        <Tabs.Screen name="chat/index" options={{ tabBarLabel: "Chat" }} />
        <Tabs.Screen name="profile/index" options={{ tabBarLabel: "Profile" }} />
      </Tabs>
  );
}
