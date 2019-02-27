CREATE TABLE `resources` (
  `resourceId` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `userName` varchar(255) DEFAULT NULL,
  `dateAdded` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`resourceId`),
  UNIQUE KEY `dateAdded_UNIQUE` (`dateAdded`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

CREATE TABLE `taggings` (
  `tagId` int(11) NOT NULL,
  `resourceId` int(11) NOT NULL,
  PRIMARY KEY (`tagId`,`resourceId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `tags` (
  `tagId` int(11) NOT NULL AUTO_INCREMENT,
  `tagName` varchar(45) NOT NULL,
  PRIMARY KEY (`tagId`,`tagName`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
