const Redis = require("ioredis");
const config = require('config');

const redisClient = new Redis({
    port: config.get("REDIS_PORT"),
    host: config.get("REDIS_HOST"),
    retryStrategy: (times: number) => {
        // In development/test, reduce retry frequency to avoid spam
        if (process.env.NODE_ENV !== 'production') {
            if (times > 3) {
                return null; // Stop retrying after 3 attempts
            }
            return Math.min(times * 100, 3000); // Max 3 seconds between retries
        }
        // Production: use default retry strategy
        return Math.min(times * 50, 2000);
    },
    maxRetriesPerRequest: process.env.NODE_ENV !== 'production' ? 1 : 3,
    enableOfflineQueue: false, // Don't queue commands when offline (prevents error spam)
    lazyConnect: false
});

// Suppress error logs in development/test if Redis is not available
if (process.env.NODE_ENV !== 'production') {
    redisClient.on('error', () => {
        // Silently ignore Redis errors in development/test
    });
}

export default redisClient;