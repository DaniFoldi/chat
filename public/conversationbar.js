createNewConversation()
function  createNewConversation(){
  const button = document.getElementById('createChat')
  button.textContent =  'Create new chat'
  button.classList.add('chat-button')
  button.addEventListener('click', () => {
    document.getElementById('createChatpopup').classList.add('shown')
    document.getElementById('createChatpopup-content').innerHTML = `
    <form>
      <input type="text" id="usernames" placeholder="Usernames">
      <button id="Create">Create chat</button>
      <p id="members"></p>
    </form>`
    document.querySelector('#createChatpopup-content form').addEventListener('submit', async event => {
      event.preventDefault()
      let usernameList = document.getElementById('usernames').value.split(' ')
      console.log(usernameList)
      document.getElementById('members').innerHTML = usernameList.join(", ")
    })
  })
}
