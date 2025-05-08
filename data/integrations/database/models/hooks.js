import LoginUseCase from "../../../../core/services/auth/login.service.js";
import { SequelizeUserRespository } from "../../../interfaces/sequelize.user.repository.js";
import { models } from "./index.js"

// Hooks
const { Otp, User } = models
const userUsecase = new LoginUseCase(new SequelizeUserRespository(User))
Otp.afterUpdate('verifyNewUser', async (otp, options) => {
    console.log("hook:verifyNewUser");
    if (otp.dataValues.purpose === 'newAccount' && otp.dataValues.isUsed) {
        await userUsecase.updateUserProfile(
            otp.dataValues.userId,
            {
                veryfied: true,
                email_verified_at: otp.dataValues.updatedAt,
            }
        )
    }
})