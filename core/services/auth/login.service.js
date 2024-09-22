import bcrypt from 'bcrypt';
import { eventEmmitter } from '../../../app/events/index.js';

class LoginUseCase {
    constructor(userRespository) {
        this.userRespository = userRespository;
        this.handle = this.handle.bind(this);
        this.generateOTP = this.generateOTP.bind(this);
        this.getUser = this.getUser.bind(this);
        this.sendOTP = this.sendOTP.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }
    async handle(username, password) {
       try {
        let {user, success, error } = await this.userRespository.getUserByUsername(username);
        console.log(user);
        if (!success) {
                return { error, success};
        }
        const isPasswordMatch  = await bcrypt.compare(password, this.userRespository.userPassword)
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
}

export default LoginUseCase;