const express = require('express');
const app = express();
const ejs = require('ejs');
const socketIO = require('socket.io');
const cookieParser = require('cookie-parser');
const fs = require('./lib/fsDeal');

//controllers
const chatController = require('./controllers/chatController');
const loginController = require('./controllers/loginController');

//middlewares
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use('/assets', express.static('public'));

//routes
app.get('/', loginController.GET);
app.post('/', loginController.POST);
app.get('/chat', chatController);

const server = app.listen(process.env.PORT || 9000);

//users
const allUsers = new fs('../models/user.json');

//sockets
const io = socketIO(server);

io.on('connection', (socket) => {
    socket.on('new-user', (name) => {
        const users = JSON.parse(allUsers.read());
        users.push(name);
        const members = users.length;
        allUsers.write(users);
        socket.broadcast.emit('joined-user', { name, members });
    });

    socket.on('new-message', ({ name, message }) => {
        socket.broadcast.emit('new-user-message', { name, message });
        socket.broadcast.emit('user-not-typing', { name });
    });

    socket.on('typing', (name) => {
        socket.broadcast.emit('typing-user', { name });
    });

    socket.on('not-typing', (name) => {
        socket.broadcast.emit('user-not-typing', { name });
    });

    socket.on('disconnect', () => {
        const users = JSON.parse(allUsers.read());
        users.pop();
        allUsers.write(users);
    });
});
