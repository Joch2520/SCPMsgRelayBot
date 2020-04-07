exports.run = (clients, msg, args) => {
  clients.qq('send_group_msg', {"group_id":msg.group_id,"message":`id:${msg.group_id}`});
}