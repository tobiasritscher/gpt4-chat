import React, {useState, useEffect} from 'react';
import {
    SafeAreaView,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Text,
    KeyboardAvoidingView,
    Platform,
    StyleSheet, View,
} from 'react-native';
import {ActivityIndicator} from "react-native-web";
import Markdown from 'react-native-markdown-text';

const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const YOUR_API_KEY = ''

const ChatScreen = ({navigation, route}) => {
    const [message, setMessage] = useState(route.params.firstMessage ?? '');
    const [messages, setMessages] = useState([{
        role: 'system',
        content: route.params.instructions,
    }]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        navigation.setOptions({ headerTitle: route.params.title, });
        if (route.params.firstMessage) {
            sendMessage();
        }
    }, []);

    const sendMessage = async () => {
        if (message.trim()) {
            const newMessage = {role: 'user', content: message};
            setMessages(prevMessages => [...prevMessages, newMessage]);
            setIsLoading(true);

            try {
                const response = await fetch(API_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${YOUR_API_KEY}`,
                    },
                    body: JSON.stringify({
                        messages: [...messages, newMessage],
                        max_tokens: 1000,
                        temperature: 0,
                        n: 1,
                        model: 'gpt-4',
                    }),
                });

                const {choices} = await response.json();
                const answer = choices[0].message.content.trim();
                setMessages(prevMessages => [...prevMessages, {role: 'assistant', content: answer}]);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }

            setMessage('');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.messages}>
                {messages.filter(msg => {
                    return msg.role !== 'system'
                }).map((message, index) => (
                    <View key={index}
                          style={[styles.message, message.role === 'user' ? styles.userMessage : styles.botMessage]}>
                        <Text style={styles.messageText}>{message.content}</Text>
                    </View>
                ))}
            </ScrollView>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.inputContainer}
            >
                <TextInput
                    style={styles.input}
                    value={message}
                    onChangeText={setMessage}
                    placeholder=""
                    onSubmitEditing={sendMessage}
                    multiline={true}
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff"/>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        padding: 10,
    },
    message: {
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        marginRight: 15,
        marginTop: 15,
        maxWidth: '80%',
    },
    apiMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#ECECEC',
        borderRadius: 5,
        marginBottom: 10,
        marginLeft: 15,
        marginTop: 15,
        padding: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#007b4f',
    },
    botMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#4d4d4d',
        borderRadius: 5,
        marginBottom: 10,
        marginLeft: 15,
        marginTop: 15,
    },
    messageText: {
        fontSize: 16,
        color: '#ffffff',
    },
    input: {
        flex: 1,
        backgroundColor: '#ECECEC',
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    sendButton: {
        backgroundColor: '#34B7F1',
        borderRadius: 25,
        marginLeft: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    sendButtonText: {
        color: '#FFFFFF',
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ChatScreen;