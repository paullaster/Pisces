import { EmailNotification } from "./email.notification.js";

export class Notification {
    /**
     * 
     * @param {*} subject 
     * @param {*} body 
     */
    constructor(subject, body) {
        this.subject = subject;
        this.body = body;
        this.via = this.via.bind(this);
    }
    /**
     * 
     * @param {*} notifiable 
     * @param {*} channel 
     * @param {*} options 
     * @returns 
     */
    async via(notifiable, channel = 'viaEmail', options = {}) {
        try {
            const notify = {
                email: notifiable,
                subject: this.subject,
                html: this.body,
                ...options,
            }
            switch (channel) {
                case 'viaEmail':
                    return await new EmailNotification().send(notify)
                case 'viaSms':
                    return;

            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}