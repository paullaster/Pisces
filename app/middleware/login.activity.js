import verifyJwtToken from "../../common/verify.jwt.token.js";
import app from "../../config/app.js";
import { userActivityQueue } from "../queues/userActivity.queue.js";

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

export const loginActivity = (req, res, next) => {
    const start = process.hrtime();
    let finished = false;

    let responseBody;

    const originalJson = res.json;
    res.json = function (body) {
        responseBody = body;
        return originalJson.call(this, body);
    };

    res.on('finish', async () => {
        finished = true;
        const diff = process.hrtime(start);
        const responseTimeMs = (diff[0] * 1e3) + (diff[1] / 1e6);
        console.log(`Response sent: status=${res.statusCode}, url=${req.originalUrl}, time=${responseTimeMs.toFixed(2)}ms`);
        const user = verifyJwtToken(responseBody.data, app);
        if (typeof user === 'object' && user !== null && 'id' in user)
            userActivityQueue.add('updateLastLogin', { userId: user.id, date: new Date() });
    });

    res.on('close', () => {
        if (!finished) {
            console.log(`Connection closed before response completed: url=${req.originalUrl}`);
        } else {
            // Optional: log if you want to see normal closes after finish
            console.log(`Connection closed after response sent: url=${req.originalUrl}`);
        }
    });

    next();
};