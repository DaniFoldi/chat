function showpopup(popup) {
  document.getElementById('popup').classList.add('shown')
  switch (popup) {
    case 'login':
      document.getElementById('popup-content').innerHTML = `
        <form>
        <input type="text" id="username" placeholder="Username or email">
        <input type="password" id="password" placeholder="Password">
        <button id="login">Log in</button>
        <a href="javascript:showpopup('signup')" id="noaccount">Or sign up here</a>
      </form>`
      document.querySelector('#popup-content form').addEventListener('submit', async event => {
        event.preventDefault()
        socket.emit('user', {
          type: 'login',
          username: document.getElementById('username').value,
          password: document.getElementById('password').value
        }, data => {
          setSessionid(data.sessionid)
          hidepopup()
        })
      })
      break
    case 'signup':
      document.getElementById('popup-content').innerHTML = `
          <form>
          <input type="text" id="username" placeholder="Username">
          <input type="text" id="email" placeholder="Email">
          <input type="password" id="password" placeholder="Password">
          <input type="password" id="confirm_password" placeholder="Confirm password">
          <button id="signup">Sign up</button>
          <a href="javascript:showpopup('login')" id="hasaccount">Or log in here</a>
        </form>`
      document.querySelector('#popup-content form').addEventListener('submit', async event => {
        event.preventDefault()
        if (document.getElementById('password').value !== document.getElementById('confirm_password').value) {
          alert('Passwords do not match!')
          return
        }
        socket.emit('user', {
          type: 'signup',
          username: document.getElementById('username').value,
          email: document.getElementById('email').value,
          password: document.getElementById('password').value
        }, data => {
          setSessionid(data.sessionid)
          hidepopup()
        })
      })
      break
  }
}

function hidepopup() {
  document.getElementById('popup').classList.remove('shown')
}
