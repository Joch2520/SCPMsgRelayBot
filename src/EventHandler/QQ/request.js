exports.run = (clients, context) => {
  if (context.request_type === 'friend') return {approve:true};
  else if (context.request_type === 'group' && context.sub_type === 'invite') return {approve:true};
  else return;
}
