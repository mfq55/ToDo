var express = require('express'),
    router = express.Router(),
    logger = require('../../config/logger'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	passportService = require('../../config/passport'),
    passport = require('passport');

	var requireAuth = passport.authenticate('jwt', { session: false }),
		requireLogin = passport.authenticate('local', { session: false });

module.exports = function (app, config) {
	app.use('/api', router);

	router.get('/users', function(req, res, next){
		logger.log('Get all uses', 'verbose');

		User.find()
			.then(users => {
				if(users){
					res.status(200).json(users);	
				} else {
					res.status(404).json({message: "No users"});
				}
			})
			.catch(error => {
				return next(error);
			});
	});

	router.get('/users/:userId', function(req, res, next){
		logger.log('Get user ' + req.params.userId, 'verbose');

		User.findById(req.params.userId)
			.then(user => {
				if(user){
					res.status(200).json(user);
				} else {
					res.status(404).json({message: "No user found"});
				}
			})
			.catch(error => {
				return next(error);
			});
	});	

	router.post('/users', function(req, res, next){
		logger.log('Create user', 'verbose');

		var user = new User(req.body);  
		if(user){
			user.save()
				.then(user => {
					res.status(200).json(user); 
				})
				.catch(error => {
					switch(error.code){
						case 11000:
							res.status(400).json({message: "Duplicate email"});
							break;
						default:
						return next(error);
					}
				});
		} else {
			res.status(400).json({message: "Bad Request"}); 
		}
	});

	router.put('/users/:userId', function(req, res, next){
		logger.log('Update user ' + req.params.userId, 'verbose');

		User.findOneAndUpdate({_id: req.params.userId}, req.body, {new:true, multi:false})
			.then(user => {
				res.status(200).json(user);
			})
			.catch(error => {
				return next(error);
			});
	});		

	router.put ('users/password/:userId', function(req, res, next){
		logger.log('Update user ' + req.params.userId, 'verbose');

		User.findById(req.params.userId)
			.exec()
			.then(function (user) {
				if (req.body.password !== undefined) {
					user.password = req.body.password;
				}

				user.save()
					.then(function (user) {
						res.status(200).json(user);
					})
					.catch(function (err) {
						return next(err);
					});
			})
			.catch(function (err) {
				return next(err);
			});
	});

	router.delete('/users/:userId', function(req, res, next){
		logger.log('Delete user ' + req.params.userId, 'verbose');

		User.remove({ _id: req.params.userId })
			.then(user => {
				res.status(200).json({msg: "Person Deleted"});
			})
			.catch(error => {
				return next(error);
			});
	});	

	router.route('/users/login').post(requireLogin, login);

};

