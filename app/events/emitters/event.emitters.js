import { eventEmmitter } from "../index.js";

// DEPLOYMENT: ORAMA PRODUCTS INDEX
// setTimeout(() =>{
//     console.log("Deploying ORAMA products index...");  // Simulating deployment process. Replace with actual deployment logic.
//     eventEmmitter.emit("deployOramaIndex")
// }, 5000);

const intervaleId = setInterval(() => {
    eventEmmitter.emit("delete-expired-user-otp", intervaleId)
}, 180000);
