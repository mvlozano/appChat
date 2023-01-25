# Global Chat Project
[![Run on Repl.it](`https://urlshortener-microservice.mvlozano.repl.co/`)

## About
Implementation for a Global Chat using Web Sockets.

## Technologies
A little bit of what's inside the project:
- **Node.js** and **Express** to create the server and handle routes, requests and responses.
- **Mongoose** to persist all the data.
- **Socket IO** to handle Web Sockets Events

## Endpoints:

Endpoints | Description | Params
----------|-------------|-------------
GET `/messages` | Returns all messages| none
GET `'/messages/:user'` | Returns all messages from the specified user | *user (via params)
POST `/messages` | Saves a new message and emit the event message on the socket| *message (via body)
DELETE `/messages` | Deletes all messages| none

## How to use:
Be sure to change the `uri` variable in `database.js` according to your own MongoDB server. It's also possible to just create a `.env` file and store this information there in order to keep it hidden and safe. Then, just run on terminal:
```
npm install
npm start
```

