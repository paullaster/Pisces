import { Email } from "../../validation/email.js";
import { Password } from "../../validation/password.js";
import { Username } from "../../validation/username.js";
import bcrypt from "bcrypt";

export class CreateUserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.handle = this.handle.bind(this);
    }
    async handle(userData) {
        try {
            const { email, username, password, phoneNumber } = userData;
            const emailObj = new Email(email);
            const usernameObj = new Username(username);
            const passwordObj = new Password(password);
            const { success, error } = await this.userRepository.getUserByEmail(emailObj.email);
            if (success) {
                return { error, success };
            }
            const salt = await bcrypt.genSalt(10);
            passwordObj.password = await bcrypt.hash(passwordObj.password, salt);
            const newUser = await this.userRepository.create({email: emailObj.email, username: usernameObj.username, phoneNumber: phoneNumber, password: passwordObj.password});
            return { success: true, user: newUser };
        } catch (error) {
            console.error(error.message);
            return { success: false, error: error.message };
        }
    }
}