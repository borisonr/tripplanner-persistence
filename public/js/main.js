$(function initializeMap (){

  var graceHopperAcademy = new google.maps.LatLng(40.705086, -74.009151);

  var styleArr = [{
    featureType: 'landscape',
    stylers: [{ saturation: -100 }, { lightness: 60 }]
  }, {
    featureType: 'road.local',
    stylers: [{ saturation: -100 }, { lightness: 40 }, { visibility: 'on' }]
  }, {
    featureType: 'transit',
    stylers: [{ saturation: -100 }, { visibility: 'simplified' }]
  }, {
    featureType: 'administrative.province',
    stylers: [{ visibility: 'off' }]
  }, {
    featureType: 'water',
    stylers: [{ visibility: 'on' }, { lightness: 30 }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ef8c25' }, { lightness: 40 }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ visibility: 'off' }]
  }, {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [{ color: '#b6c54c' }, { lightness: 40 }, { saturation: -40 }]
  }];

  var mapCanvas = document.getElementById('map-canvas');

  var currentMap = new google.maps.Map(mapCanvas, {
    center: graceHopperAcademy,
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: styleArr
  });

  var iconURLs = {
    hotel: '/images/lodging_0star.png',
    restaurant: '/images/restaurant.png',
    activity: '/images/star-3.png'
  };

  function drawMarker (type, coords) {
    var latLng = new google.maps.LatLng(coords[0], coords[1]);
    var iconURL = iconURLs[type];
    var marker = new google.maps.Marker({
      icon: iconURL,
      position: latLng
    });
    marker.setMap(currentMap);
    return marker
  }

  $.ajax({
       method: 'GET',
       url: '/api/hotels',
       success: function(data) {
           data.forEach(function(hotel) {
                 // console.log('HOTEL HERE', hotel)
                 var option = $(`<option value="${hotel.id}">${hotel.name}</option>`)[0];
                 option.attraction = hotel;
      option.attraction.type = 'hotel';
      // option.hotel.place.type = 'hotel';
         $('#hotel-choices').append(option);
      }) 
    },
    error: function(error){
      console.error(error);
    }
  })

   $.ajax({
    method: 'GET',
    url: '/api/restaurants',
    success: function(data){
      data.forEach(function(restaurant){
         var option = $(`<option value="${restaurant.id}">${restaurant.name}</option>`)[0]
      option.attraction = restaurant;
      option.attraction.type = 'restaurant';
      // option.restaurant.place.type = 'restaurant';
         $('#restaurant-choices').append(option);
      }) 
    },
    error: function(error){
      console.error(error);
    }
  })

  $.ajax({
    method: 'GET',
    url: '/api/activities',
    success: function(data){
      data.forEach(function(activity){
        var option = $(`<option value="${activity.id}">${activity.name}</option>`)[0];
      option.attraction = activity;
      option.attraction.type = activity;
      // option.activity.place.type = 'activity';
         $('#activity-choices').append(option);
      }) 
    },
    error: function(error){
      console.error(error);
    }
  })

  var dayTemplate = `
          <section class="day">
            <div>
              <h4>My Hotel</h4>
              <ul class="list-group trip-day-hotels">
              </ul>
            </div>
            <div>
              <h4>My Restaurants</h4>
              <ul class="list-group trip-day-restaurants">
              </ul>
            </div>
            <div>
              <h4>My Activities</h4>
              <ul class="list-group trip-day-activities">
              </ul>
            </div>            
          </section>
          `

  $.ajax({
    method: 'GET',
    url: '/api/days',
    success: function (data) {
      console.log("data is", data[2].hotel)
      data.forEach(function(datum) {
        $('#day-add').before(`<button class="btn btn-circle day-btn" data-day="${datum.number}">${datum.number}</button>`)
        
     })
     
    },
    error: function() {

    }
  })
 
  $.ajax({
      url: '/api/days/1', 
      method: 'POST',
      success: function(data) {
        console.log('success!')
      },
      error: function(err) {
        console.error(err);
      }
    })     
    
  $('#day-add').click(function addDay() {
    // Find the index of the last day section
    var lastIndex = $('section.day').last().data('index')
    // console.log(lastIndex) // Are you an array?

    var ourIndex = lastIndex + 1
    
    // 1. Create a new day section based off dayTemplate
    var day = $(dayTemplate)

    // Set the index on the section we're adding
    day[0].dataset.index = ourIndex
    
    // 2. Append it to the #itinerary
    $('#itinerary').append(day)
    
    // 3. Unselect all days
    $('.day').removeClass('selected')

    // 3a. select the one we just appended.
    $('#itinerary > .day').last().addClass('selected')

    // Create a button with the right number
    var button = $(`<button class="btn btn-circle day-btn current-day" data-day=${ourIndex}>${ourIndex}</button>`)
    $(this).before(button)
    
    // 5. Deselect all day buttons
    $('.day-buttons > button').removeClass('current-day')
    
    // 6. Select the one we just added
    button.addClass('current-day') 


    $.ajax({
      url: '/api/days/' + day[0].dataset.index,
      method: 'POST',
      success: function(data) {
        console.log('success!')
      },
      error: function(err) {
        console.error(err);
      }
    })     
  })

  $('.day-buttons').on('click', 'button[data-day]', function (event) {
    
    // Deselect all buttons
    $('.day-buttons > button').removeClass('current-day')

    // Select the button that was clicked
    $(this).addClass('current-day')

    // Deselect all days
    $('.day')
      .removeClass('selected')
      .find('li').each(function(i, li) {
        li.marker.setMap(null)
      })

    // Select the day for the button that was clicked
    $(`.day[data-index="${this.dataset.day}"]`)
      .addClass('selected')
      .find('li')
      .each(function(i, li) {
        li.marker.setMap(currentMap)
      })
    
    // Update the index display
    $('#day-title-index').text(this.dataset.day)

    $.ajax({
      method: 'GET',
      url: '/api/days/' + this.dataset.day,
      success: function(data){
        if(data.hotelID){

        console.log("HERE", data[2].hotel)

        var dst = $('.trip-day-hotels');
        // Create a new list item with a delete button
        var li = $(`<li class=itinerary-item>
                     ${data.hotel}
                     <button data-action="deleteFromTrip" class="btn btn-xs btn-danger remove btn-circle">x</button>
                   </li>`)[0]
        
        // Add to the destination list
        dst.append(li);

        option.getAttribute('place-latitude');
        
        // Draw a marker on the map
        li.marker = drawMarker(option.attraction.type,
                               option.attraction.place.location);




        }
      },
      error: function(error){
        console.error(error);
      }
    });
  });
  
  $('#remove-day').on('click', function(event) {
    var currentDay = $('.current-day')[0].dataset.day;
    var replacingDay = (currentDay - 1) ? (currentDay - 1) : (+currentDay + 1);

    $.ajax({
      method: 'DELETE',
      url: '/api/days/' + currentDay,
      success: function(data){

      },
      error: function(error){
        console.error(error);
      }
    });

    // $(`.day[data-index="${$('.current-day > li').data('day')}"]`).remove();

    $('.current-day').remove()

     // Deselect all buttons
    $('.day-buttons > button').removeClass('current-day')

    // Select the button that was clicked
    $(`.day[data-day="${replacingDay}"]`).addClass('current-day')

    // Deselect all days
    $('.day')
      .removeClass('selected')
      .find('li').each(function(i, li) {
        li.marker.setMap(null);
      });

    // Select the day for the button that was clicked
    $(`.day[data-index="${replacingDay}"]`)
      .addClass('selected')
      .find('li')
      .each(function(i, li) {
        li.marker.setMap(currentMap);
      })
    
    // Update the index display
    $('#day-title-index').text(replacingDay)

    // $(`.day[data-index="${$('.current-day')[0].dataset.day}"]`).remove();


  });

  $(document.body).on('click', 'button[data-action="addSelectionToTrip"]', function(event) {
    console.log(this, event);
    var dst = $(this.dataset.destinationList);
    var self = this;
    console.log($(this.dataset.sourceSelect));
    console.log("me", $(this.dataset.sourceSelect)[0].selectedOptions);
    Array.from(
      // Get all selected options (usually just one, but why not support many?)
      $(this.dataset.sourceSelect)[0].selectedOptions)
      .forEach(function(option) {
        // Create a new list item with a delete button
        var li = $(`<li class=itinerary-item>
                     ${option.textContent}
                     <button data-action="deleteFromTrip" class="btn btn-xs btn-danger remove btn-circle">x</button>
                   </li>`)[0]
        
        // Add to the destination list
        dst.append(li);

        option.getAttribute('place-latitude');
        
        // Draw a marker on the map
        li.marker = drawMarker(option.attraction.type,
                               option.attraction.place.location);
        console.log("option", $(option));

      if(option.attraction.type === 'hotel') {
        var date = String($('.current-day')[0].dataset.day)
        var hotelName = ($(option)[0].text).replace(/\s+/g, "%20")
        console.log('hotel selected', hotelName)
        $.ajax({
          method: 'POST',
          url: `/api/days/${date}/hotels`,
          data: {'hotel': hotelName},
          success: function(data){
            console.log(`/api/days/${date}/${hotelName}`)
          },
          error: function(err){
            console.log(err)
          }
        })
      }

      if(option.attraction.type === 'restaurant')
          {$.ajax({
          method: 'POST',
          url: `/api/days/${$('.current-day')[0].dataset.day}/${$(option)[0].text}`,
          success: function(){

          },
          error: function(){

          }
          })
        }
    });
  
  });

  $(document.body).on('click', 'button[data-action="deleteFromTrip"]', function(event) {
    // jQuery's closest function ascends the DOM tree to find the nearest ancestor matching
    // the selector.
    $(this).closest('li.itinerary-item').remove()
  })
});
