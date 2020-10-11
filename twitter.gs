// Twitter AppのConsumer Api Key私の場合は別ファイルに記述
//var CONSUMER_KEY = "xxxxxxxxxxxxxxxxxx";
//var CONSUMER_SECRET = "xxxxxxxxxxxxxxxxxx";


// 認証URLを取得しログに出力する
function logAuthorizeUri() {
  var twitterService = getTwitterService();
  Logger.log(twitterService.authorize());
}

// OAuth認証をよしなにしてくれるサービスクラスのインスタンスを生成・取得する
function getTwitterService() {
  return OAuth1.createService('Twitter')
      .setAccessTokenUrl('https://api.twitter.com/oauth/access_token')
      .setRequestTokenUrl('https://api.twitter.com/oauth/request_token')
      .setAuthorizationUrl('https://api.twitter.com/oauth/authenticate')
      .setConsumerKey(CONSUMER_KEY)
      .setConsumerSecret(CONSUMER_SECRET)
      // リダイレクト時に実行されるコールバック関数を指定する
      .setCallbackFunction('authCallback')
      // アクセストークンを保存するPropertyStoreを指定する
      .setPropertyStore(PropertiesService.getUserProperties());
}

// リダイレクト時に実行されるコールバック関数
function authCallback(request) {
  var twitterService = getTwitterService();
  // ここで認証成功時にアクセストークンがPropertyStoreに保存される
  var isAuthorized = twitterService.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput('Success');
  } else {
    return HtmlService.createHtmlOutput('Denied');
  }
}

function loadTwitterData(){
  var twitterData = []
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Twitter");
  const columnBVals = sheet.getRange('B:B').getValues();
  const LastRow = columnBVals.filter(String).length;
  for(var i = 0 ;i < LastRow-1; i++){
    var type = sheet.getRange(2+i, 1).getValue();
    var getData= sheet.getRange(2+i, 2).getValue();
    var tgPostMessage = sheet.getRange(2+i, 3).getValue();
    var lastid_str =  sheet.getRange(2+i, 4).getValue();
   
    twitterData.push({type:type,getData:getData,lastidStr:lastid_str})    
  }
 return twitterData
}

function getSearchTimeline(userData){
  var twitterService = getTwitterService();
  var query
  if(userData['lastidStr']) {
  var query = {
    q: userData['getData'], // 検索ワード
    //lang: 'ja', // 日本語検索
    //locale: 'ja', // 日本限定で検索
    result_type: 'recent', // 直近のツイートを検索
    since_id: userData['lastidStr'], // これ以前のツイートは見ない
    //count:'3',
  　}
  }else{
    sendMessage('新しい設定が追加されました。設定内容'+ 'search:'+  userData['getData'] + '\n 最近の3件のデータを表示します。');
   query = {
  　q: userData['getData'], // 検索ワード
    //lang: 'ja', // 日本語検索
    //locale: 'ja', // 日本限定で検索
    result_type: 'recent', // 直近のツイートを検索
    count:'3',
   }
  }
  
 
  var queryStr = '';
  for (var key in query) {
    queryStr += key + '=' + encodeURIComponent(query[key]) + '&'
  }
  
  var queryStr = queryStr.slice(0, -1);
  var url = 'https://api.twitter.com/1.1/search/tweets.json?' + queryStr;
  Logger.log('url'+ url);
  if (twitterService.hasAccess()) {
      var response = twitterService.fetch(url, {
      method: "get",
      muteHttpExceptions: true,
    });
    //Logger.log(response);
    try {
        var result = JSON.parse(response);
        Logger.log(result);
        return result.statuses;
     }catch(e){
       //例外後の処理
       //何も読み込むデータがないと、「 エラーが発生。response:{"errors":[{"code":32,"message":"Could not authenticate you."}]}」と応答がくるみたい。
       Logger.log("エラーが発生。response:" + response);
       return -1;
     }
    
  } else {
    Logger.log(service.getLastError());
    Logger.log(response.getResponseCode())
    return -1; 
 }
}
function getListTimeline(userData){
  var twitterService = getTwitterService();
  var url;
  if(userData['lastidStr']) {
    url = 'https://api.twitter.com/1.1/lists/statuses.json?list_id=' +  userData['getData'] + '&since_id=' + userData['lastidStr'];
  }else{
    sendMessage('新しい設定が追加されました。設定内容'+ 'list:'+ 'https://twitter.com/i/lists/' + userData['getData'] + '\n 最近の3件のデータを表示します。');
    url = 'https://api.twitter.com/1.1/lists/statuses.json?list_id=' +  userData['getData'] +  '&count=3';
  }
  
  if (twitterService.hasAccess()) {
      var response = twitterService.fetch(url, {
      method: "get",
      muteHttpExceptions: true,
    });
    try {
        var result = JSON.parse(response.getContentText());
        return result; 
     }catch(e){
       //例外後の処理
       //何も読み込むデータがないと、「 エラーが発生。response:{"errors":[{"code":32,"message":"Could not authenticate you."}]}」と応答がくるみたい。
       Logger.log("エラーが発生。response:" + response);
       return -1;
     }
    
  } else {
    Logger.log(service.getLastError());
    return -1;
  }
}

