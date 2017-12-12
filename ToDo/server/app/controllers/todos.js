var express = require('express'),
    router = express.Router(),
    logger = require('../../config/logger'),
	mongoose = require('mongoose'),
	Todo = mongoose.model('Todo'),
	multer = require('multer'),
	mkdirp = require('mkdirp');

module.exports = function (app, config) {
	app.use('/api', router);

	router.get('/todos/user/:userId', function(req, res, next){
		logger.log('Get all todos for ' + req.params.userId, 'verbose');

		Todo.find({userID: req.params.userId})
			.then(todos => {
				if(todos){
					res.status(200).json(todos);
				} else {
					return next(error);
				}
			});
	});

	router.get('/todos/', function(req, res, next){
		Todo.find()
		.then(todos => {
			if(todos){
				res.status(200).json(todos);
			} else {
				return next(error);
			}
		});
	})

	router.get('/todos/:todoId', function(req, res, next){
		logger.log('Get todo ' + req.params.todoId, 'verbose');

		Todo.findById(req.params.todoId)
		.then(todo => {
			if(user){
				res.status(200).json(todo);
			} else {
				return next(error);
			}
		})
		.catch(error => {
			return next(error);
		});
		
	});	

	router.post('/todos', function(req, res, next){
		logger.log('Create todo', 'verbose');

		var todo =  new Todo(req.body);  
		if(todo){
			todo.save()
				.then(todo => {
					res.status(200).json(todo); 
				})
				.catch(error => {
					return next(error);
				});
		} else {
			res.status(400).json({message: "Bad Request"}); 
		}
	});

	router.put('/todos/:todoId', function(req, res, next){
		logger.log('Update todo ' + req.params.todoId, 'verbose');

		Todo.findOneAndUpdate({_id: req.params.todoId}, req.body, {new:true, multi:false})
		.then(todo => {
			res.status(200).json(todo);
		})
		.catch(error => {
			return next(error);
		});		
	});		

	router.delete('/todos/:todoId', function(req, res, next){
		logger.log('Delete todo ' + req.params.todoId, 'verbose');

		Todo.remove({ _id: req.params.todoId })
		.then(todo => {
			res.status(200).json({msg: "Todo Deleted"});
		})
		.catch(error => {
			return next(error);
		});
	});	

	var storage = multer.diskStorage({
		destination: function (req, file, cb) {      
		  	var path = config.uploads + req.params.userId + "/";
				mkdirp(path, function(err) {
				if(err){
					res.status(500).json(err);
				} else {
					cb(null, path);
				}
				});
			},
			filename: function (req, file, cb) {
				let fileName = file.originalname.split('.');   
				cb(null, fileName[0] + new Date().getTime() + "." + fileName[fileName.length - 1]);
			}
	  });
	
		var upload = multer({ storage: storage });

		router.post('/todos/upload/:userId/:todoId', upload.any(), function(req, res, next){
			logger.log('Upload file for todo ' + req.params.todoId + ' and ' + req.params.userId, 'verbose');
			
			Todo.findById(req.params.todoId, function(err, todo){
				if(err){ 
					return next(err);
				} else {	 
					if(req.files){
						todo.file = {
							fileName : req.files[0].filename,
							originalName : req.files[0].originalname,
							dateUploaded : new Date()
						};
					}			
					todo.save()
						.then(todo => {
							res.status(200).json(todo);
						})
						.catch(error => {
							return next(error);
						});
				}
			});

		});


};