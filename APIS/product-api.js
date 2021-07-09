const exp = require('express')

const asyncErrorHandler = require('express-async-handler');
const { find } = require('tslint/lib/utils');

const productApi = exp.Router();

productApi.use(exp.json())

//exporting multerObj
const multerObj = require('../APIS/middlewares/multerObj');
//create products


productApi.post('/createproduct',multerObj.single('file'),asyncErrorHandler(async(req,res,next)=>{

    let newproduct = JSON.parse(req.body.productObj)
    console.log(newproduct)

    // console.log(newproduct.version)

    let productCollection = req.app.get('productCollection')

    
    console.log("new product is",newproduct)

    let product = await productCollection.findOne({version: newproduct.version})

    if(product!==null)
    {
        res.send({message:"product already exists"})
    }

    else{

        newproduct.Image = req.file.path
        await productCollection.insertOne(newproduct)
        res.send({message:"product created"})
    }

}))


productApi.get('/getproducts',asyncErrorHandler(async(req,res,next)=>{


    let productCollection = req.app.get('productCollection')
    let products = await productCollection.find().toArray()
    if(products===null)
    {
        res.send({message:"products empty"})
    }
else{
    res.send({productObj:products})
}
}))


module.exports=productApi
