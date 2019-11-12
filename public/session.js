function getSessionid() {
  return Cookies.get('sessionid')
}

function clearSessionid() {
  Cookies.remove('sessionid')
}

function setSessionid(sessionid) {
  const options = {
    expires: 14,
    sameSite: 'lax'
  }
  if (location.protocol === 'https:')
    options.secure = true
  Cookies.set('sessionid', sessionid, options)
}
