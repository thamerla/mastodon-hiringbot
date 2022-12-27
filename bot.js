const masto = require('masto');
const dotenv = require('dotenv');
dotenv.config();


const main = async () => {
  const m = await masto.login({
    url: process.env.INSTANCE_URL,
    accessToken: process.env.ACCESS_TOKEN,
    disableVersionCheck: true
  });

  const stream = await m.stream.streamUser();
  
  stream.on('update', (status) => {
    console.log(status.url);
    m.statuses.reblog(status.id);
  });
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
