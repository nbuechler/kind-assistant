'use strict';

var fetchUrl = require("fetch").fetchUrl;

/**
 * Module dependencies.
 */
require('../models/Log');

var mongoose = require('mongoose'),
	Log = mongoose.model('Log'),
	Experience = mongoose.model('Experience'),
	errorHandler = require('./errors'),
	_ = require('lodash');


var interceptorAPI = null;
if(process.argv[2] == 'dev'){
 interceptorAPI = '0.0.0.0:5000';
} else if(process.argv[2] == 'production') {
 interceptorAPI = '52.87.224.145:80';
}

/**
 * Create a Log
 */
exports.create = function(req, res) {
	var log = new Log(req.body);
	log.user = req.body.user;

	// TODO: Use a utility function or express something or other to make this
	// part of the array building modular

	//Create items in the logs physicArray, and others like it.

	log.physicArray = log.physicContent.split(' ');
	log.emotionArray = log.emotionContent.split(' ');
	log.academicArray = log.academicContent.split(' ');
	log.communeArray = log.communeContent.split(' ');
	log.etherArray = log.etherContent.split(' ');

	log.physicArrayLength = log.physicArray.length;
	log.emotionArrayLength = log.emotionArray.length;
	log.academicArrayLength = log.academicArray.length;
	log.communeArrayLength = log.communeArray.length;
	log.etherArrayLength = log.etherArray.length;

	if(log.physicArray.length == 1 && log.physicArray[0].length == 0){
		log.physicArrayLength = 0;
	}
	if(log.emotionArray.length == 1 && log.emotionArray[0].length == 0){
		log.emotionArrayLength = 0;
	}
	if(log.academicArray.length == 1 && log.academicArray[0].length == 0){
		log.academicArrayLength = 0;
	}
	if(log.communeArray.length == 1 && log.communeArray[0].length == 0){
		log.communeArrayLength = 0;
	}
	if(log.etherArray.length == 1 && log.etherArray[0].length == 0){
		log.etherArrayLength = 0;
	}

	log.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			/* The log's log.firstExperience query result
			 * has the log ObjectId and it needs to ba added to experience.logsList,
			 * where experience is the firstExperience id
			 * then, save it to the previousFirstExperience
			 */

			Experience.findById(log.firstExperience).exec(function(err, fExp) {
				fExp.logsList.push(log._id)
				// fExp.save(function(err) {
					// if (err) {
					// 	return res.status(400).send({
					// 		message: errorHandler.getErrorMessage(err)
					// 	});
					// } else {
					//
					// 	// Update the previousFirstExperience
					// 	log.previousFirstExperience = log.firstExperience
					// 	log.save(function(err) {
					// 		if (err) {
					// 			return res.status(400).send({
					// 				message: errorHandler.getErrorMessage(err)
					// 			});
					// 		}
					// 	})
					// }

				// });
				console.log(fExp.logsList);
				console.log('experience saved');
			});

			res.jsonp(log);
			var logID = log._id
			console.log(logID);

			fetchUrl("http://" + interceptorAPI + "/intercepts/mongo2neo/intercepts_create_single_log/" + logID, {
	      method: 'POST',
	      headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json'
	      },
	      body: JSON.stringify({
	        email: 'foo',
	        pass: 'bar'
	      })
	    }, function(error, meta, body){
				console.log('created');
		  })

		}
	});
};

/**
 * Show the current Log
 */
exports.read = function(req, res) {
	res.jsonp(req.log);
};

/**
 * Update a Log
 */
