const masto = require('masto');
const dotenv = require('dotenv');
dotenv.config();

let cache = new Map();

// clear cache every 30 minutes
setTimeout(() => {
  cache.clear();
}, 1000 * 60 * 30);

const main = async () => {
  const m = await masto.login({
    url: process.env.INSTANCE_URL,
    accessToken: process.env.ACCESS_TOKEN,
    disableVersionCheck: true
  });

  const stream = await m.stream.streamUser();
  
  stream.on('update', (status) => {
    if (status.reblogged) return;  
    
    if(status.account.bot) return;
    if(status.account.url.toLowerCase().includes('bot')) return;
    
    if (cache.has(status.id)) return;
    
    if(status.account.noindex) return;
    
    cache.set(status.id, true); 
    console.log(status.url);
    m.statuses.reblog(status.id);
  });
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
