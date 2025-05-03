import { ITOPInterface } from '../../core/app/otp.interface.js';
import { OTP } from '../../core/types/otp.js';

/**
 * SequelizeOTPRepository
 * Implements ITOPInterface using Sequelize ORM.
 */
export class SequelizeOTPRepository extends ITOPInterface {
    /**
     * @param {Object} sequelizeModel - The Sequelize model for OTP.
     */
    constructor(sequelizeModel) {
        super();
        this.model = sequelizeModel;
    }

    /**
     * Saves an OTP entry in the repository.
     * @param {Object} otpData
     * @param {string} otpData.userId
     * @param {number} otpData.otp
     * @param {string} otpData.purpose
     * @param {Date} otpData.expiryTime
     * @param {boolean} otpData.isUsed
     * @returns {Promise<void>}
     */
    async saveOTP(otpData) {
        try {
            await this.model.create(otpData);
        } catch (error) {
            throw new Error(`Failed to save OTP: ${error.message}`);
        }
    }

    /**
     * Retrieves an OTP entry for a specific user and purpose.
     * @param {string} userId
     * @param {string} purpose
     * @returns {Promise<OTP|null>}
     */
    async getOTP(userId, purpose) {
        try {
            const record = await this.model.findOne({
                where: { userId, purpose },
            });

            if (!record) return null;

            return new OTP({
                userId: record.userId,
                otp: record.otp,
                purpose: record.purpose,
                expiryTime: record.expiryTime,
                isUsed: record.isUsed,
            });
        } catch (error) {
            throw new Error(`Failed to retrieve OTP: ${error.message}`);
        }
    }

    /**
     * Marks an OTP as used in the repository.
     * @param {string} userId
     * @param {string} purpose
     * @returns {Promise<void>}
     */
    async markOTPAsUsed(userId, purpose) {
        try {
            const result = await this.model.update(
                { isUsed: true },
                { where: { userId, purpose } }
            );

            if (result[0] === 0) {
                throw new Error('No OTP found to mark as used');
            }
        } catch (error) {
            throw new Error(`Failed to mark OTP as used: ${error.message}`);
        }
    }

    /**
     * Deletes an OTP entry from the repository.
     * @param {string} userId
     * @param {string} purpose
     * @returns {Promise<void>}
     */
    async deleteOTP(userId, purpose) {
        try {
            const result = await this.model.destroy({
                where: { userId, purpose },
            });

            if (result === 0) {
                throw new Error('No OTP found to delete');
            }
        } catch (error) {
            throw new Error(`Failed to delete OTP: ${error.message}`);
        }
    }
}
