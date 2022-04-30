const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//get user name and room from URL
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

// Join chat room
socket.emit('joinRoom', {username, room});

//get room and users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputRoomUser(users);
})

//Message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //Scroll down
    chatMessage.scrollTop = chatMessage.scrollHeight;
});


// MEssage submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    //get message text
    const msg = e.target.elements.msg.value;

    //console.log(msg);
    socket.emit('chatMessage', msg);

    //Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

//Output message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML =`<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}


// Add room name to DOM
function outputRoomName(room){
    roomName.innerText = room;
}

// Add users to dom
function outputRoomUser(users){
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}