import express from 'express'
import cors from 'cors'

const app = express()
const port = Number(process.env.PORT || 3001)
app.use(cors())
app.use(express.json())

let quizzes = [
  { id: 1, title: 'JavaScript Essentials', category: 'Programming', minutes: 8, questions: [
    { text: 'Which keyword creates a block-scoped variable?', options: ['var', 'let', 'const and let', 'define'], answer: 2 },
    { text: 'What does === compare?', options: ['Only values', 'Values and types', 'Only types', 'Object keys'], answer: 1 },
    { text: 'Which method adds an item to an array end?', options: ['shift()', 'push()', 'pop()', 'unshift()'], answer: 1 }
  ]},
  { id: 2, title: 'Calculus Foundations', category: 'Mathematics', minutes: 12, questions: [] },
  { id: 3, title: 'Solar System Explorer', category: 'Science', minutes: 10, questions: [] },
  { id: 4, title: 'World Facts Challenge', category: 'General Knowledge', minutes: 7, questions: [] }
]
let nextId = Math.max(...quizzes.map(quiz => quiz.id)) + 1
const findQuiz = id => quizzes.find(quiz => quiz.id === Number(id))

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
app.get('/api/quizzes', (_req, res) => res.json(quizzes))
app.get('/api/quizzes/:id', (req, res) => {
  const quiz = findQuiz(req.params.id)
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' })
  res.json(quiz)
})
app.post('/api/quizzes', (req, res) => {
  const { title, category, minutes, questions = [] } = req.body || {}
  if (typeof title !== 'string' || !title.trim() || typeof category !== 'string' || !category.trim() || !Number.isInteger(minutes) || minutes < 1 || !Array.isArray(questions)) {
    return res.status(400).json({ error: 'title, category, positive integer minutes, and questions array are required' })
  }
  const quiz = { id: nextId++, title: title.trim(), category: category.trim(), minutes, questions }
  quizzes.push(quiz)
  res.status(201).json(quiz)
})
app.put('/api/quizzes/:id', (req, res) => {
  const quiz = findQuiz(req.params.id)
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' })
  const { title, category, minutes, questions } = req.body || {}
  if (typeof title !== 'string' || !title.trim() || typeof category !== 'string' || !category.trim() || !Number.isInteger(minutes) || minutes < 1 || !Array.isArray(questions)) {
    return res.status(400).json({ error: 'title, category, positive integer minutes, and questions array are required' })
  }
  Object.assign(quiz, { title: title.trim(), category: category.trim(), minutes, questions })
  res.json(quiz)
})
app.delete('/api/quizzes/:id', (req, res) => {
  const quiz = findQuiz(req.params.id)
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' })
  quizzes = quizzes.filter(item => item.id !== quiz.id)
  res.status(200).json({ message: 'Quiz deleted', id: quiz.id })
})
app.use((err, _req, res, _next) => {
  if (err instanceof SyntaxError && 'body' in err) return res.status(400).json({ error: 'Invalid JSON request body' })
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})
app.listen(port, () => console.log(`QuizVerse API listening at http://localhost:${port}`))
