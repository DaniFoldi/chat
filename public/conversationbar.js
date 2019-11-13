let chatname = 'Main'
const container = document.getElementById('sidebar')
const button = document.createElement('button')
container.appendChild(button)
button.textContent = chatname + ' chat'
button.classList.add('chat-button')
createNewConverstaion()

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
function  createNewConverstaion(){
  let usernameList = []
  const containerCreate = document.getElementById('sidebar')
  const buttonCreate = document.createElement('button')
  container.appendChild(button)
  buttonCreate.textContent =  'Create new chat'
  buttonCreate.classList.add('chat-button')
  buttonCreate.addEventListener('click', () => {
    createChat = {
      document.getElementById('createChatpopup').classList.add('shown')
      document.getElementById('createChatpopup-content').innerHTML = `
        <form>
        <input type="text" id="username" placeholder="Usernames">
        <button id="Create">Create chat</button>
      </form>`
      document.querySelector('#CreateChatpopup-content form').addEventListener('submit', async event => {
        usernameList.push(document.getElementById('username').split(" , "))
        console.log(usernameList);
        getIdentifier()
      })
    }
  })
}
