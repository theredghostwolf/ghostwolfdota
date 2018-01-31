// app/routes.js
var Hero = require('./models/hero');
var Ability = require("./models/ability");
var Guide = require("./models/guide");

   module.exports = function(app) {

       // server routes ===========================================================
       // handle things like api calls
       // authentication routes

       app.get('/api/heroes', function(req, res) {
         Hero.find({},function(err, heroes) {
           if (err) {
             res.send(err);
           } else {
             res.json(heroes);
           }
         })
       });

       app.post('/api/heroes', function (req, res) {
         Hero.create(req.body.data, function (err, result) {
           if (err) {
             res.send(err);
           } else {
             res.send(result)
           }
         })

       });

       app.put('/api/heroes', function (req, res) {
         Hero.findOne(req.body, function (err, result) {
           if (err) {
             res.send(err);
           } else {
             res.json(result);
           }
         })
       });

       //--------------------

       app.get('/api/abilities', function(req, res) {
         Ability.find({},function(err, heroes) {
           if (err) {
             res.send(err);
           } else {
             res.json(heroes);
           }
         })
       });

       app.post('/api/abilities', function (req, res) {
         Ability.create(req.body.data, function (err, result) {
           if (err) {
             res.send(err);
           } else {
             res.send(result)
           }
         })

       });

       app.put('/api/abilities', function (req, res) {
         Ability.find(req.body, function (err, result) {
           if (err) {
             res.send(err);
           } else {
             res.json(result);
           }
         })
       });

       //-------------------

       app.get('/api/guides', function(req, res) {
         Guide.find({},function(err, heroes) {
           if (err) {
             res.send(err);
           } else {
             res.json(heroes);
           }
         })
       });

       app.post('/api/guides', function (req, res) {
         Guide.create(req.body.data, function (err, result) {
           if (err) {
             console.log(err)
             res.send(err);
           } else {

             res.send(result)
           }
         })

       });

       app.put('/api/guides', function (req, res) {
         Guide.findOne(req.body, function (err, result) {
           if (err) {
             res.send(err);
           } else {
             res.json(result);
           }
         })
       });

       // frontend routes =========================================================
       // route to handle all angular requests
       app.get('*', function(req, res) {
           res.sendfile('./public/views/index.html'); // load our public/index.html file
       });

   };
