function getData() {
  return {
    sessionid: Cookies.get('sessionid'),
    userid: Cookies.get('userid')
  }
}

function clearData() {
  Cookies.remove('sessionid')
  Cookies.remove('userid')
}

function setData(data) {
  const options = {
    expires: 14,
    sameSite: 'lax'
  }
  if (location.protocol === 'https:')
    options.secure = true
  Cookies.set('sessionid', data.sessionid, options)
  Cookies.set('userid', data.userid, options)
}
