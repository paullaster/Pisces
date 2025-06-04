import { Assets } from "../../core/types/assets.js";
import { AssetRepository } from "../../core/app/asset.interface.js";

export class SequelizeAssetRepository extends AssetRepository {
    constructor(AssetModel) {
        super();
        this.dataSource = AssetModel;
        this.mapToCart = this.mapToCart.bind(this);
        this.getCartById = this.getCartById.bind(this);
        this.update = this.update.bind(this);
    }
    /**
     * 
     * @param {*} assetId 
     * @param {*} associatedModel 
     * @param {*} type 
     * @param {*} eagerLoad 
     * @returns 
     */
    async getCartById(assetId, associatedModel = [], type = 'fetch', eagerLoad = false) {
        try {
            let asset;
            if (eagerLoad) {
                asset = await this.dataSource.findByPk(assetId, {
                    include: associatedModel,
                });
            } else {
                asset = await this.dataSource.findByPk(assetId);
            }
            if (type === 'create' && asset) {
                return { error: 'asset already exist', success: false };
            }
            if (type === 'create' && !asset) {
                return { success: true };
            }
            if (type !== 'create' && !asset) {
                return { error: 'asset does not exist', success: false };
            }
            return this.mapToCart(asset);
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    /**
     * 
     * @param {*} asset 
     * @param {*} model 
     * @param {*} bulk 
     * @returns 
     */
    async create(asset, model = [], bulk = false) {
        try {
            console.log(asset)
            // Create a new asset
            const newAsset = bulk ? await this.dataSource.bulkCreate(asset) : await this.dataSource.create(asset);
            return this.mapToCart(newAsset);
        } catch (error) {
            console.log(error);
            // await this.delete(asset.assetId);
            return { error: error.message, success: false };
        }
    }
    async update(cartItem, payload, model) {
        try {
            const { data, success, error } = await this.getCartById(cartItem, model, 'fetch', true);
            if (!success) {
                return { success: false, error };
            }
            const asset = await this.dataSource.findByPk(cartItem);
            const itemToUpdate = data.Items.findIndex(dataItem => dataItem['dataValues'].productId === payload.item.productId);
            if (itemToUpdate !== -1) {
                data.Items[itemToUpdate]['dataValues'].price = payload.item.price;
                data.Items[itemToUpdate]['dataValues'].quantity = payload.item.quantity;
                data.Items[itemToUpdate]['dataValues'].color = payload.item.color;
                data.Items[itemToUpdate]['dataValues'].size = payload.item.size;

            }
            const passedModel = await model.findByPk(data.Items[itemToUpdate]['dataValues'].itemId);
            await passedModel.update(data.Items[itemToUpdate]['dataValues']);
            return this.mapToCart(asset);
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    async delete(id, model) {
        try {
            const { success, error } = await this.getCartById(id, model, 'fetch', true);
            if (!success) {
                return { success: false, error };
            }
            const deletedCart = await this.dataSource.destroy({
                where: {
                    assetId: id,
                }
            });
            return { success: true, data: deletedCart };
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    /**
     * 
     * @param {*} asset 
     * @returns 
     */
    mapToCart(asset) {
        try {
            return { success: true, data: new Assets(asset['dataValues']) };
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
}