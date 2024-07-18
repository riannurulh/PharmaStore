const {Product,User,Profile,OrderProduct,Seller} = require('../models/index')
const {Op} = require('sequelize')
const bcrypt = require('bcryptjs');
const formatIDR = require('../helper/formatIDR')
const { sendEmail } = require('../nodemailer/nodemailer');

class Controller{
    static async login(req,res){
        try {
            const {error,mail} = req.query
            if (mail) {
                sendEmail(mail)
            }
            res.render('index',{mail,error})
        } catch (error) {
            res.send(error.message)
        }
    }
    static async postLogin(req,res){
        try {
            const {email,password}=req.body
            let user = await User.findOne({where:{email}})
            if (user) {
                if (bcrypt.compareSync(password, user.password)) {
                    req.session.UserId = user.id
                    req.session.role = user.role
                    res.redirect('/shop')
                } else {
                    res.redirect(`/?error=invalid email/password`)
                }
            } else {
                res.redirect(`/?error=invalid email/password`)
            }
        } catch (error) {
            res.send(error.message)
        }
    }
    static async register(req,res){
        try {
            res.render('register')
        } catch (error) {
            res.send(error.message)
        }
    }
    static async postRegister(req,res){
        try {
            const {email,password,phoneNumber,address,name} = req.body
            await User.create({email,password,phoneNumber})
            let user = await User.findOne({where:{email}})
            await Profile.create({address,name,UserId:user.id})
            res.redirect(`/?mail=${email}`)
        } catch (error) {
            res.send(error.message)
        }
    }
    static async showAllProducts(req,res){
        try {
            const {search,send} = req.query
            let products
            if (search) {
                products = await Product.findAll({where:{

                    name:{[Op.iLike]: `%${search}%`}
                }})
            } else {
                products = await Product.showAll()
            }
            console.log(send);
            res.render('shop',{products,formatIDR,send})
        } catch (error) {
            res.send(error.message)
        }
    }
    static async addToCart(req,res){
        try {
            const {id} = req.params

            let data = await OrderProduct.findOne({
                where:{
                    ProfileId: req.session.UserId,
                    ProductId: id
                }
            })
            if (data) {
                await OrderProduct.increment({ total: 1 }, { where: { 
                    ProfileId: req.session.UserId,
                    ProductId: id
                 } });
            } else {
                await OrderProduct.create({
                    ProfileId: req.session.UserId,
                    ProductId: id,
                    total: 1
                })
            }
            res.redirect('/shop')
        } catch (error) {
            res.send(error.message)
        }
    }
    static async checkout(req,res){
        try {
            let data = await Profile.findAll({
                include:{
                    model:Product,
                },
                where:{
                    id:req.session.UserId
                }
            })
            res.render('checkout',{data,formatIDR})
        } catch (error) {
            res.send(error.message)
        }
    }
    static async deleteListCheckout(req,res){
        try {
            const {id} = req.params
            await OrderProduct.destroy({where:{ProductId:id,ProfileId:req.session.UserId}})
            res.redirect('/checkout')
        } catch (error) {
            res.send(error.message)
        }
    }
    static async sendOrder(req,res){
        try {
            const {id} = req.params
            await OrderProduct.destroy({where:{ProfileId:id}})
            res.redirect('/shop?send=sent')
        } catch (error) {
            res.send(error.message)
        }
    }
    static async loginAdmin(req,res){
        try {
            const {error} = req.query
            res.render('indexAdmin',{error})
        } catch (error) {
            res.send(error.message)
        }
    }
    static async postLoginAdmin(req,res){
        try {
            const {email,password}=req.body
            let user = await Seller.findOne({where:{email}})
            if (user) {
                if (password, user.password) {
                    req.session.UserId = user.id
                    res.redirect('/shopAdmin')
                } else {
                    res.redirect(`/admin?error=invalid email/password`)
                }
            } else {
                res.redirect(`/admin?error=invalid email/password`)
            }
        } catch (error) {
            res.send(error.message)
        }
    }
    static async showAllProductsAdmin(req,res){
        try {
            const {search,deleted} = req.query
            let products
            if (search) {
                products = await Product.findAll({where:{

                    name:{[Op.iLike]: `%${search}%`}
                }})
            } else {
                products = await Product.findAll()
            }
            res.render('shopAdmin',{products,formatIDR,deleted})
        } catch (error) {
            res.send(error.message)
        }
    }
    static async deleteProduct(req,res){
        try {
            const {id} = req.params
            let product = await Product.findByPk(id)
            await Product.destroy({where:{id}})
            res.redirect(`/shopAdmin?deleted=${product.name}`)
        } catch (error) {
            res.send(error.message)
        }
    }
    static async showFormAdd(req,res){
        try {
            const {errors} = req.query

            res.render('addForm',{errors})
        } catch (error) {
            res.send(error.message)
        }
    }
    static async postFormAdd(req,res){
        try {
            const {name,description,price} = req.body
            await Product.create({name,description,price})
            res.redirect('/shopAdmin')
        } catch (error) {
            if (error.name==='SequelizeValidationError'||error.name==='SequelizeUniqueConstraintError') {
                error = error.errors.map(el=>{
                    return el.message
                })
                res.redirect(`/add?errors=${error}`)
            } else {
                res.send(error.message)
            }
        }
    }
    static getLogout(req,res){
        req.session.destroy((err)=>{
            if (err) res.send(err)
            else {
                res.redirect('/')
            }
        })
    }
}

module.exports = Controller