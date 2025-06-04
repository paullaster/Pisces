/**
 * @typedef {Object} UserProps
 * @property {number} [id]
 * @property {string} [firstName]
 * @property {string} [lastName]
 * @property {string} [email]
 * @property {string} [phoneNumber]
 * @property {Date|string} [email_verified_at]
 * @property {boolean} [veryfied]
 * @property {boolean} [completed]
 * @property {'customer'|'admin'} [type]
 * @property {Date|string} [lastLogin]
 * @property {Date|string} [createdAt]
 * @property {Date|string} [updatedAt]
 */

/**
 * User entity representing a user in the system, excluding sensitive fields.
 */
export class User {
    /** @type {number|undefined} */
    id;
    /** @type {string|undefined} */
    firstName;
    /** @type {string|undefined} */
    lastName;
    /** @type {string|undefined} */
    email;
    /** @type {string|undefined} */
    phoneNumber;
    /** @type {Date|string|undefined} */
    email_verified_at;
    /** @type {boolean|undefined} */
    veryfied;
    /** @type {boolean|undefined} */
    completed;
    /** @type {'customer'|'admin'|undefined} */
    type;
    /** @type {Date|string|undefined} */
    lastLogin;
    /** @type {Date|string|undefined} */
    createdAt;
    /** @type {Date|string|undefined} */
    updatedAt;

    /**
     * @param {UserProps} obj
     */
    constructor(obj = {}) {
        this.id = obj.id;
        this.firstName = obj.firstName;
        this.lastName = obj.lastName;
        this.email = obj.email;
        this.phoneNumber = obj.phoneNumber;
        this.email_verified_at = obj.email_verified_at;
        this.veryfied = obj.veryfied;
        this.completed = obj.completed;
        this.type = obj.type;
        this.lastLogin = obj.lastLogin;
        this.createdAt = obj.createdAt;
        this.updatedAt = obj.updatedAt;
    }

    /**
     * Returns a plain object representation of the user, excluding undefined fields.
     * @returns {UserProps}
     */
    toJSON() {
        /** @type {UserProps} */
        const result = {};
        for (const key of Object.keys(this)) {
            if (this[key] !== undefined) {
                result[key] = this[key];
            }
        }
        return result;
    }
}
