function sendMessage() {
  const data = document.getElementById('input').value.trim()
  const message = Message.sent({
    message: data
  })
  if (Object.keys(replymessage).length > 0) {
    message.properties.replyuser = replymessage.user
    message.properties.replymessage = replymessage.message
    replymessage = {}
  }
  messages.push(message)
  message.preprocess()
  document.getElementById('messages').appendChild(message.render())
  message.postrender()
  socket.emit('message', message.properties)
  document.getElementById('input').value = ''
  document.getElementById('send').disabled = true
  document.getElementById('input').classList.forEach(el => {
    if (el.indexOf('line-') === 0)
      document.getElementById('input').classList.remove(el)
  })
  document.getElementById('input').classList.add('line-1')
}

document.getElementById('send').addEventListener('click', () => {
  sendMessage()
})

document.getElementById('input').addEventListener('keydown', event => {
  if (!event.shiftKey && event.key === 'Enter') {
    event.preventDefault()
    sendMessage()
  }
})

document.getElementById('input').addEventListener('input', () => {
  document.getElementById('input').classList.forEach(el => {
    if (el.indexOf('line-') === 0)
      document.getElementById('input').classList.remove(el)
  })
  let lineCount = Math.min(Math.ceil((document.getElementById('input').scrollHeight - 16) / 18), 3)
  document.getElementById('input').classList.add(`line-${lineCount}`)
  if (document.getElementById('input').value.trim().length === 0) {
    document.getElementById('send').disabled = true
  } else {
    document.getElementById('send').disabled = false
  }
})
