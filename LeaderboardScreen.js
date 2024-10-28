import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import axios from 'axios';

const LeaderboardScreen = ({ route }) => {
  const { quizId } = route.params; 
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        
        const response = await axios.get(`http://ip_address:port/quizzes/${quizId}/leaderboard`);
        setLeaderboard(response.data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, [quizId]);

  return (
    <View>
      <Text style={{fontSize:30, textAlign:"center", fontWeight:"bold", color:"green",paddingBottom:30}}>Leaderboard</Text>
      {leaderboard.length === 0 ? (
        <Text style={{fontSize:20, textAlign:"center"}}>No scores available yet.</Text>
      ) : (
        <FlatList style={{marginTop:20}}
          data={leaderboard}
          renderItem={({ item }) => (
            <Text style={{fontSize:30, textAlign:'center', paddingBottom:10, color:"gray"}}>{item.username} :- {item.score}</Text>
          )}
          keyExtractor={(item) => item._id}
        />
      )}
    </View>
  );
};

export default LeaderboardScreen;
