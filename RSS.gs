
function isNew(nowpubDate,lastpubDate){
  var postDateD = new Date(nowpubDate);
  var lastCheckDateD = new Date(lastpubDate);
  return ( postDateD.getTime()  > lastCheckDateD.getTime());
}
function checkUpdate(feed){
   var newFeeds = [];
   try {
    var xml = UrlFetchApp.fetch(feed['url']).getContentText();
    var document = XmlService.parse(xml);
     //var siteTitle = document.getRootElement().getChildren("channel")[0].getChildren("title");
     Logger.log('siteTitle' + siteTitle);
    var entries = document.getRootElement().getChildren("channel")[0].getChildren("item");
   }
   catch(e){
    Logger.log(feed['url']+ 'でデータの取得エラー発生')
    return -1
   } 
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
//初回用 RSSを取得し、その時点で最新の記事のpubDateをスプシに書き込む。
function setlastPubDateFoce(){
  feeds = loadRssUrls();
  for(const feed of feeds){
    try {
      var xml = UrlFetchApp.fetch(feed['url']).getContentText();
      var document = XmlService.parse(xml);
      var entries = document.getRootElement().getChildren("channel")[0].getChildren("item");
    }
    catch(e){
      Logger.log(feed['url'] + 'でデータの取得エラー発生');
      return -1
    } 
    feed['lastPubDate'] = entries[0].getChildText("pubDate");
  }
  
  updateSpreadSheet(feeds);
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
  sheet.getRange(changeColumn, 3).setValue(feeds['lastPubDate']);
}
function RssCheck2tgMain(){
  feeds = loadRssUrls();
  Logger.log(feeds)
    var workColumn = 1;
  for(const feed of feeds){
    var newFeeds = checkUpdate(feed);
    if(newFeeds.length){
      //更新のあったRSSについては、lastPubDateを取得した時点で最新のもに変える
      feed['lastPubDate'] = newFeeds[newFeeds.length - 1]['pubDate'];
      sendToTelegram(newFeeds);
      updateSpreadSheet(feed,workColumn);
    }
    workColumn = workColumn +1;
  }

}


