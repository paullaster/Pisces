import  jwt from "jsonwebtoken";
import app from "../../../config/app.js";
class LoginController {
    constructor(LoginUseCase) {
        this.LoginUseCase = LoginUseCase;
        this.login = this.login.bind(this);
    }
    async login(req, res) {
        try {
            if (!req.body) {
                return res.ApiResponse.error(400);
            }
            const { username, password } = req.body;
            const { error, success, user } = await this.LoginUseCase.handle(username, password);
            if (!success) {
                return res.ApiResponse.error(401, error);
            }
            console.log();
            const token = jwt.sign({username: user.username, email: user.email}, app.key, {algorithm: 'HS512', expiresIn: '1h' });
            return res.ApiResponse.success(token, 200, "Login successful");
        } catch (error) {
            res.ApiResponse.error(500, error.message);
        }
    }
};

export default LoginController;