import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

const HomeScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');

  const handleStartQuiz = () => {
    if (!username) {
      Alert.alert('Error', 'Please enter your username');
      return;
    }
    navigation.navigate('QuizList', { username });
  };

  return (
    <View style={{paddingTop:130}}>
    <View style={{ padding: 20}}>
      <Text style={{ fontSize: 24, textAlign:"center" }}>Welcome to the Quiz App</Text>
      <TextInput
        placeholder="Enter your username"
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, padding: 10, marginVertical: 20, borderRadius:20 }}
      />
      <Button title="Start Quiz" onPress={handleStartQuiz} />
    </View>
    </View>
  );
};

export default HomeScreen;
