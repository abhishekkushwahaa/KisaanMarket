import { Feather, Ionicons, Octicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function _layout() {
  return (
    <Tabs
      screenOptions={({ route }) => {
        return {
          tabBarIcon: ({ color }) => {
            let iconName;
            if (route.name === "index") {
              iconName = (
                <Feather
                  name="home"
                  color={color}
                />
              );
            } else if (route.name === "search/index") {
              iconName = (
                <Feather
                  name="book-open"
                  color={color}
                />
              );
            } else if (route.name === "add/index") {
              iconName = (
                <Ionicons
                  name="document-text-outline"
                  color={color}
                />
              );
            } else if (route.name === "chat/index") {
              iconName = (
                <Octicons
                  name="person"
                  color={color}
                />
              );
            } else if (route.name === "profile/index") {
              iconName = (
                <Octicons
                  name="person"
                  color={color}
                />
              );
            }
            return iconName;
          },
        };
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="search/index" />
      <Tabs.Screen name="add/index" />
      <Tabs.Screen name="chat/index" />
      <Tabs.Screen name="profile/index" />
    </Tabs >
  );
}
