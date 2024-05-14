import bcrypt from 'bcrypt';

class LoginUseCase {
    constructor(userRespository) {
        this.userRespository = userRespository;
        this.handle = this.handle.bind(this);
    }
    async handle(username, password) {
       try {
        let {user, success } = await this.userRespository.getUserByUsername(username);
        if (!success) {
            const userByEmail = await this.userRespository.getUserByEmail(username);
            if (!userByEmail) {
                return { error: error, success: false};
            }
            user = userByEmail;
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