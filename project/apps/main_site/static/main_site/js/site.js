var where = false;
var map;
var ctx;
var my_point = false;
var all_points = new Array();
var time_to_fade_out_ms = 20000;


$(function(){
	$(".i_exist_btn").click(say_that_i_exist);
	draw_map();
	ctx = document.getElementById("points").getContext("2d");
	ctx.canvas.width  = window.innerWidth;
  	ctx.canvas.height = window.innerHeight;
  	animloop();
  	$(window).resize(recalculate_points);
});

function say_that_i_exist() {

	var link = $(this);
	if (where === false || where === undefined) {
		where = prompt("Where?");	
	}

	if (where) {
		$.ajax({
			url: link.attr("href"),
			data: {"where": where, 'csrf_token': CSRF_TOKEN},
			type: "POST",
			success: i_existed,
		});	
	}

	return false;
}

function i_existed(json) {
	if (json.success) {
		my_point = {}
		my_point.lat = 1.0*json.lat;
		my_point.lon = 1.0*json.lon;
		update_xy(my_point);	
	} else {
		alert("Sorry, we don't know that location. Can you be more specific?");
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
	if (point.x !== undefined && point.y!== undefined) {
		var my_grad = ctx.createRadialGradient(point.x,point.y,2,point.x,point.y,10);
		if (is_me) {
			my_grad.addColorStop(0, '#d0d321');
			// my_grad.addColorStop(0.9, '#019F62');
			my_grad.addColorStop(1, 'rgba(255,255,255,0)');
		} else {
			my_grad.addColorStop(0, '#398147');
			// my_grad.addColorStop(0.9, '#019F62');
			my_grad.addColorStop(1, 'rgba(255,255,255,0)');

		}

		ctx.beginPath();
	    ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI, false);
	    ctx.fillStyle = my_grad;
	    ctx.fill();

	    // ctx.lineWidth = 5;
	    // ctx.strokeStyle = "#FFF";
	    // ctx.stroke();
	    $(ctx).css("z-index", "800");
	}
}

function animloop(){
  requestAnimFrame(animloop);
  render();
}

function render() {
	ctx.width = ctx.width;
	console.log("rendering");
	if (my_point !== false) {
		draw_point(my_point, true);	
	}
	for (var j=0; j<all_points.length; j++ ) {
		draw_point(all_points, false);
	}
}

function recalculate_points(){
	update_xy(my_point);
	for (var j=0; j<all_points.length; j++ ) {
		update_xy(all_points);
	}
}

function update_xy(pt) {
	var l = new MM.Location(pt.lat, pt.lon);
	var xy = map.locationPoint(l);
	pt.x = xy.x;
	pt.y = xy.y;
}

function add_to_all_points(lat, lon) {
	var pt = {}
	pt.lat = lat * 1.0;
	pt.lon = lon * 1.0;
	pt.birth_time = new Date().getTime();
	update_xy(pt);
	all_points.push(pt);
}

(function(){

    // LISTEN FOR MESSAGES
    PUBNUB.subscribe({
        channel    : "i_exist",      // CONNECT TO THIS CHANNEL.

        restore    : false,              // STAY CONNECTED, EVEN WHEN BROWSER IS CLOSED
                                         // OR WHEN PAGE CHANGES.

        callback   : function(message) { // RECEIVED A MESSAGE.
            add_to_all_points(message.lat, message.lon);
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
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function( callback ){
            window.setTimeout(callback, 1000 / 5);
          };
})();


