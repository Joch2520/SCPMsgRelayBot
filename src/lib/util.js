var EmojiMap = require('./EmojiMap.js')


module.exports.ToQ = class ToQTranscoder {
    constructor(msg) {
      if (!(this instanceof ToQTranscoder)) {
        return new ToQTranscoder(msg);
      };
      this.msg = msg;
      this.subject = msg.content;
    }

    ReplaceAll() {
      return this.MsgRepAtDU().MsgRepAtUser().MsgRepEmj()
    }

    MsgRepAtDU() {
      if (/<@!?[0-9]+>/g.test(this.subject)) {
        this.subject.match(/<@!?[0-9]+>/g).forEach(elem => {
          var nick = this.msg.mentions.users.get(elem.substring(elem[2]=='!'?3:2,elem.length-1)).tag;
          this.subject = this.subject.replace(elem,` @${nick} `)
        });
      }
      return this;
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
      } else this.subject = ` ${this.subject} `
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
    this.durstr = ""+duration;
    this.strint = null;
    this.strdec = null;
    this.format = format;
    this.valid = true;
    this.exp = {
      "en": "", "cn": ""
    }
    this.result = {
      "yr":0, "mth":0, "day":0, "hr":0, "min":0, "sec":0, "ms":0
    }
    if (isNaN(this.dur)) {this.dur=0}
    if (this.durstr.includes(".")) {
      this.strint = this.durstr.split(".")[0];
      this.strdec = this.durstr.split(".")[1];
    } else this.strint = this.durstr;

    this.parse();
    this.check();
    this.normalize();
    this.genExp();
  }

  parse() {
    switch (this.format) {
      case "ms":
        if (this.dur) {
          this.result.ms += this.dur%1000;
          this.dur-=this.result.ms;
          this.dur/=1000;
        }
        this.format == "s";
      case "s":
      case "sec":
      case "second":
        if (this.dur) {
          this.result.sec += this.dur%60;
          this.dur-=this.result.sec;
          this.dur/=60;
        }
        this.format == "min";
      case "min":
      case "minute":
        if (this.dur) {
          this.result.min += this.dur%60;
          this.dur-=this.result.min;
          this.dur/=60;
        }
        this.format == "hr";
      case "hr":
      case "hour":
        if (this.dur) {
          this.result.hr += this.dur%24;
          this.dur-=this.result.hr;
          this.dur/=24;
        }
        this.format == "day";
      case "day":
        if (this.dur) {
          this.result.day += this.dur%30;
          this.dur-=this.result.day;
          this.dur/=30;
        }
        this.format == "mth";
      case "mth":
      case "month":
        if (this.dur) {
          this.result.mth += this.dur%365;
          this.dur-=this.result.mth;
          this.dur/=365;
        }
        this.format == "yr";
      case "yr":
      case "year":
        if (this.dur) {
          this.result.yr += this.dur;
        }
        break;
      case "initial":
        var arr = this.durstr;
        if (arr.includes("h")) {
          arr = arr.split("h");
          this.result.hr = parseInt(arr[0]);
          if (arr[1]!=undefined&&arr[1]) { arr = arr[1]; } else { break; }
        }
        if (arr.includes("m")) {
          arr = arr.split("m");
          this.result.min = parseInt(arr[0]);
          if (arr[1]!=undefined&&arr[1]) { arr = arr[1]; } else { break; }
        }
        if (arr.includes("s")) {
          arr = arr.split("s");
          this.result.sec = parseInt(arr[0]);
          if (arr[1]!=undefined&&arr[1]) { arr = arr[1]; } else { break; }
        }
        if (arr!=undefined&&arr) { this.result.ms = arr; }
        break;
      case ":":
        if (this.durstr.includes(":")) {
          var arr = this.durstr.split(":");
          var last = arr.pop()
          if (last.includes(".")) {
            var secsNless = last.split(".");
            arr.push(secsNless[0]);
            this.result.ms = parseInt(secsNless[1].substring(0,3));
          } else { arr.push(last) }
          if (arr.length) {
            var curr = arr.pop()
            if (curr.length==2) {
              this.result.sec = parseInt(curr)
            } else { return this.valid = false }
          }
          if (arr.length) {
            var curr = arr.pop()
            if (curr.length==2) {
              this.result.min = parseInt(curr)
            } else { return this.valid = false }
          }
          if (arr.length) {
            var curr = arr.pop()
            if (curr.length<=2) {
              this.result.hr = parseInt(curr)
            } else { return this.valid = false }
          }
        }
        break;
      default:
        break;
    }
  }

  normalize() {
    if (this.result.ms>=1000) {
      this.result.sec += (this.result.ms - this.result.ms%1000)/1000;
      this.result.ms%=1000;
    }
    if (this.result.sec>=60) {
      this.result.min += (this.result.sec - this.result.sec%60)/60;
      this.result.sec%=60;
    }
    if (this.result.min>=60) {
      this.result.hr += (this.result.min - this.result.min%60)/60;
      this.result.min%=60;
    }
    if (this.result.hr>=24) {
      this.result.day += (this.result.hr - this.result.hr%24)/24;
      this.result.hr%=60;
    }
    if (this.result.day>=30) {
      this.result.mth += (this.result.day - this.result.day%30)/30;
      this.result.day%=30;
    }
    if (this.result.mth>=12) {
      this.result.yr += (this.result.mth - this.result.mth%12)/12;
      this.result.mth%=12;
    }
  }

  check() {
    if (!this.valid) {
      var e = new Error(`Invalid time representation.`);
      e.code = `INVALID_TIME_REP`;
      throw e;
    }
  }

  genExp() {
    var units = ["yr", "mth", "day", "hr", "min", "sec", "ms"]
    var enU = ["Year", "Month", "Day", "Hour", "Minute", "Second", "Milisecond"]
    var cnU = ["年", "月", "日", "時", "分", "秒", "毫秒"]
    for (var unit of units) {
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

  toMS() {
    var ms = this.result.ms;
    if (this.result.sec) { ms+= this.result.sec*1000; }
    if (this.result.min) { ms+= this.result.min*60000; }
    if (this.result.hr) { ms+= this.result.hr*3600000; }
    return ms;
  }

  get chiExp() { return this.exp.cn }
  get engExp() { return this.exp.en }
}
