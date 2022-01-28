const socket = io();
const messages = document.getElementById('messages');
const azolar = document.getElementById('members');
const input = document.getElementById('input');
const typing = document.querySelector('.typing');

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

    if (input.value) {
        const DIV = document.createElement('div');
        DIV.textContent = input.value;
        DIV.classList.add('messageSent');
        DIV.classList.add('msg');
        messages.appendChild(DIV);
        socket.emit('new-message', { name, message: input.value });
        input.value = '';
    }
});

socket.on('new-user-message', ({ name, message }) => {
    typing.textContent = '';
    const DIV = document.createElement('div');
    DIV.textContent = message;
    DIV.classList.add('messageReceived');
    DIV.classList.add('msg');
    messages.appendChild(DIV);

    const SPAN = document.createElement('span');
    SPAN.textContent = name;
    SPAN.classList.add('timestamp');
    DIV.appendChild(SPAN);
});

input.addEventListener('keyup', (e) => {
    if (input.value.length < 10 || (input.value > 25 && input.value < 50)) {
        socket.emit('typing', { name });
    } else {
        socket.emit('not-typing', { name });
    }
});

socket.on('typing-user', ({ name: { name: userName } }) => {
    typing.textContent = userName + ' is typing';
});

socket.on('user-not-typing', ({ name }) => {
    typing.textContent = '';
});

console.log(typing);
