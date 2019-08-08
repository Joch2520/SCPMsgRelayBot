  function ToQTranscoder (subject) {
    if(!(this instanceof ToQTranscoder)) {return new ToQTranscoder(subject)};
    this.subject = subject;
  }

  function ToDTranscoder (subject, client) {
    if(!(this instanceof ToDTranscoder)) {return new ToDTranscoder(subject,client)};
    if (!client) {
      return undefined;
    } else {
      this.client = client;
      this.subject = subject;
    }
  }

  function ToTTranscoder (subject, client) {
    if(!(this instanceof ToTTranscoder)) {return new ToTTranscoder(subject,client)};
    if (!client) {
      return undefined;
    } else {
      this.client = client;
      this.subject = subject;
    }
  }

  var __ToQTranscoder = ToQTranscoder.prototype = {
    MsgRepAtUser: function () {
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
      } else {var result = this.subject}
      return new ToQTranscoder(result);
    }
  };
  var __ToDTranscoder = ToDTranscoder.prototype = {
    MsgRepAtUser: function () {
      var client = this.client;
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
      } else {var result = this.subject}
      return new ToDTranscoder(result,client);
    },
    MsgRepAtRole: function () {
      var client = this.client;
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
      } else {var result = this.subject}
      return new ToDTranscoder(result,client);
    }
  };
  var __ToTTranscoder = ToTTranscoder.prototype = {
    MsgRepAtUser: function () {
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
      } else {var result = this.subject}
      return new ToTTranscoder(result,client);
    }
  };

module.exports.ToQ = ToQTranscoder;
module.exports.ToT = ToTTranscoder;
module.exports.ToD = ToDTranscoder;
