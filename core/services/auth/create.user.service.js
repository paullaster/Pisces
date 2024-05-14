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
            const { email, username, password } = userData;
        const emailObj = new Email(email);
        const usernameObj = new Username(username);
        const passwordObj = new Password(password);
        const user = await this.userRepository.getUserByEmail(emailObj.email);
        if (user) {
            return { error: "User already exists", success: false };
        }
        const salt = await bcrypt.genSalt(10);
        passwordObj.password = await bcrypt.hash(passwordObj.password, salt);
        console.log(emailObj.email, usernameObj.username, passwordObj.password)
        const newUser = await this.userRepository.create(emailObj.email, usernameObj.username, passwordObj.password);
        return { success: true, user: newUser };
        } catch (error) {
            console.error(error.message);
            return { success: false, error: error.message };
        }
    }
}