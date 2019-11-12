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
    container.innerHTML = this.properties.displayed
    container.appendChild(timestamp)
    this.container = container
    return container
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
