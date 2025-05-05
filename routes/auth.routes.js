import express from 'express';
import LoginController from '../app/controllers/users/login.js';
import LoginUseCase from '../core/services/auth/login.service.js';
import { SequelizeUserRespository } from '../data/interfaces/sequelize.user.repository.js';
import { models } from '../data/integrations/database/models/index.js';
import { CreateAccount } from '../app/controllers/users/create.account.js';
import { CreateUserService } from '../core/services/auth/create.user.service.js';
import { loginActivity } from '../app/middleware/login.activity.js';

const { User } = models;
const authRoutes = express.Router();
const userRepository = new SequelizeUserRespository(User);
const loginUseCase = new LoginUseCase(userRepository);
const loginController = new LoginController(loginUseCase);

// create account
const accountCreationService = new CreateUserService(userRepository)
const createAccount = new CreateAccount(accountCreationService);

authRoutes.post('/register', createAccount.createAccount);
authRoutes.post('/login', loginController.login);
authRoutes.post('/get-user', loginController.getUser);
authRoutes.post('/resend-otp', loginController.resendOTP);
authRoutes.post('/verify-otp', loginController.verifyOTP);
authRoutes.patch('/update-profile/:username', loginController.updateUserProfile);
export { authRoutes };