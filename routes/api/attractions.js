var express = require('express');
var router = express.Router();
var models = require('../../models');
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Place = models.Place;

router.get('/api/hotels', function(req, res, next) {
	Hotel.findAll({ include: Place})
		.then(function(hotels) {
			res.json(hotels);
		});
	// res.json(Hotel);
})

router.get('/api/restaurants', function(req, res, next) {
	Restaurant.findAll({ include: Place})
		.then(function(restaurants) {
			res.json(restaurants);
		});
})

router.get('/api/activities', function(req, res, next) {
	Activity.findAll({ include: Place})
		.then(function(activities) {
			res.json(activities);
		});
})

module.exports = router;