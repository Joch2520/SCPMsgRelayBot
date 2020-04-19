const got = require("got");
const cheerio = require("cheerio");

module.exports.run = async (clients, msg, args) => {
    if (!args.length) return msg.channel.send({embed:{
      color: 0x660000,
      title: "用法：",
      description: clients.config.CMD_PREFIX+"search [<cn/us/int>] <字串>",
      timestamp: new Date()
    }})
    let bc = args.shift();
    if (!["en","cn","int"].includes(bc.toLowerCase())) return msg.channel.send(`無法提供網址，用法：${clients.config.CMD_PREFIX}search [<cn/us/int>] <字串>`);

    switch (bc) {
        case "cn" :
            args.unshift("http://scp-wiki-cn.wikidot.com/search:site/a/p/q/");
            break;
        case "en" :
            args.unshift("http://scp-wiki.wikidot.com/search:site/a/p/q/");
            break;
        case "int" :
            args.unshift("http://scp-int.wikidot.com/search:site/a/p/q/");
            break;
    }

    let link = args.shift() + args.join(" ")
    var res = await got(encodeURI(link));
    let $ = cheerio.load(res.body);


    let items = $('.item');

    let Titles = [], Links = [];

    items.find('a').slice(0).each((index, element) => {
      Titles.push($(element).text());
      Links.push($(element).attr('href'));
    });

    if (!Titles.length) {
      Titles.push("無結果");
      Links.push("從缺");
    };

    let Embed = {
      color: 0x660000,
      title: "搜尋結果",
      description: `以${args.join(" ")}搜尋：`,
      fields: []
    }

    for (var i = 0; i<5 && Titles.length>0; i++) {
      Embed.fields.push({name:Titles.shift(), value:Links.shift(), inline:true})
    }

    msg.channel.send({embed:Embed});

}

module.exports.help = {
    name: "search",
    embed: {
      description: "於wikidot上搜尋包含目標字串的頁面，返回最多5個結果。\n用法: search [<cn/us/int>] <目標字串>"
    }
}
