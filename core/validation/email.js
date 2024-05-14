export class Email {
    constructor(email) {
        if(!this.isValidEmail(email)) {
            throw new Error('Invalid email');
        }
        this.email = email;
    }
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}