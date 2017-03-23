var on = false; // start false here because handleClick is called at the bottom, which turns everything on for the first time
var badgeText = "";

chrome.browserAction.onClicked.addListener(handleClick);

function handleClick() {
  on = !on;
  if (on) {
    message = "turn_on";
    badgeText ={text: "on"};
  } else {
    message = "turn_off";
    badgeText = {text: ""};
  }
  chrome.tabs.query({active: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {"message": message});
    chrome.browserAction.setBadgeText(badgeText);
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.request == "state") {
    var state = on ? "on" : "off";
    sendResponse({state: state});
  }
});

handleClick();
