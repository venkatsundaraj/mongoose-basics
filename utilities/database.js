const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient

let _db;


const mongoConnect = function(callback){
    MongoClient.connect('mongodb+srv://venkatsundaraj:kW8ZXVJKhps1y9dQ@cluster0.6rckxqf.mongodb.net/shop?retryWrites=true&w=majority')
    .then(client=>{
        _db = client.db() 
        callback()
    })
    .catch(err=>{
        console.log(err)
    })
}

const getDb = function(){
    if(_db){
        return _db
    }
    else 'No database was connected'
}

exports.mongoConnect = mongoConnect

exports.getDb = getDb