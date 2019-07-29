    function D2QTranscoder (subject) {
      this.subject = subject;
      if(!(this instanceof D2QTranscoder)) {return new D2QTranscoder(subject)};
    }

    function Q2DTranscoder (subject, client) {
      if (!client) {
        return undefined;
      } else {
        this.client = client;
        this.subject = subject;
      }
      if(!(this instanceof Q2DTranscoder)) {return new Q2DTranscoder(subject,client)};
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
        }
        return this;
      }
    };
    var __Q2DTranscoder = Q2DTranscoder.prototype = {
      MsgRepAtUser: function () {
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
      },
      MsgRepAtRole: function () {
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
    }

module.exports.Q2D = Q2DTranscoder;
module.exports.D2Q = D2QTranscoder;
