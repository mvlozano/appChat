const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require('cors');
require('dotenv').config();

//Database configuration
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const dbUrl = process.env.MONGO_URI;
mongoose.connect(dbUrl, (err) => {
    console.log('mongo db connection', err);
});
const Message = mongoose.model('Message', {
    name: String,
    message: String
});

const PORT = process.env.PORT || 3000;

//Middlewares
//Serves static files
app.use(express.static(__dirname));
//Parser for requests body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//Allow requests from other domains
app.use(cors());

//Returns all messages
app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    });
});

//Returns messages from the specified user
app.get('/messages/:user', (req, res) => {
    const user = req.params.user;
    Message.find({ name: user }, (err, messages) => {
        res.send(messages);
    });
});

//Send a new message, saves it and emit the event message on the socket
app.post('/messages', async (req, res) => {
    try {
        let message = new Message(req.body);
        let savedMessage = await message.save();
        console.log('saved');
        let censored = await Message.findOne({ message: 'badword' });
        if (censored) {
            await Message.deleteOne({ _id: censored._id });
        } else {
            io.emit('message', req.body);
            res.sendStatus(200);
        }
    } catch (error) {
        res.sendStatus(500);
        return console.error(error);
    } finally {
        console.log('message post called');
    }
});

//Deletes all messages
app.delete('/messages', async (req, res) => {
    try {
        await Message.deleteMany({});
    } catch (error) {
        res.sendStatus(500);
        return console.error(error);
    } finally {
        console.log('messages deleted');
    }
});

//On connection event logs it
io.on('connection', (socket) => {
    console.log('a user connected');
});

//Starts listening for requests
const server = http.listen(PORT, () => {
    console.log('server listening on port', PORT);
});