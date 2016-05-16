var db = require('./_db');
var Sequelize = require('sequelize');
var Hotel = require('./hotel')(db);
var Restaurant = require('./restaurant')(db);
var Activity = require('./activity')(db);
var Place = require('./place')(db);
var Day = require('./day')(db);

Hotel.belongsTo(Place);
Restaurant.belongsTo(Place);
Activity.belongsTo(Place);


var DayRestaurant = db.define('day_restaurant', {
});

var DayActivity = db.define('day_activity', {
});

Day.belongsTo(Hotel)
Day.belongsToMany(Restaurant, {through: DayRestaurant})
Day.belongsToMany(Activity, {through: DayActivity})


module.exports = {
  db: db, 
  Place: Place, 
  Hotel: Hotel, 
  Activity: Activity, 
  Restaurant: Restaurant,
  Day: Day
} 
