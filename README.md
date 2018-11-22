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

2. In your terminal, run this command: 
```
npm install
``` 
to install dependencies.

3. Run 
```
gulp
```
 to start up both the Express server for back-end and the web client. By default, the Express server is hosted on port 3000 of your localhost, which is proxied to port 7000 of the web client.

4. You can now open [localhost:7000](localhost:7000) on browser to see the web. Thanks to the proxy mentioned above, you can also access the APIs via this url. For example: [localhost:7000/api/media](localhost:7000/api/media).