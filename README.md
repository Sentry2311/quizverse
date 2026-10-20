# QuizVerse Experiment 4 REST API

## Aim and project choice
QuizVerse demonstrates REST API development and testing with Node.js and Express. The supplied Experiment 4 handout describes an Event Management System, and explicitly permits using a student's own project topic; this implementation uses QuizVerse quizzes as the CRUD resource. The React frontend fetches and displays the catalogue from the API.

## Run locally
Requires Node.js 18 or newer.

```sh
npm install
npm run server
```

In a second terminal:

```sh
npm run dev
```

Open the Vite URL shown in the terminal and choose **Explore quizzes**. The API listens on `http://localhost:3001`; Vite proxies `/api` requests to it. Data is held in memory and resets when the API process restarts.

## API endpoints

| Method | Endpoint | Success | Purpose |
| --- | --- | --- | --- |
| GET | `/api/quizzes` | 200 | Return all quizzes as JSON |
| GET | `/api/quizzes/:id` | 200 | Return one quiz; 404 if absent |
| POST | `/api/quizzes` | 201 | Create a quiz |
| PUT | `/api/quizzes/:id` | 200 | Replace a quiz; 404 if absent |
| DELETE | `/api/quizzes/:id` | 200 | Delete a quiz; 404 if absent |

POST and PUT accept JSON with `title` (nonempty string), `category` (nonempty string), `minutes` (positive integer), and `questions` (array). Invalid input returns 400 with a JSON `error` field. Responses use `application/json`.

## Postman
Import [`postman/quizverse.postman_collection.json`](postman/quizverse.postman_collection.json) into Postman and run `npm run server` first. The collection covers list, detail, create, update, delete, invalid body (400), and unknown ID (404); tests assert the response codes. The create request saves its generated ID for the update and delete requests.

For the handout's screenshot evidence, capture each request's method, endpoint, status and response in Postman. Required captures: GET all, GET by ID, POST, PUT, DELETE, invalid request. Also capture the browser's **Explore quizzes** page while the API is running to show frontend data fetched from the server. These are manual Postman/browser captures; screenshots are not included as if they had been created here.

## Theory answers

1. **API:** An interface that lets software systems exchange requests and data through defined operations.
2. **RESTful API:** An HTTP API organized around resources, using resource URLs and standard HTTP methods, typically returning JSON.
3. **REST principles:** Client-server separation, stateless requests, cacheable responses where appropriate, a uniform interface, layered architecture, and optional code-on-demand.
4. **HTTP methods:** GET reads a resource; POST creates a resource; PUT replaces or updates a resource; DELETE removes it.
5. **Express.js:** A Node.js web framework that provides middleware, routing, and HTTP request/response helpers.
6. **Routing:** Mapping an HTTP method and URL pattern to a handler.
7. **`req` and `res`:** `req` contains the incoming request; `res` builds and sends the server's response.
8. **`req.params` and `req.body`:** `req.params` contains URL path values such as `:id`; `req.body` contains parsed submitted data.
9. **JSON:** JavaScript Object Notation, a text format for structured data that is portable and easy for web clients to parse.
10. **Status codes:** 200 means success; 201 means created; 400 means invalid request; 404 means resource not found; 500 means unexpected server failure.
11. **Postman:** An API client used to compose requests, set headers and bodies, inspect responses, and automate assertions.
12. **Postman body and headers:** The body carries submitted data; headers carry metadata such as `Content-Type: application/json`.
13. **CRUD:** Create, Read, Update, Delete; in this API they map to POST, GET, PUT, and DELETE.
14. **Middleware:** A function that runs during the request/response pipeline. `express.json()` parses JSON bodies, while CORS middleware allows the browser frontend to call the API.

## Important code snippets

Express server, JSON and CORS middleware, GET list, POST, route parameters, PUT, DELETE, JSON responses, validation, and error handling are implemented in [`server/index.js`](server/index.js). The frontend fetches `/api/quizzes` in [`src/App.jsx`](src/App.jsx), then renders the returned collection in its catalogue.

```js
app.use(cors())
app.use(express.json())
app.get('/api/quizzes/:id', (req, res) => {
  const quiz = findQuiz(req.params.id)
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' })
  res.json(quiz)
})
```

## Result
QuizVerse exposes quiz CRUD endpoints with JSON responses and appropriate 200, 201, 400, and 404 status codes. Its frontend catalogue retrieves and displays quiz data from the Express API. Import and run the included Postman collection to verify the endpoint behavior.

Repository: https://github.com/Sentry2311/quizverse
Postman collection: `postman/quizverse.postman_collection.json`
