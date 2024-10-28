import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, ScrollView } from 'react-native';
import axios from 'axios';

const QuizListScreen = ({ navigation, route }) => {
  const { username } = route.params;
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get('http://ip_address:port/quizzes'); 
        setQuizzes(response.data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };

    fetchQuizzes();
  }, []);

  const renderItem = ({ item }) => (
    <View style={{ padding: 20 }}>
      <Text style={{ color: "green", fontSize: 20, textAlign: "center", padding: 5 }}>
        {item.title} ({item.type})
      </Text>
      <Button
        title="Take Quiz"
        onPress={() => navigation.navigate('QuizScreen', { quizId: item._id, username })}
      />
    </View>
  );

  return (
    <ScrollView style={{ flex: 1 }}>
      <View>
        <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 35, color: "green", padding: 20 }}>
          Available Quizzes
        </Text>
        <FlatList
          data={quizzes}
          keyExtractor={(quiz) => quiz._id}
          renderItem={renderItem}
         
          scrollEnabled={false} 
        />
      </View>
    </ScrollView>
  );
};

export default QuizListScreen;
