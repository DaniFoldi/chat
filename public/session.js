function getSessionid() {
  return Cookies.get('sessionid')
}

function clearSessionid() {
  Cookies.remove('sessionid')
}

function setSessionid(sessionid) {
  console.log(sessionid)
  Cookies.set('sessionid', sessionid, {
    expires: 14,
    // secure: true,
    sameSite: 'lax'
  })
}
