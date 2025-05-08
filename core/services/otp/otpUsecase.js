import { randomBytes } from 'crypto';
import { OTPConfig } from '../../../infrastructure/config/otp.config.js';
import { eventEmmitter } from '../../../app/events/index.js';

// @ts-check

/**
 * @typedef {Object} OTPResult
 * @property {boolean} success
 * @property {number} [otp]
 * @property {Date} [expiryTime]
 * @property {string} [message]
 * @property {string} [error]
 * @property {string} [purpose]
 */

/**
 * @typedef {Object} OTPData
 * @property {string} userId
 * @property {number} otp
 * @property {string} purpose
 * @property {Date} expiryTime
 * @property {boolean} isUsed
 */

export class OTPInterface {
    #repository;
    #config;

    /**
     * @param {any} otpRepository - Repository implementation
     * @param {Partial<OTPConfig>} [config] - Optional configuration
     */
    constructor(otpRepository, config = {}) {
        this.#repository = otpRepository;
        this.#config = new OTPConfig(config);
    }

    /**
     * Generates cryptographically secure OTP
     * @returns {number}
     */
    #generateSecureOTP() {
        const buffer = randomBytes(4);
        const num = buffer.readUInt32BE(0);
        return num % (this.#config.maxRange - this.#config.minRange) + this.#config.minRange;
    }

    /**
     * Generates an OTP for a user
     * @param {string} userId 
     * @param {string} purpose 
     * @returns {Promise<OTPResult>}
     */
    async generateOTP(userId, purpose) {
        try {
            const otp = this.#generateSecureOTP();
            const expiryTime = new Date(Date.now() + this.#config.validityPeriod);

            await this.#repository.saveOTP({
                userId,
                otp,
                purpose,
                expiryTime,
                isUsed: false
            });

            return {
                success: true,
                otp,
                expiryTime,
                purpose,
            };
        } catch (error) {
            return { error: `OTP Generation failed: ${error.message}`, success: false };
        }
    }

    /**
 * 
 * @param {*} notifiable 
 * @param {*} notificationType 
 * @returns 
 */
    async sendOTP(notifiable, notificationType) {
        try {
            if (notifiable && notificationType) {
                eventEmmitter.emit('sendOTP-newcustomer', { notifiable, notificationType });
                return { success: true }
            }
        } catch (error) {
            return { error: error.message, success: false };
        }
    }

    /**
     * Verifies an OTP
     * @param {string} userId 
     * @param {number} otp 
     * @param {string} purpose 
     * @returns {Promise<OTPResult>}
     */
    async verifyOTP(userId, otp, purpose) {
        try {
            const storedOTP = await this.#repository.getOTP(userId, purpose);

            if (!storedOTP) {
                return { success: false, message: 'OTP not found' };
            }

            if (this.#isOTPInvalid(storedOTP, otp)) {
                return { success: false, message: this.#getInvalidationReason(storedOTP, otp) };
            }

            await this.#repository.markOTPAsUsed(userId, purpose);
            return { success: true, message: 'OTP verified successfully' };
        } catch (error) {
            return { error: `OTP Verification failed: ${error.message}`, success: false };
        }
    }

    /**
     * @param {OTPData} storedOTP 
     * @param {number} inputOTP 
     * @returns {boolean}
     */
    #isOTPInvalid(storedOTP, inputOTP) {
        return storedOTP.isUsed ||
            new Date() > storedOTP.expiryTime ||
            storedOTP.otp !== inputOTP;
    }

    /**
     * @param {OTPData} storedOTP 
     * @param {number} inputOTP 
     * @returns {string}
     */
    #getInvalidationReason(storedOTP, inputOTP) {
        if (storedOTP.isUsed) return 'OTP already used';
        if (new Date() > storedOTP.expiryTime) return 'OTP expired';
        if (storedOTP.otp !== inputOTP) return 'Invalid OTP';
        return 'Unknown validation error';
    }

    /**
     * Invalidates an OTP
     * @param {string} userId 
     * @param {string} purpose 
     * @returns {Promise<OTPResult>}
     */
    async invalidateOTP(userId, purpose) {
        try {
            await this.#repository.deleteOTP(userId, purpose);
            return { success: true, message: 'OTP invalidated successfully' };
        } catch (error) {
            return { success: false, error: `OTP Invalidation failed: ${error.message}` };
        }
    }
    /**
     * 
     * @param {object} query 
     * @returns 
     */
    async getOTPs(query) {
        try {
            if (!query) {
                return { success: false, error: 'Missing query param.' };
            }
            return await this.#repository.getOTPs(query);
        } catch (error) {
            return { success: false, error: error.message }
        }
    }
}