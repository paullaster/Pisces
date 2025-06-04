/**
 * ITOPInterface defines the contract for OTP repository implementations.
 * This abstraction ensures decoupling between the use case logic and the underlying database.
 */
export class ITOPInterface {
    /**
     * Saves an OTP entry in the repository.
     * @param {Object} otpData
     * @param {string} otpData.userId - The ID of the user.
     * @param {number} otpData.otp - The generated OTP.
     * @param {string} otpData.purpose - The purpose of the OTP.
     * @param {Date} otpData.expiryTime - The expiration time of the OTP.
     * @param {boolean} otpData.isUsed - Whether the OTP has been used.
     * @returns {Promise<void>}
     */
    async saveOTP(otpData) {
        throw new Error('saveOTP method must be implemented');
    }

    /**
     * Retrieves an OTP entry for a specific user and purpose.
     * @param {string} userId - The ID of the user.
     * @param {string} purpose - The purpose of the OTP.
     * @returns {Promise<Object|null>} - The OTP data or null if not found.
     */
    async getOTP(userId, purpose) {
        throw new Error('getOTP method must be implemented');
    }

    /**
     * Marks an OTP as used in the repository.
     * @param {string} userId - The ID of the user.
     * @param {string} purpose - The purpose of the OTP.
     * @returns {Promise<void>}
     */
    async markOTPAsUsed(userId, purpose) {
        throw new Error('markOTPAsUsed method must be implemented');
    }

    /**
     * Deletes an OTP entry from the repository.
     * @param {string} userId - The ID of the user.
     * @param {string} purpose - The purpose of the OTP.
     * @returns {Promise<void>}
     */
    async deleteOTP(userId, purpose) {
        throw new Error('deleteOTP method must be implemented');
    }
}
