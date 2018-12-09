# Artisan - The Art of Craftmanship

## Set up the local environment
1. Create a new file named `.env` from the `.env_example` file and fill in your database information. **DO NOT** delete the `.env_example` file.

   For example:
```
# Create .env file with this environment variables.
DB_HOST=localhost
DB_DATABASE=artisan_db
DB_USER=root
DB_PASSWORD=123456
APP_PORT=3000
```

2. The API uses [JSON Web Token](https://en.wikipedia.org/wiki/JSON_Web_Token) as API key for authentication. You need to set the signing key in `.env` file `JWT_SECRET_KEY=shhh`. API keys are signed with one hour expiration time. Logged out user's API keys are stored in a blacklist until their expiration time and deleted when they are expired. Blacklisted keys are saved in memory by default, but for production high-performance memory caching system like [Redis](https://redis.io/) or Memchached should be used. Here you have the opition to save on memory or redis. If redis is used for caching, `CACHING_SERVER=memory` in `.env` file shoud be changed to `CACHING_SERVER=redis`. If redis is runnig in different port or host, you can change the configuration in `.env` file.

	For example:
```
#redis variables if not set default values will be used
REDIS_PORT=11211
REDIS_HOST=localhost
```

	To install Redis:
	Download, extract and compile Redis, on windows it recommended to install on [WSL](https://en.wikipedia.org/wiki/Windows_Subsystem_for_Linux):
```shelll
$ wget http://download.redis.io/releases/redis-4.0.2.tar.gz
$ tar xzf redis-4.0.2.tar.gz
$ cd redis-4.0.2
$ sudo make distclean
$ sudo make –j
$ sudo make install -j
$ cd utils
$ sudo ./install_server.sh
```
	To start redis service:
```shelll
$ sudo service redis_6379 start
```


3. In your terminal, run this command to install dependencies:
```
npm install
``` 

4. Run this command to start up both the Express server for back-end and the web client:

```
gulp
```

5. By default, the Express server is hosted on port 3000 of your localhost, which is proxied to port 7000 of the web client.

   You can now open [localhost:7000](http://localhost:7000) on browser to see the web. Thanks to the proxy mentioned above, you can also access the APIs via this url. For example: [localhost:7000/api/media](http://localhost:7000/api/media).
