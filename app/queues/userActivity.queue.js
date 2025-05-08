import { Queue } from "bullmq";
import redis from "../../config/redis.js";

export const userActivityQueue = new Queue('user-activity', {
    connection: {
        host: redis.host,
        port: parseInt(redis.port || '6379')
    }
})