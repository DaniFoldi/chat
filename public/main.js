const socket = io()
const md = markdownit({
  breaks: true,
  linkify: true,
  typographer: true
})
md.use(markdownitSpoiler)
md.use(markdownitSup)
md.use(markdownitSub)
md.use(markdownitEmoji)
md.use(markdownitKbd)
md.use(md => {
  const temp = md.renderer.rules.fence.bind(md.renderer.rules)
  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    const token = tokens[idx]
    const code = token.content.trim()
    if (token.info.length > 0) {
      return `<pre><code class="hljs">${hljs.highlightAuto(code, [token.info]).value}</code></pre>`
    }
    return temp(tokens, idx, options, env, slf)
  }
})
md.renderer.rules.emoji = (token, idx) => {
  return twemoji.parse(token[idx].content)
}

const messages = []
let replymessage = {}

const emoji_regex = /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])+$/
let wasAlreadyConnected = false

socket.on('connect', () => {
  if (wasAlreadyConnected) {
    const message = Message.special({
      message: 'Connection restored'
    })
    messages.push(message)
    message.preprocess()
    document.getElementById('messages').appendChild(message.render())
    message.postrender()
  } else {
    const message = Message.special({
      message: 'Connected'
    })
    messages.push(message)
    message.preprocess()
    document.getElementById('messages').appendChild(message.render())
    message.postrender()
    wasAlreadyConnected = true
  }
  socket.emit('user', {
    type: 'token',
    sessionid: getSessionid()
  }, data => {
    if (!data.authenticated) {
      showpopup('login')
    }
  })
})

socket.on('disconnect', () => {
  const message = Message.special({
    message: 'Connection lost'
  })
  messages.push(message)
  message.preprocess()
  document.getElementById('messages').appendChild(message.render())
  message.postrender()
})

socket.on('message', data => {
  const message = Message.received(data)
  messages.push(message)
  message.preprocess()
  document.getElementById('messages').appendChild(message.render())
  message.postrender()
  if (data.timing && data.timing !== 'none') {
    setTimeout(() => {
      message.delete()
    }, data.timing * 1000)
  }
})

socket.on('special', data => {
  const message = Message.special(data)
  messages.push(message)
  message.preprocess()
  document.getElementById('messages').appendChild(message.render())
  message.postrender()
})

socket.on('delete', identifier => {
  const message = messages.filter(el => el.properties.identifier === identifier)[0]
  if (typeof message !== 'undefined')
    message.delete()
})

socket.on('messageevent', data => {
  const message = messages.filter(el => el.properties.identifier === data.identifier)[0]
  const label = message.container.getElementsByTagName('span')[0]
  if (data.type === 'react') {
    label.textContent = parseInt(label.textContent) + 1
  } else {
    label.textContent = parseInt(label.textContent) - 1
  }
})
