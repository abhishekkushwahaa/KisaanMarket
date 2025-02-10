import React, { useState, useEffect } from "react";
import { ArrowLeft, Send, Circle, Bot } from "lucide-react-native";
import { View, Text, FlatList, TouchableOpacity, TextInput, BackHandler, Platform, KeyboardAvoidingView } from "react-native";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY);

const chats = [
    { id: "1", name: "AI Assistant", lastMessage: "Ask me anything!", time: "Just now", unread: 0, isGemini: true },
    { id: "2", name: "Raj Kumar", lastMessage: "Price update?", time: "10:30 AM", unread: 2 },
    { id: "3", name: "Amit Sharma", lastMessage: "Thanks!", time: "9:15 AM", unread: 0 },
    { id: "4", name: "Sunil Maurya", lastMessage: "Will check the rates.", time: "Yesterday", unread: 1 },
];

const ChatScreen = ({ chat, onBack }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (chat.isGemini && messages.length === 0) {
            setMessages([{
                id: "1",
                text: "Hello! I'm Gemini. How can I help you today?",
                sender: "other",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        }
    }, [chat.isGemini]);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            onBack();
            return true;
        });
        return () => backHandler.remove();
    }, []);

    const sendMessage = async () => {
        if (!input.trim()) return;

        // Add user message
        const userMessage = {
            id: Date.now().toString(),
            text: input,
            sender: "me",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");

        if (chat.isGemini) {
            // Add typing indicator
            setIsTyping(true);

            try {
                const model = genAI.getGenerativeModel({ model: "gemini-pro" });
                const result = await model.generateContent(input);
                const response = await result.response;
                const text = response.text();

                // Add Gemini response
                setMessages(prev => [...prev, {
                    id: Date.now().toString() + "-gemini",
                    text: text,
                    sender: "other",
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
            } catch (error) {
                console.error("API Error:", error);
                setMessages(prev => [...prev, {
                    id: Date.now().toString() + "-error",
                    text: "Sorry, I couldn't process your request.",
                    sender: "other",
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
            } finally {
                setIsTyping(false);
            }
        }
    };

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="mt-10 pb-2 flex-row items-center px-4">
                <TouchableOpacity onPress={onBack} className="p-2 -ml-2">
                    <ArrowLeft size={24} color="#16a34a" />
                </TouchableOpacity>
                <View className="ml-4">
                    <Text className="text-green-600 text-lg font-semibold">{chat.name}</Text>
                    <View className="flex-row items-center">
                        <Circle size={12} color="#16a34a" fill="#16a34a" />
                        <Text className="text-green-400 text-sm ml-2">
                            {isTyping ? "Typing..." : "Online"}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Messages list */}
            <FlatList
                data={messages}
                renderItem={({ item }) => (
                    <View className={`mx-4 my-1 ${item.sender === "me" ? "items-end" : "items-start"}`}>
                        <View className={`p-3 rounded-xl ${
                            item.sender === "me"
                                ? "bg-[#D9FDD3] rounded-br-none"
                                : "bg-white rounded-bl-none"
                        }`}
                              style={{
                                  maxWidth: '75%',
                                  elevation: 2,
                                  shadowColor: '#000',
                                  shadowOpacity: 0.1,
                                  shadowRadius: 4,
                                  shadowOffset: { width: 0, height: 2 }
                              }}>
                            <Text className="text-[#111B21] text-base">{item.text}</Text>
                            <Text className={`text-[#667781] text-xs mt-1 ${item.sender === "me" ? "text-right" : ""}`}>
                                {item.time}
                            </Text>
                        </View>
                    </View>
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingVertical: 16 }}
            />

            {/* Input area */}
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <View className="flex-row items-center">
                    <TextInput
                        className="flex-1 bg-[#F0F2F5] rounded-2xl p-4 m-2 text-[#111B21] text-base"
                        placeholder="Type a message"
                        placeholderTextColor="#667781"
                        value={input}
                        onChangeText={setInput}
                        onSubmitEditing={sendMessage}
                    />
                    <TouchableOpacity
                        onPress={sendMessage}
                        className={`p-3 mr-2 rounded-full ${input.trim() ? "bg-green-600" : "bg-gray-400"}`}
                        disabled={!input.trim()}
                    >
                        <Send size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const ChatListScreen = () => {
    const [selectedChat, setSelectedChat] = useState(null);

    return (
        <View className="flex-1 bg-white">
            {selectedChat ? (
                <ChatScreen
                    chat={selectedChat}
                    onBack={() => setSelectedChat(null)}
                />
            ) : (
                <>
                    <View className="bg-white mt-10 px-4 shadow-sm">
                        <Text className="text-[#111B21] text-2xl font-bold">Chats</Text>
                    </View>

                    <FlatList
                        data={chats}
                        className="flex-1"
                        contentContainerStyle={{ paddingVertical: 8 }}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                className="flex-row items-center px-4 py-2 bg-white"
                                onPress={() => setSelectedChat(item)}
                            >
                                <View className="bg-green-600 w-12 h-12 rounded-full items-center justify-center">
                                    <Text className="text-white text-lg font-medium uppercase text-center mb-1">
                                        {item.isGemini ? <Bot size={28} color="white" /> : item.name[0]}
                                    </Text>
                                </View>

                                <View className="flex-1 ml-4 border-b border-gray-100 pb-3">
                                    <View className="flex-row justify-between items-center">
                                        <Text className="text-[#111B21] font-semibold text-base">{item.name}</Text>
                                        <Text className="text-[#667781] text-xs">{item.time}</Text>
                                    </View>
                                    <View className="flex-row justify-between items-center mt-1">
                                        <Text
                                            className="text-[#667781] text-sm flex-1 mr-2"
                                            numberOfLines={1}
                                        >
                                            {item.lastMessage}
                                        </Text>
                                        {item.unread > 0 && (
                                            <View className="bg-green-600 w-5 h-5 rounded-full items-center justify-center">
                                                <Text className="text-white text-xs">{item.unread}</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </>
            )}
        </View>
    );
};

export default ChatListScreen;