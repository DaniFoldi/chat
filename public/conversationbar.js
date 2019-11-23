
createNewConversation()

for(let i = 1; i <= 3/*dbHandler.conversationsOfUsers(sessions[uuid()])*/; i++) {
  createChatButtons(i)
}

function  createNewConversation(){
  const button = document.getElementById('createChat')
  button.textContent = 'Create new chat'
  button.classList.add('chat-button')
  button.addEventListener('click', () => {
    document.getElementById('createChatpopup').classList.add('shown')
    document.getElementById('createChatpopup-content').innerHTML = `
    <form>
      <input type="text" id="usernames" placeholder="Usernames">
      <button id="Create">Create chat</button>
    </form>`
    document.querySelector('#createChatpopup-content form').addEventListener('submit', async event => {
      event.preventDefault()
      let usernameList = document.getElementById('usernames').value.split(/[ ,]+/gi)
      let identifierList = []
      for (var i = 0; i < identifierList.length; i++) {
        socket.emit('conversation',{type:'getIdentifier', usernames: usernameList }, data => {
          identifierList.push(data)
        })
      }
      socket.emit('conversation',{type:'identiferOfCurrentUser', sessionid: getData().sessionid }, data => {
        identifierList.push(data)
      })
      socket.emit('conversation',{type:'newConversation', identifiers: identifierList }, data => {})
    })
  })
}

function createChatButtons(buttonN) {
  const buttonContainer = document.getElementById('sidebar')
  const chatButton = document.createElement('Button-' + buttonN)
  buttonContainer.appendChild(chatButton)
  chatButton.classList.add('chat-button')
  chatButton.textContent = 'Button-' + buttonN
}
