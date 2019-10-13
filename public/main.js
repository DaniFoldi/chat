const socket = io()
const md = markdownit({
  linkify: true
})

socket.on('message', data => {
  displayMessage('other', data)
})

socket.on('special', data => {
  displayMessage('special', data)
})

function displayMessage(type, data) {
  const message = document.createElement('div')
  message.classList.add('message')
  message.classList.add('message-' + type)
  message.innerHTML = md.render(data)
  document.getElementById('messages').appendChild(message)
}

function sendMessage() {
  socket.emit('message', document.getElementById('input').value)
  displayMessage('my', document.getElementById('input').value)
  document.getElementById('input').value = ''
  document.getElementById('input').rows = 1
  document.getElementById('send').disabled = true
}

document.getElementById('send').addEventListener('click', () => {
  sendMessage()
})

document.getElementById('input').addEventListener('keydown', event => {
  if (!event.shiftKey && event.key === 'Enter') {
    sendMessage()
    event.preventDefault()
  }
})

document.getElementById('input').rows = 1
document.getElementById('input').addEventListener('input', event => {
  const lineCount = Math.min(3, event.target.value.split('\n').length)
  event.target.rows = lineCount
  if (document.getElementById('input').value.trim().length === 0) {
    document.getElementById('send').disabled = true
  } else {
    document.getElementById('send').disabled = false
  }
})
