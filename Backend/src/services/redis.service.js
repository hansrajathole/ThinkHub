import Redis from "ioredis";
import config from '../config/config.js'

const redis = new Redis({
    username: config.REDIS_USERNAME,
    host : config.REDIS_HOST,
    port : Number(config.REDIS_PORT),
    password : config.REDIS_PASSWORD
})

redis.on("connect", ()=>{
    console.log("Redis connect");
})

redis.on("error", (error) => {
    console.error("Redis error:", error.message);
})


export default redis
