export class FetchUserAssociationController {
    constructor(fetchUserAssociationService) {
        this.fetchUserAssociationService = fetchUserAssociationService;
        this.fetchUserAssociation = this.fetchUserAssociation.bind(this);
    }
    async fetchUserAssociation(req, res) {
        try {
            const { success, user, error } = await this.fetchUserAssociationService.fetchUserAssociation(req.user.userId, req.model);
            if (!success) {
                return res.ApiResponse.error(500, error);
            }
            return res.ApiResponse.success(user, 200, " ");
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
}