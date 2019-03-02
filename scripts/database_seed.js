const mysql = require("mysql");
const dbService = require("../dbservice")


const seedData = require('./seedData.json')


async function seedDatabase(){
    for(i=0; i<seedData.data.length;i++){

        const data = { 
            title: seedData.data[i].title,
            url: seedData.data[i].url,
            description: seedData.data[i].description,
            userName: seedData.data[i].userName,
            //for seeded data add a random date/time between current date and currentdate - 30 days
            //otherwise it looks like all the resources are added at same time 
            dateAdded: new Date(new Date() - (Math.random() * 86400000) * 30)
        }

        const resourceTags = seedData.data[i].resourceTags
        console.log(seedData.data[i].resourceTags)

        try {
             const addBodyOfResource = await dbService.addResource(data)
             const resourceId = addBodyOfResource.insertId;
             const getTagIds = await dbService.getResourceTagIds(resourceTags);
             
             console.log(data.title, getTagIds)
    
            let tagPromises = [];
            
             for (let item of getTagIds) {
                 const thisTagId = item.tagId
                 tagPromises.push(dbService.applyTagsToResource(resourceId, thisTagId))
            }

             await Promise.all(tagPromises)
            
         } catch (error) {
              console.log(error)
         }

    }
    console.log("database successfully seeded")
}

seedDatabase()

