import { eventEmmitter } from "../index.js"
import { EmailTemplateBuilder } from "@brainspore/shackuz";
import * as fs from "fs";
import app from "../../../config/app.js";
import { Notification } from "../../notifications/notification.js";
import { models } from "../../../data/integrations/database/models/index.js";
import path from "path";
import { fileURLToPath } from "url";
const _filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(_filename);

const { User } = models;

eventEmmitter.on("sendOTP-newcustomer", async (payload) => {
    try {
        console.log("sendOTP-newcustomer");
        const subject = "Noels Delivery OTP Code is " + payload.notifiable.otp;
        const otpClasses = {
            fontSize: '24px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '20px',
        }
        const emailBody = new EmailTemplateBuilder({ appConfig: { title: 'Customer OTP Notification' } })
            .addBlock('p', 'Below is your one time passcode that you need to use to complete your authentication.')
            .addBlock('p', 'The verification code will be valid for 10 minutes. Please do not share this code with anyone.')
            .addBlock('d')
            .addBlock('p', `${payload.notifiable.otp}`, otpClasses)
            .buildHTML();
        const notify = new Notification(subject, emailBody);
        const attachments = [
            {
                filename: "logo.png",
                path: '../../../public/logo.png',
                cid: "noelslogo"
            }
        ];
        if (payload.notificationType.type === 'email') {
            await notify.via(payload.notifiable.user.email, 'viaEmail', { attachments });
        }
        // else if (payload.notificationType.type === 'phone') {
        //     // Send SMS using Twilio
        //     // await notify.via('viaSms', payload.notifiable.phoneNumber);
        // }
        else {
            console.log("Notification type not supported");
            eventEmmitter.emit("sendOTP-newcustomer-not-supported", payload.notifiable);
            return;
        }
        eventEmmitter.emit("sendOTP-newcustomer-initiated");
    } catch (error) {
        console.log({ error: error.message });
    }
});


eventEmmitter.on('sendOTP-newcustomer-initiated', () => {
    console.log("sendOTP-newcustomer-initiated")
});
eventEmmitter.on('sendOTP-newcustomer-not-supported', async (payload) => {
    console.log("sendOTP-newcustomer-not-supported")
    const user = await User.findByPk(payload.id);
    if (user) {
        await user.destroy();
    }
});