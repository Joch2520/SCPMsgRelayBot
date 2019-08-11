exports.run = (client, msg, args) => {
  if ( args === [] ) { args = [10] };
  if ( args[0] > 100 ) { args = [100] };
  /* if(!msg.guild.member(client.user).hasPermission("KICK_MEMBERS")) {
    return msg.reply("I got no (KICK_MEMBER) permission to do this.").catch(console.error);
  } else {*/
    async function purge(num) {
      msg.delete();
      const fetched = await msg.channel.fetchMessages({limit:num});
      if (args[0]===1) {
        msg.channel.delete(fetched);
      } else {
      msg.channel.bulkDelete(fetched);
      }
      console.log('Deleted '+fetched.size+' messages from channel '+msg.channel.id);
    };
    purge(args[0]);
//  }
}
