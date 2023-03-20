const path = require('path')

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
/*const getProductDetails= function(req,res,next){
    const productId = req.params.productId

    // Products.findAll({where:{id:productId}}).then(product=>{
    //     console.log(product)
    //     res.render('shop/productDetail',{
    //         path:'shop/productDetail',
    //         title:product[0].title,
    //         product:product[0]
    //     })
    // }).catch(err=>console.log(err))
    
    
    Products.findByPk(productId).then(product=>{
        res.render('shop/productDetail',{
            path:'shop/productDetail',
            title:product.title,
            product:product
        })
    }).catch(err=>console.log(err))

    
}


const getAllCartItems = (req,res,next)=>{
    

    req.user.getCart().then(cart=>{
        
        // console.log(cart)
        return cart.getProducts().then(product=>{
            
            res.render('shop/cart',{
            title:'Cart',
            path: 'shop/cart',
            cartProducts:product
        })
        }).catch(err=>console.log(err))
    }).catch(err=>console.log(err))
    
}




const getPostCartItems = function(req,res,next){
    const productId = req.body.productId;
    // Products.getProductFromId(productId, product=>{
        
    //     Cart.addItemToCart(product)
    // })

    let fetchCart;
    let newQuantity = 1
    req.user.getCart()
    .then(cart=>{
        fetchCart = cart
        return cart.getProducts({where : {id : productId}})
        .then(products=>{
            
            let product;
            if(products.length > 0){
                product = products[0]
            }

            
            if(product){
                
                const oldQuantity = product.cartIitem.quantity
                newQuantity = oldQuantity + 1
                return product;
            }

            return Products.findByPk(productId)
            
            
        })
        .then(product=>{
            return fetchCart.addProduct(product, {
                    through : {quantity : newQuantity}
                })
        })
        .then(data=>{
            res.redirect('/cart')
        })
        
    })

    .catch(err=>{
        console.log(err)
    })
 
}

const removeCartProducts = function(req,res,next){
    const productId = req.body.productId
    

    req.user.getCart()
    .then(data=>{
        return data.getProducts({where: {id : productId} })
    })
    .then(product=>{
        // console.log(product.cartIitem)
        const productItem = product[0]
        return productItem.cartIitem.destroy()
    })
    .then(data=>{
        
        res.redirect('/cart')
    })
    .catch(err=>{
        console.log(err)
    })

    // Products.getProductFromId(productId,product=>{
    //     Cart.deleteCartProduct(productId, product.amount)
    //     res.redirect('/cart')
    // })
    
}



const addOrderItems = function(req,res,next){
    let fetchCart;
    req.user.getCart()
    .then(cart=>{
        fetchCart = cart
        return cart.getProducts()
    })
    .then(products=>{
        return req.user.createOrder()
        .then(order=>{
            return order.addProducts(products.map(product=>{
                product.orderItem = {quantity:product.cartIitem.quantity}
                return product
            }))
        })
        .catch(err=>console.log(err))
    })
    .then(data=>{
        return fetchCart.setProducts(null)
    })
    .then(data=>{
        res.redirect('/orders')

    })
    .catch(err=>{
        console.log(err)
    })
}



const getOrders = (req,res,next)=>{
    req.user.getOrders({include     : ['products']})
    .then((order)=>{
        console.log(order)
        // const prodcts    = order.map(order=>console.log(order))
        // prodcts.forEach(product=>{
        //     product.forEach(prod=>{
        //         console.log(prod.title)
        //     })
        // })
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




const getIndex = (req,res,next)=>{
    //  Products.findAll().then(result=>{
        // console.log(result)

        

        req.user.getProducts().then(result=>{
            res.render('shop/index',{
        products:result,
        path : '/',
        title:'home'
                
        })
        
    }).catch(err=>{
        console.log(err)
    })
       
        
    

    
    
}







const getCheckout = (req, res,next)=>{
    res.render('shop/checkout',{
        title:'Checkout',
        path:'shop/checkout'
    })
}

*/


