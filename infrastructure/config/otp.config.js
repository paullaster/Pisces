export class OTPConfig {
    static DEFAULT_LENGTH = 6;
    static DEFAULT_VALIDITY = 5 * 60 * 1000; // 5 minutes in milliseconds
    static DEFAULT_MIN_RANGE = 100000;
    static DEFAULT_MAX_RANGE = 999999;

    #length;
    #validityPeriod;
    #minRange;
    #maxRange;

    /**
     * @param {Object} [config]
     * @param {number} [config.length]
     * @param {number} [config.validityPeriod]
     * @param {number} [config.minRange]
     * @param {number} [config.maxRange]
     */
    constructor(config = {}) {
        this.#length = config.length || OTPConfig.DEFAULT_LENGTH;
        this.#validityPeriod = config.validityPeriod || OTPConfig.DEFAULT_VALIDITY;
        this.#minRange = config.minRange || Math.pow(10, this.#length - 1);
        this.#maxRange = config.maxRange || Math.pow(10, this.#length) - 1;
    }

    get length() {
        return this.#length;
    }

    get validityPeriod() {
        return this.#validityPeriod;
    }

    get minRange() {
        return this.#minRange;
    }

    get maxRange() {
        return this.#maxRange;
    }

    /**
     * @param {number} length
     * @returns {this}
     */
    setLength(length) {
        this.#length = length;
        this.#updateRanges();
        return this;
    }

    /**
     * @param {number} validityPeriod
     * @returns {this}
     */
    setValidityPeriod(validityPeriod) {
        this.#validityPeriod = validityPeriod;
        return this;
    }
    /**
     *
     */
    #updateRanges() {
        this.#minRange = Math.pow(10, this.#length - 1);
        this.#maxRange = Math.pow(10, this.#length) - 1;
    }
}