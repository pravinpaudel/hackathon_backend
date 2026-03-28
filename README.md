# Cognitive Builder App Backend (MVP)

Minimal Node.js + Express + MongoDB backend for tracking mental check-ins and game performance, then computing a simple Cognitive Index (CI) for burnout risk.

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- dotenv

## Features

- Store daily mental check-ins (stress, mood)
- Store simple game performance (reaction time, accuracy)
- Compute Cognitive Index from latest check-in + latest game session
- Return status and recommendation message

## Project Structure

~~~text
src/
  app.js
  server.js
  config/
    db.js
  controllers/
    checkInController.js
    gameController.js
    resultController.js
  middlewares/
    logger.js
  models/
    User.js
    CheckIn.js
    GameSession.js
    CognitiveIndex.js
  routes/
    index.js
  services/
    normalizationService.js
    cognitiveIndexService.js
~~~

## Setup

### 1. Install dependencies

~~~bash
npm install
~~~

### 2. Create environment file

Copy .env.example to .env and update values if needed.

~~~env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/cognitive_builder
DUMMY_USER_ID=demo-user-1
~~~

### 3. Run server

Development mode:

~~~bash
npm run dev
~~~

Production-like start:

~~~bash
npm start
~~~

Server starts on http://localhost:5000

## API Endpoints

Base path: /api

### POST /api/checkin

Save a mental check-in.

Request body:

~~~json
{
  "stress": 4,
  "mood": 2
}
~~~

Rules:
- stress: 1 to 5
- mood: 1 to 5

### POST /api/game

Save a game session.

Request body:

~~~json
{
  "reactionTime": 320,
  "accuracy": 0.78
}
~~~

Rules:
- reactionTime: milliseconds, >= 0
- accuracy: 0 to 1

### GET /api/result

Fetches latest check-in and latest game session, computes CI, stores result, and returns:

~~~json
{
  "ciScore": 0.565,
  "status": "Drifting",
  "message": "You're getting tired. Take a short break."
}
~~~

If either check-in or game session is missing, returns 404 with an error message.

## Cognitive Index Formula

Normalization:
- stress and mood are normalized from 1-5 to 0-1
- mood contributes as negative signal: (1 - normalizedMood)
- accuracy contributes as performance signal: (1 - accuracy)

Step 1: compute daily score:

$$
CI_{today} = 0.5 \cdot stress + 0.3 \cdot (1 - mood) + 0.2 \cdot (1 - accuracy)
$$

Step 2: apply exponential moving average (EMA) with $\alpha = 0.7$:

$$
CI_{final} = 0.7 \cdot CI_{today} + 0.3 \cdot CI_{previous}
$$

If no previous CI exists, then $CI_{final} = CI_{today}$.

Status bands:
- 0.0 to <0.3: Stable
- 0.3 to <0.6: Drifting
- 0.6 to 1.0: Burnout Risk

Messages:
- Stable: You're doing well. Keep going!
- Drifting: You're getting tired. Take a short break.
- Burnout Risk: You may be experiencing burnout. Try a calming activity.

## Quick Demo with curl

### 1) Submit check-in

~~~bash
curl -X POST http://localhost:5000/api/checkin \
  -H "Content-Type: application/json" \
  -d '{"stress":4,"mood":2}'
~~~

### 2) Submit game session

~~~bash
curl -X POST http://localhost:5000/api/game \
  -H "Content-Type: application/json" \
  -d '{"reactionTime":320,"accuracy":0.78}'
~~~

### 3) Get result

~~~bash
curl http://localhost:5000/api/result
~~~

## Notes

- No authentication is included (MVP uses DUMMY_USER_ID).
- The User model exists for future extension but is not required in current endpoint flow.
- Basic request logging middleware is enabled.
