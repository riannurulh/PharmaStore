'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsToMany(models.Profile, { through: models.OrderProduct })
      Product.hasMany(models.OrderProduct)
    }
    get priceFormat(){
      return this.price.toLocaleString('id-ID')
    }
    static async showAll() {
      try {
        let data = await Product.findAll()
        return data
      } catch (error) {
        throw error
      }
    }
  }
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull:{
          msg:'nama tidak boleh kosong'
        },
        notEmpty:{
          msg:'nama tidak boleh kosong'
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull:{
          msg:'description tidak boleh kosong'
        },
        notEmpty:{
          msg:'description tidak boleh kosong'
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate:{
        notNull:{
          msg:'harga tidak boleh kosong'
        },
        notEmpty:{
          msg:'harga tidak boleh kosong'
        },
        min:{
          args:1000,
          msg:'harga terendah adalah 1000'
        }
      }
    },
    SellerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
    hooks: {
      beforeCreate: (user, options) => {
        user.SellerId = 1
      },
    },
  });
  return Product;
};