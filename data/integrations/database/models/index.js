'use strict'

import { Sequelize, DataTypes } from 'sequelize'
import config from '../../../../config/db.cjs'
import user from './user'
import address from './address'
import otp from './otp'
import image from './image'
import category from './category'

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
}

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models)
  }
})

export { sequelize, models }