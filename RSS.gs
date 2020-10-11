
function isNew(nowpubDate,lastpubDate){
  var postDateD = new Date(nowpubDate);
  var lastCheckDateD = new Date(lastpubDate);
  var result = postDateD.getTime()  > lastCheckDateD.getTime();
  
  return result;
}
function checkUpdate(feed){
   var newFeeds = [];
   try {
    var xml = UrlFetchApp.fetch(feed['url']).getContentText();
    var document = XmlService.parse(xml);
    var entries = document.getRootElement().getChildren("channel")[0].getChildren("item");
   }
   catch(e){
    Logger.log(feed['url']+ 'でデータの取得エラー発生')
    return -1
   } 
  //Logger.log(entries);
   //lastPubDateが空の時は最新の1つを表示する。
  if(!feed['lastPubDate']) {
    sendMessage('新しい設定が追加されました URL:' + feed['url'] + '\n最近の1件のデータを表示します。');
    var title = entries[0].getChildText("title");
    var link = entries[0].getChildText("link");
    var pubDate = entries[0].getChildText("pubDate");
    //var category = entries[0].getChildText("category");
    newFeeds.push({title:title,link:link,pubDate:pubDate}); 
    return newFeeds;
  }else{
    entries.reverse();
    for(var ii = 0; ii < entries.length; ii ++){
      var title = entries[ii].getChildText("title");
      var link = entries[ii].getChildText("link");
      var pubDate = entries[ii].getChildText("pubDate");
      //var category = entries[ii].getChildText("category");
      if(isNew(pubDate,feed['lastPubDate'])){
        newFeeds.push({title:title,link:link,pubDate:pubDate});
      }
    }
    return newFeeds;
  }
}
//エクセルのセルからRSSの記載されているURLを持ってくる
function loadRssUrls(){
  var rssUrls = []
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("RSS");
  const columnBVals = sheet.getRange('B:B').getValues();
  const LastRow = columnBVals.filter(String).length;
  for(var i = 0 ;i < LastRow-1; i++){
    var url = sheet.getRange(2+i, 2, 1).getValue();
    var lastPubDate = sheet.getRange(2+i, 3, 1).getValue();
   
    rssUrls.push({url:url,lastPubDate:lastPubDate})    
  }
 return rssUrls
}
function sendToTelegram(newFeeds){
  
  for(const newFeed of newFeeds){
    var EntryTitle = newFeed['title'];
    var PubDate = Utilities.formatDate(new Date( newFeed['pubDate']), "JST", "yyyy/MM/dd (E) HH:mm z");
    var EntryUrl = newFeed['link'];
    var telegramPostMessage = `<b>${EntryTitle} </b>\n via ${EntryUrl} ${PubDate}\n #RSS #Feed\n`

     sendMessage(telegramPostMessage );
    Logger.log(telegramPostMessage );
  }
}

function updateSpreadSheet(feed,changeColumn){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("RSS");
  sheet.getRange(changeColumn, 3).setValue(feed['lastPubDate']);
}
function RssCheck2tgMain(){
  feeds = loadRssUrls();
  Logger.log(feeds)
  var workColumn = 2;
  for(const feed of feeds){
    var newFeeds = checkUpdate(feed);
    if(newFeeds.length){
      //更新のあったRSSについては、lastPubDateを取得した時点で最新のもに変える
      feed['lastPubDate'] = newFeeds[newFeeds.length - 1]['pubDate'];
      sendToTelegram(newFeeds);
      Logger.log(feed)
      updateSpreadSheet(feed,workColumn);
    }
    workColumn = workColumn +1;
  }

}


