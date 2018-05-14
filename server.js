var express = require('express');
var request = require('request')
var path = require('path');

// Store our app's ID and Secret. These we got from Step 1. 
// Todo:  For this tutorial, we'll keep your API credentials right here. But for an actual app, you'll want to  store them securely in environment variables. 
var clientId = '335440263095.337322633860';
var clientSecret = '7c9b32fb6ec68126fd700d7b0ddeecb6';

var app = express();

// Again, we define a port we want to listen to
const PORT=4391;

//app.use(express.static('public'));
app.use('/static', express.static('public'));

// Lets start our server
app.listen(PORT, function () {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Example app listening on port " + PORT);
});

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    //res.sendFile(path.join(__dirname + '/index.html'));
    res.redirect('https://7a2337db.ngrok.io/static/index.html');
});

// This route handles get request to a /oauth endpoint. We'll use this endpoint for handling the logic of the Slack oAuth process behind our app.
app.get('/oauth', function(req, res) {
    // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint. If that code is not there, we respond with an error message
    if (!req.query.code) {
        res.status(500);
        res.send({"Error": "Looks like we're not getting code."});
        console.log("Looks like we're not getting code.");
    } else {
        // We'll do a GET call to Slack's `oauth.access` endpoint, passing our app's client ID, client secret, and the code we just got as query parameters.
        request({
            url: 'https://slack.com/api/oauth.access', //URL to hit
            qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret}, //Query string data
            method: 'GET', //Specify the method

        }, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                //res.json(body);
                console.log('config', body);

                // ToDo : Store 


                res.redirect('https://7a2337db.ngrok.io/static/index.html');

            }
        })
    }
});

// Route the endpoint that our slash command will point to and send back a simple response to indicate that ngrok is working
app.post('/command', function(req, res) {
    res.send('Your ngrok tunnel is up and running!');
});

app.listen(4390);
