from annoying.decorators import render_to, ajax_request
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse



from libs.pubnub import Pubnub
from main_site.models import Existence

def send_pubnub_notification(my_existence):
    pubnub = Pubnub(
        "pub-141dae41-5126-40f9-bf3b-61e4f8676853",  ## PUBLISH_KEY
        "sub-da7f8e66-7602-11e1-8e7f-3157f0c9d5f9",  ## SUBSCRIBE_KEY
        "sec-636f4ae1-b6ab-4819-8aac-7c06ec949a7e",    ## SECRET_KEY
        False    ## SSL_ON?
    )

    pubnub.publish({
        'channel' : 'i_exist',
        'message' : {
                    'lon' : my_existence.lon,
                    'lat' : my_existence.lat,
                    'where' : my_existence.where,
                    'hash': my_existence.ip_hash,
                    # 'when': my_existence.when
                }
    })


@render_to("main_site/home.html")
def home(request):
    return locals()

@ajax_request
def i_exist(request):
    if request.method == "POST":
        where =  request.POST["where"]
        try:
            if "lat" in request.POST:
                my_existence = Existence.objects.create(where=where, ip=request.META["REMOTE_ADDR"], lat=float(request.POST["lat"]), lon=float(request.POST["lon"]))
            else:
                my_existence = Existence.objects.create(where=where, ip=request.META["REMOTE_ADDR"])

            send_pubnub_notification(my_existence)
            return {"success": True, "lat": my_existence.lat, "lon": my_existence.lon, "hash":my_existence.ip_hash}

        except Exception, e:
            print e
            return {"success": False}

    else:
        return HttpResponseRedirect(reverse("main_site:home"))
