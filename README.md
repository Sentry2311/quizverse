# QuizVerse - Experiment 3: React Hooks and State Management

## Aim
Develop an interactive online quiz platform using React Hooks and State Management. The project demonstrates `useState`, `useEffect`, `createContext`, and `useContext` for local state, side effects, and shared application state.

## Project features
- Responsive dashboard, leaderboard, and mobile navigation
- Search and category filtering for quizzes
- Registration/unregistration status for each quiz
- Interactive, timed JavaScript quiz with answer navigation
- Conditional rendering of quiz, result, dashboard, and empty-search views
- Automatic scoring and result summary
- Browser localStorage persistence for registrations and quiz attempts

## React concepts demonstrated

| Requirement | Implementation |
| --- | --- |
| `useState()` | Manages current page, quiz answer selections, timer, search term, filter, registration list, and result history. |
| `useEffect()` | Runs the countdown timer and persists registered quiz state in `localStorage`. |
| `createContext()` | Creates `QuizContext` for shared application state. |
| `useContext()` | `useQuizApp()` provides shared state and update functions to dashboard, catalogue, quiz, and results components. |
| Event handling | Button clicks register/unregister users, change quiz questions, select answers, filter categories, and submit a quiz. |
| Conditional rendering | Shows each page by selected navigation state, search empty state, registered status, and quiz completion result. |

## Important code snippets

### Shared state with Context API
```jsx
const QuizContext = createContext(null)

function useQuizApp() {
  const context = useContext(QuizContext)
  if (!context) throw new Error('useQuizApp must be used inside QuizContext')
  return context
}
```

### Local state and registration update
```jsx
const [registered, setRegistered] = useState(() =>
  JSON.parse(localStorage.getItem('quizverse-registered') || '["JavaScript Essentials"]')
)

const register = (title) => setRegistered(current =>
  current.includes(title)
    ? current.filter(item => item !== title)
    : [...current, title]
)
```

### Side effect and persistent storage
```jsx
useEffect(() => {
  localStorage.setItem('quizverse-registered', JSON.stringify(registered))
}, [registered])
```

### Search and category filtering
```jsx
const visible = catalog.filter(item =>
  (filter === 'All' || item.category === filter) &&
  item.title.toLowerCase().includes(search.toLowerCase())
)
```

## Run locally
```bash
npm install
npm run dev
```

## Technology
React, Vite, Tailwind CSS, Lucide React, browser localStorage.

## Theory answers

1. **React Hooks** are functions that let functional components use React features such as state and lifecycle behavior.
2. **`useState()`** stores component data that can change and causes the UI to re-render when it updates.
3. A normal variable does not trigger a re-render; React state does.
4. **`useEffect()`** runs side-effect logic after rendering, such as timers, API calls, or localStorage updates.
5. It executes after the component renders, based on its dependency array.
6. The dependency array controls when an effect runs again.
7. **`useContext()`** reads a value supplied by a React context.
8. The **Context API** shares data between components without manually passing it through every level of props.
9. **Prop drilling** is passing props through components that do not need them only to reach a child component.
10. Context avoids prop drilling by making shared values available to subscribed components.
11. **State management** is organizing, reading, and updating data that affects an application's UI.
12. Local state belongs to one component; shared/global state is used by multiple components.
13. **Conditional rendering** displays different UI based on a condition or state value.
14. React compares the new virtual UI after a state update and efficiently updates the affected DOM.
15. Hooks make reusable stateful behavior possible in functional components without classes.

## Note
This is a front-end academic project. It uses locally defined quiz data and browser storage, so it does not require a backend server for demonstration.