exports.update = function(req, res) {
	var log = req.log;

	log = _.extend(log , req.body);

	log.physicArray = log.physicContent.split(' ');
	log.emotionArray = log.emotionContent.split(' ');
	log.academicArray = log.academicContent.split(' ');
	log.communeArray = log.communeContent.split(' ');
	log.etherArray = log.etherContent.split(' ');

	log.physicArrayLength = log.physicArray.length;
	log.emotionArrayLength = log.emotionArray.length;
	log.academicArrayLength = log.academicArray.length;
	log.communeArrayLength = log.communeArray.length;
	log.etherArrayLength = log.etherArray.length;

	if(log.physicArray.length == 1 && log.physicArray[0].length == 0){
		log.physicArrayLength = 0;
	}
	if(log.emotionArray.length == 1 && log.emotionArray[0].length == 0){
		log.emotionArrayLength = 0;
	}
	if(log.academicArray.length == 1 && log.academicArray[0].length == 0){
		log.academicArrayLength = 0;
	}
	if(log.communeArray.length == 1 && log.communeArray[0].length == 0){
		log.communeArrayLength = 0;
	}
	if(log.etherArray.length == 1 && log.etherArray[0].length == 0){
		log.etherArrayLength = 0;
	}

	log.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {


			// /* First look at the previousFirstExperience, and remove that log ObjectId
			//  * from the experience. (You might be adding it right back there again!)
			//  * But if the experience changed the next step relates the experience back
			//  * to the log.
			//  */
			//
			// 	Experience.findById(log.previousFirstExperience).exec(function(err, pExp) {
			// 	console.log('pExp');
			// 	console.log(pExp);
			//
			// 		var index = experience.logsList(log._id);
			// 		if (index > -1) {
			// 				pExp.logsList.splice(index, 1);
			// 		}
			//
			// 		pExp.save(function(err) {
			// 			if (err) {
			// 				return res.status(400).send({
			// 					message: errorHandler.getErrorMessage(err)
			// 				});
			// 			} else {
			//
			// 				/* The log's log.firstExperience query result
			// 				 * has the log ObjectId and it needs to ba added to experience.logsList,
			// 				 * where experience is the firstExperience id
			// 				 * then, save it to the previousFirstExperience
			// 				 */
			//
			// 				Experience.findById(log.firstExperience).exec(function(err, fExp) {
			// 					fExp.logsList.push(log._id)
			// 					fExp.save(function(err) {
			// 						if (err) {
			// 							return res.status(400).send({
			// 								message: errorHandler.getErrorMessage(err)
			// 							});
			// 						} else {
			//
			// 							// Update the previousFirstExperience
			// 							log.previousFirstExperience = log.firstExperience
			// 							log.save(function(err) {
			// 								if (err) {
			// 									return res.status(400).send({
			// 										message: errorHandler.getErrorMessage(err)
			// 									});
			// 								}
			// 							})
			// 						}
			//
			// 					});
			// 					console.log(fExp.logsList);
			// 					console.log('experience saved');
			// 				});
			//
			// 			}
			//
			// 		});
			//
			// 	}




			console.log('log._id');
			console.log(log._id);
			console.log('==========');

			res.jsonp(log);
			var logID = log._id
			console.log(logID);

			fetchUrl("http://" + interceptorAPI + "/intercepts/mongo2neo/intercepts_update_single_log/" + logID, {
	      method: 'PUT',
	      headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json'
	      },
	      body: JSON.stringify({
	        email: 'foo',
	        pass: 'bar'
	      })
	    }, function(error, meta, body){
				console.log('updated');
		  })

		}
	});
};

/**
 * Delete an Log
 */
exports.delete = function(req, res) {
	var log = req.log ;

	/*
	 * It makes more sense to archive and hide, then remove from the system.
	 */

	// log.remove(function(err) {
	// 	if (err) {
	// 		return res.status(400).send({
	// 			message: errorHandler.getErrorMessage(err)
	// 		});
	// 	} else {
	// 		res.jsonp(log);
	//
	// 		var logID = log._id
	// 		console.log(logID);
	//
	// 		fetchUrl("http://" + interceptorAPI + "/intercepts/mongo2neo/intercepts_destroy_single_log/" + logID, {
	//       method: 'DELETE',
	//       headers: {
	//         'Accept': 'application/json',
	//         'Content-Type': 'application/json'
	//       },
	//       body: JSON.stringify({
	//         email: 'foo',
	//         pass: 'bar'
	//       })
	//     }, function(error, meta, body){
	// 			console.log('deleted');
	// 	  })
	//
	// 	}
	// });
};

/**
 * List of Logs
 */
exports.list = function(req, res) {
	Log.find().sort('-created').populate('user', 'displayName').exec(function(err, logs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logs);
		}
	});
};

exports.listPublic = function(req, res) {
	Log.find({'privacy': 1}).sort('-created').populate('user', 'displayName').exec(function(err, logs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logs);
		}
	});
};

exports.listByLogedInUser = function(req, res) {
	Log.find({'user': req.assert('user_id').value}).sort('-created').populate('user', 'displayName').exec(function(err, logs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logs);
		}
	});
};

/**
 * Log middleware
 */
exports.logByID = function(req, res, next, id) {
	Log.findById(id).populate('user', 'displayName').populate('firstExperience').exec(function(err, log) {
		if (err) return next(err);
		if (! log) return next(new Error('Failed to load Log ' + id));

		req.log = log ;

		if(log.firstExperience){
			/**
			 * Does the user id of the experience of the log match the current user?
			 * If it does, then nothing happens, but if it doesn't then the firstExperience
			 * might be set to null so that people can't see it. Here's how:
			 * If the firstExperience.privacy is less than 1, then the it is private.
			 */

			 var doesExperienceUserMatch = false;
	 			if(req.user){
	 				doesExperienceUserMatch = log.firstExperience.user.toString() === req.assert('user_id').value;
	 					if(log.firstExperience.privacy < 1 && !doesExperienceUserMatch) {
	 							req.log.firstExperience = null;
	 					} else {
	 							/**
	 							 * Get only the public logs.
	 							 */
	 							var logs = log.firstExperience.logsList;
	 							var logsList= [];
	 							for (var i = 0; i < logs.length; i++) {
	 								if(logs[i].privacy > 0){
	 									logsList.push(logs[i]);
	 								} else if (logs[i].user._id.toString() === req.assert('user_id').value) {
	 									logsList.push(logs[i]);
	 								}
	 								// else {
	 								// 	//That log was private - :D
	 								// }
	 							}

	 							log.firstExperience.logsList = logsList;
	 					}
	 			}
			}

			next();
	});
};

/**
 * Log authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.log.user.id !== req.user.id) {
		// TODO: Add logic that creates an alert log if someone is this is true
		if(req.log.privacy < 1){
			return res.status(403).send('User is not authorized');
		}
	}
	next();
};
