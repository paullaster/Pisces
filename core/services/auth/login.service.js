import bcrypt from 'bcrypt';

class LoginUseCase {
    constructor(userRespository) {
        this.userRespository = userRespository;
        this.handle = this.handle.bind(this);
    }
    async handle(username, password) {
       try {
        let {user, success, error } = await this.userRespository.getUserByUsername(username);
        if (!success) {
                return { error, success};
        }
        const isPasswordMatch  = await bcrypt.compare(password, this.userRespository.userPassword)
        if (isPasswordMatch !== true) {
            return { error: "Password mismatch", success: false };
        }
        return {success, user};
       } catch (error) {
         return { error: error.message, success: false };
       }
    }
}

export default LoginUseCase;