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
        requestTimeInterval: 3,
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
      for (let i = 0; i < 500; i++) {
        const context = {
          id: 'user_' + Math.random(), // Random ID to simulate different users
        };
        await vwoClient.getFlag(featureKey, context);
        //const isFlagEnabled = flag.isEnabled();
        vwoClient.trackEvent('checkout', context);
      }
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      console.log('Events processed successfully');
      res.end("true");
    });

    const port = process.env.PORT || 3000;
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to initialize VWO SDK:', err);
    process.exit(1);
  }
}

startServer();
