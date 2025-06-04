
// Custom error types
export class AssetProcessingError extends Error {
    /**
     * 
     * @param {*} message 
     * @param {*} cause 
     */
    constructor(message, cause) {
        super(message);
        this.name = 'AssetProcessingError';
        this.cause = cause;
    }
}