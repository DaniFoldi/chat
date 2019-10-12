const socket = io()

socket.on('message', data => {
  createMessage('other', data)
})

function createMessage(direction, data) {
  const message = document.createElement('p')
  message.classList.add('message')
  message.classList.add('message-' + direction)
  message.textContent = data
  document.getElementById('messages').appendChild(message)
}

function sendMessage() {
  socket.emit('message', document.getElementById('input').value)
  createMessage('my', document.getElementById('input').value)
  document.getElementById('input').value = ''
}

document.getElementById('send').addEventListener('click', () => {
  sendMessage()
})

document.getElementById('input').addEventListener('keydown', event => {
  console.log(event)
  if (!event.shiftKey && event.key === 'Enter') {
    sendMessage()
    event.preventDefault()
  }
})
