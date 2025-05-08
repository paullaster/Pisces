/** @typedef {import('../types/user.result.jsdoc').UserResult} UserResult */

/**
 * @class UserRepository
 * @abstract
 */

class UserRepository {
    /**
     * @abstract
     * @param {string|number} id
     * @returns {Promise<UserResult>}
     */
    async getUserById(id) {
        return Promise.resolve({ success: false });
    }
    /**
     * @abstract
     * @param {string} username
     * @returns {Promise<UserResult>}
     */
    async getUserByUsername(username) {
        return Promise.resolve({ success: false })
    }
    /**
     * @abstract
     * @param {string} email
     * @returns {Promise<UserResult>}
     */
    async getUserByEmail(email) {
        return Promise.resolve({ success: false })
    }
    /**
     * @abstract
     * @param {any} userId
     * @param {object} update
     * @returns Promise{ <UserResult>}
     */
    async update(userId, update) {
        return Promise.resolve({ success: false });
    }
    /**
     * @abstract
     * @param {string|number} id
     * @returns {Promise<UserResult>}
     */
    async delete(id) {
        return Promise.resolve({ success: false });
    }
}

export { UserRepository };