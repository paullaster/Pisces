'use strict'

import { Sequelize, DataTypes } from 'sequelize'
import config from '../../../../config/db.cjs'
import user from './user.js'
import address from './address.js'
import otp from './otp.js'
import image from './image.js'
import category from './category.js'
import productcategory from './productcategory.js'
import attribute from './attribute.js'
import attributevalue from './attributevalue.js'
import cart from './cart.js'
import cartitem from './cartitem.js'
import deliverylocation from './deliverylocation.js'
import discount from './discount.js'
import notification from './notification.js'
import order from './order.js'
import orderitem from './orderitem.js'
import orderitemdiscount from './orderitemdiscount.js'
import paymentmethod from './paymentmethod.js'
import product from './product.js'
import productdiscount from './productdiscount.js'
import productvariant from './productvariant.js'
import transaction from './transaction.js'
import variantattribute from './variantattribute.js'
import warehouse from './warehouse.js'

const env = process.env.NODE_ENV || 'development'

const { database, username, password, ...options } = config[env]

const sequelize = new Sequelize(database, username, password, options)

try {
  sequelize.authenticate()
  console.log('Database connected successfully')
}
catch (error) {
  console.error('Unable to connect to the database:', error)
  throw error
}

const models = {
  User: user(sequelize, DataTypes),
  Address: address(sequelize, DataTypes),
  Otp: otp(sequelize, DataTypes),
  Category: category(sequelize, DataTypes),
  Image: image(sequelize, DataTypes),
  ProductCategory: productcategory(sequelize, DataTypes),
  Attribute: attribute(sequelize, DataTypes),
  AttributeValue: attributevalue(sequelize, DataTypes),
  Cart: cart(sequelize, DataTypes),
  CartItem: cartitem(sequelize, DataTypes),
  DeliveryLocation: deliverylocation(sequelize, DataTypes),
  Discount: discount(sequelize, DataTypes),
  Notification: notification(sequelize, DataTypes),
  Order: order(sequelize, DataTypes),
  OrderItem: orderitem(sequelize, DataTypes),
  OrderItemDiscount: orderitemdiscount(sequelize, DataTypes),
  PaymentMethod: paymentmethod(sequelize, DataTypes),
  Product: product(sequelize, DataTypes),
  ProductDiscount: productdiscount(sequelize, DataTypes),
  ProductVariant: productvariant(sequelize, DataTypes),
  Transaction: transaction(sequelize, DataTypes),
  VariantAttribute: variantattribute(sequelize, DataTypes),
  Warehouse: warehouse(sequelize, DataTypes),
}

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models)
  }
})
export { sequelize, models }