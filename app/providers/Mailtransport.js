import { createTransport } from 'nodemailer';
import { mail } from '../../infrastructure/config/mail.js';

const transporter = createTransport({
    // Specify the transport type explicitly for type safety
    // @ts-ignore
    host: mail.host,
    port: mail.port,
    secure: mail.security === 'true',
    auth: {
        user: mail.username,
        pass: mail.password,
    }
});
export default transporter;