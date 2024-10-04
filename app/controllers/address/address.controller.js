import { JoiSanitizer } from "../../middleware/joisanitizer.js";

export class AddressController {
    constructor(addressService) {
        this.addressService = addressService;
        this.fetchAddresses = this.fetchAddresses.bind(this);
        this.createAddress = this.createAddress.bind(this);
        this.updateAddress = this.updateAddress.bind(this);
        this.deleteAddress = this.deleteAddress.bind(this);
        this.setDefaultAddress = this.setDefaultAddress.bind(this);
        this.fetchAddressById = this.fetchAddressById.bind(this);
    }

    async fetchAddresses(req, res) {
        try {
            const { success, address, error } = await this.addressService.fetchAddresses(req.user.userId);
            if (!success) {
                return res.ApiResponse.error(400, error);
            }
            return res.ApiResponse.success(address, 200, ' ');
        } catch (error) {
            return res.ApiResponse.error(400, error.message);
        }
    }
    async fetchAddressById(req, res) {
        try {
            const { success, address, error } = await this.addressService.fetchAddressById(req.params.addressId);
            if (!success) {
                return res.ApiResponse.error(404, error);
            }
            return res.ApiResponse.success(address, 200, ' ');
        } catch (error) {
            return res.ApiResponse.error(400, error.message);
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
            const { success, address, error } = await this.addressService.createAddress(user, validatedAddress.value);
            if (!success) {
                return res.ApiResponse.error(400, error);
            }
            return res.ApiResponse.success(address, 201, 'Address created');
        } catch (error) {
            return res.ApiResponse.error(400, error.message);
        }
    }
    async updateAddress(req, res) {
        try {
            if (!req.body) {
                return res.ApiResponse.error(400, 'Invalid address data');
            }
            const sanitizer = new JoiSanitizer();
            const sanitizedObject = sanitizer.sanitizeObject(req.body);
            const { success, address, error } = await this.addressService.updateAddress(req.user.userId, req.params.addressId, sanitizedObject);
            if (!success) {
                return res.ApiResponse.error(400, error);
            }
            return res.ApiResponse.success(address, 200, 'Address updated');
        } catch (error) {
            return res.ApiResponse.error(400, error.message);
        }
    }
    async setDefaultAddress(req, res) {
        try {
            const { success, error, address } = await this.addressService.setDefaultAddress(req.user.userId, req.params.addressId);
            if (!success) {
                return res.ApiResponse.error(400, error);
            }
            return res.ApiResponse.success(address, 200, 'Default address set');
        } catch (error) {
            return res.ApiResponse.error(400, error.message);
        }
    }
    async deleteAddress(req, res) {
        try {
            const { success, error, address } = await this.addressService.deleteAddress( req.user.userId, req.params.addressId);
            if (!success) {
                return res.ApiResponse.error(400, error);
            }
            return res.ApiResponse.success(address, 200, 'Address deleted');
        } catch (error) {
            return res.ApiResponse.error(400, error.message);
        }
    }
}