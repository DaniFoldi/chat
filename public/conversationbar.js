var chatname = 'Main'
const container = document.getElementById('sidebar')
const button = document.createElement('button')
container.appendChild(button)
button.textContent = chatname + ' chat'
button.classList.add('chat-button')


button.addEventListener('click', () => {
  replymessage = {
    user: 'anon',
    message: this.properties.message
  }
  /*document.querySelectorAll('.message-replying').forEach((el, i) => {
    el.classList.remove('message-replying')
  })
  this.container.classList.add('message-replying')
  document.getElementById("input").focus()*/
})
