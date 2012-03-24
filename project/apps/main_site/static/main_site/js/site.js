var where = false;
var map;
var ctx;


$(function(){
	$(".i_exist_btn").click(say_that_i_exist);
	draw_map();
	ctx = document.getElementById("points").getContext("2d");
	ctx.canvas.width  = window.innerWidth;
  	ctx.canvas.height = window.innerHeight;

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
	draw_point(1.0*json.lat, 1.0*json.lon, true);
}

function draw_map() {
	$("#map").height($(window).height());
	var template = MAP_BASE_URL + '/{Z}/{X}/{Y}.png';
	var provider = new MM.TemplatedLayer(template);
	map = new MM.Map('map', provider);
	map.setCenter({ lat: 0, lon: 0 }).setZoom(2);
	map.setZoomRange(2, 3);
}

function draw_point(lat, lon, is_me) {
	lat = lat*1.0;
	lon = lon*1.0;
	var l = new MM.Location(lat, lon);
	xy = map.locationPoint(l);
	var my_grad = ctx.createRadialGradient(xy.x,xy.y,2,xy.x,xy.y,10);
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
    ctx.arc(xy.x, xy.y, 10, 0, 2 * Math.PI, false);
    ctx.fillStyle = my_grad;
    ctx.fill();

    // ctx.lineWidth = 5;
    // ctx.strokeStyle = "#FFF";
    // ctx.stroke();
    $(ctx).css("z-index", "800");
}

(function(){

    // LISTEN FOR MESSAGES
    PUBNUB.subscribe({
        channel    : "i_exist",      // CONNECT TO THIS CHANNEL.

        restore    : false,              // STAY CONNECTED, EVEN WHEN BROWSER IS CLOSED
                                         // OR WHEN PAGE CHANGES.

        callback   : function(message) { // RECEIVED A MESSAGE.
            console.log(message)
            draw_point(message.lat, message.lon, false);
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