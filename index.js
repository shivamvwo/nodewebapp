const http = require('http');
const { init } = require('vwo-fme-node-sdk');

const accountId = '881134';
const sdkKey = '001ce6b291e5880b9074de9698baf36a';
const featureKey = 'boolean';

let vwoClient;

async function startServer() {
  try {
    vwoClient = await init({
      accountId,
      sdkKey,
      batchEventData: {
        eventsPerRequest: 500,
        requestTimeInterval: 5 * 60 * 1000,
        flushCallback: (error, events) => {
          if (error) {
            console.log('Error flushing events:', error);
          } else {
            console.log('Events flushed successfully:', events);
          }
        }
      }
    });
    console.log('VWO SDK initialized');

    const server = http.createServer(async (req, res) => {
      const context = {
        id: 'user_' + Math.random(), // Random ID to simulate different users
      };
      const flag = await vwoClient.getFlag(featureKey, context);
      const isFlagEnabled = flag.isEnabled();
      vwoClient.trackEvent('checkout', context);
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(String(isFlagEnabled));
    });

    server.listen(3000, () => {
      console.log('Server running on port 3000');
    });
  } catch (err) {
    console.error('Failed to initialize VWO SDK:', err);
    process.exit(1);
  }
}

startServer();
