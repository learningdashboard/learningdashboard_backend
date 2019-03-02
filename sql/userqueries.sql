USE learning_dashboard;
SELECT * FROM users;
WHERE userId = 1;

USE learning_dashboard;
REPLACE INTO users (userId, userName, githubPicture)
VALUES (1, "NicolaNew", "test");