const mongoose= require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


module.exports= ()=>{
    const mongoURI = `mongodb://${process.env.MONGODBUSERNAME}:${process.env.MONGODBPASSWORD}@ds239309.mlab.com:39309/edgistify-authentication`;
    mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology:true } )
        .then(connection=>console.log('mongodb connection successful'))
        .catch(err=>console.log(err))
    ;
}