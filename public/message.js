class Message {
  constructor(properties) {
    this.properties = properties
    if (typeof this.properties.identifier === 'undefined')
      this.properties.identifier = uuid()
  }
  preprocess() {
    this.properties.displayed = this.properties.message
    for (let keyword in emojireplacements) {
      this.properties.displayed = this.properties.displayed.replace(new RegExp(keyword, 'g'), emojireplacements[keyword])
    }
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
    if (this.properties.messagetype !== 'special') {
      const button = document.createElement('button')
      container.appendChild(button)
      button.textContent = 'Reply'
      button.style.display = "none"
      container.addEventListener("mouseover", () => {
        this.replyshow(this)
      })
      container.addEventListener("mouseout", () => {
        this.replyhide(this)

      })

      button.addEventListener('click', () => {
        this.properties.replying = 'anon'
        this.properties.reply = this.properties.message
        
      })

      this.replybutton = button
    }
    this.container = container
    return container
  }
    replyshow(x) {
      this.replybutton.style.display = "block"
    }
    replyhide(x) {
      this.replybutton.style.display = "none"
    }

  postrender() {
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
