var branches = ["cn", "de", "en", "es", "fr", "int", "it", "ja", "ko", "pl", "ru", "th"]

exports.run = (clients, msg, args) => {
  var options = {site:args[0].toLowerCase()};
  var params = [...args];
  params.splice(0,2);
  var paramStr = params.join(' ');
  //console.log(JSON.stringify(args)+"\n"+site+"\n"+JSON.stringify(params)+"\n"+paramStr)
  if (branches.includes(options.site)) {
    switch (args[1].toLowerCase()) {
      case "page"||"pages":
        clients.scp.findPages(paramStr, options)
          .then(res => {
            //console.log(JSON.stringify(res))
            var resultArr = JSON.parse(JSON.stringify(res.data.pages))
            if (resultArr) {
              if ((resultArr.length === 1)||(paramStr.toLowerCase() === resultArr[0].name.toLowerCase())) {
                var resultEmbed = {
                  "title":resultArr[0].title,
                  "url": resultArr[0].site + "/" + resultArr[0].name,
                  "description":"",
                  "timestamp": resultArr[0].creationDate.date.replace(" ","T"),
                  "author": {
                    "name":""
                  },
                  "fields": [
                    {
                      "name": "評分\nRating",
                      "value": resultArr[0].rating.toString(10),
                      "inline": true
                    },
                    {
                      "name": "淨評分\nClean Rating",
                      "value": resultArr[0].cleanRating.toString(10),
                      "inline": true
                    },
                    {
                      "name": "貢獻者評分\nContributor Rating",
                      "value": resultArr[0].contributorRating.toString(10),
                      "inline": true
                    },
                    {
                      "name": "經調整評分\nAdjusted Rating",
                      "value": resultArr[0].adjustedRating.toString(10),
                      "inline": true
                    },
                    {
                      "name": "Wilson分數\nWilson Score",
                      "value": resultArr[0].wilsonScore.toString(10),
                      "inline": true
                    },
                    {
                      "name": "排名\nRank",
                      "value": resultArr[0].rank.toString(10),
                      "inline": true
                    }
                  ]
                }
                for (user of resultArr[0].authors) {
                  if (user.role==="Author") {
                    resultEmbed.author.name += user.user + ", ";
                  } else if (user.role==="Translator"){
                    resultEmbed.description += "由" + user.user + ", ";
                  }
                };
                if (resultEmbed.author) {
                  resultEmbed.author.name = resultEmbed.author.name.slice(0,-2);
                };
                if (resultEmbed.description) {
                  resultEmbed.description = resultEmbed.description.slice(0,-2);
                  resultEmbed.description += "翻譯";
                }
                if (resultArr[0].altTitle) {
                  resultEmbed.title += " - " + resultArr[0].altTitle
                };
                msg.channel.send({embed:resultEmbed})
              } else {
                var resultStr = '';
                //console.log(JSON.stringify(resultArr,null,2))
                for (i of resultArr) {
                  //console.log(JSON.stringify(i,null,2))
                  resultStr += "[" + i.title + "](" + i.site + "/" + i.name + ")\n"
                }
                msg.channel.send(resultStr);
              }
            } else msg.channel.send("找不到結果。\nNo results found.")
          })
          .catch(console.log)
        break;
      case "user"||"users":
        clients.scp.findUsers(paramStr, options)
          .then(res => {
            if (res.length === 1) {
              msg.channel.send(JSON.stringify(res))
            } else {

            }
          })
          .catch(console.log)
        break;
      case "tag"||"tags":
        clients.scp.findTags(params, options)
          .then(res => {
            if (res.length === 1) {
              msg.channel.send(JSON.stringify(res))
            } else {

            }
          })
          .catch(console.log)
        break;
      default:
        msg.channel.send("指令不正確。請重新輸入。\nInvalid commmand. Please enter again.");
        break;
    }
  } else {
    msg.channel.send("分部代碼不正確。請重新輸入。\nInvalid branch tag. Please enter again.");
  }

}
