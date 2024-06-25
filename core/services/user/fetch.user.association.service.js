export class FetchUserAssociationService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.fetchUserAssociation = this.fetchUserAssociation.bind(this);
    }
    async fetchUserAssociation(userId, model) {
        try {
            if (!userId) {
                return { success: false, error: "Invalid user ID!" };
            }
            if (typeof userId!=='string') {
                return { success: false, error: "User ID must be a string!" };
            }
            const { success, error, data:user } = await this.userRepository.getUserAssociations(userId, model);
            if (!success) {
                return { success, error };
            }
            return { success: true, user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}