const dbService = require('./dbservice');
const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

//test route for testing server is running
app.get('/', function (req, res) {
  res.json({ message: "hello" })
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
    .then(function (results) {
      response.json(results);
    })
    .catch(function (error) {
      //something went wrong
      response.status(500);
      response.json(error);
    });
})

app.get('/tags', function(request, response){
  dbService.getTags()
  .then(function (results) {
    response.json(results);
  })
  .catch(function (error) {
    //something went wrong
    response.status(500);
    response.json(error);
  });
})

//returns search results
app.get('/resources/search', function (request, response) {
  let queryparams = request.query.tags
  console.log(queryparams)
  dbService.searchByTags(queryparams)
    .then(function (results) {
      response.json(results);
    })
    .catch(function (error) {
      //something went wrong
      response.status(500);
      response.json(error);
    });
})


//Post a new resource -- JADE TO WRITE
app.post('/resources', async function (request, response) {
  const data = { 
    title: request.body.title,
    url: request.body.url,
    description: request.body.description,
    userName: request.body.userName,
    }

    const resourceTags = request.body.resourceTags

  try {
    const addBodyOfResource = await dbService.addResource(data);
    const resourceId = addBodyOfResource.insertId;
    const getTagIds = await dbService.getResourceTagIds(resourceTags);

    for (let item of getTagIds) {
      const thisTagId = item.tagId
      await dbService.applyTagsToResource(resourceId, thisTagId)
    }

    response.json(resourceId);
  } catch (error) {
    response.status(500);
    response.json(error);
  };
})


app.delete('/resources/:resourceId', function (request, response) {
  const resourceId = request.params.resourceId;

  dbService.deleteResource(resourceId)
    .then(function (results) {
      response.json(results);
    })
    .catch(function (error) {
      //something went wrong
      response.status(500);
      response.json(error);
    });

})

app.put('/resources/:resourceId', async function (request, response) {
  const resourceId = request.params.resourceId;

  const data = { 
    title: request.body.title,
    url: request.body.url,
    description: request.body.description,
    userName: request.body.userName,
    }

  const resourceTags = request.body.resourceTags

    try {
      await dbService.editResource(resourceId, data);
      await dbService.removeTags(resourceId);
      const getTagIds = await dbService.getResourceTagIds(resourceTags);
  
      for (let item of getTagIds) {
        const thisTagId = item.tagId
        await dbService.applyTagsToResource(resourceId, thisTagId);
      }
  
      response.json(results);
    } catch (error) {
      response.json(error);
    };

})

module.exports = app;