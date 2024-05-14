export class Username {
    constructor(username) {
        if(!this.isValidUsername(username)) {
            throw new Error('Invalid username');
        }
        this.username = username;
    }
    isValidUsername(username) {
        return /^[a-zA-Z0-9_]{3,15}$/.test(username);
    }
}