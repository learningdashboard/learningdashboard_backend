const dbService = require('./dbservice');
const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

//test route for testing server is running
app.get('/', function(req,res){
    res.json({message:"hello"})
})

//returns all resources
app.get('/resources', function (request, response) {
    dbService.getResources()
    .then(function(results){
      response.json(results);
    })
    .catch(function(error){
      //something went wrong
      response.status(500);
      response.json(error);
    });
  })

  //returns latest 5 resources
  app.get('/resources/top', function (request, response) {
    dbService.getResourcesTop()
    .then(function(results){
      response.json(results);
    })
    .catch(function(error){
      //something went wrong
      response.status(500);
      response.json(error);
    });
  })

  //returns search results
  app.get('/resources/search', function(request, response){
    let queryparams = request.query.tags
    console.log(queryparams)
    dbService.searchByTags(queryparams)
    .then(function(results){
      response.json(results);
    })
    .catch(function(error){
      //something went wrong
      response.status(500);
      response.json(error);
    });
  })


  //Post a new resource -- JADE TO WRITE
  app.post('/resources', function (request, response) {
    const title = request.body.title;
    const url = request.body.url;
    const description = request.body.description;
    const userName = request.body.userName;
    const dateAdded = request.body.dateAdded;
    const resourceId = request.body.resourceId;
    const resourceTags = request.body.resourceTags;

  
    dbService.addResource(title, url, description, userName, dateAdded)
    .then(function(results){
      response.json(results);
    })
    .then(dbService.applyTags(resourceId, resourceTags))
    .then(function(results){
        response.json(results);
      })
    .catch(function(error){
      response.status(500);
      response.json(error);
    });
  })

  
  // JADE TO WRITE
  app.delete('/resource/:resourceId', function(request, response){

  })

  module.exports = app;