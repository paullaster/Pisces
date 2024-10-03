import { Address } from "../../core/types/address.js";
export class SequelizeAddressRepository {
    constructor(AddressModel) {
        this.dataSource = AddressModel;
        this.mapToAddress = this.mapToAddress.bind(this);
        this.getAddressById = this.getAddressById.bind(this);
        this.update = this.update.bind(this);
        this.getUserAddresses = this.getUserAddresses.bind(this);
        this.create = this.create.bind(this);
    }

    // Implement CRUD operations here...
    mapToAddress(data) {
        try {
            const address = data ? data['dataValues'] : {};
            return { success: true, data: new Address(address) }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }
    async getAddressById(addressId, associatedModel = [], type = 'fetch') { }
    async getUserAddresses(userId, associatedModel =[], type = 'fetch', earger = false) {
        try {
            const userAddresses = await this.dataSource.findAll({
                where: { userId },
                include: associatedModel,
                order: [['addressId', 'DESC']],
            });
            return { success: true, data: userAddresses.map(addr => this.mapToAddress(addr)?.data) };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    async update(addressId, data) { }
    async create(address) {
        try {
            const userAddresses = await this.dataSource.findAll({
                where: { userId: address.userId },
                order: [['addressId', 'DESC']],
            });
            if (userAddresses.length >= 2) {
                return { success: false, error: 'User can have a maximum of 2 addresses.' };
            }
            const newAddress = await this.dataSource.create(address);
            return await this.getUserAddresses(newAddress['dataValues'].userId);
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    async delete(addressId) { }
}