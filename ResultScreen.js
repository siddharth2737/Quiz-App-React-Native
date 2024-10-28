import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ScrollView } from 'react-native';
import axios from 'axios';

const ResultScreen = ({ route }) => {
  const { quizId, username, score } = route.params; 
  const [leaderboard, setLeaderboard] = useState([]);
  const [quizData, setQuizData] = useState([]);
  const [userPosition, setUserPosition] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`http://ip_address:port/quizzes/${quizId}/leaderboard`);
        setLeaderboard(response.data);

        
        const position = response.data.findIndex(item => item.username === username);
        setUserPosition(position + 1); 
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    const fetchQuizData = async () => {
      try {
        const response = await axios.get(`http://ip_address:port/quizzes/${quizId}`); 
        setQuizData(response.data.questions); 
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };

    fetchLeaderboard();
    fetchQuizData();
  }, [quizId, username]);

  return (
    <ScrollView style={{ flex: 1 }}>
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 30, textAlign: "center", fontWeight: "bold", color: "green", paddingBottom: 0 }}>
        Your Score: {score}
      </Text>

      {userPosition !== null && (
        <Text style={{ fontSize: 24, textAlign: "center", paddingBottom: 5 }}>
          Your Position: {userPosition} {userPosition === 1 ? '(1st)' : userPosition === 2 ? '(2nd)' : userPosition === 3 ? '(3rd)' : 'th'}
        </Text>
      )}

      <Text style={{ fontSize: 30,  fontWeight: "bold", marginTop: 10 }}>
        Leaderboard
      </Text>
      {leaderboard.length === 0 ? (
        <Text>No scores available yet.</Text>
      ) : (
        <FlatList
          style={{ marginTop: 20 }}
          data={leaderboard}
          renderItem={({ item }) => (
            <Text style={{ fontSize: 30, textAlign: 'center', paddingBottom: 10, color: "gray" }}>
              {item.username} : {item.score}
            </Text>
          )}
          keyExtractor={(item) => item._id}
        />
      )}

      <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 30 }}>Answers and Explanations:</Text>
      {quizData.length > 0 ? (
        <FlatList
          data={quizData}
          keyExtractor={(item) => item.question}
          renderItem={({ item }) => (
            <View style={{ padding: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>{item.question}</Text>
              <Text style={{ color: 'green' }}>Correct Answer: {item.answer}</Text>
              <Text style={{ color: 'gray' }}>Explanation: {item.explanation}</Text>
            </View>
          )}
        />
      ) : (
        <Text>No answers available for this quiz.</Text>
      )}
    </View>
    </ScrollView>
  );
};

export default ResultScreen;
