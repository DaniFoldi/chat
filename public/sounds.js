const soundEffects = {
  badumtss: 'sounds/badumtss.mp3',
  bell: 'sounds/bell.mp3',
  meow: 'sounds/meow.mp3'
}

function playSound(url, play = true) {
  let element = document.querySelector(`audio[src='${url}']`)
  if (element === null) {
    element = document.createElement('audio')
    element.src = url
    element.preload = 'auto'
    document.body.appendChild(element)
  }
  if (play) {
    element.pause()
    element.currentTime = 0
    element.play()
  }
}

for (let effect in soundEffects) {
  playSound(soundEffects[effect], false)
}
