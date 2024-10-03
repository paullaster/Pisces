import { RandomCodeGenerator } from "../../../common/generating_unique_codes.js";

export class AddressService {
    constructor(addressRepository) {
        this.addressRepository = addressRepository;
        this.fetchAddress = this.fetchAddress.bind(this);
        this.createAddress = this.createAddress.bind(this);
        this.updateAddress = this.updateAddress.bind(this);
        this.deleteAddress = this.deleteAddress.bind(this);
    }
    async fetchAddress(addressId, model = []) {
        try {
            if (!addressId) {
                return { success: false, error: "Invalid addressId!" };
            }
            const { success, error, data: address } = await this.addressRepository.getById(addressId, model, 'fetch');
            if (!success) {
                return { success: false, error };
            }
            return { success: true, address };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    async createAddress(user, address) {
        try {
            if (!user ||!address) {
                return { success: false, error: "Invalid user or address!" };
            }
            address.userId = user;
            address.addressId = RandomCodeGenerator(5, 'ad');
            const { success, error, data } = await this.addressRepository.create(address);
            if (!success) {
                return { success: false, error };
            }
            return { success: true, address: data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    async updateAddress(addressId, payload) {}
    async deleteAddress(addressId) {}
}