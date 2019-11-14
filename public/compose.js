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
  if (document.getElementById('timing').value !== 'none') {
    message.properties.timing = parseInt(document.getElementById('timing').value)
    setTimeout(() => {
      message.delete()
    }, message.properties.timing * 1000)
  }
  parseCommands(message)
  messages.push(message)
  message.preprocess()
  document.getElementById('messages').appendChild(message.render())
  message.postrender()
  socket.emit('message', message.properties)
  document.querySelectorAll('.message-replying').forEach((el, i) => {
    el.classList.remove('message-replying')
  })
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

function parseCommands(message) {
  if (message.properties.message[0] === "!" && message.properties.message[1] === "!") {
    message.properties.message = message.properties.message.substr(1)
    return
  }
  if (message.properties.message[0] === "!") {
    if (message.properties.message.split(' ')[0] === '!shrug') {
      message.properties.message = message.properties.message.split(' ')
      message.properties.message.shift()
      message.properties.message.push('¯\\\\_(ツ)\\_/¯')
      message.properties.message = message.properties.message.join(' ')
      return
    }
    if (message.properties.message.split(' ')[0] === '!lenny') {
      message.properties.message = message.properties.message.split(' ')
      message.properties.message.shift()
      message.properties.message.push('( ͡° ͜ʖ ͡°)')
      message.properties.message = message.properties.message.join(' ')
      return
    }
    if (message.properties.message.split(' ')[0] === '!uwu') {
      message.properties.message = message.properties.message.split(' ')
      message.properties.message.shift()
      message.properties.message.push('(ᵘﻌᵘ)')
      message.properties.message = message.properties.message.join(' ')
      return
    }
    if (message.properties.message.split(' ')[0] === '!tableflip') {
      message.properties.message = message.properties.message.split(' ')
      message.properties.message.shift()
      message.properties.message.push('(╯°□°)╯︵ ┻━┻')
      message.properties.message = message.properties.message.join(' ')
      return
    }
    if (message.properties.message.split(' ')[0] === '!unflip') {
      message.properties.message = message.properties.message.split(' ')
      message.properties.message.shift()
      message.properties.message.push('┬─┬ ノ( ゜-゜ノ)')
      message.properties.message = message.properties.message.join(' ')
      return
    }
    if (message.properties.message.split(' ')[0] === '!ping') {
      message.properties.message = message.properties.message.split(' ')
      message.properties.message.shift()
      message.properties.ping = true
      message.properties.message = message.properties.message.join(' ')
      return
    }
    if (message.properties.message.split(' ')[0] === '!meow') {
      message.properties.message = message.properties.message.split(' ')
      message.properties.message.shift()
      message.properties.meow = true
      message.properties.message = message.properties.message.join(' ')
      return
    }
    if (message.properties.message.split(' ')[0] === '!badumtss') {
      message.properties.message = message.properties.message.split(' ')
      message.properties.message.shift()
      message.properties.badumtss = true
      message.properties.message = message.properties.message.join(' ')
      return
    }
    if (message.properties.message.split(' ')[0] === '!shake') {
      message.properties.message = message.properties.message.split(' ')
      message.properties.message.shift()
      message.properties.shake = true
      message.properties.message = message.properties.message.join(' ')
      return
    }
    if (message.properties.message.split(' ')[0] === '!lmgtfy') {
      message.properties.message = message.properties.message.split(' ')
      message.properties.message.shift()
      message.properties.lmgtfy = true
      message.properties.message = message.properties.message.join(' ')
      return
    }
    if (message.properties.message.split(' ')[0] === '!zalgo') {
      message.properties.message = message.properties.message.split(' ')
      message.properties.message.shift()
      message.properties.zalgo = true
      message.properties.message = message.properties.message.join(' ')
      return
    }
    if (message.properties.message.split(' ')[0] === '!glitch') {
      message.properties.message = message.properties.message.split(' ')
      message.properties.message.shift()
      message.properties.glitch = true
      message.properties.message = message.properties.message.join(' ')
      return
    }
  }
}

document.getElementById('input').addEventListener('keydown', event => {
  if (!event.shiftKey && event.key === 'Enter' && document.getElementById('input').value.trim().length > 0) {
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
