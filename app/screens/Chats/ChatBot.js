import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import axios from 'axios';

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const CHAT_API_KEY = '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';
  const url = 'https://api.openai.com/v1/engines/text-davinci-002/completions';
  const [textInput, setTextInput] = useState('');

  const handleSend = async (newMessage) => {
    /*  const prompt = textInput;
    const resonse = await axios.post(
      url,
      {
        prompt: prompt,
        max_tokens: 1024,
        temperature: 0.5,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${CHAT_API_KEY}`,
        },
      }
    );
    const text = resonse.data.choices[0].text;
    setMessages([
      ...messages,
      { type: 'user', text: textInput },
      { type: 'bot', text: text },
    ]);
    setTextInput('');*/
    try {
      //get the user´s message
      const userMessage = newMessage[0];

      //Add the user´s message to the messages state
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, userMessage)
      );
      const messageText = userMessage.text.toLowerCase();
      const keywords = ['recipe', 'food', 'diet', 'fruit'];
      if (!keywords.some((keyword) => messageText.includes(keyword))) {
        //if the message does not contain any food-related keywords, respond wuth
        const botMessage = {
          _id: new Date().getTime() + 1,
          text: 'Hola amiguete',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Food Bot',
          },
        };
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, botMessage)
        );
        return;
      }

      const response = await axios.post(
        'https://api.openai.com/v1/engines/text-davinci-002/completions',
        {
          prompt: `Hola no se que es esto ${messageText}`,
          max_tokenss: 1200,
          temperature: 0.2,
          n: 1,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CHAT_API_KEY}`,
          },
        }
      );
      console.log(response.data);

      const recipe = response.data.choices[0].text.trim();
      const botMessage = {
        _id: new Date().getTime() + 1,
        text: recipe,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Food Bot',
        },
      };

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, botMessage)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: 'blue',
          padding: 10,
          alignItems: 'center',
          justifyContent: 'center',
          borderBottomWidth: 1,
          marginTop: 40,
          marginBottom: 5,
        }}
      >
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white' }}>
          Food Bot
        </Text>
      </View>
      <GiftedChat
        messages={messages}
        onSend={(newMessage) => handleSend(newMessage)}
        user={{ _id: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
