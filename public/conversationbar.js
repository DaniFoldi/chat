//let dbHandler;
//dbHandler = require('./database')()


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
      let i = 0
      let identifierList = []
      while (i < usernameList.length  ) {
        identifierList.push(await dbHandler.getIdentifier(usernameList[i]))
        i++
      }
      identifierList.push(sessions[uuid()])
      dbHandler.newConversation(identifierList)
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
