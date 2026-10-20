import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const QuizContext = createContext(null)
function useQuiz() {
  const value = useContext(QuizContext)
  if (!value) throw new Error('Quiz context is unavailable')
  return value
}

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [registered, setRegistered] = useState(() => JSON.parse(localStorage.getItem('quizverse-registered') || '[]'))
  const [attempts, setAttempts] = useState(() => JSON.parse(localStorage.getItem('quizverse-attempts') || '[]'))
  const [answers, setAnswers] = useState({})
  const [question, setQuestion] = useState(0)
  const [seconds, setSeconds] = useState(480)
  const [quizzes, setQuizzes] = useState([])
  const [apiError, setApiError] = useState('')

  useEffect(() => {
    fetch('/api/quizzes')
      .then(response => { if (!response.ok) throw new Error('Quiz API is unavailable'); return response.json() })
      .then(setQuizzes)
      .catch(error => setApiError(error.message))
  }, [])

  useEffect(() => { localStorage.setItem('quizverse-registered', JSON.stringify(registered)) }, [registered])
  useEffect(() => { localStorage.setItem('quizverse-attempts', JSON.stringify(attempts)) }, [attempts])
  useEffect(() => {
    if (page !== 'quiz' || seconds <= 0) return
    const timer = setInterval(() => setSeconds(value => value - 1), 1000)
    return () => clearInterval(timer)
  }, [page, seconds])
  useEffect(() => { if (page === 'quiz' && seconds === 0) finish() }, [seconds])

  const activeQuiz = quizzes[0]
  const score = useMemo(() => activeQuiz.questions.reduce((total, item, index) => total + (answers[index] === item.answer ? 1 : 0), 0), [answers])
  const register = title => setRegistered(items => items.includes(title) ? items.filter(item => item !== title) : [...items, title])
  const start = () => { if (!activeQuiz?.questions?.length) return; setAnswers({}); setQuestion(0); setSeconds(activeQuiz.minutes * 60); setPage('quiz') }
  const finish = () => { setAttempts(items => [{ score, total: activeQuiz.questions.length, date: new Date().toLocaleDateString() }, ...items].slice(0, 5)); setPage('results') }
  const shared = { page, setPage, search, setSearch, category, setCategory, registered, register, attempts, answers, setAnswers, question, setQuestion, seconds, score, start, finish, activeQuiz, quizzes, apiError }

  return <QuizContext.Provider value={shared}>
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4"><button onClick={() => setPage('dashboard')} className="text-xl font-black text-indigo-700">QuizVerse</button><span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">React Hooks Demo</span></div></header>
      <nav className="mx-auto flex max-w-6xl gap-2 px-5 pt-5">{[['dashboard', 'Dashboard'], ['catalog', 'Explore quizzes'], ['leaderboard', 'Leaderboard']].map(([id, label]) => <button key={id} onClick={() => setPage(id)} className={`rounded-lg px-4 py-2 text-sm font-bold ${page === id ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600'}`}>{label}</button>)}</nav>
      <main className="mx-auto max-w-6xl px-5 py-8">{apiError && <p role="alert" className="mb-4 rounded-xl bg-rose-50 p-4 text-rose-700">{apiError}. Start the API with <code>npm run server</code>.</p>}{page === 'dashboard' && <Dashboard/>}{page === 'catalog' && <Catalog/>}{page === 'quiz' && activeQuiz?.questions?.length ? <Quiz/> : page === 'quiz' && <p>No quiz questions are available.</p>}{page === 'results' && <Results/>}{page === 'leaderboard' && <Leaderboard/>}</main>
    </div>
  </QuizContext.Provider>
}

