
  const exp = require('express')

  const app = exp()

  const path = require("path")



//joining angular and express

app.use(exp.static(path.join(__dirname,'./dist/MEAN-APP/')))





//importing mongo client
const mc = require('mongodb').MongoClient;



//connection string
const dataBaseUrl = "mongodb+srv://Sathwik1:Sodari@1234@cluster0.15aac.mongodb.net/mydatabase1?retryWrites=true&w=majority";






//connect to database server
mc.connect(dataBaseUrl,{useNewUrlParser:true,useUnifiedTopology:true},(error, client )=>{


  if(error){
    console.log("error in database connection",error)
  }


  else{

      //database object
    let databaseObj = client.db("mydatabase1")

    //collection object
 let userCollection = databaseObj.collection("userCollection")

 let productCollection = databaseObj.collection("productCollection")

 app.set("userCollection",userCollection)

 app.set("productCollection",productCollection)

    console.log("connected to database.....")
  }


})






  //importing apis

const userApi = require('./APIS/user-api')

const productApi = require('./APIS/product-api')








  //execute specific api based on path

  app.use('/user',userApi)

  app.use('/product',productApi)



  

  //invalid path

  app.use((req,res,next)=>{
    res.send({message:`${req.url} does'nt exist`})
  })


  //error handling
  
  app.use((err,req,res,next)=>{
    res.send({message:`error is ${err.message}`})
  })





// assigning port
const port = 3000
app.listen(port,()=>{
    console.log("server running in 3000 successfully......")
})