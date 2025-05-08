import { eventEmmitter } from "../index.js";
import { OTP } from "../../controllers/otp/otp.js";
import { OTPInterface } from "../../../core/services/otp/otpUsecase.js";
import { SequelizeOTPRepository } from "../../../data/interfaces/Sequelize.otp.respository.js";
import { models } from "../../../data/integrations/database/models/index.js";
import { Op } from "sequelize";

eventEmmitter.on('delete-expired-user-otp', async (id) => {
    console.log('event:delete-expired-user-otp');
    const { Otp } = models;
    const otpInstance = new OTP(new OTPInterface(new SequelizeOTPRepository(Otp)));
    const expiredOTP = await otpInstance.getOTPs({
        where: {
            expiryTime: {
                [Op.lt]: new Date(),
            }
        }
    });
    console.log("response: ", expiredOTP)
    if ('success' in expiredOTP && !expiredOTP.success) {
        console.log(expiredOTP)
        return;
    }
    if ('otp' in expiredOTP && expiredOTP.otp) {
        if (Array.isArray(expiredOTP.otp) && expiredOTP.otp.length) {
            expiredOTP.otp.forEach(async (o) => {
                const dl = await otpInstance.invalidateOTP(o.userId, o.purpose);
                if (!dl.success) {
                    console.log('Failed to delete expired', dl)
                }
            });
        }
    }
    clearInterval(id);
});