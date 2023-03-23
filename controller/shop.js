const Product = require('../module/product')
const Order = require('../module/order')

const getIndex = (req,res,next)=>{
    
     Product.find().then(result=>{
        
       res.render('shop/index',{
        products:result,
        path : '/',
        title:'home'
    })
    }).catch(err=>{
        console.log(err)
    })    
        
}


const getProducts = (req,res,next)=>{
    

    Product.find().then(result=>{
       res.render('shop/productList',{
        products:result,
        path : 'shop/productList',
        title:'product-list'
    })
    }).catch(err=>{
        console.log(err)
    })   
    
}


const getProductDetails = function(req,res,next){
    const productId = req.params.productId
    
    Product.findById(productId)
    .then(product=>{
        // console.log(product)
        res.render('shop/productDetail',{
            path:'shop/productDetail',
            title:product.title,
            product:product
        })
    })
    .catch(err=>{
        console.log(err)
    })
    
}

const getPostCartItems = function(req,res,next){
    const productId = req.body.productId
    Product.findById(productId)
    .then(data=>{
        return req.user.addToCart(data)
    })
    .then(data=>{

        res.redirect('/')
    })
    .catch(err=>{
        console.log(err)
    })
}

const getAllCartItems = (req,res,next)=>{
    req.user
    .populate('cart.items.productId')
    .then(carts=>{
        const cartItems = carts.cart.items
       res.render('shop/cart',{
            title:'Cart',
            path: 'shop/cart',
            cartProducts:cartItems
        })
    })
    .catch(err=>{
        console.log(err)
    })       
    
}

const removeCartProducts = function(req,res,next){
    const productId = req.body.productId
    req.user.removeProductFromCart(productId)
    .then(data=>{

        res.redirect('/cart')
    })
    .catch(err=>{
        console.log(err)
    })
}



const addOrderItems = function(req,res,next){

    req.user
    .populate('cart.items.productId')
    .then(data=>{
        const productsAll = data.cart.items.map(productItem=>{
            
            return {quantity:productItem.quantity, product:{...productItem.productId._doc}}
        })
        
        
        const order = new Order({
            products:productsAll,
            user:{
                name:req.user.name,
                userId:req.user
            },
            
        })

        return order.save()
    })
    .then(data=>{
        return req.user.clearCart()
    })
    .then(data=>{
        res.redirect('/orders')
    })
    .catch(err=>{
        console.log(err)
    })
    
}

const getOrders= function(req,res,next){
    Order.find({'user.userId': req.user._id})
    .then((order)=>{
        console.log(order[0].products)
        res.render('shop/orders',{
        title:'Orders',
        path: 'shop/orders',
        orders:order
    })
    })
    .catch(err=>{
        console.log(err)
    })
}

module.exports = {
    getIndex : getIndex,
    getProducts : getProducts,
    getProductDetails:getProductDetails,
    getPostCartItems:getPostCartItems,
    getAllCartItems:getAllCartItems,
    removeCartProducts:removeCartProducts,
    addOrderItems:addOrderItems,
    getOrders:getOrders
}

/*const path = require('path')

const adminPath = require('../utilities/path')

const Product = require('../module/product')
const User = require('../module/user')
const { getDb } = require('../utilities/database')


const getProducts = (req,res,next)=>{
    

    Product.fetchAll().then(result=>{
       res.render('shop/productList',{
        products:result,
        path : 'shop/productList',
        title:'product-list'
    })
    }).catch(err=>{
        console.log(err)
    })   
    
}


const getIndex = (req,res,next)=>{
    
     Product.fetchAll().then(result=>{
       res.render('shop/index',{
        products:result,
        path : '/',
        title:'home'
    })
    }).catch(err=>{
        console.log(err)
    })    
        
}

const getProductDetails = function(req,res,next){
    const productId = req.params.productId
    
    Product.findProductById(productId)
    .then(product=>{
        // console.log(product)
        res.render('shop/productDetail',{
            path:'shop/productDetail',
            title:product.title,
            product:product
        })
    })
    .catch(err=>{
        console.log(err)
    })
    
}

const getPostCartItems = function(req,res,next){
    const productId = req.body.productId;
    Product.findProductById(productId)
    .then(data=>{
        return data
    })
    .then(data=>{        
        // console.log(req.user, data)
        return req.user.addCartItem(data)
    })
    .then(data=>{
        res.redirect('/')
        // console.log(data)
    })
    .catch(err=>{
        console.log(err)
    })

    
 
}


const getAllCartItems = (req,res,next)=>{
    req.user.getCarts()
    .then(carts=>{
        
       res.render('shop/cart',{
            title:'Cart',
            path: 'shop/cart',
            cartProducts:carts
        })
    })
    .catch(err=>{
        console.log(err)
    })       
    
}

const removeCartProducts = function(req,res,next){
    const productId = req.body.productId
    req.user.deleteCartById(productId)
    .then(data=>{
        res.redirect('/cart')
    })
    .catch(err=>{
        console.log(err)
    })
}

const addOrderItems = function(req,res,next){
    req.user.addOrderItem()
    .then(data=>{
        res.redirect('/orders')

    })
    .catch(err=>{
        console.log(err)
    })
}


const getOrders = (req,res,next)=>{
    req.user.getAllOrders()
    .then((order)=>{
        // console.log(order)
        res.render('shop/orders',{
        title:'Orders',
        path: 'shop/orders',
        orders:order
    })
    })
    .catch(err=>{
        console.log(err)
    })
      
}




  module.exports = {
    getProducts:getProducts,
    getIndex:getIndex,
    // getCheckout:getCheckout,
    getAllCartItems:getAllCartItems,
    getOrders:getOrders,
    getProductDetails:getProductDetails,
    getPostCartItems:getPostCartItems,
    removeCartProducts:removeCartProducts,
    addOrderItems:addOrderItems
}  
*/