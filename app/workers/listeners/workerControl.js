import { eventEmmitter } from "../../events/index.js";
import { spawn, exec } from "node:child_process";

let workerProcess = null;

eventEmmitter.on('startWorker', () => {
    if (!workerProcess) {
        workerProcess = spawn('node', ['app/workers/userActivity.worker.js'], { stdio: 'pipe' });
        console.log('Worker started')
    }
});

eventEmmitter.on('stopWorker', () => {
    if (workerProcess) {
        workerProcess.kill();
        workerProcess = null;
        console.log('worker stopped');
    }
})