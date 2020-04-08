var EmojiMap = require('./EmojiMap.js')


module.exports.ToQ = class ToQTranscoder {
    constructor(subject) {
      if (!(this instanceof ToQTranscoder)) {
        return new ToQTranscoder(subject);
      };
      this.subject = subject;
    }

    ReplaceAll() {
      return this.MsgRepAtUser().MsgRepEmj()
    }

    MsgRepAtUser() {
      var AtQU = /At\(\d{5,11}\)/g, CurrUQQ = '', result = '';
      if (AtQU.test(this.subject)) {
        var MsgMention = this.subject.match(AtQU);
        var MsgContent = this.subject.split(AtQU);
        for (var j = 0; j < MsgMention.length; j++) {
          CurrUQQ = MsgMention[j].substring(3,(MsgMention[j].length-1));
          result += '' + MsgContent[j] + '[CQ:at,qq=' + CurrUQQ + ']';
        }
        result += MsgContent[(MsgContent.length-1)];
        this.subject = result;
      }
      return this;
    }

    MsgRepEmj() {
      var emj = /\<\:.+\:\d+\>/g, result = '';
      if(emj.test(this.subject)) {
        for (var emjobj of EmojiMap) {
          this.subject = this.subject.replace(new RegExp(`<:${emjobj[1]}:${emjobj[2]}>`,'g'), `[CQ:face,id=${emjobj[0]}]`);
          }
        }

      var MsgEmoji = this.subject.match(emj);
      var MsgContent = this.subject.split(emj);

      if (MsgEmoji!==undefined&&MsgEmoji) {
        for (var k = 0; k < MsgEmoji.length; k++) {
          var emjName = MsgEmoji[k].split(":")[1];
          var emjID = MsgEmoji[k].split(":")[2];
          emjID = emjID.substring(0,emjID.length-1);
          console.log(`<:${emjName}:${emjID}>`)
          result += `${MsgContent[k]}[Emoji:${emjName}]`;
        }
      }
      result += MsgContent[(MsgContent.length-1)];
      this.subject = result;

      return this;
    }
}

