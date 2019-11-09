class Message {
  constructor(properties) {
    this.properties = properties
    if (typeof this.properties.identifier === 'undefined')
      this.properties.identifier = uuid()
  }
  preprocess() {
    this.parseCommand()
    this.properties.displayed = this.properties.message
    this.properties.displayed = this.properties.displayed.replace(/\n/g, '\n\n')
    if (!emoji_regex.test(this.properties.displayed)) // TODO: fix to work with all emojis
      this.properties.displayed = md.render(this.properties.displayed).trim()
  }
  render() {
    const bigContainer = document.createElement('div')
    bigContainer.classList.add('message')
    //bigContainer.style['background-color'] = '#FFDC00'
    const container = document.createElement('div')
    container.classList.add('message')
    container.classList.add('message-' + this.properties.messagetype)
        if (emoji_regex.test(this.properties.displayed)) { // TODO: fix to work with all emojis
      container.classList.add('message-emoji')
    }
    container.innerHTML = this.properties.displayed
    //container.style['left'] = '60px'
    if (typeof this.properties.replyuser !== 'undefined' && typeof this.properties.replymessage !== 'undefined') {

      const original = document.createElement('b')
      original.textContent = `Replying to ${this.properties.replyuser}'s message: ${this.properties.replymessage}:`
      container.prepend(original, container.firstChild)
    }
    if (this.properties.messagetype !== 'special') {
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
    if (this.properties.messagetype === 'received') {
      //socket.emit('user',
      //  {type:'getinfo',identifier:user.identifier},username => {this.properties.user}
      //)
      const senderName = document.createElement('b')
      senderName.textContent = `feladó: ${this.properties.user} `
      bigContainer.prepend(senderName)
      let profil = document.createElement('IMG')
      bigContainer.appendChild(profil)
      profil.src='https://scontent-vie1-1.xx.fbcdn.net/v/t31.0-8/p960x960/12976728_129746087426668_8421938268686210730_o.jpg?_nc_cat=108&_nc_oc=AQkoaRPDQR24ypMXzR2Og0fb-l5jQIKhxIOdrGij2QE97BexCzsEvnNYc6KPvoSuhvsThlIl8Z6-by0p6lKwKXyW&_nc_ht=scontent-vie1-1.xx&oh=dafb6142d9a48eb4733fcac65bac3809&oe=5E5342C0'
    }
    bigContainer.appendChild(container)
    this.bigContainer = bigContainer
    return bigContainer
  }
  parseCommand() {
    if (this.properties.message[0] === "!") {
      if (this.properties.message.split(' ')[0] === '!shrug') {
        this.properties.message = this.properties.message.split(' ')
        this.properties.message.shift()
        this.properties.message.push('¯\\_(ツ)_/¯')
        this.properties.message = this.properties.message.join(' ')
      }
      if (this.properties.message.split(' ')[0] === '!lenny') {
        this.properties.message = this.properties.message.split(' ')
        this.properties.message.shift()
        this.properties.message.push('( ͡° ͜ʖ ͡°)')
        this.properties.message = this.properties.message.join(' ')
      }
      if (this.properties.message.split(' ')[0] === '!uwu') {
        this.properties.message = this.properties.message.split(' ')
        this.properties.message.shift()
        this.properties.message.push('(ᵘﻌᵘ)')
        this.properties.message = this.properties.message.join(' ')
      }
      if (this.properties.message.split(' ')[0] === '!tableflip') {
        this.properties.message = this.properties.message.split(' ')
        this.properties.message.shift()
        this.properties.message.push('(╯°□°)╯︵ ┻━┻')
        this.properties.message = this.properties.message.join(' ')
      }
      if (this.properties.message.split(' ')[0] === '!unflip') {
        this.properties.message = this.properties.message.split(' ')
        this.properties.message.shift()
        this.properties.message.push('┬─┬ ノ( ゜-゜ノ)')
        this.properties.message = this.properties.message.join(' ')
      }
    }
  }
  async postrender() {
    /*const maxmargin = this.bigContainer.classList.contains('message-emoji') ? 92 : 96 // TODO: imrpove //this part
    if (this.properties.messagetype === 'received') {
      let i = 40
      this.bigContainer.style['margin-right'] = `${i}%`
      const originalHeight = this.bigContainer.offsetHeight
      while (this.bigContainer.offsetHeight === originalHeight && i < maxmargin) {
        this.bigContainer.style['margin-right'] = `${i}%`
        i++
      }
      this.bigContainer.style['margin-right'] = `${i - 2}%`
    } else if (this.properties.messagetype === 'sent') {
      let i = 40
      this.bigContainer.style['margin-left'] = `${i}%`
      const originalHeight = this.bigContainer.offsetHeight
      while (this.bigContainer.offsetHeight === originalHeight && i < maxmargin) {
        this.bigContainer.style['margin-left'] = `${i}%`
        i++
      }
      this.bigContainer.style['margin-left'] = `${i - 2}%`
    }*/
    document.getElementById('messages').scroll({
      behavior: 'smooth',
      top: this.bigContainer.offsetTop,
      left: 0
    })
    const links = linkify.find(this.properties.message).filter((el => el.type === 'url'))
    for (let link of links) {
      console.log(link)
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
