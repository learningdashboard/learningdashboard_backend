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
    const query = "SELECT resources.*, GROUP_CONCAT(tags.tagName) AS resourceTags FROM resources LEFT JOIN taggings on resources.resourceId=taggings.resourceId LEFT JOIN tags ON tags.tagId=taggings.tagId GROUP BY resources.resourceId"
    return sendQuery(query)
    .then(function(results){
        let resources = results;
        for(i=0; i<resources.length; i++){
            resources[i].resourceTags = resources[i].resourceTags.split(',')
        }
        return resources
    })
};


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


function applyTags(resourceId, resourceTags) {
    let params = []

    for (let item of dummyTagList) {
        if (resourceTags.includes(item)) {
            params.push(["true"])
        } else {
            params.push(["false"])
        }
    };

    params.push([resourceId]);

    const query = 'UPDATE resource_tags SET Javascript = ?, Conditionals = ?, Axios = ?, HTML = ?, AWS = ?, Arrays = ?, React = ?, Bootstrap = ?, mySQL = ?, Tutorials = ?, Loops = ?, JS_Express = ?, CSS = ?, Testing_TDD = ?, Professional_Development = ? WHERE resourceId = ?'

    return sendQuery(query, params);
    
}

module.exports = {
    getResources,
    addResource,
    applyTags
};