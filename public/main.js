const socket = io()

socket.on('message', data => {
  createMessage('other', data)
})

function createMessage(direction, data) {
  const message = document.createElement('p')
  message.classList.add('message')
  message.classList.add('message-' + direction)
  const md = window.markdownit()
var result = md.render(data);
  message.innerHTML = result
  document.getElementById('messages').appendChild(message)
}

document.getElementById('send').addEventListener('click', () => {
  socket.emit('message', document.getElementById('input').value)
  createMessage('my', document.getElementById('input').value)
  document.getElementById('input').value = ''
})
