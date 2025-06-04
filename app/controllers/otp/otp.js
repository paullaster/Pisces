export class OTP {
    /**
     * 
     * @param {any} otpUsecase - Usecase implementation
     */
    constructor(otpUsecase) {
        this.otpUsecase = otpUsecase;
        this.invalidateOTP = this.invalidateOTP.bind(this);
        this.getOTPs = this.getOTPs.bind(this);
    }
    /**
     * 
     * @param {object} query 
     * @returns Promise<{success: boolean, error?: string, otp?: []}>
     */
    async getOTPs(query) {
        try {
            if (!query) {
                return { success: false, error: 'Missing required argument!' }
            }
            return await this.otpUsecase.getOTPs(query);
        } catch (error) {
            return { success: false, error: error.message }
        }
    }
    /**
     * 
     * @param {*} userId 
     * @param {*} purpose 
     * @returns 
     */
    async invalidateOTP(userId, purpose) {
        try {
            if (!userId || !purpose) {
                return { success: false, error: 'Missing required arguments!' }
            }
            return await this.otpUsecase.invalidateOTP(userId, purpose);

        } catch (error) {
            return { success: false, error: error.message }
        }
    }
}