import { CreateUserService } from "../../../core/services/auth/create.user.service.js";

export class CreateAccount {
    /**
     * 
     * @param {CreateUserService} CreateAccountService 
     */
    constructor(CreateAccountService) {
        this.createAccountService = CreateAccountService;
        this.createAccount = this.createAccount.bind(this);
    }
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async createAccount(req, res) {
        try {
            if (!req.body) {
                return res.ApiResponse.error(400);
            }
            const { error, success, user } = await this.createAccountService.handle(req.body);
            if (!success) {
                return res.ApiResponse.error(400, error);
            }
            return res.ApiResponse.success(user, 201, 'Account created successfully');
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }

}