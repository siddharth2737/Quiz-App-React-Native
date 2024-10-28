import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';

const QuizScreen = ({ route, navigation }) => {
  const { quizId, username } = route.params; 

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({});
  const [timeLeft, setTimeLeft] = useState(60); 

  const handleOptionPress = (questionIndex, option) => {
    setAnswers({ ...answers, [questionIndex]: option });
    setSelectedOptions({ ...selectedOptions, [questionIndex]: option });
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) {
        Alert.alert('Error', 'Quiz ID is not available.');
        return;
      }

      try {
        const response = await axios.get(`http://ip_address:port/quizzes/${quizId}`);
        setQuiz(response.data);
      } catch (error) {
        console.error('Error fetching quiz:', error);
        Alert.alert('Error', 'Failed to fetch quiz. Please try again.');
      }
    };

    fetchQuiz();
  }, [quizId]);

  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); 
  }, []);
    
  const handleSubmit = async () => {
    try {
      const response = await axios.post(`http://ip_address:port/quizzes/${quizId}/submit`, {
        answers: Object.values(answers),
        username, 
      });
      Alert.alert('Your Score', `You scored: ${response.data.score}`);
      navigation.navigate('ResultScreen', { quizId, username, score: response.data.score }); 
    } catch (error) {
      console.error('Error submitting answers:', error);
      Alert.alert('Error', 'Failed to submit answers. Please try again.');
    }
  };

  if (!quiz) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <View style={{ paddingLeft: 200 }}>
        <Button
          color="green"
          title="View Leaderboard"
          onPress={() => navigation.navigate('Leaderboard', { quizId })}
        />
      </View>

      <Text style={{ fontSize: 25, textAlign: 'center', padding: 20, fontWeight: 'bold', paddingBottom: 30 }}>
        {quiz.title}
      </Text>

      <Text style={{ fontSize: 20, color: 'red', textAlign: 'center', paddingBottom: 20 }}>
        Time Left: {timeLeft} seconds
      </Text>

      {quiz.questions.map((q, index) => (
        <View key={index} style={{ marginBottom: 20 }}>
          <Text style={{ paddingBottom: 20, fontSize: 20 }}>{q.question}</Text>
          {q.options.map((option, idx) => (
            <TouchableOpacity
              key={idx}
              style={{
                backgroundColor: selectedOptions[index] === option ? 'blue' : 'gray',
                padding: 10,
                marginBottom: 10,
                borderRadius: 5,
              }}
              onPress={() => handleOptionPress(index, option)}
            >
              <Text style={{ color: 'white' }}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <View style={{ paddingTop: 20, padding: 40, paddingBottom: 20 }}>
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};

export default QuizScreen;
