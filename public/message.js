class Message {
  constructor(properties) {
    this.properties = properties
    if (typeof this.properties.identifier === 'undefined')
      this.properties.identifier = uuid()
    if (typeof this.properties.timestamp === 'undefined') {
      this.properties.timestamp = (new Date()).toString().split(' ', 5)
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
    bigContainer.style['padding'] = '0px'
    bigContainer.style['margin'] = '0px'
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
    if (typeof this.properties.replyuser !== 'undefined' && typeof this.properties.replymessage !== 'undefined') {

      const original = document.createElement('i')
      if(this.properties.messagetype === 'sent') {
        original.textContent = `Replying to ${this.properties.replyuser}'s message: ${this.properties.replymessage}:`
      }else if(this.properties.messagetype === 'received'){
        original.textContent = `${this.properties.user} replies to ${this.properties.replyuser}'s message: ${this.properties.replymessage}:`
      }
      container.prepend(original)
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
      const button = document.createElement('button')
      container.appendChild(button)
      button.textContent = 'Reply'
      button.classList.add('msg-button')

      button.addEventListener('click', () => {
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
    if (this.properties.messagetype === 'received') {
      this.properties.user = 'Not undefined anymore, altought still not working'
      //socket.emit('user',
      //  {type:'getinfo',identifier:user.identifier},username => {this.properties.user}
      //)
      if (typeof this.properties.replyuser == 'undefined' && typeof this.properties.replymessage == 'undefined') {
      const senderName = document.createElement('i')
      senderName.textContent = `${this.properties.user}`
      bigContainer.prepend(senderName)}
      let profile = document.createElement('IMG')
      bigContainer.appendChild(profile)
      profile.style['top'] = '14px'
      profile.src='https://scontent-vie1-1.xx.fbcdn.net/v/t31.0-8/p960x960/12976728_129746087426668_8421938268686210730_o.jpg?_nc_cat=108&_nc_oc=AQkoaRPDQR24ypMXzR2Og0fb-l5jQIKhxIOdrGij2QE97BexCzsEvnNYc6KPvoSuhvsThlIl8Z6-by0p6lKwKXyW&_nc_ht=scontent-vie1-1.xx&oh=dafb6142d9a48eb4733fcac65bac3809&oe=5E5342C0'
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
    const maxmargin = this.container.classList.contains('message-emoji') ? 92 : 96 // TODO: imrpove this part
    if (this.properties.messagetype === 'received') {
      let i = 40
      this.container.style['margin-right'] = `${i}%`
      const originalHeight = this.container.offsetHeight
      while (this.container.offsetHeight === originalHeight && i < maxmargin) {
        this.container.style['margin-right'] = `${i}%`
        i++
      }
      this.container.style['margin-right'] = `${i - 12}%`
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
