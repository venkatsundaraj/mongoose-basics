const express = require('express')
const app = express()
const path = require('path')
const rootDir = require('./utilities/path')
const adminRouter = require('./routes/admin')
const bodyParser = require('body-parser')
const ejs = require('ejs')
// const sequelize = require('./utilities/database')
// const mongoConnect = require('./utilities/database').mongoConnect
const User = require('./module/user')
const Product = require('./module/product')
const mongoose = require('mongoose')

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use((req,res,next)=>{
    User.findById('641958922e12df7b489f43d4')
    .then(user=>{
        // console.log(user)
        req.user = user
        
        next()
    })
    .catch(err=>{
        console.log(err)
    })
})



app.use(express.static(path.join(rootDir, 'style')))

app.use(bodyParser.urlencoded({extended:false}))

// app.use('/', function(req,res,next){
//     res.write('<html><header><title>m</title></header><body><h1>This is your first html page</h1></body></html>')
// })





app.use(adminRouter.router)

app.use((req,res,next)=>{
    res.status(404).render('404',{
        path : '',
        title: '404 Page'
    })
})

mongoose.connect('mongodb+srv://venkatsundaraj:zvLfLwdLBP94k2Ad@cluster0.6rckxqf.mongodb.net/shop?retryWrites=true&w=majority')
.then(data=>{
    User.findOne()
    .then(user=>{
        if(!user){
            const user = new User({
                name:'venkatsundaraj',
                email:'venkatesh@gmail.com',
                cart:{
                    items:[]
                }
            })
            user.save()
        }
        app.listen(3000, ()=>{
            console.log('Server started')
        })
    })
    

})
.catch(err=>{
    console.log(err)
})