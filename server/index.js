const express = require('express');
require('dotenv').config();
const { json } = require('body-parser');
const massive = require('massive');
const session = require('express-session');
const ac = require('./authController');
const tc = require('./treasureController');
const auth = require('./middleware/authMiddleware');
const { CONNECTION_STRING, SESSION_SECRET } = process.env;

const app = express();
app.use(json());

app.use(session({
    secret: SESSION_SECRET,
    saveUninitialized: false,
    resave: true
}))
massive(CONNECTION_STRING).then(db => {
    app.set('db', db);
})

app.post('/auth/register', ac.register);
app.post('/auth/login', ac.login);
app.get('/auth/logout', ac.logout)

app.get('/api/treasure/dragon', tc.dragonTreasure);
app.get('/api/treasure/user', auth.usersOnly, tc.getMyTreasure);
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, tc.getAllTreasure);

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
})