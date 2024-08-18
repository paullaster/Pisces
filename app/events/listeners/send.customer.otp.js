import { eventEmmitter } from "../index.js"
import * as fs from "fs";
import app from "../../../config/app.js";
import { Notification } from "../../notifications/notification.js";
import User from "../../../data/integrations/database/models/users.js";
import path from "path";
import { fileURLToPath } from "url";
const _filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(_filename);

eventEmmitter.on("sendOTP-newcustomer", async(payload) => {
    try {
        console.log("sendOTP-newcustomer");
        const subject = "Neols Delivery OTP Code is " + payload.notifiable.Otps[0]['dataValues'].otp;
        const templateUrl =  path.join(__dirname, '../../../resources/views/otp.mail.template.html');
        const logoUrl = `${app.webUrl}/public/logo.svg`;
        const OTPemailTemplate = fs.readFileSync(templateUrl, "utf8");
        const mailBody = OTPemailTemplate
            .replace('{{ otp }}', payload.notifiable.Otps[0]['dataValues'].otp)
            .replace('logo-url', logoUrl);
        const notify = new Notification(subject, mailBody);
        if (payload.notificationType.type === 'email') {
            await notify.via('viaEmail', payload.notifiable.email);
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


eventEmmitter.on('sendOTP-newcustomer-initiated', ()=> {
    console.log("sendOTP-newcustomer-initiated")
});
eventEmmitter.on('sendOTP-newcustomer-not-supported', async(payload)=> {
    console.log("sendOTP-newcustomer-not-supported")
    const user = await User.findByPk(payload.id);
    user.destroy();
});