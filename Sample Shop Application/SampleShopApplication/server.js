var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/public', express.static(__dirname + '/public'));
var path = require('path');

// viewed at http://localhost:3000
app.get(['/', '/index'], function(req, res) {
    res.sendFile(path.join(__dirname + '/views/index.html'));
});
// viewed at http://localhost:3000/cart
app.get('/cart', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/cart.html'));
});


var routes = require('./api/routes/appRoutes');
routes(app);


app.listen(port);