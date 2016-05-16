var Sequelize = require('sequelize'); 

module.exports = function(db){
  var Day = db.define('day', {
    number: {
    	type: Sequelize.INTEGER,
    	unique: true
    }
  });

  return Day; 
};
