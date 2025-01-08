import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import Login from "@/app/(tabs)/screens/Login";
import ScreenNavigator from "@/app/(tabs)/screens/ScreenNavigator";

export default function App() {
    return (
        <SafeAreaView className="flex-1">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <ScreenNavigator />
            </ScrollView>
        </SafeAreaView>
    );
}