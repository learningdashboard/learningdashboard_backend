const mysql = require("mysql");

const dummyTagList = [
    "JavaScript",
    "Conditionals",
    "Axios",
    "HTML",
    "AWS",
    "Arrays",
    "React",
    "Bootstrap",
    "mySQL",
    "Tutorials",
    "Loops",
    "JS_Express",
    "CSS",
    "Testing_TDD",
    "Professional_Development"
  ]
  

function getDatabaseConnection() {
    return mysql.createConnection({
        host: process.env.RDS_HOST,
        user: process.env.RDS_USER,
        password: process.env.RDS_PASSWORD,
        database: process.env.RDS_DATABASE 
    });
};

function sendQuery(query, params) {
    const connection = getDatabaseConnection();
    return new Promise(function(resolve, reject) {
        connection.query(query, params, function(error, results, fields) {
            if (error) {
                connection.destroy();
                return reject(error);
            } 
            else {
                connection.end(function(err){
                    return resolve(results);
                });
                ;
            }
        });
    });
};

function getResources(){
    const query = `SELECT resources.*, GROUP_CONCAT(tags.tagName) AS resourceTags FROM 
                resources LEFT JOIN taggings on resources.resourceId=taggings.resourceId 
                LEFT JOIN tags ON tags.tagId=taggings.tagId 
                GROUP BY resources.resourceId`
    return sendQuery(query)
    .then(function(results){
        //resourceTags field is sent back as comma seperated list ...so pass to array
        let resources = results;
        for(i=0; i<resources.length; i++){
            resources[i].resourceTags = resources[i].resourceTags.split(',')
        }
        return resources
    })
};

function getResourcesTop(){
    const query = `SELECT resources.*, GROUP_CONCAT(tags.tagName) AS resourceTags FROM 
                resources LEFT JOIN taggings on resources.resourceId=taggings.resourceId 
                LEFT JOIN tags ON tags.tagId=taggings.tagId 
                GROUP BY resources.resourceId
                ORDER BY resources.dateAdded DESC
                LIMIT 1`
    return sendQuery(query)
    .then(function(results){
        //resourceTags field is sent back as comma seperated list ...so pass to array
        let resources = results;
        for(i=0; i<resources.length; i++){
            resources[i].resourceTags = resources[i].resourceTags.split(',')
        }
        return resources
    })
}

function searchByTags(arrayOfTags){
    console.log(arrayOfTags)
    const query = `SELECT resources.*, GROUP_CONCAT(tags.tagName) AS resourceTags FROM 
                resources LEFT JOIN taggings on resources.resourceId=taggings.resourceId 
                LEFT JOIN tags ON tags.tagId=taggings.tagId 
                WHERE tags.tagName IN (?)
                GROUP BY resources.resourceId`
    const params = arrayOfTags
    return sendQuery(query, params)
    .then(function(results){
        //resourceTags field is sent back as comma seperated list ...so pass to array
        let resources = results;
        for(i=0; i<resources.length; i++){
            resources[i].resourceTags = resources[i].resourceTags.split(',')
        }
        return resources
    })
}


//JADE TO IMPLEMENT 3 steps to storing a resource
function addResource(title, url, description, userName, dateAdded) {
    const data  =  {
    title: title,
    url: url,     
    description: description, 	
    userName: userName,
    dateAdded: dateAdded
    };

    const query = "INSERT INTO learning_resources SET ?"
    const params = data
    return sendQuery(query, params);
}

//JADE TO WRITE
//Delete a resource from taggings table and THEN from resources table....idealliy would do this in a single sql
//procedure but for now if you do it in this order there is no risk that it gets deleted from resources table and then 
//someone picks it up in a search before its deleted from taggings table
function deleteResource(resourceId){

}

module.exports = {
    getResources,
    addResource,
    getResourcesTop,
    searchByTags,
    deleteResource
};