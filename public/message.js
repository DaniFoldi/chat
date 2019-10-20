class Message {
  constructor(properties) {
    this.properties = properties
    if (typeof this.properties.identifier === 'undefined')
      this.properties.identifier = uuid()
  }
  preprocess() {
    this.properties.displayed = this.properties.message
    this.properties.displayed = this.properties.displayed.replace(/\n/g, '\n\n')
    if (!emoji_regex.test(this.properties.displayed)) // TODO: fix to work with all emojis
      this.properties.displayed = md.render(this.properties.displayed).trim()
  }
  render() {
    const container = document.createElement('div')
    container.classList.add('message')
    container.classList.add('message-' + this.properties.messagetype)
    if (emoji_regex.test(this.properties.displayed)) { // TODO: fix to work with all emojis
      container.classList.add('message-emoji')
    }
    container.innerHTML = this.properties.displayed
    if (typeof this.properties.replyuser !== 'undefined' && typeof this.properties.replymessage !== 'undefined') {
      const original = document.createElement('p')
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
          user: 'anon',
          message: this.properties.message
        }
        // TODO: display which message is being replied to
      })
    }
    this.container = container
    return container
  }

  async postrender() {
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
      console.log(link)
      const raw = await fetch(`api/tools/article-parser?url=${encodeURIComponent(link.href)}`)
      const data = await raw.json()
      const article = document.createElement('article')
      article.innerHTML = data.content
      this.container.appendChild(article)
    }
  }

  delete() {
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
