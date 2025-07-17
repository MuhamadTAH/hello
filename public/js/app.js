const socket = io();
const chatFeed = document.getElementById('chat-feed');
const messageInput = document.getElementById('message');
const sendBtn = document.getElementById('sendBtn');

sendBtn.addEventListener('click', () => {
  const msg = messageInput.value.trim();
  if (msg) {
    socket.emit('chatMessage', msg);
    messageInput.value = '';
  }
});

socket.on('chatMessage', data => {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerText = `${data.user}: ${data.text}`;
  chatFeed.appendChild(div);
  chatFeed.scrollTop = chatFeed.scrollHeight;
});