function Dashboard() {
  const { attempts, registered, start, setPage } = useQuiz()
  const average = attempts.length ? Math.round(attempts.reduce((sum, item) => sum + item.score / item.total * 100, 0) / attempts.length) : 0
  return <><section className="rounded-3xl bg-slate-900 p-8 text-white"><p className="font-bold text-teal-300">INTERACTIVE LEARNING</p><h1 className="mt-2 text-4xl font-black">Ready to learn, Alex?</h1><p className="mt-3 max-w-xl text-slate-300">Use the quiz catalogue to search, filter, register, and complete a timed challenge.</p><button onClick={start} className="mt-6 rounded-xl bg-teal-500 px-5 py-3 font-bold">Start JavaScript quiz</button></section><section className="mt-6 grid gap-4 sm:grid-cols-3">{[[attempts.length, 'Quizzes completed'], [average + '%', 'Average score'], [registered.length, 'Registered quizzes']].map(([value, label]) => <div key={label} className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-3xl font-black text-indigo-700">{value}</p><p className="text-sm text-slate-500">{label}</p></div>)}</section><section className="mt-8 rounded-2xl bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="text-xl font-black">Recent activity</h2><p className="text-sm text-slate-500">Results are saved with localStorage.</p></div><button onClick={() => setPage('catalog')} className="font-bold text-indigo-700">Explore</button></div>{attempts.length ? attempts.map((item, i) => <p key={i} className="mt-3 border-t pt-3">JavaScript Essentials: {item.score}/{item.total} on {item.date}</p>) : <p className="mt-4 text-slate-500">No quiz attempts yet.</p>}</section></>
}

function Catalog() {
  const { search, setSearch, category, setCategory, registered, register, start, quizzes } = useQuiz()
  const categories = ['All', ...new Set(quizzes.map(item => item.category))]
  const visible = quizzes.filter(item => (category === 'All' || item.category === category) && item.title.toLowerCase().includes(search.toLowerCase()))
  return <><h1 className="text-3xl font-black">Explore quizzes</h1><p className="mt-2 text-slate-500">Search, filter, and register for a challenge.</p><input aria-label="Search quizzes" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search quizzes..." className="mt-6 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-600"/><div className="mt-4 flex flex-wrap gap-2">{categories.map(item => <button key={item} onClick={() => setCategory(item)} className={`rounded-full px-4 py-2 text-sm font-bold ${category === item ? 'bg-indigo-600 text-white' : 'bg-white ring-1 ring-slate-200'}`}>{item}</button>)}</div><div className="mt-6 grid gap-4 md:grid-cols-2">{visible.map(item => { const isRegistered = registered.includes(item.title); return <article key={item.id} className="rounded-2xl bg-white p-5 shadow-sm"><span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">{item.category}</span><h2 className="mt-4 text-xl font-black">{item.title}</h2><p className="mt-2 text-slate-500">{item.questions.length || 10} questions · {item.minutes} minutes</p><div className="mt-5 flex gap-2"><button onClick={() => register(item.title)} className="flex-1 rounded-xl border border-indigo-600 py-2 font-bold text-indigo-700">{isRegistered ? 'Registered ✓' : 'Register'}</button>{item.id === 1 && <button onClick={start} className="rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white">Start</button>}</div></article>})}</div>{!visible.length && <p className="mt-6 rounded-xl border border-dashed p-6 text-center text-slate-500">No quizzes match your search.</p>}</>
}

function Quiz() {
  const { activeQuiz, question, setQuestion, answers, setAnswers, seconds, finish, setPage } = useQuiz()
  const item = activeQuiz.questions[question]
  const time = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
  return <section className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-sm"><div className="flex justify-between"><button onClick={() => setPage('dashboard')} className="font-bold text-slate-500">← Exit</button><span className="font-bold text-amber-700">⏱ {time}</span></div><div className="mt-5 h-2 rounded bg-slate-200"><div className="h-2 rounded bg-teal-500" style={{width: `${(question + 1) / activeQuiz.questions.length * 100}%`}}/></div><p className="mt-6 text-sm font-bold text-indigo-700">QUESTION {question + 1} OF {activeQuiz.questions.length}</p><h1 className="mt-2 text-2xl font-black">{item.text}</h1><div className="mt-6 space-y-3">{item.options.map((option, index) => <button key={option} onClick={() => setAnswers({ ...answers, [question]: index })} className={`w-full rounded-xl border-2 p-4 text-left font-semibold ${answers[question] === index ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200'}`}>{String.fromCharCode(65 + index)}. {option}</button>)}</div><div className="mt-6 flex justify-between"><button disabled={!question} onClick={() => setQuestion(question - 1)} className="font-bold disabled:opacity-30">Previous</button>{question < activeQuiz.questions.length - 1 ? <button onClick={() => setQuestion(question + 1)} className="rounded-xl bg-indigo-600 px-5 py-2 font-bold text-white">Next</button> : <button onClick={finish} className="rounded-xl bg-teal-500 px-5 py-2 font-bold text-white">Submit</button>}</div></section>
}

function Results() { const { score, activeQuiz, start, setPage } = useQuiz(); const percent = Math.round(score / activeQuiz.questions.length * 100); return <section className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm"><p className="font-bold text-indigo-700">QUIZ COMPLETE</p><h1 className="mt-2 text-3xl font-black">Your score: {percent}%</h1><p className="mt-3 text-slate-600">{score} correct out of {activeQuiz.questions.length}</p><div className="mt-6 flex gap-3"><button onClick={start} className="flex-1 rounded-xl bg-indigo-600 py-3 font-bold text-white">Retry</button><button onClick={() => setPage('dashboard')} className="flex-1 rounded-xl border py-3 font-bold">Dashboard</button></div></section> }
function Leaderboard() { return <section className="rounded-2xl bg-white p-6 shadow-sm"><h1 className="text-3xl font-black">Leaderboard</h1><p className="mt-2 text-slate-500">Weekly top learners</p>{[['Aarav', 980], ['Meera', 925], ['Alex', 870], ['Riya', 840]].map(([name, points], index) => <div key={name} className="mt-4 flex justify-between border-t pt-4"><span className="font-bold">#{index + 1} {name}</span><span className="font-black text-indigo-700">{points} pts</span></div>)}</section> }
