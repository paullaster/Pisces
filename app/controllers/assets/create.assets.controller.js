export class CreateAssetscontroller {
    constructor(CreateAssetsService) {
        this.createAssetsService = CreateAssetsService;
        this.createAsset = this.createAsset.bind(this);
    }
    async createAsset(req, res) {
        try {
            if (!req.files ||!req.body) {
                return res.ApiResponse.error(400, 'Invalid data');
            }
            const {success, error } = await this.createAssetsService.handle(req.files, req.body);
            if (!success) {
                return res.ApiResponse.error(500, error);
            }
            return res.ApiResponse.success({}, 201, 'Success');
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
}