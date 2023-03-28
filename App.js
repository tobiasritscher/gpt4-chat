import React, {useRef, useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {ActivityIndicator} from "react-native-web";

const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const YOUR_API_KEY = ''

const App = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([{role: 'system', content: 'Du bisch än hilfriche assistänt, wo mich dutzt und nume uf züridütsch schriebt. Min Name isch Tobi'}]);
  const [isLoading, setIsLoading] = useState(false);

  const handleMessage = async () => {
    if (message.trim() === '') {
      return;
    }

    const newMessage = { role: 'user', content: message };
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
          max_tokens: 2000,
          temperature: 0.2,
          n: 1,
          model: 'gpt-4',
        }),
      });

      const { choices } = await response.json();
      const answer = choices[0].message.content.trim();
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: answer }]);
    } catch (error) {
      console.error(error);
    } finally {
    setIsLoading(false);
    }

    setMessage('');
  };

  return (
      <View style={stylesTwo.container}>
        <View style={stylesTwo.messages}>
          {messages.filter( msg => {
            return msg.role !== 'system'
          }).map((message, index) => (
              <View key={index} style={[stylesTwo.message, message.role === 'user' ? stylesTwo.userMessage : stylesTwo.botMessage]}>
                <Text style={stylesTwo.messageText}>{message.content}</Text>
              </View>
          ))}
        </View>
        <View style={stylesTwo.inputContainer}>
          <TextInput
              style={stylesTwo.input}
              placeholder="Type your message"
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={handleMessage}
          />
          <TouchableOpacity style={stylesTwo.button} onPress={handleMessage}>
            <Text style={stylesTwo.buttonText}>Send</Text>
          </TouchableOpacity>
        </View>
        {isLoading && (
            <View style={stylesTwo.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
        )}
      </View>
  );
};

const stylesTwo = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messages: {
    flex: 1,
    width: '100%',
    padding: 10,
    marginTop: 20,
  },
  message: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#d2edfc',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
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

export default App;
