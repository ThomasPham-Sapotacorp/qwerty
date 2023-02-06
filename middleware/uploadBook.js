const FilesHelpers 	= require(__path_helpers + 'files');
const upload  		= FilesHelpers.uploadMulti('thumbnail','books' );
const notify		= require(__path_configs + 'notify');
module.exports = (req, res, next) =>{
    upload (req,res,(err)=>{
        let item = Object.assign(req.body);
	    let taskCurrent = (item.id)? "edit" : "add";
    
        if (err) {
            if(err.code == 'LIMIT_FILE_SIZE'){
                err = notify.ERROR_FILE_LIMIT;
            }		
        } else {
            if(!req.files.length && taskCurrent == "add"){
                err = notify.ERROR_FILE_REQUIRE;
            }
        }
        res.errorUpload = err;

        next();
    })
}