module.exports.ToD = class ToDTranscoder {
    constructor(subject, client) {
      if (!(this instanceof ToDTranscoder)) {
        return new ToDTranscoder(subject, client);
      };
      if (!client) {
        return undefined;
      }
      else {
        this.client = client;
        this.subject = subject;
      }
    }

    ReplaceAll (fm) {
      return this.MsgRepAtUser().MsgRepAtRole().MsgRepEmj(fm)
    }

    MsgRepAtUser () {
      var AtDU = /At\([^@#]{2,32}\#\d{4}\)/g, CurrUTag, CurrUID, result = '';
      if (AtDU.test(this.subject)) {
        var MsgMention = this.subject.match(AtDU);
        var MsgContent = this.subject.split(AtDU);
        for (var j = 0; j < MsgMention.length; j++) {
          CurrUTag = MsgMention[j].substring(3,(MsgMention[j].length-1));
          CurrUID = this.client.users.find(person => person.tag === CurrUTag).id;
          result += '' + MsgContent[j] + '<@' + CurrUID + '>';
        }
        result += MsgContent[(MsgContent.length-1)];
        this.subject = result;
      }
      return this;
    }

    MsgRepAtRole () {
      var AtDR = /At\(\#\w{2,32}\)/g;
      if (AtDR.test(this.subject)) {
        var MsgMention = this.subject.match(AtDR);
        var MsgContent = this.subject.split(AtDR);
        var result = ''
        for (var j = 0; j < MsgMention.length; j++) {
          CurrRName = MsgMention[j].substring(3,(MsgMention[j].length-1));
          CurrRID = this.client.users.find(person => person.tag === CurrUTag).id;
          result += '' + MsgContent[j] + '<@' + CurrRID + '>';
        }
        result += MsgContent[(MsgContent.length-1)];
        this.subject = result;
      }
      return this;
    }

    MsgRepEmj(fm) {
      if (fm=="q"||fm==0) {var i=0}
      else if (fm=="t"||fm==3) {var i=3}
      var found = EmojiMap.filter(emj=>(this.subject==emj[i]))
      if (found.length) {
        var emjobj = found[0];
        this.subject = `<:${emjobj[1]}:${emjobj[2]}>`;
      }
      return this;
    }
}

module.exports.ToT = class ToTTranscoder {
    constructor(subject, client) {
      if (!(this instanceof ToTTranscoder)) {
        return new ToTTranscoder(subject, client);
      };
      if (!client) {
        return undefined;
      }
      else {
        this.client = client;
        this.subject = subject;
      }
    }

    ReplaceAll () {
      return this.MsgRepAtUser()
    }

    MsgRepAtUser () {
      var client = this.client;
      var AtDU = /At\([^@#]{5,32}\)/g, CurrUName, result = '';
      if (AtDU.test(this.subject)) {
        var MsgMention = this.subject.match(AtDU);
        var MsgContent = this.subject.split(AtDU);
        for (var j = 0; j < MsgMention.length; j++) {
          CurrUTag = MsgMention[j].substring(3,(MsgMention[j].length-1));
          result += '' + MsgContent[j] + '@' + CurrUName;
        }
        result += MsgContent[(MsgContent.length-1)];
        this.subject = result;
      }
      return this;
    }
}

module.exports.DP = class DurationParser {
  constructor(duration, format) {
    this.dur = Number(duration);
    this.durstr = toString(duration);
    this.strint = null;
    this.strdec = null;
    this.format = format || "ms";
    this.exp = {
      "en": "", "cn": ""
    }
    this.result = {
      "yr":0, "mth":0, "day":0, "hr":0, "min":0, "sec":0, "mil":0
    }
    if (this.dur.isNaN()) {throw new Error("Duration has to be a number.")}
    if (this.durstr.includes(".")) {
      this.strint = durstr.split(".")[0];
      this.strdec = durstr.split(".")[1];
    } else this.strint = durstr;

    this.parse();
    this.genExp();
  }

  parse() {
    if (this.format == "ms") {
      this.result.mil = parseInt(this.strint.slice(-3))
      this.strint = this.strint.substring(0, this.strint.length-3);
      this.format == "s";
    }
    if (this.format == "s"||"sec"||"second") {
      while (this.strint>60) {
        while (this.strint>3600) {
          while (this.strint>86400) {
            while (this.strint>2592000) {
              while (this.strint>946080000) {
                this.result.yr++;
                this.strint-=946080000;
              }
              this.result.mth++;
              this.strint-=2592000;
            }
            this.result.day++;
            this.strint-=86400;
          }
          this.result.hr++;
          this.strint-=3600;
        }
        this.result.min++;
        this.strint-=60;
      }
      this.result.sec = this.strint;
    }

    else if (this.format == "min"||"minute") {

      while (this.strint>60) {
        while (this.strint>1440) {
          while (this.strint>432000) {
            while (this.strint>15768000) {
              this.result.yr++;
              this.strint-=15768000;
            }
            this.result.mth++;
            this.strint-=43200;
          }
          this.result.day++;
          this.strint-=1440;
        }
        this.result.hr++;
        this.strint-=60;
      }
      this.result.min = this.strint;
    }

  }

  genExp() {
    var units = ["yr", "mth", "day", "hr", "min", "sec", "mil"]
    var enU = ["Year", "Month", "Day", "Hour", "Minute", "Second", "Milisecond"]
    var cnU = ["年", "月", "日", "時", "分", "秒", "毫秒"]
    for (unit of units) {
      var curr = this.result[unit];
      var i = units.indexOf(unit);
      if (curr>1) {
        this.exp.en += ` ${curr} ${enU[i]}s`
        this.exp.cn += ` ${curr} ${cnU[i]}`
      } else if (curr>0) {
        this.exp.en += ` ${curr} ${enU[i]}`
        this.exp.cn += ` ${curr} ${cnU[i]}`
      }
    }
  }

  get chiExp() { return this.exp.cn }
  get engExp() { return this.exp.en }
}
