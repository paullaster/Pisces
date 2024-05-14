import bcrypt from 'bcrypt';

class LoginUseCase {
    constructor(userRespository) {
        this.userRespository = userRespository;
        this.handle = this.handle.bind(this);
    }
    async handle(username, password) {
       try {
        let user = await this.userRespository.getUserByUsername(username);
        if (!user) {
            user = await this.userRespository.getUserByEmail(username);
            if (!user) {
                return { error: "User not found", success: false};
            }
        }
        const isPasswordMatch  = await bcrypt.compare(password, this.userRespository.password)
        if (isPasswordMatch !== true) {
            return { error: "Password mismatch", success: false };
        }
        return {success: true, user};
       } catch (error) {
         return { error: error.message, success: false };
       }
    }
}

export default LoginUseCase;