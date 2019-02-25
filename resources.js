const serverless = require('serverless-http');
const express = require('express');
const app = express();
app.use(express.json());
const dbService = require('./dbservice');

app.get('/resources', function (request, response) {
    dbService.getResources()
    .then(function(results){
      //we got the resources ok
      response.json(results);
    })
    .catch(function(error){
      //something went wrong
      response.status(500);
      response.json(error);
    });
  })

module.exports.handler = serverless(app);