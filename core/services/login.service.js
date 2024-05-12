import bcrypt from 'bcrypt';

class LoginUseCase {
    constructor(userRespository) {
        this.userRespository = userRespository;
    }
    async handle(username, password) {
        let user = await this.userRespository.getUserByUsername(username);
        if (!user) {
            user = await this.userRespository.getUserByEmail(username);
            if (!user) {
                return { error: "User not found", success: false};
            }
        }
        const isPasswordMatch  = await bcrypt.compare(password, user.password)
        if (isPasswordMatch !== true) {
            return { error: "Password mismatch", success: false };
        }
        return {success: true, user};
    }
}

export default LoginUseCase;