class Message {
  constructor(properties) {
    this.properties = properties
    if (typeof this.properties.identifier === 'undefined')
      this.properties.identifier = uuid()
    if (typeof this.properties.timestamp === 'undefined')
      this.properties.timestamp = new Date()
  }
  preprocess() {
    this.properties.displayed = this.properties.message
    this.properties.displayed = this.properties.displayed.replace(/\n/g, '\n\n')
    if (this.properties.lmgtfy) {
      this.properties.displayed = `<iframe class='lmgtfy' src='https://lmgtfy.com/?q=${this.properties.message}'></iframe>`
      return
    }
    if (this.properties.zalgo) {
      this.properties.displayed = zalgo(this.properties.displayed)
      console.log(this.properties.displayed)
      return
    }
    if (this.properties.glitch) {
      this.properties.displayed = glitch(this.properties.displayed)
      return
    }
    if (!emoji_regex.test(this.properties.displayed)) // TODO: fix to work with all emojis
      this.properties.displayed = md.render(this.properties.displayed).trim()
  }
  render() {
    const container = document.createElement('div')
    container.classList.add('message')
    container.classList.add('message-' + this.properties.messagetype)
    const timestamp = document.createElement('p')
    timestamp.classList.add('timestamp')
    container.appendChild(timestamp)
    if (emoji_regex.test(this.properties.displayed)) { // TODO: fix to work with all emojis
      container.classList.add('message-emoji')
    }
    if (this.properties.lmgtfy) {
      container.classList.add('message-large')
    }
    const messageContainer = document.createElement('div')
    container.appendChild(messageContainer)
    messageContainer.classList.add('message-content')
    messageContainer.innerHTML = this.properties.displayed
    if (this.properties.flip) {
      container.getElementsByClassName('message-content')[0].classList.add('message-flip')
    }
    if (typeof this.properties.replyuser !== 'undefined' && typeof this.properties.replymessage !== 'undefined') {
      const original = document.createElement('p')
      original.textContent = `Replying to ${this.properties.replyuser}'s message: ${this.properties.replymessage}:`
      container.prepend(original, container.firstChild)
    }
    if (this.properties.shake) {
      container.classList.add('shake')
      container.classList.add('shake-constant')
      container.classList.add('shake-constant--hover')
      container.classList.add('shake-slow')
    }
    if (this.properties.messagetype !== 'special') {
      const reactButton = document.createElement('button')
      container.appendChild(reactButton)
      const reactCount = document.createElement('span')
      container.appendChild(reactCount)
      reactCount.textContent = '0'
      if (reactCount.textContent === '0') {
        reactCount.classList.add('hidden')
      } else {
        reactCount.classList.remove('hidden')
      }
      reactButton.classList.add('msg-button')
      reactButton.classList.add('reaction')
      reactButton.addEventListener('click', () => {
        if (!reactButton.classList.contains('filled')) {
          socket.emit('messageevent', {
            type: 'react',
            identifier: this.properties.identifier
          })
          reactButton.classList.add('filled')
          reactCount.textContent = parseInt(reactCount.textContent) + 1
        } else {
          socket.emit('messageevent', {
            type: 'unreact',
            identifier: this.properties.identifier
          })
          reactButton.classList.remove('filled')
          reactCount.textContent = parseInt(reactCount.textContent) - 1
        }
        if (reactCount.textContent === '0') {
          reactCount.classList.add('hidden')
        } else {
          reactCount.classList.remove('hidden')
        }
      })
      const button = document.createElement('button')
      container.appendChild(button)
      button.textContent = 'Reply'
      button.classList.add('msg-button')

      button.addEventListener('click', () => {
        replymessage = {
          user: 'anon',
          message: this.properties.message
        }
        document.querySelectorAll('.message-replying').forEach((el, i) => {
          el.classList.remove('message-replying')
        })
        this.container.classList.add('message-replying')
        document.getElementById("input").focus()
      })
      if (this.properties.messagetype === 'sent') {
        const deleteButton = document.createElement('button')
        container.appendChild(deleteButton)
        deleteButton.textContent = 'Delete'
        deleteButton.classList.add('msg-button')
        deleteButton.addEventListener('click', () => {
          this.delete()
          socket.emit('delete', this.properties)
        })
      }
    }
    this.container = container
    container.addEventListener('click', () => {
      if (!container.classList.contains('shake-slow'))
        return
      container.classList.remove('shake-slow')
      container.classList.add('shake-little')
    })
    this.updateTime()
    return container
  }
  async postrender() {
    if (this.properties.tts) {
      const tts = new SpeechSynthesisUtterance(this.properties.message)
      speechSynthesis.speak(tts)
    }
    if (this.properties.messagetype === 'received') {
      if (this.properties.ping) {
        playSound(soundEffects.bell)
      }
      if (this.properties.meow) {
        playSound(soundEffects.meow)
      }
      if (this.properties.badumtss) {
        playSound(soundEffects.badumtss)
      }
    }
    const maxmargin = this.container.classList.contains('message-emoji') ? 92 : 96 // TODO: imrpove this part
    if (this.properties.messagetype === 'received') {
      let i = 40
      this.container.style['margin-right'] = `${i}%`
      const originalHeight = this.container.offsetHeight
      while (this.container.offsetHeight === originalHeight && i < maxmargin) {
        this.container.style['margin-right'] = `${i}%`
        i++
      }
      this.container.style['margin-right'] = `${i - 2}%`
    } else if (this.properties.messagetype === 'sent') {
      let i = 40
      this.container.style['margin-left'] = `${i}%`
      const originalHeight = this.container.offsetHeight
      while (this.container.offsetHeight === originalHeight && i < maxmargin) {
        this.container.style['margin-left'] = `${i}%`
        i++
      }
      this.container.style['margin-left'] = `${i - 2}%`
    }
    document.getElementById('messages').scroll({
      behavior: 'smooth',
      top: this.container.offsetTop,
      left: 0
    })
    const links = linkify.find(this.properties.message).filter((el => el.type === 'url'))
    for (let link of links) {
      const raw = await fetch(`api/tools/article-parser?url=${encodeURIComponent(link.href)}`)
      const data = await raw.json()
      const article = document.createElement('article')
      article.innerHTML = data.content
      this.container.appendChild(article)
    }
  }

  updateTime() {
    const diff = timediff(this.properties.timestamp, new Date(), {
      returnZeros: false
    })
    if (typeof diff.seconds !== 'undefined' && this.container.getElementsByClassName('timestamp')[0].textContent !== pluralize(Object.keys(diff)[0], diff[Object.keys(diff)[0]], true) + ' ago') {
      this.container.getElementsByClassName('timestamp')[0].textContent = pluralize(Object.keys(diff)[0], diff[Object.keys(diff)[0]], true) + ' ago'
    }
  }

  delete() {
    if (this.container.parentNode)
      this.container.parentNode.removeChild(this.container)
    messages.splice(messages.indexOf(this), 1)
  }


  static received(properties) {
    properties.messagetype = 'received'
    return new Message(properties)
  }

  static sent(properties) {
    properties.messagetype = 'sent'
    return new Message(properties)
  }

  static special(properties) {
    properties.messagetype = 'special'
    return new Message(properties)
  }
}
