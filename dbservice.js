const mysql = require("mysql");


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
    return new Promise(function (resolve, reject) {
        connection.query(query, params, function (error, results, fields) {
            if (error) {
                connection.destroy();
                return reject(error);
            }
            else {
                connection.end(function (err) {
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
                GROUP BY resources.resourceId
                ORDER BY resources.dateAdded DESC`
    return sendQuery(query)
    .then(function(results){
        console.log(results)
        //resourceTags field is sent back as comma seperated list ...so pass to array
        let resources = results;
        for(i=0; i<resources.length-1; i++){
            //if there are no tags don't try to split them into an array
            if(resources[i].resourceTags != null){
                resources[i].resourceTags = resources[i].resourceTags.split(',')
            } 
        }

        console.log(JSON.stringify(resources))
        return resources
    })
};

function getResourcesTop() {
    const query = `SELECT resources.*, GROUP_CONCAT(tags.tagName) AS resourceTags FROM 
                resources LEFT JOIN taggings on resources.resourceId=taggings.resourceId 
                LEFT JOIN tags ON tags.tagId=taggings.tagId 
                GROUP BY resources.resourceId
                ORDER BY resources.dateAdded DESC
                LIMIT 5`
    return sendQuery(query)
    .then(function(results){
        //resourceTags field is sent back as comma seperated list ...so pass to array
        let resources = results;
        for(i=0; i<resources.length; i++){
            //if there are no tags don't try to split them into an array
            if(resources[i].resourceTags != null){
                resources[i].resourceTags = resources[i].resourceTags.split(',')
            }
        }
        return resources
    })
}

function getTags(){
    const query = `SELECT tagName FROM tags`
    return sendQuery(query)
    .then(function(tags){
        let tagsArray=[]
        for(i=0;i<tags.length;i++){
            tagsArray.push(tags[i].tagName)
        }
        return tagsArray;
    })
}

function searchByTags(arrayOfTags) {
    const query = `SELECT t2.* FROM
                    (SELECT DISTINCT resources.resourceId FROM 
                    resources LEFT JOIN taggings on resources.resourceId=taggings.resourceId 
                    LEFT JOIN tags ON tags.tagId=taggings.tagId 
                    WHERE tags.tagName IN (?)) t1
                    LEFT JOIN
                    (SELECT resources.*, GROUP_CONCAT(tags.tagName) AS resourceTags FROM
                    resources LEFT JOIN taggings on resources.resourceId=taggings.resourceId
                    LEFT JOIN tags ON tags.tagId=taggings.tagId
                    GROUP BY resources.resourceId) t2
                    ON t1.resourceId=t2.resourceId
                    ORDER BY t2.dateAdded DESC`
    const params = arrayOfTags
    return sendQuery(query, [params])
    .then(function(results){
        //resourceTags field is sent back as comma seperated list ...so pass to array
        let resources = results;
        for(i=0; i<resources.length; i++){
            //if there are no tags don't try to split them into an array
            if(resources[i].resourceTags != null){
                resources[i].resourceTags = resources[i].resourceTags.split(',')
            }
        }
        return resources
    })
}

//3 steps to storing a resource
function addResource(data) {
    const query = `INSERT INTO resources SET ?`;
    const params = data;
    return sendQuery(query, params);
}

function getResourceTagIds(resourceTags) {
    const query = `SELECT tagId from tags WHERE tagName IN (?)`;
    const params = [resourceTags];
    return sendQuery(query, params);
}

function applyTagsToResource(resourceId, tagId) {
    const query = `INSERT INTO taggings (resourceId, tagId) VALUES (?, ?);`;
    const params = [resourceId, tagId];
    return sendQuery(query, params);
}

//Delete resource info and tags (from both 'resources' and 'taggings' tables in db)
function deleteResource(resourceId) {
    const query = `DELETE t, r FROM taggings as t RIGHT JOIN resources as r ON t.resourceId = r.resourceId WHERE r.resourceId = ?;`;
    const params = resourceId;
    return sendQuery(query, params);
}

function editResource(resourceId,data) {
    const query = `UPDATE resources SET ? WHERE resourceId = ?`;
    const params = [data, resourceId];
    return sendQuery(query, params);
}

function removeTags(resourceId) {
    const query = `DELETE FROM taggings WHERE resourceId = ?`;
    const params = resourceId;
    return sendQuery(query, params);  
}

module.exports = {
    getResources,
    addResource,
    getResourcesTop,
    searchByTags,
    deleteResource,
    getResourceTagIds,
    applyTagsToResource,
    getTags,
    editResource,
    removeTags
};