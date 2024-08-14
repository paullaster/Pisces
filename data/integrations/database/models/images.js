import { uppercasefirst } from "../../../../common/uppercasefirst.js";
import { sequelize } from "../connection.js";
import { DataTypes } from "sequelize";

const Image = sequelize.define('Image',{
    imgId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    imagableId: {
        type: DataTypes.STRING,
    },
    imagableType: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
    },
},
{
    tableName: 'images',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
}
);
Image.prototype.getImagable = async function(options){
    if(!this.imagableType) return Promise.resolve(null);
    const mixinMethodName = `get${uppercasefirst(this.imagableType)}`;
    return this[mixinMethodName](options);
}
Image.addHook('afterFind', (findResult)=> {
    if(!Array.isArray(findResult)) findResult = [findResult];
    for (const instance of findResult) {
        if(instance.imagableType === 'Product' && instance.Product !== undefined){
            instance.imagable = instance.product;
        }else if (instance.imagableType === 'Category' && instance.Category !== undefined){
            instance.imagable = instance.category;
        }
        delete instance.Product;
        delete instance.dataValues.Product;
        delete instance.Category;
        delete instance.dataValues.Category;
    }
})
Image.sync();

export default Image;