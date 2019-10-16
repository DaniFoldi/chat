const socket = io()
const md = markdownit({
  linkify: true
})

let emojireplacements = {};

(async function() {
  const raw = await fetch('emojis.json')
  emojireplacements = await raw.json()
}())

const emoji_regex = /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])+$/
let wasAlreadyConnected = false

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
  for (let keyword in emojireplacements) {
    data = data.replace(new RegExp(keyword, 'g'), emojireplacements[keyword])
  }
  if (emoji_regex.test(data)) { // TODO: fix to work with all emojis
    message.classList.add('message-emoji')
    message.innerHTML = data
  } else {
    message.innerHTML = md.render(data)
  }
  document.getElementById('messages').appendChild(message)
}

function sendMessage() {
  const message = document.getElementById('input').value.replace(/\n/g, '\n\n')
  socket.emit('message', message)
  displayMessage('my', message)
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

socket.on('disconnect', () => {
  displayMessage('special', 'Connection lost')
})

socket.on('connect', () => {
  if (wasAlreadyConnected) {
    displayMessage('special', 'Connection restored')
  } else {
    displayMessage('special', 'Connected')
    wasAlreadyConnected = true
  }
})
