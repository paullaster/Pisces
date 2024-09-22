import express from 'express';
import LoginController from '../app/controllers/users/login.js';
import LoginUseCase from '../core/services/auth/login.service.js';
import { SequelizeUserRespository } from '../data/interfaces/sequelize.user.repository.js';
import User from '../data/integrations/database/models/users.js';
import { CreateAccount } from '../app/controllers/users/create.account.js';
import { CreateUserService } from '../core/services/auth/create.user.service.js';


const userRoutes = express.Router();
const userRepository = new SequelizeUserRespository(User);
const loginUseCase = new LoginUseCase(userRepository);
const loginController = new LoginController(loginUseCase);

// create account
const accountCreationService = new CreateUserService(userRepository)
const createAccount = new CreateAccount(accountCreationService);

userRoutes.post('/register', createAccount.createAccount);
userRoutes.post('/login', loginController.login);
userRoutes.post('/get-user', loginController.getUser);
userRoutes.post('/verify-otp', loginController.verifyOTP);
export { userRoutes};