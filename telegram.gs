// send to telegram
function testSendMessage(){
  sendMessage('test message from gas')
}

function sendMessage(postMessage) {
  // 以下2行は自分の環境に合わせて設定してください
  var chatId= globalChatId
  var token=globalYuzukiToken

  sendTelegram(chatId, postMessage, token);

}
function sendMessageMain(postMessage) {
  // 以下2行は自分の環境に合わせて設定してください
  var chatId= globalChatIdMain
  var token=globalYuzukiToken

  sendTelegram(chatId, postMessage, token);

}
function sendDebugMessage(postMessage) {
  // 以下2行は自分の環境に合わせて設定してください
  var chatId= globalChatId
  var token=globalYuzukiToken

  sendTelegram(chatId, postMessage, token);

}
function sendTelegram(chatId, text, token) {
  var payload = {
    'method': 'sendMessage',
    'chat_id': chatId,
    'text': text,
    'parse_mode': 'HTML'
  }
  var data = {
    'method': 'post',
    'payload': payload
  }
  UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/', data);
}