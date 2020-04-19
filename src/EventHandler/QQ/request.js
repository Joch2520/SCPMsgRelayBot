exports.run = (clients, context) => {
  if (context.request_type==='friend') return {approve:true};
  else if (context.request_type==='group' && context.sub_type==='invite' && context.user_id===2502425837) return {approve:true};
  else return;
}
