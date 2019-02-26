#This query joins the resources with the taggings table...so you get a row for each resource with each tagId. Then you just select
#DISTINCT resourceIds so if a resource has muliple tags it only gets returned once.
USE learning_dashboard;
SELECT DISTINCT resources.resourceId FROM
resources LEFT JOIN taggings on resources.resourceId=taggings.resourceId
WHERE tagId IN (1,12);

#To save a 2 step process in the backend we can actually combine these queries into an *Uber-query*
USE learning_dashboard;
SELECT DISTINCT resources.* FROM
resources LEFT JOIN taggings on resources.resourceId=taggings.resourceId
LEFT JOIN tags ON tags.tagId=taggings.tagId
WHERE tagName IN ("Axios");

#Then run another query based on the returned resourceID above to get all the tags for that resource ...backend can put this as 
#an array into the resourceTags key of the resource object
USE learning_dashboard;
SELECT tagId From taggings
WHERE resourceId = 2;

#Returns resources with the tagNames concatentated as a array
USE learning_dashboard;
SELECT resources.*, GROUP_CONCAT(tags.tagName) AS ResourceTags FROM
resources LEFT JOIN taggings on resources.resourceId=taggings.resourceId
LEFT JOIN tags ON tags.tagId=taggings.tagId
GROUP BY resources.resourceId

