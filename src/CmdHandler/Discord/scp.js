var branches = ["cn", "de", "en", "es", "fr", "int", "it", "ja", "ko", "pl", "ru", "th"]

exports.run = (clients, msg, args) => {
  var options = {site:args[0].toLowerCase()};
  var params = [...args];
  params.splice(0,2);
  var paramStr = params.join(' ');
  //console.log(JSON.stringify(args)+"\n"+site+"\n"+JSON.stringify(params)+"\n"+paramStr)
  if (branches.includes(args[0])) {
    switch (args[1].toLowerCase()) {
      case "page":
      case "pages":
        clients.scp.findPages(paramStr, options)
          .then(res => {
            //console.log(JSON.stringify(res))
            var resultArr = JSON.parse(JSON.stringify(res.data.pages))
            var exactMatch = resultArr.filter(each => each.name === paramStr);
            if (resultArr!==undefined&&resultArr.length) {
              if (exactMatch.length===1) {
                var resultEmbed = {
                  "title":exactMatch[0].title,
                  "url": exactMatch[0].site + "/" + exactMatch[0].name,
                  "description":"",
                  "timestamp": exactMatch[0].creationDate.date.replace(" ","T"),
                  "fields": [
                    {
                      "name": "評分\nRating",
                      "value": "",
                      "inline": true
                    },
                    {
                      "name": "淨評分\nClean Rating",
                      "value": "",
                      "inline": true
                    },
                    {
                      "name": "貢獻者評分\nContributor Rating",
                      "value": "",
                      "inline": true
                    },
                    {
                      "name": "經調整評分\nAdjusted Rating",
                      "value": "",
                      "inline": true
                    },
                    {
                      "name": "Wilson分數\nWilson Score",
                      "value": "",
                      "inline": true
                    },
                    {
                      "name": "排名\nRank",
                      "value": "",
                      "inline": true
                    }
                  ]
                }
                var creators = [[],[]], prepend = ["作者：","譯者："], colors = [12063507,2036664]
                for (user of exactMatch[0].authors) {
                  if (user.role==="Author") {
                    creators[0].push(user.user);
                  } else if (user.role==="Translator") {
                    creators[1].push(user.user);
                  }
                };
                for (var i=0; i<creators.length;i++) {
                  if (creators[i]!==undefined&&creators[i].length) {
                    creators[i] = prepend[i] + creators[i].join(", ");
                  } else {  creators.splice(i,1); prepend.splice(i,1); colors.splice(i,1); i--;  }
                };
                var creatorStr = creators.join("\n");
                if (creatorStr) {
                  resultEmbed.description = creatorStr;
                }
                resultEmbed.color = colors.reduce((a, b) => a + b, 0);
                if (exactMatch[0].altTitle) { resultEmbed.title += " - " + exactMatch[0].altTitle };
                if (exactMatch[0].rating) {resultEmbed.fields[0].value = exactMatch[0].rating.toString(10)} else {resultEmbed.fields[0].value = "N/A"}
                if (exactMatch[0].cleanRating) {resultEmbed.fields[1].value = exactMatch[0].cleanRating.toString(10)} else {resultEmbed.fields[1].value = "N/A"}
                if (exactMatch[0].contributorRating) {resultEmbed.fields[2].value = exactMatch[0].contributorRating.toString(10)} else {resultEmbed.fields[2].value = "N/A"}
                if (exactMatch[0].adjustedRating) {resultEmbed.fields[3].value = exactMatch[0].adjustedRating.toString(10)} else {resultEmbed.fields[3].value = "N/A"}
                if (exactMatch[0].wilsonScore) {resultEmbed.fields[4].value = exactMatch[0].wilsonScore.toString(10)} else {resultEmbed.fields[4].value = "N/A"}
                if (exactMatch[0].rank) {resultEmbed.fields[5].value = exactMatch[0].rank.toString(10)} else {resultEmbed.fields[5].value = "N/A"}
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
      case "user":
      case "users":
        clients.scp.findUsers(paramStr, options)
          .then(res => {
            var resultArr = JSON.parse(JSON.stringify(res.data.users))
            var exactMatch = resultArr.filter(each => each.displayName.toLowerCase() === paramStr.toLowerCase());
            if (resultArr!==undefined&&resultArr.length) {
              if (exactMatch.length===1) {
                var inSiteInfo = exactMatch[0].activity[args[0]];
                if (inSiteInfo) {
                  var resultEmbed = {
                    "title":exactMatch[0].displayName,
                    "description":"in "+args[0].toUpperCase()+ " Branch",
                    "footer":{"text":"Last active in the branch at"},
                    "timestamp": inSiteInfo.lastActive.date.replace(" ","T"),
                    "fields": [
                      {
                        "name": "加入網站\nJoined Site",
                        "value": "",
                        "inline": true
                      },
                      {
                        "name": "投票\nVotes",
                        "value": "",
                        "inline": true
                      },
                      {
                        "name": "編輯\nRevisions",
                        "value": "",
                        "inline": true
                      },
                      {
                        "name": "創建頁面\nCreated Pages",
                        "value": "",
                        "inline": true
                      },
                      {
                        "name": "最高分數\nHighest Rating",
                        "value": "",
                        "inline": true
                      },
                      {
                        "name": "總分數\nTotal Rating",
                        "value": "",
                        "inline": true
                      }
                    ]
                  }
                  if (exactMatch[0].deleted) {
                    resultEmbed.title += "(已刪除 deleted)"
                  } else {resultEmbed.url= "http://www.wikidot.com/user:info/" + exactMatch[0].name;}
                  if (inSiteInfo.member.date) {resultEmbed.fields[0].value += inSiteInfo.member.date} else {resultEmbed.fields[0].value = "N/A"}
                  if (inSiteInfo.votes) {resultEmbed.fields[1].value = inSiteInfo.votes.toString(10)} else {resultEmbed.fields[1].value = "N/A"}
                  if (inSiteInfo.revisions) {resultEmbed.fields[2].value = inSiteInfo.revisions.toString(10)} else {resultEmbed.fields[2].value = "N/A"}
                  if (inSiteInfo.pages) {resultEmbed.fields[3].value = inSiteInfo.pages.toString(10)} else {resultEmbed.fields[3].value = "N/A"}
                  if (inSiteInfo.highestRating) {resultEmbed.fields[4].value = inSiteInfo.highestRating.toString(10)} else {resultEmbed.fields[4].value = "N/A"}
                  if (inSiteInfo.totalRating) {resultEmbed.fields[5].value = inSiteInfo.totalRating.toString(10)} else {resultEmbed.fields[5].value = "N/A"}
                  msg.channel.send({embed:resultEmbed})
                } else msg.channel.send("該用戶並無加入該分部。\nThe specified user did not join the specified branch.");
              } else {
                var resultStr = '';
                //console.log(JSON.stringify(resultArr,null,2))
                for (i of resultArr) {
                  //console.log(JSON.stringify(i,null,2))
                  resultStr += "[" + i.title + "](" + i.site + "/" + i.name + ")\n"
                }
                msg.channel.send(resultStr);
              }
            } else msg.channel.send("找不到結果。\nNo results found.");
          })
          .catch(console.log)
        break;
      case "tag":
      case "tags":
        clients.scp.findTags(params, options)
          .then(res => {
            if (res.length === 1) {
              msg.channel.send(JSON.stringify(res))
            } else {
              msg.channel.send(JSON.stringify(res),{split:true})
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
