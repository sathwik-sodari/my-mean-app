//create mini express application
const exp = require('express')

const asyncErrorHandler = require('express-async-handler')

const userApi = exp.Router();

const bcryptjs = require('bcryptjs')

const jwt = require('jsonwebtoken') 

const verifyToken = require('./middlewares/verifytoken');
const multer = require('multer');

userApi.use(exp.json())




//exporting multer object from middleware created
const multerObj = require('../APIS/middlewares/multerObj')

  // //import cloudinary

  // const cloudinary = require('cloudinary').v2;

  // const multer = require('multer')

  // const {CloudinaryStorage} = require('multer-storage-cloudinary')


  // //configure cloudinary
  // cloudinary.config({
  //   cloud_name:'dbbgievib',
  //   api_key:'685412858955382',
  //   api_secret:'9sxNsG6HE_kz6I4dZF96RFfYF7E'
  // })

  // //configure multer-storage-cloudinary

  // const clStorage = new CloudinaryStorage({
  //   cloudinary : cloudinary,
  //   params: async(req,file)=>{
      
  //     return{
  //       folder:"MEAN-APP Images",
  //       public_id: file.fieldname+'-'+Date.now()
  //     }

  //   }
  // })


  // //configure multer

  // const multerObj = multer({storage:clStorage})


// //http://localhost:3000/user/getusers
// userApi.get('/getusers',(req,res,next)=>{

//     userCollection.find().toArray((err,userList)=>{
//         if(err){
//         console.log("error is ",err)
//         res.send({message: err.message })
//         }
//         else{
//             res.send({message: userList})
//         }
//     })
// })





//get using promises
// userApi.get('/getusers',(req,res,next)=>{
 
//   userCollection.find().toArray()
//   .then(userList=>{res.send({message:userList})})
//   .catch(err=>{
//     console.log("error in reading users",err)
//     res.send({message:err.message})
// }) 
// }
// )


//using async await
userApi.get('/getusers',asyncErrorHandler(async(req,res,next)=>{


  //getting user collection object from server.js file

  let userCollection = req.app.get("userCollection") 


  let userObj = await userCollection.find().toArray()

  res.send({message:userObj})
}))




//http://localhost:3000/user/getuser/<username>

userApi.get('/getuser/:username',(req,res,next)=>{
  let un =  req.params.username

  let userCollection = req.app.get("userCollection") 

  userCollection.findOne({username:un},(err,userObj)=>{


  if(err)
  {
    console.log("error in reading users data ",err)
    res.send({message:err.message})
  }

  //if user object is not existing
  if(userObj==null)
  {
    res.send({message:"User not found"})
  }


  //if user exits
  else
  {
    res.send({message:userObj})
  }


})

})



//using promise
userApi.get("/getuser/:username",(req,res,next)=>{
  let un = req.params.username

  let userCollection = req.app.get("userCollection") 

  userCollection.findOne({username:un})
  .then(userObj=>{
    if(userObj===null)
    {
      res.send({message:"user not exists"})
    }
    else{
      res.send({message:userObj})
    }
  })
  .catch(err=>{
    console.log("error in getting user",err)
    res.send({message:err.message})
  })
})
 


// userApi.post('/createuser',(req,res,next)=>{
//   let newuser = req.body

//   console.log(newuser.username)

//   userCollection.findOne({username:{$eq:newuser.username}},(err,userObj)=>{

//     if(err)
//     {
//       console.log("error in reading object",err)
//       res.send({message:err.message})
//     }

//   if(userObj==null)
//   {
//     userCollection.insertOne(newuser,(err,success)=>{

//       console.log("userobj null")

//       if(err)
//       {
//         console.log("error in creating userobj",err)
//         res.send({message:err.message})
//       }

//       else{
//         res.send({message:"user created successfully"})
//       }
//     })
//   }


//   else{
//     res.send({message:"user already exists"})
//   }
//   })

// })



//using async await
userApi.post('/createuser',multerObj.single('file'),asyncErrorHandler(async(req,res,next)=>{
  // let newuser = req.body 

  let newuser = JSON.parse(req.body.userobj)  

  let userCollection = req.app.get("userCollection")

  let user = await userCollection.findOne({username: newuser.username})

  if(user!==null)
  {
    res.send({message:"user already existed"})
  }
  else{

    //hashing the password
    let hashedpassword = await bcryptjs.hash(newuser.password,7);


    newuser.password = hashedpassword;

    //add image url
    newuser.profileImage = req.file.path;


    await userCollection.insertOne(newuser)
    res.send({message:"created successfully"})
  }
}))




//http://localhost:3000/users/updateuser/:username

userApi.put('/updateuser/:username',(req,res,next)=>{
  
  let modifieduser = req.body

  let userCollection = req.app.get("userCollection") 
  
  userCollection.updateOne({username: modifieduser.username },{$set:{...modifieduser}},(err,success)=>{

  if(err){
    res.send({message:err.message})
  }
 
    else{
      res.send({message:"user updated"})
    }
})
 
})


//delete

userApi.delete("/deleteuser/:username",asyncErrorHandler(async(req,res,next)=>
{
  let deluser = req.params.username


  let userCollection = req.app.get("userCollection") 
  
let user =await userCollection.findOne({username:deluser})
if(user===null)
{
  res.send({message:"user doesnot exist to remove"})
}
else{
  await userCollection.deleteOne({username:deluser})
  res.send({message:"user removed"})
}
}))



 //login 

userApi.post('/login',asyncErrorHandler( async(req,res,next)=>{

  let credentials = req.body

  //verify credentials


  let userCollection = req.app.get("userCollection") 

  let user = await userCollection.findOne({username:credentials.username})

  if(user===null)
  {
    res.send({message:"username invalid"})
  }
  else{

    let result = await bcryptjs.compare(credentials.password, user.password)

    if(result===false)
    {
      res.send({message:"invalid password"})
    }    

    
    else{
      
      //creating token
      let signedToken = jwt.sign({username:credentials.username},'abcdef',{expiresIn:10})
      res.send({message:"login success",token:signedToken, username: credentials.username,userObj : user})
    }
  }
}))




//dummy route to created protected resuorce
userApi.get('/testing',verifyToken,(req,res,next)=>{
  res.send({message:"this is protected data"})
})



//sample route

userApi.get('/getusers',(req,res)=>{
    res.send({message:"reply from user api"})
})


module.exports=userApi