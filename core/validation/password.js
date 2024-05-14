export class Password {
    constructor(password) {
        if(!this.isValidPassword(password)) {
            throw new Error('Invalid password');
        }
        this.password =  password;
    }
    isValidPassword(password) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
    }
}