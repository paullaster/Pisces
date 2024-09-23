import bcrypt from 'bcrypt';
import { eventEmmitter } from '../../../app/events/index.js';
import app from '../../../config/app.js';

class LoginUseCase {
    constructor(userRespository) {
        this.userRespository = userRespository;
        this.handle = this.handle.bind(this);
        this.generateOTP = this.generateOTP.bind(this);
        this.getUser = this.getUser.bind(this);
        this.sendOTP = this.sendOTP.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.updateUserProfile = this.updateUserProfile.bind(this);
    }
    async handle(username, password) {
       try {
        let {user, success, error } = await this.userRespository.getUserByUsername(username);
        console.log(user);
        if (!success) {
                return { error, success};
        }
        const decodePassword = Buffer.from(password, 'base64').toString('utf-8');
        const isPasswordMatch  = await bcrypt.compare(decodePassword, this.userRespository.userPassword)
        if (isPasswordMatch !== true) {
            return { error: "Password mismatch", success: false};
        }
        return {success, user};
       } catch (error) {
         return { error: error.message, success: false };
       }
    }
    async generateOTP(obj, model) {
        try {
            let {user, success, error } = await this.userRespository.createTempCustomer(obj, model);
            if (!success) {
                return { error, success };
            }
            return {user, success };
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    async sendOTP (notifiable, notificationType) {
       try {
           if (notifiable && notificationType) {
            eventEmmitter.emit('sendOTP-newcustomer', {notifiable, notificationType});
            return { success: true}
        }
       } catch (error) {
        return { error: error.message, success: false };
       }
    }
    async getUser(username){
        try {
            let {user, success, error } = await this.userRespository.getUserByUsername(username);
            if (!success) {
                return { error, success };
            }

            return {user, success };
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    async deleteUser(user) {
        try {
            let { success, error } = await this.userRespository.delete(user);
            if (!success) {
                return { error, success };
            }
            return { success };
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    async verifyOTP(option, model) {
        try {
            let { success, error, user } = await this.userRespository.verifyOTP(option, model);
            if (!success) {
                return { error, success };
            }
            return { success, user };
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    async updateUserProfile(username, payload) {
        try {
            const password = Buffer.from(payload.password, 'base64').toString('utf-8');
            const usrname = Buffer.from(username, 'base64').toString('utf-8');
            const salt = await bcrypt.genSalt(parseInt(app.pwdRounds));
            payload.password = await bcrypt.hash(password, salt);
            let { success, error, user } = await this.userRespository.update(usrname, payload);
            if (!success) {
                return { error, success };
            }
            return { success, user };
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
}

export default LoginUseCase;