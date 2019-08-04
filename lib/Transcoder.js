  function D2QTranscoder (subject) {
    if(!(this instanceof D2QTranscoder)) {return new D2QTranscoder(subject)};
    this.subject = subject;
  }

  function Q2DTranscoder (subject, client) {
    if(!(this instanceof Q2DTranscoder)) {return new Q2DTranscoder(subject,client)};
    if (!client) {
      return undefined;
    } else {
      this.client = client;
      this.subject = subject;
    }
  }

  function D2TTranscoder (subject, client) {
    if(!(this instanceof D2TTranscoder)) {return new D2TTranscoder(subject,client)};
    if (!client) {
      return undefined;
    } else {
      this.client = client;
      this.subject = subject;
    }
  }

  function T2DTranscoder (subject, client) {
    if(!(this instanceof T2DTranscoder)) {return new T2DTranscoder(subject,client)};
    if (!client) {
      return undefined;
    } else {
      this.client = client;
      this.subject = subject;
    }
  }

  function Q2TTranscoder (subject, client) {
    if(!(this instanceof Q2TTranscoder)) {return new Q2TTranscoder(subject,client)};
    if (!client) {
      return undefined;
    } else {
      this.client = client;
      this.subject = subject;
    }
  }

  function T2QTranscoder (subject) {
    if(!(this instanceof T2QTranscoder)) {return new T2QTranscoder(subject)};
    this.subject = subject;
  }

  var __D2QTranscoder = D2QTranscoder.prototype = {
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
      return new D2QTranscoder(result);
    }
  };
  var __Q2DTranscoder = Q2DTranscoder.prototype = {
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
      return new Q2DTranscoder(result,client);
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
      return new Q2DTranscoder(result,client);
    }
  }

module.exports.D2Q = D2QTranscoder;
module.exports.D2T = D2TTranscoder;
module.exports.Q2D = Q2DTranscoder;
module.exports.Q2T = Q2TTranscoder;
module.exports.T2D = T2DTranscoder;
module.exports.T2Q = T2QTranscoder;
