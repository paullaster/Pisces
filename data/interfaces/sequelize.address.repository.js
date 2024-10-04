import { Address } from "../../core/types/address.js";
export class SequelizeAddressRepository {
    constructor(AddressModel) {
        this.dataSource = AddressModel;
        this.mapToAddress = this.mapToAddress.bind(this);
        this.fetchById = this.fetchById.bind(this);
        this.update = this.update.bind(this);
        this.getUserAddresses = this.getUserAddresses.bind(this);
        this.create = this.create.bind(this);
        this.setAddressDefault = this.setAddressDefault.bind(this);
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
    async fetchById(addressId, associatedModel = [], type = 'fetch') {
        try {
            const address = await this.dataSource.findByPk(addressId);
            return { success: true, data: this.mapToAddress(address)?.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    async getUserAddresses(userId, associatedModel = [], type = 'fetch', earger = false, filters = {}, options = {}) {
        try {
            const userAddresses = await this.dataSource.findAll({
                where: { userId, ...filters},
                include: associatedModel,
                order: [['addressId', 'DESC']],
                ...options
            });
            return { success: true, data: userAddresses.map(addr => this.mapToAddress(addr)?.data) };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    async update(user, addressId, data) {
        try {
            const updatedAddress = await this.dataSource.update(data, { where: { addressId, userId: user } });
            return updatedAddress > 0 ? await this.getUserAddresses(user) : { success: false, error: 'No address found or not updated.' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    async setAddressDefault(user, addressId) {
        try {
            const currentActive = await this.dataSource.findAll({where: { userId: user, default: true}});
            if (currentActive.length) {
                await this.dataSource.update({ default: false }, { where: { userId: user, default: true } });
            }
            await this.dataSource.update({ default: true }, { where: { addressId, userId: user } });
            return await this.getUserAddresses(user);
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    async create(address) {
        try {
            const userAddresses = await this.dataSource.findAll({
                where: { userId: address.userId },
                order: [['addressId', 'DESC']],
            });
            if (userAddresses.length >= 2) {
                return { success: false, error: 'User can have a maximum of 2 addresses.' };
            }
            if (!userAddresses.length) {
                address.default = true;
            }
            const newAddress = await this.dataSource.create(address);
            return await this.getUserAddresses(newAddress['dataValues'].userId);
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    async delete(user, addressId) {
        try {
            const count = await this.dataSource.count({ where: { userId: user } });
            if (count > 1) {
                const userAddresses = await this.dataSource.findAll({ where: { userId: user} });
                const deleteDefault = userAddresses.find((addr) => {
                    return addr['dataValues'].default && addr['dataValues'].addressId === addressId;
                })
                if (deleteDefault) {
                    const toSetDefault = userAddresses.find((ntDefault) => ntDefault['dataValues'].addressId !== addressId)
                    await this.setAddressDefault(user, toSetDefault['dataValues'].addressId);
                }
            }
            await this.dataSource.destroy({ where: { addressId, userId: user } });
            return await this.getUserAddresses(user);

        } catch (error) {
            console.log(error)
            return { success: false, error: error.message };
        }
    }
}