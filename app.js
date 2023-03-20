const express = require('express')
const app = express()
const path = require('path')
const rootDir = require('./utilities/path')
const adminRouter = require('./routes/admin')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const sequelize = require('./utilities/database')
const mongoConnect = require('./utilities/database').mongoConnect
const User = require('./module/user')
const Product = require('./module/product')


app.set('view engine', 'ejs')
app.set('views', 'views')

app.use((req,res,next)=>{
    User.findUserById('641511771054a6b818ba88f9')
    .then(user=>{
        
        req.user = new User(user.email, user.password, user.cart, user._id)
        
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

mongoConnect(()=>{
    app.listen(3000)
})