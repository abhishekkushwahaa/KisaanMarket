import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const messagesData = [
    { id: "1", text: "Hello, how are you?", sender: "received" },
    { id: "2", text: "I'm good, thanks! How about you?", sender: "sent" },
    { id: "3", text: "I'm doing great, ready for the meeting!", sender: "received" },
];

const ChatScreen = () => {
    const [message, setMessage] = useState("");

    const sendMessage = () => {
        if (message.trim()) {
            setMessage("");
        }
    };

    const renderMessage = ({ item }) => (
        <View
            key={item.id}
            className={`mb-2 flex-row ${item.sender === "sent" ? "justify-end" : "justify-start"}`}
        >
            {item.sender === "sent" ? (
                <View
                    className={`max-w-3/4 p-4 rounded-lg bg-green-600`}
                >
                    <Text className="text-base text-white">{item.text}</Text>
                </View>
            ) : (
                <View
                    className={`max-w-3/4 p-4 rounded-lg bg-gray-200`}
                >
                    <Text className="text-base text-gray-800">{item.text}</Text>
                </View>
            )}
        </View>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-gray-100"
        >
            <View className="flex-1 mt-10">
                <FlatList
                    data={messagesData}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMessage}
                    contentContainerStyle={{ padding: 10 }}

                />
                <View className="flex-row p-2 bg-gray-100 border-t border-gray-100 items-center">
                    <TextInput
                        value={message}
                        onChangeText={setMessage}
                        placeholder="Type a message..."
                        className="flex-1 p-3 bg-gray-200 rounded-lg text-gray-800 text-lg"
                    />
                    <TouchableOpacity onPress={sendMessage} className="ml-2 p-3 bg-green-600 rounded-full">
                        <FontAwesome name="send" size={22} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default ChatScreen;
