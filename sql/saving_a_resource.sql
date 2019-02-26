#ADD A NEW RESOURCE TO DATABASE - 3 STEP QUERY 

#STEP ONE: SAVE ALL THE RESOURCE DETAILS INTO resources TABLE -- this is just like saving the todoitem but with
#a few extra fields
# when we run this query from the Node mySQL package you get the autoIncremented Id of the insert returned to you as a response
# from database.....so you can capture that in a variable ready to use in step2!
# https://github.com/mysqljs/mysql#getting-the-id-of-an-inserted-row
USE learning_dashboard;
INSERT INTO resources (title, description, url, userName) 
VALUES ("Axios Tutorial", "This is a basic Axios Tutorial", "test2@test.com", "Nicola");


#STEP TWO: LOOK UP THE TAG IDs for the Tagnames associated with the resource 
#when we run this query from backend code we will get the list of tag_ids we want to give to the resource
USE learning_dashboard;
SELECT tagId from tags WHERE tagName IN ('Axios');

#STEP THREE: PUT ENTRIES INTO taggings TABLE FOR EACH resourceId(from step 1) and tagId(from Step 2)
USE learning_dashboard;
INSERT INTO taggings (resourceId, tagId) 
VALUES (4, 4);

