#DELETING A RESOURCE BASED ON ID:

#From the backend you delete from taggings table first ...otherewise someone could access the taggings info in a search 
#after the resource is deleted from resources table...this way around is safer

#Delete from taggings database
Use learning_dashboard;
DELETE FROM taggings
WHERE resourceId=1;


#Delete from resource database
Use learning_dashboard;
DELETE FROM resources
WHERE resourceId=1;
