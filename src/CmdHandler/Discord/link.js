const got = require("got");
const cheerio = require("cheerio");

module.exports.run = async (clients, msg, args) => {
    switch (args.length) {
        case 1 :
            args.unshift("cn");
            break;
        case 2 :
            break;
        default :
            let ReturnEmbed = {
              color: 0x660000,
              title: "用法：",
              description: clients.config.CMD_PREFIX+"link [<cn/en/int>] <尾網址>",
              timestamp: new Date()
            }
            return msg.channel.send({embed:ReturnEmbed})
    }
    let bc = args.shift();
    if (!["en","cn","int"].includes(bc.toLowerCase())) return msg.channel.send(`無法提供網址，用法：${clients.config.CMD_PREFIX}link [<cn/en/int>] <尾網址>`);

    switch (bc) {
        case "cn" :
            args.unshift("http://scp-wiki-cn.wikidot.com/");
            break;
        case "en" :
            args.unshift("http://scp-wiki.wikidot.com/");
            break;
        case "int" :
            args.unshift("http://scp-int.wikidot.com/");
            break;
    }

    let link = args.join()
    var res = await got(link)
    var $ = cheerio.load(res.body);
    var title = '不存在之頁面', rating = '從缺';

    if ($('#page-title').length) {
      title = $('#page-title').contents().first().text().trim();
      rating = $('#prw54355').contents().first().text().trim();
      if (title.includes('\n')) { title = title.split('\n').join().trim(); }
      if (!rating||rating==undefined) { rating="從缺" };
    }

    let SCPEmbed = {
      color: 0x660000,
      title: title,
      url: link,
      fields: [
        {
    			name: "現時評分",
    			value: rating,
    			inline: true,
    		}
      ]
    }

    msg.channel.send({embed:SCPEmbed});

}

module.exports.help ={
    name: "link",
    embed: {
      description: `提供wikidot頁面連接與資訊。\n用法: link [<分部>] <頁面UNIX名>`,
      fields: [
        {
          name: `目前可用分部`,
          description: `en, int, cn`
        },
        {
          name: `範例: link int scp-cn-1000`,
          value: `http://scp-int.wikidot.com/scp-cn-1000 鏈接以及現時評分將被提供。`
        }
      ]
    }
}
