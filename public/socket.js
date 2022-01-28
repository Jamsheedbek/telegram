const socket = io();
const messages = document.getElementById('messages');
const azolar = document.getElementById('members');
const input = document.getElementById('input');

const name = document.cookie
    .split('; ')
    .filter((e) => e.includes('username'))[0]
    .slice(9);

socket.emit('new-user', { name });

const DIV = document.createElement('div');
DIV.textContent = 'you joined';
DIV.classList.add('new-join');
messages.appendChild(DIV);

socket.on('joined-user', ({ name: { name: userName }, members }) => {
    azolar.textContent = members + ' members';
    const DIV = document.createElement('div');
    DIV.textContent = userName + ' joined';
    DIV.classList.add('new-join');
    messages.appendChild(DIV);
});

const form = document.getElementById('form');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const DIV = document.createElement('div');
    DIV.textContent = input.value;
    DIV.classList.add('messageSent');
    DIV.classList.add('msg');
    messages.appendChild(DIV);
    socket.emit('new-message', { name, message: input.value });
    input.value = '';
});

socket.on('new-user-message', ({ name, message }) => {
    const DIV = document.createElement('div');
    DIV.textContent = message;
    DIV.classList.add('messageReceived');
    DIV.classList.add('msg');
    messages.appendChild(DIV);
});

input.addEventListener('keyup', (e) => {
    socket.emit('typing', { name });
});

socket.on('typing-user', ({ name }) => {
    const typing = document.querySelector('.typing');
    typing.textContent = name + ' is typing';
});
