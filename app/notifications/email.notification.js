import { mail } from "../../config/mail.js";
import transporter from "../providers/Mailtransport.js";

export class EmailNotification {
    async send(mailable, ...args) {
        try {
            const info = await transporter.sendMail({
                from: mail.from,
                to: mailable.email,
                subject: mailable.subject,
                html: mailable.html,
                ...args,
            });
            transporter.close();
            return {success: true, data: info};
    } catch(error) {
        console.log(error);
        return {success: false, error: error.message};
    }
}
}