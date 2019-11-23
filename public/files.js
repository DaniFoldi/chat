let sendFiles = []

addEventListener('dragover', event => {
  event.preventDefault()
})

addEventListener('drop', event => {
  event.preventDefault()
  console.log(event)
  if (event.dataTransfer.items) {
    for (let i = 0; i < event.dataTransfer.items.length; i++) {
      if (event.dataTransfer.items[i].kind !== 'file')
        continue
      sendFiles.push(event.dataTransfer.items[i].getAsFile())
    }
  }
})
