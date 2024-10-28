import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen'; 
import QuizListScreen from './QuizListScreen'; 
import QuizScreen from './QuizScreen'; 
import LeaderboardScreen from './LeaderboardScreen'; 
import ResultScreen from './ResultScreen'; 


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="QuizList" component={QuizListScreen} />
        <Stack.Screen name="QuizScreen" component={QuizScreen} />
        <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
        <Stack.Screen name="ResultScreen" component={ResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
