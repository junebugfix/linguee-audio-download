var sticker

// turns on for the first time when loading a page
debugger;
console.log('hi')
chrome.runtime.sendMessage({request: "state"}, function(response) {
  if (response.state === "on") {
    turnOn()    
  }
});

// recieves the message after the action button is pressed
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('contentjs onMessage')
    if (request.message === "turn_on") {
      turnOn()      
    } else if (request.message === "turn_off") {
      turnOff()
    }
  }
)

function turnOn() {
  console.log('turn on')
  displaySticker()
  document.addEventListener('click', handleClick)
}

function turnOff() {
  removeSticker()
  document.removeEventListener('click', handleClick)
}

function handleClick(event) {
  console.log(event)
  if (event.target.className === 'audio') {
      var link = document.createElement('a');
      link.href = 'http://www.linguee.com/mp3/' + event.target.id
      link.download = document.getElementById(event.target.id).parentNode.firstChild.innerHTML // the word beside the audio icon

      //Dispatching click event.
      if (document.createEvent) {
          var e = document.createEvent('MouseEvents');
          e.initEvent('click' ,true ,true);
          link.dispatchEvent(e);
          return true;
      }
  }
}

function displaySticker() {
  sticker = document.createElement('div')
  sticker.innerHTML = 'click 🔊 to download'
  sticker.style.position = 'fixed'
  sticker.style.top = '5px'
  sticker.style.right = '5px'
  sticker.style.background = '#222'
  sticker.style.color = '#fff'
  sticker.style.fontSize = '10px'
  sticker.style.borderRadius = '5px'
  sticker.style.padding = '3px'
  sticker.style.zIndex = '9999'
  document.body.appendChild(sticker)
}

function removeSticker() {
  document.body.removeChild(sticker)
}