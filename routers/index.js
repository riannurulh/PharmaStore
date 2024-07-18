const express = require('express')
const Controller = require('../controllers/controller')
const router = express.Router()

// define the home page route
router.get('/', Controller.login)
router.post('/', Controller.postLogin)
router.get('/register', Controller.register)
router.post('/register', Controller.postRegister)
router.get('/admin', Controller.loginAdmin)
router.post('/admin', Controller.postLoginAdmin)
router.get('/logout', Controller.getLogout)

router.use((req, res, next) => {
  if (!req.session.UserId) {
      const error = 'Sign in to continue'
      res.redirect(`/?error=${error}`)
  } else {
      next()
  }
})
router.get('/shop', Controller.showAllProducts)
router.get('/shopAdmin', Controller.showAllProductsAdmin)
router.get('/addToCart/:id', Controller.addToCart)
router.get('/checkout', Controller.checkout)
router.get('/delete/:id', Controller.deleteListCheckout)
router.get('/deleteItem/:id', Controller.deleteProduct)
router.get('/sendOrder/:id', Controller.sendOrder)
router.get('/add', Controller.showFormAdd)
router.post('/add', Controller.postFormAdd)



// define the about route
router.get('/about', (req, res) => {
  res.send('About birds')
})

module.exports = router