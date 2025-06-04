import app from "../../../infrastructure/config/app.js";
import { SequelizeUserRespository } from "../../../data/interfaces/sequelize.user.repository.js";
import { Email } from "../../validation/email.js";
import { Password } from "../../validation/password.js";
import bcrypt from "bcrypt";
import { RandomCodeGenerator } from "../../../common/generating_unique_codes.js";

export class CreateUserService {
    /**
     * 
     * @param {SequelizeUserRespository} userRepository 
     */
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.handle = this.handle.bind(this);
    }
    /**
     * 
     * @param {*} userData 
     * @returns 
     */
    async handle(userData) {
        try {
            const { email, password, ...rest } = userData;
            const emailObj = new Email(email);
            const passwordObj = new Password(password);
            const { success, error } = await this.userRepository.getUserByEmail(emailObj.email);
            if (success) {
                if (rest.type === 'admin') {
                    return { error: 'Admin account already exist, Please login instead!', success: false }
                }
                return { error, success };
            }
            const salt = await bcrypt.genSalt(parseInt(String(app.pwdRounds || 10)));
            passwordObj.password = await bcrypt.hash(passwordObj.password, salt);
            const { success: status, error: er, user } = await this.userRepository.create({ id: `${RandomCodeGenerator(6, 'user_')}_${Date.now()}`, email: emailObj.email, password: passwordObj.password, ...rest });
            if (status) {
                return { success: status, user };
            }
            return { success: status, error: er };
        } catch (error) {
            console.error(error.message);
            return { success: false, error: error.message };
        }
    }
}