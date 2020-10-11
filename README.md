# RSSandTwitter2Telegram
##これは何か？
RSSとTwitterの更新内容をTelegramに送信します。

##事前準備

###TelegramのBOTを作成する

telegramで[@BotFather](https://t.me/BotFather)に話しかけてBOTを作成し、`token`をメモリます。

###Twitterのアプリを作成する
Twitterでアプリを作成してください。既に持っている場合には[Twitter Developers](https://developer.twitter.com/en/apps)を見てください。

##設置
[RSS&Twitter2telegram　公開用](https://docs.google.com/spreadsheets/d/10H7JWUsqceFV_XWnUzsuM7YpGAGvrdnYZLXqFysXvnk/edit?usp=sharing)を自分のフォルダにコピーします。
ツール→スクリプトエディタを開きます。telegram.gsとRSS.gsとtwitter.gsの内容をコピーします。

###Telegram
`chatId=`と`token`を自分の環境に書き換えてください。
chatIdはhttps://api.telegram.org/botXXX:YYYY/getUpdates　(XXX:YYYYの部分は自分の`token`に書き換える。)を見てください。testSendMessage()を実行して、設定した部屋に「test message from gas」とBOTから発言があればTelegramの設定はOKです。

###Twitter
[\[GAS\] GoogleAppsScriptでTwitterbotを作る \- Qiita](https://qiita.com/k7a/items/e6a456bec26b4e667c47)を参考にして、ライブラリの登録・コールバックの変更をする。postMessageを実行しアプリを認証したアカウントで発言が出来ればOKです。

##RSS
特に設定不要。TelegramでBOTの発言が出来てればOK。

##設定
[RSS&Twitter2telegram　公開用](https://docs.google.com/spreadsheets/d/10H7JWUsqceFV_XWnUzsuM7YpGAGvrdnYZLXqFysXvnk/edit?usp=sharing)の「設定」を見てください。

