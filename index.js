const { init } = require('vwo-fme-node-sdk');

const accountId = '881134';
const sdkKey = '001ce6b291e5880b9074de9698baf36a';
const featureKey = 'boolean';

let vwoClient;

async function start() {
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
            console.log('Events flushed successfully:', events ? events.ev.length : 0);
          }
        }
      }
    });
    console.log('VWO SDK initialized');

    console.log('Starting load test loop...');
    for (let i = 0; i < 500; i++) {
      const context = {
        id: 'user_' + Math.random(), // Random ID to simulate different users
      };
      const flag = await vwoClient.getFlag(featureKey, context);
      console.log("loop index: ", i, "flag isEnabled: ", flag.isEnabled());
      vwoClient.trackEvent('checkout', context);
    }
    console.log('Events processed successfully');
    await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000));
    console.log('Exiting...');
    process.exit(0);

  } catch (err) {
    console.error('Failed to initialize VWO SDK:', err);
    process.exit(1);
  }
}

start();
