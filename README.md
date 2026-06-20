# Online Quiz Application

## Assignment 2 Group Project

This project is a full-stack single-player online quiz application built with the **MERN stack**. Users can register, log in, complete randomised quiz attempts, receive a score, review completed attempts in detail, view their quiz history, and compare results on a leaderboard. Admin users can manage quiz questions through a protected admin interface.

The application implements the required core quiz mechanics plus our approved group-specific variation: **Review mode after completion**.

---

## Approved Game Mechanic Variation

### Review Mode After Completion

Our selected and implemented variation is **Review mode after completion**.

After a user submits a quiz, the application displays the final score and provides a **Review attempt** option. Review mode allows the user to inspect the completed attempt question-by-question, including:

- the original question text
- the user's selected answer
- the correct answer
- whether the user was correct or incorrect
- an explanation for the question, where available

This goes beyond a simple final-score screen because the user can reflect on their mistakes and understand why each answer was correct or incorrect.

---

## Feature Summary

### Player Features

- User registration and login
- JWT-based authenticated sessions
- Protected quiz, history, review, and leaderboard access
- Randomised quiz questions for each attempt
- Quiz submission with backend score calculation
- Final score display after submission
- Review mode after completion
- Persistent quiz history
- Leaderboard based on each user's best attempt
- Dark mode toggle persisted in `localStorage`
- Clear loading and error feedback during quiz fetching and submission

### Admin Features

- Protected admin panel
- Admin-only route access using role-based authorisation
- Create quiz questions
- Edit existing questions
- Delete questions
- Activate/deactivate questions
- Bulk import questions
- Manage optional explanations used by review mode

### Security, Validation, and Reliability Features

- Backend quiz marking so correct answers are not exposed to the frontend during quiz-taking
- Password hashing with `bcrypt`
- JWT authentication for protected routes
- Admin middleware for admin-only endpoints
- Rate limiting on login and quiz submission endpoints
- `helmet` middleware for safer HTTP headers
- Request sanitisation middleware
- Server-side validation for submitted data
- Consistent API response format for success and error states

---

## Bonus and Polish Features

The application includes several additional features and polish improvements that support the bonus criteria.

### UI/UX Polish

- Clean separation between quiz-taking, result display, history, leaderboard, and review screens
- Clear result card shown immediately after quiz submission
- Review page uses correct/incorrect indicators so users can quickly understand their performance
- Quiz history provides a clear path back to previous attempts
- Leaderboard gives users a comparative view of high-performing attempts
- Dark mode improves usability and is persisted after refresh using `localStorage`
- Player-facing and admin-facing pages use consistent styling patterns

### Thoughtful Extension of the Approved Variation

The approved variation is not implemented as a temporary result screen only. Instead, completed attempts are saved in the database, allowing users to return to previous attempts and review them later.

This makes review mode more meaningful because users can:

- review immediately after finishing a quiz
- revisit past attempts through quiz history
- compare selected answers against correct answers
- read explanations attached to questions
- use mistakes as learning feedback

### Error Handling and User Feedback

The application includes user-facing feedback and backend safeguards, including:

- validation errors for invalid inputs
- protected route handling for unauthenticated users
- admin route blocking for non-admin users
- error responses using a consistent API envelope
- loading/error handling when quiz questions fail to load
- submission error handling when quiz submission fails
- rate limiting feedback for repeated login or submission attempts

---

## Tech Stack

### Frontend

- React
- React Router
- Axios
- React Context + `useReducer` for quiz state management
- React Hook Form + Zod for form validation
- CSS files for page-specific styling
- `localStorage` for dark mode persistence

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT authentication
- bcrypt password hashing
- express-rate-limit
- helmet
- custom request sanitisation middleware

---

## Project Structure

```txt
backend/
  controllers/
    auth.controller.js
    quiz.controller.js
    leaderboard.controller.js
    admin.controller.js

  middleware/
    auth.middleware.js
    admin.middleware.js
    rateLimit.middleware.js
    sanitize.middleware.js

  models/
    User.js
    Question.js
    Score.js

  routes/
    auth.routes.js
    quiz.routes.js
    leaderboard.routes.js
    admin.routes.js

  config/
    db.js

  server.js

frontend/
  src/
    api/
      api.js
      quizApi.js

    components/
      AuthPage.js
      Quiz.js
      QuizHistory.js
      QuizReview.js
      Leaderboard.js

    context/
      QuizContext.js

    pages/
      Home.js
      Admin.js

    App.js
    App.css
```

---

## Database Models

### User

Stores registered users and their role.

```js
{
  username: String,
  password: String,
  role: "user" | "admin"
}
```

Passwords are hashed before being stored, so plaintext passwords are not saved in the database.

### Question

Stores quiz questions.

```js
{
  questionText: String,
  options: [String],
  correctAnswer: Number,
  explanation: String,
  isActive: Boolean
}
```

The `explanation` field directly supports the **review mode after completion** variation by giving users feedback after they complete an attempt.

The `isActive` field allows admins to disable questions without permanently deleting them.

### Score

Stores completed quiz attempts.

```js
{
  userId: ObjectId,
  score: Number,
  totalQuestions: Number,
  answers: [
    {
      questionId: ObjectId,
      selectedAnswer: Number,
      isCorrect: Boolean
    }
  ]
}
```

