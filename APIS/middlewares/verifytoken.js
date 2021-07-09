let jwt = require('jsonwebtoken')


const verifyToken = (req,res,next)=>{

    let bearerToken = req.headers.authorization

    
    let token;
    

    if(bearerToken==undefined)
    {
        return res.send({message:"unauthorized access"})

    }

    else{

       token = bearerToken.split(' ')[1]

        jwt.verify(token,'abcdef',(err,decoded)=>
        {
            if(err)
            {
                return res.send({message:"sesssion expired login to continue"})
            }



            else{
                next() 
            }
        })
    }




}




module.exports = verifyToken;