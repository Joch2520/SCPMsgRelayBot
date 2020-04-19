exports.run = (clients, msg, args) => {
  var pref = clients.config.CMD_PREFIX
  var cmdDesc = {
    "help":{
      "title":pref+"help",
      "description":"列出可用指令。\nLists all available commands."
    },
    "purge":{
      "title":pref+"purge",
      "description":"刪除此指令前特定數量的訊息（1-100），預設為10。\nDeletes a specific amount of messages (1-100) before this command, default is 10."
    },
    "scp":{
      "title":pref+"scp",
      "description":"從ScpperDB搜尋對應資料。用法：\""+pref+"scp [分部代碼] [搜索類別] [關鍵詞]\"\nSearches information from ScpperDB. Usage: \""+pref+"scp [branch code] [search category] [key word(s)]\"",
      "fields":[
        {
          "name":"可用分部代碼：\nAvailable branch tags:",
          "value":"cn, de, en, es\nfr, int, it, ja\nko, pl, ru, th",
          "inline":true
        },
        {
          "name":"可用搜索類別：\nAvailable search categories:",
          "value":"page/pages\nuser/users\ntag/tags",
          "inline":true
        }
      ]
    }
  };
  var generalHelp = "所有可用指令列表：\nList of all available commands:\n"+pref+Object.keys(cmdDesc).join("\n"+pref)+"\n使用\""+pref+"help [指令]\"可得具體資訊。\nSee\""+pref+"help [Command]\"for more information.";

  if(!args[0]) {
    msg.channel.send(generalHelp);
  } else if (cmdDesc.hasOwnProperty(args[0])) {
    msg.channel.send({embed:cmdDesc[args[0]]});
  } else msg.channel.send("指令不存在。使用\""+pref+"help\"尋找更多資料。\nInvalid command. See \""+pref+"help\" for more information.");
}
