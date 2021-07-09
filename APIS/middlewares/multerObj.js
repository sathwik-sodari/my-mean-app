const cloudinary = require('cloudinary').v2;

const multer  = require('multer')

const {CloudinaryStorage} = require('multer-storage-cloudinary')


//configuring cloudinary

cloudinary.config({
    cloud_name:'dbbgievib',
    api_key:'685412858955382',
    api_secret:'9sxNsG6HE_kz6I4dZF96RFfYF7E'
});

//configuring multer cloud storage

const clStorage = new CloudinaryStorage({
    cloudinary : cloudinary,
    params:async(req,file)=>
    {

       return {
        folder:"MEAN-APP Images",
        public_id : file.fieldname+'-'+Date.now()
    }
}
})


//multer obj

const multerObj = multer({storage:clStorage})

module.exports = multerObj
