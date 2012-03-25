var where = false;
var map, getContext, canvas, now, my_hash;
var my_point = false;
var my_lat, my_lon;
var my_point_drawn = false;
var geolocated = false;
var all_points = new Array();
var TIME_TO_FADE_OUT_MS = 8000;
var CIRCLE_SIZE = 8;

previous_points_length = all_points.length;

$(function(){
	if (navigator.geolocation) {
  		navigator.geolocation.getCurrentPosition(location_found, no_geolocation);
  	} else {
  		no_geolocation();
  	}
	$(".i_exist_btn").click(say_that_i_exist);
	draw_map();
	canvas = document.getElementById("points")
	ctx = canvas.getContext("2d");
	ctx.canvas.width  = window.innerWidth;
  	ctx.canvas.height = window.innerHeight;
  	animloop();
  	$(window).resize(recalculate_points);
  	// $(document).keydown(key_pressed);
  	// $(document).keyup(key_upped);
});

function location_found(loc){
	geolocated = true;
	where = true;
	my_lat = loc.coords.latitude + "";
	my_lon = loc.coords.longitude + "";
}
function no_geolocation() {
	geolocated = false;
}

function say_that_i_exist() {
	if (where === false || where === undefined) {
		where = prompt("Where?");	
	}

	if (where) {
		var post_data;
		if (geolocated) {
			post_data = {"where": "geolocated", "lat": my_lat, "lon": my_lon, 'csrf_token': CSRF_TOKEN};
		} else {
			post_data = {"where": where, 'csrf_token': CSRF_TOKEN};
		}

		$.ajax({
			url: $(".i_exist_btn").attr("href"),
			data: post_data,
			type: "POST",
			success: i_existed,
		});	
	}


	return false;
}

function key_pressed() { 
	if (where) {
		$(".i_exist_btn").addClass(".pressed");
		say_that_i_exist();
	}
}
function key_upped() {
	if (where) {
		$(".i_exist_btn").removeClass(".pressed");
	}
}

function i_existed(json) {
	if (json.success) {
		my_point = {}
		my_point.lat = 1.0*json.lat;
		my_point.lon = 1.0*json.lon;
		my_hash = json.hash;
		my_point.birth_time = new Date().getTime();
		update_xy(my_point);
	} else {
		alert("Sorry, we don't know that location. Can you be more specific?");
		where = false;
	}
	
}

function draw_map() {
	$("#map").height($(window).height());
	var template = MAP_BASE_URL + '/{Z}/{X}/{Y}.png';
	var provider = new MM.TemplatedLayer(template);
	map = new MM.Map('map', provider);
	map.setCenter({ lat: 0, lon: 0 }).setZoom(2);
	map.setZoomRange(2, 3);
}

function draw_point(point, is_me) {
	if (point.x !== undefined && point.y !== undefined) {
		var my_grad = ctx.createRadialGradient(point.x,point.y,0,point.x,point.y,CIRCLE_SIZE);
		var opacity = 1 - ((now-point.birth_time) / TIME_TO_FADE_OUT_MS);
		if (is_me) {
			my_grad.addColorStop(0, 'rgba(208,211,33,1)');
			my_grad.addColorStop(0.8, 'rgba(208,211,33,0.8)');
			my_grad.addColorStop(1, 'rgba(208,211,33,0.2)');
		} else {
			my_grad.addColorStop(0, 'rgba(57,129,71,1)');
			my_grad.addColorStop(0.8, 'rgba(57,129,71,0.8)');
			my_grad.addColorStop(1, 'rgba(57,129,71,0.2)');

		}

		ctx.beginPath();
	    ctx.arc(point.x, point.y, opacity*CIRCLE_SIZE, 0, 2 * Math.PI, false);
	    ctx.fillStyle = my_grad;
	    ctx.fill();

	    $(ctx).css("z-index", "800");
	}
}

function animloop(){
  requestAnimFrame(animloop);
  render();
}

function render() {
	now = new Date().getTime();
	canvas.width = canvas.width;

	if (now > my_point.birth_time+TIME_TO_FADE_OUT_MS) {
		my_point = false;
	}
	if (my_point !== false) {
		draw_point(my_point, true);		
	}
	var temp_pts = new Array();
	for (var key in all_points) {
		if ( now < all_points[key].birth_time+TIME_TO_FADE_OUT_MS ) {
			temp_pts.push(all_points[key]);
		}
	};
	all_points = temp_pts;
	for (var key in all_points) {
		draw_point(all_points[key], false);	
	}

}

function recalculate_points(){
	update_xy(my_point);
	for (var key in all_points) {
		update_xy(all_points[key]);
	}
	my_point_drawn = false;
	previous_points_length = -1;
}

function update_xy(pt) {
	var l = new MM.Location(pt.lat, pt.lon);
	var xy = map.locationPoint(l);
	pt.x = xy.x;
	pt.y = xy.y;
}

function add_to_all_points(lat, lon, hash) {
	if (hash != my_hash) {
		var pt = {}
		pt.lat = lat * 1.0;
		pt.lon = lon * 1.0;
		pt.birth_time = new Date().getTime();
		update_xy(pt);
		all_points[hash] = pt;	
	}
}

(function(){

    // LISTEN FOR MESSAGES
    PUBNUB.subscribe({
        channel    : "i_exist",      // CONNECT TO THIS CHANNEL.

        restore    : false,              // STAY CONNECTED, EVEN WHEN BROWSER IS CLOSED
                                         // OR WHEN PAGE CHANGES.

        callback   : function(message) { // RECEIVED A MESSAGE.
            add_to_all_points(message.lat, message.lon, message.hash);
        },

        disconnect : function() {        // LOST CONNECTION.
            // alert(
            //     "Connection Lost." +
            //     "Will auto-reconnect when Online."
            // )
        },

        reconnect  : function() {        // CONNECTION RESTORED.
            // alert("And we're Back!")
        },

        connect    : function() {        // CONNECTION ESTABLISHED.

            PUBNUB.publish({             // SEND A MESSAGE.
                channel : "i_exist",
                
            })

        }
    })

})();



window.requestAnimFrame = (function(){
  // return  window.requestAnimationFrame       || 
  //         window.webkitRequestAnimationFrame || 
  //         window.mozRequestAnimationFrame    || 
  //         window.oRequestAnimationFrame      || 
  //         window.msRequestAnimationFrame     || 
  return function( callback ){
            window.setTimeout(callback, 1000 / 15);
          };
})();


