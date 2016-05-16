var express = require('express');
var router = express.Router();
var models = require('../../models');
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Place = models.Place;
var Day = models.Day;


router.get('/api/days', function(req, res, next){
	Day.findAll().then(function(days){
		res.json(days);
	})
})

router.get('/api/days/:num', function(req, res, next) {
	Day.findOne({
		where: {
			number: parseInt(req.params.num)
		},
		include: Hotel
	})
		.then(function(day) {
			res.json(day);
		});
})

router.post('/api/days/:num', function(req, res, next){
	console.log(req.params.num)
	Day.findOrCreate({
		where: {
		number: +req.params.num
	}
	})
})

router.delete('/api/days/:num', function(req, res, next){
	Day.destroy({
		where: {
			number: +req.params.num
		}
	})
})

router.post('/api/days/:day/:restaurant', function(req, res, next){
	//add a restaurant
	var ourDay = req.params.day;
	var ourRestaurant = req.params.restaurant;
	Day.findOne({
		where: {
			// finish this
		}
	})
})

router.post('/api/days/:num/hotels', function(req, res, next){
	//add a hotel
	var ourDay = +req.params.day;
	var ourHotel = (req.body.hotel).replace("%20", " ");
	console.log("in post req", ourDay, ourHotel)
	Promise.all([Day.findOne({
		where: {
			number: ourDay
		}
	}), Hotel.findOne({
		where: {
			name: ourHotel
		}
	})])
	.spread(function(day, hotel) {
		console.log('i am here')
		day.setHotel(hotel)
			.then(function () {
				console.log('saved!')
			});
	})
	
})

router.post('/api/days/:num/:activity', function(req, res, next){
	//add an activity
})

module.exports = router;