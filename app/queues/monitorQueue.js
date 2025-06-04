import { eventEmmitter } from "../events/index.js";
import { userActivityQueue } from "./userActivity.queue.js"

let workerRunning = false;
export const monitorQueue = async () => {
    const jobCount = await userActivityQueue.getWaitingCount();

    if (jobCount > 0 && !workerRunning) {
        eventEmmitter.emit('startWorker');
        workerRunning = true;
    } else if (jobCount === 0 && workerRunning) {
        eventEmmitter.emit('stopWorker');
        workerRunning = false;
    }
}

setInterval(monitorQueue, 5000);