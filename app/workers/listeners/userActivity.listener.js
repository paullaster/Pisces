import { QueueEvents } from "bullmq";

const queueEvents = new QueueEvents('user-activity');

queueEvents.on('active', (jobId, prev) => {
    console.log(`Job ${jobId} is now active; previous status was ${prev}`);
});

queueEvents.on('added', (jobId, name) => {
    console.log(`A job with ID ${jobId} called ${name} was added`)
});

queueEvents.on('waiting', (jobId, prev) => {
    console.log(`A job with ID ${jobId} is waiting`);
});

queueEvents.on('completed', (jobId, returnValue, prev) => {
    console.log(`${jobId} has completed and returned ${returnValue}`);
});

queueEvents.on('failed', (jobId, failedReason, prev) => {
    console.log(`${jobId} has failed with reason ${failedReason}`);
});

queueEvents.on('error', (err) => { });

