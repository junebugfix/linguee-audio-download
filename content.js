var sticker

// turns on for the first time when loading a page
chrome.runtime.sendMessage({request: "state"}, function(response) {
  if (response.state === "on") {
    turnOn()    
  }
});

// recieves the message after the action button is pressed
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === "turn_on") {
      turnOn()      
    } else if (request.message === "turn_off") {
      turnOff()
    }
  }
)

function turnOn() {
  displaySticker()
  document.addEventListener('click', handleClick)
}

function turnOff() {
  removeSticker()
  document.removeEventListener('click', handleClick)
}

function handleClick(event) {
  if (event.target.className === 'audio') {
      var link = document.createElement('a');
      var linkBeginning = /https?:\/\/(www)?.linguee.[^\/]*/g.exec(window.location)[0]
      link.href = linkBeginning + '/mp3/' + event.target.id
      link.download = sanitizeFilename(event.target.previousElementSibling.innerText) // the word beside the audio icon

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
  sticker.innerHTML = 'click any 🔊  &nbsp;to download'
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

// from: https://github.com/parshap/node-sanitize-filename

/*jshint node:true*/
'use strict';

/**
 * Replaces characters in strings that are illegal/unsafe for filenames.
 * Unsafe characters are either removed or replaced by a substitute set
 * in the optional `options` object.
 *
 * Illegal Characters on Various Operating Systems
 * / ? < > \ : * | "
 * https://kb.acronis.com/content/39790
 *
 * Unicode Control codes
 * C0 0x00-0x1f & C1 (0x80-0x9f)
 * http://en.wikipedia.org/wiki/C0_and_C1_control_codes
 *
 * Reserved filenames on Unix-based systems (".", "..")
 * Reserved filenames in Windows ("CON", "PRN", "AUX", "NUL", "COM1",
 * "COM2", "COM3", "COM4", "COM5", "COM6", "COM7", "COM8", "COM9",
 * "LPT1", "LPT2", "LPT3", "LPT4", "LPT5", "LPT6", "LPT7", "LPT8", and
 * "LPT9") case-insesitively and with or without filename extensions.
 *
 * Capped at 255 characters in length.
 * http://unix.stackexchange.com/questions/32795/what-is-the-maximum-allowed-filename-and-folder-size-with-ecryptfs
 *
 * @param  {String} input   Original filename
 * @param  {Object} options {replacement: String}
 * @return {String}         Sanitized filename
 */

function truncate(s, len) {
  return s.substr(0, len)
}

var illegalRe = /[\/\?<>\\:\*\|":]/g;
var controlRe = /[\x00-\x1f\x80-\x9f]/g;
var reservedRe = /^\.+$/;
var windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
var windowsTrailingRe = /[\. ]+$/;

function sanitize(input, replacement) {
  var sanitized = input
    .replace(illegalRe, replacement)
    .replace(controlRe, replacement)
    .replace(reservedRe, replacement)
    .replace(windowsReservedRe, replacement)
    .replace(windowsTrailingRe, replacement);
  return truncate(sanitized, 255);
}

function sanitizeFilename(input, options) {
  var replacement = (options && options.replacement) || '';
  var output = sanitize(input, replacement);
  if (replacement === '') {
    return output;
  }
  return sanitize(output, '');
};