import  jwt from "jsonwebtoken";
import app from "../../../config/app.js";
class LoginController {
    constructor(LoginUseCase) {
        this.LoginController = LoginUseCase;
    }
    async login(req, res) {
        const { username, password } = req.body;
        const { error, success, user } = await this.LoginController.handle(username, password);
        if (!success) {
            return res.status(401).json({ error });
        }
        const token = jwt.sign(user, app.key, {algorithm: 'HS512', expiresIn: '1h' });
        return res.status(200).json({ token });
    }
};

export default LoginController;