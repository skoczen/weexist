Artechetype (terrible pun) is a grab-and-go starter django+js I use when making new digital projects.  You're welcome to as well, and if you come across improvements, pull requests are welcome.

NOTE: I'm still working on it. Don't use it quite yet.



Map tiles
=========

```bash
mb-util --scheme=osm we_exist.mbtiles ../project/apps/main_site/static/map/tiles
```


Deploying to Heroku, with AWS for static media
==============================================

I love heroku. It's easy, it scales well, and it takes care of most of the stuff I don't want to think about.  Here's how to get artechetype running on it:

Preparing
---------


1. Install the gem, if you don't already have it

	```gem install heroku```

2. Authenticate

	```heroku login```

3. Create the app
	
	```bash
	heroku create --stack cedar mynewproject
	```

3. I use this set of addons in almost every project

	```bash
heroku addons:add custom_domains:basic
heroku addons:add zerigo_dns:basic
heroku addons:add memcache:5mb
heroku addons:add logging:expanded
heroku addons:add redistogo:nano
	```

4. Set up your domains

	```bash
	heroku domains:add www.mydomain.com
	heroku domains:add mydomain.com
	```

5. Set your keys

	* If you have a private repo, you can set the keys directly in `keys_and_passwords.py`.
	* If you have a public repo:
		* You're best off setting them as environment variables in your deployment environment.  
			```bash
			heroku config:add AWS_ACCESS_KEY_ID=foo-bar-1
			```
		* For local usage, set the keys in `keys_and_passwords_private.py`

	Keys you're likely want to set:
		```bash
		heroku config:add AWS_ACCESS_KEY_ID=foo`
		heroku config:add AWS_SECRET_ACCESS_KEY=bar
		heroku config:add AWS_STORAGE_BUCKET_NAME=myproject
		heroku config:add DB_PASSWORD=pass1234
		# analytics settings.
		```
	

Deploying
---------

* `fab deploy`

Note: If you haven't created the AWS bucket, simply running `./manage.py sync_static` will do it for you.