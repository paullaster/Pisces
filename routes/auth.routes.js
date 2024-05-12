import express from 'express';
import LoginController from '../app/controllers/users/login.js';
import LoginUseCase from '../core/services/login.service.js';
import { SequelizeUserRespository } from '../data/interfaces/sequelize.user.repository.js';
import { sequelize } from '../data/integrations/database/connection.js';


const userRoutes = express.Router();
const userRepository = new SequelizeUserRespository(sequelize);
const loginUseCase = new LoginUseCase(userRepository);
const loginController = new LoginController(loginUseCase);

userRoutes.post('/login', loginController.login)
userRoutes.post('/create', );

export { userRoutes};