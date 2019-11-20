class Message {
  constructor(properties) {
    this.properties = properties
    if (typeof this.properties.identifier === 'undefined')
      this.properties.identifier = uuid()
    if (typeof this.properties.timestamp === 'undefined') {
      this.properties.timestamp = (new Date()).toString().split(' ', 5)
    }
    if(typeof this.properties.user === 'undefined') {
      this.properties.user = 'Not undefined! :)'
    }
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
    const bigContainer = document.createElement('div')
    bigContainer.classList.add('message')
    bigContainer.classList.add('bigContainer')
    const container = document.createElement('div')
    container.classList.add('message')
    container.classList.add('message-' + this.properties.messagetype)
    const timestamp = document.createElement('p')
    timestamp.classList.add('timestamp')
    const currentDate = (new Date()).toString().split(' ', 5)
    if (this.properties.timestamp[1] === currentDate[1] && this.properties.timestamp[2] === currentDate[2] && this.properties.timestamp[3] === currentDate[3]) {
      timestamp.textContent = currentDate[4]
    } else {
      timestamp.textContent = currentDate.join(' ')
    }
    if (emoji_regex.test(this.properties.displayed)) { // TODO: fix to work with all emojis
      container.classList.add('message-emoji')
    }
    if (this.properties.lmgtfy) {
      container.classList.add('message-large')
    }
    if (this.properties.flip) {
      container.classList.add('message-flip')
    }
    container.innerHTML = this.properties.displayed
    container.appendChild(timestamp)
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
      })
      const replyButton = document.createElement('button')
      container.appendChild(replyButton)
      replyButton.classList.add('msg-button')
      replyButton.classList.add('reply')
      const replyText = document.createElement('span')
      replyButton.appendChild(replyText)
      replyText.textContent = 'reply'
      replyText.classList.add('msg-button')
      replyText.classList.add('text')


      replyButton.addEventListener('click', () => {
        replymessage = {
          user: 'aron',
          message: this.properties.message
        }
        document.querySelectorAll('.message-replying').forEach((el, i) => {
          el.classList.remove('message-replying')
        })
        container.classList.add('message-replying')
        document.getElementById("input").focus()
      })
      if (typeof this.properties.replyuser !== 'undefined' && typeof this.properties.replymessage !== 'undefined') {
        const original = document.createElement('i')
        original.textContent = `Replying to ${this.properties.replyuser}'s message: `
        container.prepend(original)
      }
      if (this.properties.messagetype === 'sent') {
        const deleteButton = document.createElement('button')
        deleteButton.classList.add('msg-button')
        deleteButton.classList.add('delete')
        container.appendChild(deleteButton)
        const deleteText = document.createElement('span')
        deleteButton.appendChild(deleteText)
        deleteText.textContent = 'delete'
        deleteText.classList.add('msg-button')
        deleteText.classList.add('text')

        deleteButton.addEventListener('click', () => {
          this.delete()
          socket.emit('delete', this.properties)
        })
      }
    }
    if (this.properties.messagetype === 'received') {
      /*socket.emit('user',
        {type:'getinfo',identifier:user.identifier},username => {this.properties.user}
      )*/
      const senderName = document.createElement('i')
      senderName.style['left'] = '60px'
      senderName.textContent = `${this.properties.user}`
      bigContainer.prepend(senderName)
      let profile = document.createElement('IMG')
      bigContainer.appendChild(profile)
      profile.src='https://www.nikonforums.com/forums/public/style_images/Nikon_Forums_Default/profile/default_large.png'
    }
    bigContainer.appendChild(container)
    this.bigContainer = bigContainer
    this.container = container
    container.addEventListener('click', () => {
      if (!container.classList.contains('shake-slow'))
        return
      container.classList.remove('shake-slow')
      container.classList.add('shake-little')
    })
    return bigContainer
  }

  async postrender() {
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
    document.getElementById('messages').scroll({
      behavior: 'smooth',
      top: this.bigContainer.offsetTop,
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

  delete() {
    if (this.container.parentNode)
      this.container.parentNode.removeChild(this.bigContainer)
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