The full answer list is stored so that users can review completed attempts later. This is important for the variation because review mode depends on reconstructing the user's completed attempt, not just displaying a score.

---

## API Response Format

All API responses use a consistent envelope. This makes frontend error handling easier and keeps API behaviour predictable.

### Success

```json
{
  "success": true,
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "error": "Error message"
}
```

---

## Main API Routes

### Authentication

```txt
POST /api/auth/register
POST /api/auth/login
```

### Quiz

```txt
GET /api/quiz/questions
POST /api/quiz/submit
GET /api/quiz/history
GET /api/quiz/review/:scoreId
```

### Leaderboard

```txt
GET /api/leaderboard
```

### Admin

```txt
GET /api/admin/questions
POST /api/admin/questions
PUT /api/admin/questions/:id
DELETE /api/admin/questions/:id
PUT /api/admin/questions/:id/toggle
POST /api/admin/questions/import
```

---

## Key Design Decisions

### 1. Backend Marking

Quiz marking is performed on the backend. The frontend only sends the selected answer indexes, while the backend retrieves the correct answers from MongoDB and calculates the score.

This design prevents users from inspecting frontend data or network responses during quiz-taking to access the answer key.

### 2. Persistent Review Mode

Completed quiz attempts are stored in the `Score` model, including the full list of selected answers. This allows the review page to reconstruct each completed attempt and show the selected answer, correct answer, correctness status, and explanation.

This makes the review mode variation persistent rather than temporary. Users can review an attempt immediately after submission or later from quiz history.

### 3. Randomised Questions

Questions are shuffled on the backend before being sent to the frontend. This means different attempts can present questions in a different order, reducing predictability and making repeated attempts more engaging.

### 4. Authentication and Route Protection

JWT authentication is used to protect quiz history, review, quiz submission, and admin routes. Admin routes also require the authenticated user to have the `admin` role.

This separates normal player functionality from administrative functionality.

### 5. Rate Limiting

Rate limiting is applied to login and quiz submission endpoints. This helps reduce brute-force login attempts and repeated spam submissions.

### 6. Dark Mode Persistence

The application includes a dark mode toggle stored in `localStorage`. This means the user's selected theme remains after refreshing the page.

### 7. Consistent API Envelope

All API responses follow a consistent success/error structure. This reduces duplicated frontend logic and makes error handling more predictable.

---

## Installation and Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd COMP4347_ASS2
```

---

## Backend Setup

### 1. Install backend dependencies

```bash
cd backend
npm install
```

### 2. Create `.env`

Create a `.env` file in the `backend` folder:

```env
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
```

### 3. Start backend server

```bash
npm run dev
```

The backend should run on:

```txt
http://localhost:5000
```

---

## Frontend Setup

### 1. Install frontend dependencies

```bash
cd frontend
npm install
```

### 2. Start frontend

```bash
npm start
```

The frontend should run on:

```txt
http://localhost:3000
```

The frontend API base URL is:

```txt
http://localhost:5000/api
```

---

## How to Use the App

### As a Player

1. Register a new account or log in.
2. Start a quiz.
3. Select one answer for each question.
4. Submit the quiz.
5. View the final score.
6. Click **Review attempt** to see selected answers, correct answers, correctness indicators, and explanations.
7. View previous attempts in **History**.
8. View rankings in **Leaderboard**.
9. Toggle dark mode if preferred.

### As an Admin

1. Log in with an admin account.
2. Open the admin panel.
3. Create, edit, activate/deactivate, delete, or bulk import questions.
4. Add explanations to questions so they appear in review mode.
5. Ensure questions are marked as active if they should appear in quiz attempts.

---

## Testing Checklist

The following behaviours were tested during development:

### Authentication and Access Control

- Register new user
- Login existing user
- Logout user
- Protected routes redirect/block unauthenticated users
- Admin routes block non-admin users
- Admin routes allow admin users

### Quiz Flow

- Load quiz questions
- Questions are randomised
- User can select answers
- User can submit quiz answers
- Backend calculates score correctly
- Final score is displayed after submission
- Duplicate/invalid submissions are handled appropriately

### Review Mode Variation

- Review attempt link appears after quiz completion
- Completed attempt can be reviewed later
- Review page displays question text
- Review page displays selected answer
- Review page displays correct answer
- Review page displays correct/incorrect status
- Review page displays explanations where available

### History and Leaderboard

- User can view quiz history
- User can open a previous attempt from history
- Leaderboard displays user rankings
- Leaderboard uses each user's best attempt

### Admin Functionality

- Admin can create questions
- Admin can edit questions
- Admin can delete questions
- Admin can activate/deactivate questions
- Admin can bulk import questions
- Active questions can appear in quiz attempts

### UI/UX and Error Handling

- Dark mode persists after refresh
- Invalid inputs return validation errors
- Login rate limiter works
- Quiz submit rate limiter works
- Frontend displays loading states where appropriate
- Frontend displays error states where appropriate
- API errors follow the consistent response envelope

---

## Group Variation Demonstration

The implemented variation is **Review mode after completion**.

This is demonstrated through:

- the result card shown after quiz submission
- the **Review attempt** link after completing a quiz
- the quiz history page listing previous attempts
- the review page displaying:
  - question text
  - selected answer
  - correct answer
  - correct/incorrect status
  - explanation, where available

This satisfies the required game mechanic variation because users can inspect their completed quiz attempt after submission rather than only seeing a final score.

---