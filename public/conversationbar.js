createNewConversation()
function  createNewConversation(){
  let usernameList = []
  const container = document.getElementById('sidebar')
  const button = document.createElement('button')
  container.appendChild(button)
  button.textContent =  'Create new chat'
  button.classList.add('chat-button')
  button.addEventListener('click', () => {
    document.getElementById('createChatpopup').classList.add('shown')
    document.getElementById('createChatpopup-content').innerHTML = `
    <form>
      <input type="text" id="username" placeholder="Usernames">
      <button id="Create">Create chat</button>
      <p>usernameList</p>
    </form>`
    document.querySelector('#createChatpopup-content form').addEventListener('submit', async event => {
      usernameList.push(document.getElementById('username').split(", "))
      console.log(usernameList);
      getIdentifier()
    })
  })
  document.getElementById('createChatpopup').classList.remove('shown')
}