function getUserTimeline(userData){
  var twitterService = getTwitterService();
  var url;
  if(userData['lastidStr']) {
    url = 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=' + userData['getData'] + '&since_id=' + userData['lastidStr'];
  }else{
    sendMessage('新しい設定が追加されました。設定内容'+ 'id:'+userData['getData'] + '\n 最近の3件のデータを表示します。');
    url = 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=' + userData['getData'] + '&count=3';
  }
  if (twitterService.hasAccess()) {
      
      var response = twitterService.fetch(url, {
      method: "get",
      muteHttpExceptions: true,
    });
    try {
        var result = JSON.parse(response.getContentText());
        return result; 
     }catch(e){
       //例外後の処理
       //何も読み込むデータがないと、「 エラーが発生。response:{"errors":[{"code":32,"message":"Could not authenticate you."}]}」と応答がくるみたい。
       Logger.log("エラーが発生。response:" + response);
       return -1;
     }
    
  } else {
    Logger.log(service.getLastError());
    return -1;
  }
}

function sendformattedMessage(result,userData){
  //最新のid_strをとりだす。取り出したデータは最初が最新のデータとなる。
  var lastIdStr = result[0]["id_str"];
  Logger.log('lastIdStr' + lastIdStr);
  Logger.log(typeof(lastIdStr));
  result.reverse();
  for(const post of result){
    var CreatedAt = Utilities.formatDate(new Date( post["created_at"]), "JST", "yyyy/MM/dd (E) HH:mm z");
    var idstr = post["id_str"];
    var displayName = post["user"]["name"];
    var UserName =  post["user"]["screen_name"];
    var text =    post["text"];
    var LinkToTweet = 'https://twitter.com/' + UserName  + '/status/' + idstr
    //本当はテンプレートリテラル (テンプレート文字列)を使って、シートから呼んだ値の中にある変数を書き換えたいのだが、
    //以下の例ではダメなので、しょうがないので、苦肉の策で、プログラムに直接書くことも考えたが
    //今後増えた場合に対応がメンドいので、統一の出力にするようにした。
    //var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Twitter");  
    //var tgPostMessage = `sheet.getRange(userData['no']+1, 4).getValue()`;
//    if(userData['no'] == '1'){
//      var tgPostMessage = `<a href="${LinkToTweet}"><b>【ハリー･ポッター:魔法同盟公式</b></a><a href="https://twitter.com/${UserName}"><b>@${UserName}】</b></a><br>-> ${CreatedAt}<br>----<br>#IFTTT #Twitter #公式`
//       tgPostMessage = tgPostMessage.replace(/<br>/g, '\n')
//    }
    //var tgPostMessage = '<a href="' + LinkToTweet + '"><b>【' + displayName +   '</b></a><a href="https://twitter.com/' + UserName +'"><b>' +  UserName + '】</b></a>\n->' + CreatedAt + '\n----\n#Twitter' 
    var tgPostMessage = `<a href="${LinkToTweet}"><b>【${displayName}</b></a><a href="https://twitter.com/${UserName}"><b>@${UserName}】</b></a>\n-> ${CreatedAt}\n----\n#Twitter #${UserName}` 
    //Logger.log(tgPostMessage);
    sendMessage(tgPostMessage);
  }
   return lastIdStr;
}

function updateSpreadSheetTwitter(changeColumn,lastidStr){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Twitter");
  sheet.getRange(changeColumn,4).setValue(lastidStr);
}

function Twitter2Telegram(){
  twitterUsersData = loadTwitterData();
  Logger.log(twitterUsersData);
  console.log(twitterUsersData);
  //Logger.log(twitterUsersData[0]['tgPostMessage']);
  var tweetdata = [];
  var workColumn = 2;
  for(const userData of twitterUsersData){
  
    //ID指定によりデータを取得する  
    if(userData['type'] == 'id'){
      tweetdata = getUserTimeline(userData);
      //Logger.log(tweetdata);
    //検索によってデータを取得する
    }else if(userData['type'] == 'search'){
      tweetdata  = getSearchTimeline(userData);
      //今後のバグとりのために、Twitterから受信したデータ：tweetdataはどっかのスプシに残しておいたほうがいいかもなあ。
      Logger.log('tweetdata' + tweetdata )
    }else if(userData['type'] == 'list'){
      tweetdata = getListTimeline(userData);
    }else{
       Logger.log('指定されたtypeに誤りがあります' + userData['type'] )
      //sendDebugMessage('指定されたtypeに誤りがあります' + userData['type']);
    }

    if(tweetdata.length){
      //新着のツイートをTGに送信する。
      var lastIdStr = sendformattedMessage(tweetdata,userData);
      //更新のあった行にスプシの更新をする
      updateSpreadSheetTwitter(workColumn,lastIdStr);
      }
    workColumn=workColumn+1
  }
  Logger.log(tweetdata)

}

//post test message
function postMessage(){
  postRequest('statuses/update.json', { status: "test2" });
}
// TwitterにAPIリクエストを送る
function postRequest(api_url, parameters) {
  var twitterService = getTwitterService();
  if (twitterService.hasAccess()) {
    var url = 'https://api.twitter.com/1.1/' + api_url;
    var response = twitterService.fetch(url, {
      method: "post",
      muteHttpExceptions: true,
      payload: parameters
    });
    var result = JSON.parse(response.getContentText());
    Logger.log(JSON.stringify(result, null, 2));
  } else {
    Logger.log(service.getLastError());
  }
}
