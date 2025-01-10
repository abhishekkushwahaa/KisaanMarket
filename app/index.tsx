import React from 'react';
import ScreenNavigator from '@/screens/ScreenNavigator';
import { SafeAreaView, ScrollView } from 'react-native';

export default function App() {
  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="flex-1"
      >
        <ScreenNavigator />
      </ScrollView>
    </SafeAreaView>
  );
}
