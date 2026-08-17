import Redis from "ioredis";
import config from '../config/config.js'

const redis = new Redis({
    username: config.REDIS_USERNAME,
    host: config.REDIS_HOST,
    port: Number(config.REDIS_PORT),
    password: config.REDIS_PASSWORD,
    connectTimeout: 5000,
    // null = use ioredis default (don't fail commands on a single retry attempt)
    maxRetriesPerRequest: null,
    // Queue commands while reconnecting so they replay once connected
    enableOfflineQueue: true,
    retryStrategy(times) {
        // Exponential backoff, max 30s between retries
        const delay = Math.min(times * 500, 30000);
        console.warn(`[Redis] Reconnecting... attempt #${times} (next in ${delay}ms)`);
        return delay;
    },
});

redis.on("connect", () => {
    console.log("[Redis] Connected successfully");
});

redis.on("ready", () => {
    console.log("[Redis] Ready to accept commands");
});

redis.on("error", (error) => {
    // Log but do NOT crash the process — Redis failure is non-fatal
    console.error("[Redis] Connection error:", error.message);
});

redis.on("reconnecting", (delay) => {
    console.warn(`[Redis] Reconnecting in ${delay}ms...`);
});

redis.on("close", () => {
    console.warn("[Redis] Connection closed");
});

export default redis;
