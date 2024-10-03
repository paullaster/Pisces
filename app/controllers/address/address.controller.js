import { JoiSanitizer } from "../../middleware/joisanitizer.js";

export class AddressController {
    constructor(addressService) {
        this.addressService = addressService;
        this.fetchAddress = this.fetchAddress.bind(this);
        this.createAddress = this.createAddress.bind(this);
        this.updateAddress = this.updateAddress.bind(this);
        this.deleteAddress = this.deleteAddress.bind(this);
    }

    async fetchAddress(req, res) {
        try {
            if (!req.params.addressId) {
                return res.ApiResponse.error(400, 'The address ID is required');
            }
            const { success, address, error } = await this.addressService.fetchAddress(req.params.addressId);
            if (!success) {
                return res.ApiResponse.error(400, error);
            }
            return res.ApiResponse.success(address, 200, ' ');
        } catch (error) {
            return res.ApiResponse.error(400, error);
        }
    }
    async createAddress(req, res) {
        try {
            if (!req.body) {
                return res.ApiResponse.error(400, 'Invalid address data');
            }
            const sanitizer = new JoiSanitizer();
            const validatedAddress = sanitizer.validateAddress(req.body);
            if (validatedAddress.error) {
                return res.ApiResponse.error(400, validatedAddress.error.details[0].message);
            }
            const user = req.user.userId;
            const { success, address, error } = await this.addressService.createAddress(user, req.body);
            if (!success) {
                return res.ApiResponse.error(400, error);
            }
            return res.ApiResponse.success(address, 201, 'Address created');
        } catch (error) {
            return res.ApiResponse.error(400, error.message);
        }
    }
    async updateAddress(req, res) {}
    async deleteAddress(req, res) {}
}