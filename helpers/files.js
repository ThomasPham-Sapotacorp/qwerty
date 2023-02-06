var multer 		 = require('multer');
var randomstring = require("randomstring");
const path 		 = require('path');
const fs		 = require('fs');
const notify		= require(__path_configs + 'notify');


let uploadMultiFile = (field, folderDes, fileLength = 10, fileSize_ = 8, fileExtension = 'jpeg|jpg|png|gif',) => {
	var storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, __path_upload + folderDes)
		},
		filename: function (req, file, cb) {
			cb(null, randomstring.generate(fileLength) + path.extname(file.originalname));
		}
	})

	var upload = multer({
		storage: storage,
		limits: {
			fileSize: fileSize_ * 1024 * 1024,
		},
		errorHandling: 'manual',
		fileFilter: (req, file, cb) => {
			const fileType = new RegExp(fileExtension);
			const extName = fileType.test(path.extname(file.originalname).toLowerCase());
			const mimetype = fileType.test(file.mimetype);
			console.log('hello')
			if (mimetype && extName) {
				return cb(null, true);
			} else {
				req.fileTypeInvalid = notify.ERROR_FILE_EXTENSION;
        		cb(notify.ERROR_FILE_EXTENSION);
			}
		},
		
	}).array(field, 10)

	return upload;
}

let uploadSingleFile = (field, folderDes, fileLength = 10, fileSize_ = 8, fileExtension = 'jpeg|jpg|png|gif',) => {
	var storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, __path_upload + folderDes)
		},
		filename: function (req, file, cb) {
			cb(null, randomstring.generate(fileLength) + path.extname(file.originalname));
		}
	})

	var upload = multer({
		storage: storage,
		limits: {
			fileSize: fileSize_ * 1024 * 1024,
		},
		errorHandling: 'manual',
		fileFilter: (req, file, cb) => {
			const fileType = new RegExp(fileExtension);
			const extName = fileType.test(path.extname(file.originalname).toLowerCase());
			const mimetype = fileType.test(file.mimetype);
			if (mimetype && extName) {
				return cb(null, true);
			} else {
				req.fileTypeInvalid = notify.ERROR_FILE_EXTENSION;
        		cb(notify.ERROR_FILE_EXTENSION);
			}
		},
		
	}).single(field);

	return upload;
}


let removeFile = (folder, fileName) => {
	if (fileName){
		let path = folder + fileName
		if (fs.existsSync(path)) {
			fs.unlink(path, (err) => {if(err) throw err;});
		}
	}
}



module.exports = {
	uploadMulti: uploadMultiFile,
	uploadSingle: uploadSingleFile,
	remove: removeFile,

}