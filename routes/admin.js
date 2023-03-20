const express = require('express')

const router = express.Router()

const path = require('path')

const adminPath = require('../utilities/path')

const shopController = require('../controller/shop')

const adminController = require('../controller/admin')



router.get('/', shopController.getIndex)

router.get('/cart', shopController.getAllCartItems)

router.post('/cart', shopController.getPostCartItems)

router.get('/product-list', shopController.getProducts)

// router.get('/checkout', shopController.getCheckout)

router.get('/orders', shopController.getOrders)

router.get('/product/:productId', shopController.getProductDetails)

router.post('/remove-cart-product', shopController.removeCartProducts)

router.post('/add-to-bag', shopController.addOrderItems)






router.get('/admin/add-product',adminController.getForm)

router.post('/product', adminController.redirectHome)

router.get('/admin/all-products', adminController.getAllProducts)

router.get('/admin/edit-product/:productId', adminController.getEditProductPage)

router.post('/edit-product', adminController.editProductItem)

router.post('/admin/delete-product/', adminController.getDeleteProduct)


module.exports={
    router
}