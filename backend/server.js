require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());


const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Mongodb is connected');
  })
  .catch(err => {
    console.error('Mongodb connection error:', err);
  });


const quizSchema = new mongoose.Schema({
  title: String,
  questions: [{
    question: String,
    options: [String],
    answer: String,
    explanation: String 
  }],
});

const leaderboardSchema = new mongoose.Schema({
  quizId: String,
  username: String,
  score: Number,
});

const Quiz = mongoose.model('Quiz', quizSchema);
const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

// Create a new quiz
app.post('/quizzes', async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.send(quiz);
  } catch (error) {
    res.status(500).send({ message: 'Error creating quiz' });
  }
});

// Get all quizzes
app.get('/quizzes', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.send(quizzes);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching quizzes' });
  }
});

// Get a specific quiz by id
app.get('/quizzes/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).send({ message: 'Quiz not found' });
    }
    res.send(quiz);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching quiz' });
  }
});

// Submit answers for a quiz
app.post('/quizzes/:id/submit', async (req, res) => {
  const { answers, username } = req.body;
  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    return res.status(404).send({ message: 'Quiz not found' });
  }

  let score = 0;

  quiz.questions.forEach((question, index) => {
    if (question.answer === answers[index]) {
      score++;
    }
  });

  try {
    const leaderboardEntry = new Leaderboard({ quizId: req.params.id, username, score });
    await leaderboardEntry.save();
    res.send({ score });
  } catch (error) {
    res.status(500).send({ message: 'Error saving score' });
  }
});

// Get leaderbaord for a specific quiz

app.get('/quizzes/:id/leaderboard', async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find({ quizId: req.params.id }).sort({ score: -1 }).limit(10);
    res.send(leaderboard);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching leaderboard' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
