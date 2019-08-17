exports.run = (clients, context) => {
  if (context.request_type === 'friend') return {approve:true}; else return;
}
