/**
 * OTP Entity
 * Represents the core business object for OTP operations.
 */
export class OTP {
    /**
     * @param {Object} params
     * @param {string} params.userId - The ID of the user.
     * @param {number} params.otp - The generated OTP.
     * @param {string} params.purpose - The purpose of the OTP.
     * @param {Date} params.expiryTime - The expiration time of the OTP.
     * @param {boolean} params.isUsed - Whether the OTP has been used.
     */
    constructor({ userId, otp, purpose, expiryTime, isUsed = false }) {
        this.userId = userId;
        this.otp = otp;
        this.purpose = purpose;
        this.expiryTime = expiryTime;
        this.isUsed = isUsed;
    }

    /**
     * Checks if the OTP is expired.
     * @returns {boolean}
     */
    isExpired() {
        return new Date() > this.expiryTime;
    }

    /**
     * Marks the OTP as used.
     */
    markAsUsed() {
        this.isUsed = true;
    }

    /**
     * Validates the OTP against input and checks its state.
     * @param {number} inputOTP
     * @returns {{boolean, string}} Validation result
     *         -Validation result.isValid - Whether the OTP is valid.
     *         -Validation result.reason - The reason if invalid.
     */
    validate(inputOTP) {
        if (this.isUsed) {
            return { isValid: false, reason: 'OTP already used' };
        }
        if (this.isExpired()) {
            return { isValid: false, reason: 'OTP expired' };
        }
        if (this.otp !== inputOTP) {
            return { isValid: false, reason: 'Invalid OTP' };
        }
        return { isValid: true, reason: 'OTP is valid' };
    }
}
