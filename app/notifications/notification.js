import { EmailNotification } from "./email.notification.js";

export class Notification {
    constructor(subject, body) {
        this.subject = subject;
        this.body = body;
        this.via = this.via.bind(this);
    }
    async via(channel, notifiable, options = {}) {
        try {
            const notify = {
                email: notifiable,
                subject: this.subject,
                html: this.body,
                ...options,
            }
            console.log(notify)
            switch(channel) {
                case 'viaEmail':
                    return  await new EmailNotification().send(notify)
                case 'viaSms':
                    return;
    
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}