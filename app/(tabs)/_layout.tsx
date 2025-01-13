import { Feather, Fontisto } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";
import { Home, HeartHandshake, UserRoundCog } from 'lucide-react-native';

interface TabBarIconProps {
  size: number;
  color: string;
  focused: boolean;
}

export default function _layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#f7f7f7",
          marginBottom: 2,
          paddingTop: 8,
          height: 60,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarActiveTintColor: "#22c55e",
        tabBarInactiveTintColor: "#6b7280",
        tabBarIcon: ({ color }: TabBarIconProps) => {
          if (route.name === "index") {
            return <Home color={color} size={24} />;
          } else if (route.name === "search/index") {
            return <Feather name="search" color={color} size={24} />;
          } else if (route.name === "market/index") {
            return (
              <View
                style={{
                  width: 70,
                  height: 60,
                  marginBottom: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <HeartHandshake size={35} color={color} />
              </View>
            );
          } else if (route.name === "chat/index") {
            return <Fontisto name="hipchat" size={21} color={color} />
          } else if (route.name === "profile/index") {
            return <UserRoundCog color={color} size={25} />;
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
