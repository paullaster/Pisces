/**
 * @class UserRepository
 * @abstract
 */

class UserRepository {
    /**
     * @abstract
     * @param { id } 
     * @returns { Promise<User | null>}
     */
    async getUserById(id) {
        throw new Error('Not implemented');
    }
    /**
     * @abstract
     * @param { username } 
     * @returns { Promise<User | null>}
     */
    async getUserByUsername(username) {
        throw new Error('Not implemented');
    }
    /**
     * @abstract
     * @param { email } 
     * @returns { Promise<User | null>}
     */
    async getUserByEmail(email) {
        throw new Error('Not implemented');
    }
    /**
     * @abstract
     * @param { User} 
     * @returns { Promise<User | null>}
     */
    async update(user) {
        throw new Error('Not implemented');
    }
    /**
     * @abstract
     * @param { id } 
     * @returns { Promise<User | null>}
     */
    async delete(id) {
        throw new Error('Not implemented');
    }
    /**
     * @abstract
     * @param { options} 
     * @param { model }
     * @returns { Promise<User | null>}
     */
    async verifyOTP(options, model) {
        throw new Error('Not implemented');
    }
}

export { UserRepository };