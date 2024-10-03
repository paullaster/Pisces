export class SetupController {
    constructor(setupService) {
        this.setupService = setupService;
        this.setup = this.setup.bind(this);
        this.getCountries = this.getCountries.bind(this);
    }
    async getCountries(req, res) {
        try {
            const { success, countries, error } = await this.setupService.getCountries();
            if (!success) {
                return res.ApiResponse.error(500, error);
            }
            return res.ApiResponse.success(countries, 200, " ");
        } catch (error) {
            return res.ApiResponse.error(500, error);
        }
    }
    async setup(req, res) {
        try {
            const { success, message, error } = await this.setupService.setup();
            if (!success) {
                return res.ApiResponse.error(500, error);
            }
            return res.ApiResponse.success({}, 200, message);
        } catch (error) {
            console.error(error);
        }
    }
}