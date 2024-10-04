import { RandomCodeGenerator } from "../../../common/generating_unique_codes.js";

export class AddressService {
    constructor(addressRepository) {
        this.addressRepository = addressRepository;
        this.fetchAddresses = this.fetchAddresses.bind(this);
        this.createAddress = this.createAddress.bind(this);
        this.updateAddress = this.updateAddress.bind(this);
        this.deleteAddress = this.deleteAddress.bind(this);
        this.setDefaultAddress = this.setDefaultAddress.bind(this);
        this.fetchAddressById = this.fetchAddressById.bind(this);
    }
    async fetchAddresses(userId, model = []) {
        try {
            if (!userId) {
                return { success: false, error: "Invalid" };
            }
            const { success, error, data } = await this.addressRepository.getUserAddresses(userId, model, 'fetch', true);
            if (!success) {
                return { success: false, error };
            }
            return { success: true, address: data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    async fetchAddressById(addressId, model = []) {
        try {
            if (!addressId) {
                return { success: false, error: "Invalid user or address ID!" };
            }
            const { success, error, data } = await this.addressRepository.fetchById(addressId, model, 'fetch');
            if (!success) {
                return { success: false, error };
            }
            return { success: true, address: data };
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
            address.addressId = RandomCodeGenerator(8, 'ad');
            const { success, error, data } = await this.addressRepository.create(address);
            if (!success) {
                return { success: false, error };
            }
            return { success: true, address: data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    async updateAddress(user, addressId, payload) {
        try {
            if (!addressId ||!payload) {
                return { success: false, error: "Invalid address ID or payload!" };
            }
            const { success, error, data } = await this.addressRepository.update(user,addressId, payload);
            if (!success) {
                return { success: false, error };
            }
            return { success: true, address: data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    async setDefaultAddress(user, addressId) {
        try {
            if (!addressId) {
                return { success: false, error: "Invalid address ID!" };
            }
            const { success, error, data } = await this.addressRepository.setAddressDefault(user, addressId);
            if (!success) {
                return { success: false, error };
            }
            return { success: true, address: data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    async deleteAddress(user, addressId) {
        try {
            if (!addressId) {
                return { success: false, error: "Invalid address ID!" };
            }
            const { success, error, data } = await this.addressRepository.delete(user, addressId);
            if (!success) {
                return { success: false, error };
            }
            return { success: true, address: data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}