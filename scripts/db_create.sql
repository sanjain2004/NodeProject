CREATE DATABASE  IF NOT EXISTS `pil`;
USE `pil`;

--
-- Table structure for table `User`
--
DROP TABLE IF EXISTS `User`;
CREATE TABLE `User` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `userName` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `createdDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `contact` varchar(20) DEFAULT NULL,
  `status` enum('active','deactivated','deleted') NOT NULL,
  `stateCode` char(2) NOT NULL,
  `role` enum('investigator','client') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userName_UNIQUE` (`userName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `InvestigatorUser`
--
DROP TABLE IF EXISTS `InvestigatorUser`;
CREATE TABLE `InvestigatorUser` (
  `id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_investigator_id` FOREIGN KEY (`id`) REFERENCES `User` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `ClientUser`
--
DROP TABLE IF EXISTS `ClientUser`;
CREATE TABLE `ClientUser` (
  `id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_client_id` FOREIGN KEY (`id`) REFERENCES `User` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `PiXState`
--
DROP TABLE IF EXISTS `PiXState`;
CREATE TABLE `PiXState` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `investigatorId` int(11) NOT NULL,
  `stateCode` char(2) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `zipcode` varchar(10) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `licenseNumber` varchar(255) DEFAULT NULL,
  `licenseFileId` varchar(36) DEFAULT NULL,
  `licenseExpiryDate` datetime DEFAULT NULL,
  `companyName` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_pixstate_id_idx` (`investigatorId`),
  CONSTRAINT `fk_pixstate_id` FOREIGN KEY (`investigatorId`) REFERENCES `InvestigatorUser` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `PiXStateXPractice`
--
DROP TABLE IF EXISTS `PiXStateXPractice`;
CREATE TABLE `PiXStateXPractice` (
  `piId` int(11) NOT NULL,
  `practice` varchar(255) NOT NULL,
  KEY `fk_pixstatexpractice_id_idx` (`piId`),
  CONSTRAINT `fk_pixstatexpractice_id` FOREIGN KEY (`piId`) REFERENCES `PiXState` (`investigatorId`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `Case`
--
DROP TABLE IF EXISTS `PILCase`;
CREATE TABLE `PILCase` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdBy` int(11) NOT NULL,
  `budget` int(11) NOT NULL,
  `description` varchar(512) DEFAULT NULL,
  `status` enum('assigned','open','suspended','closed') NOT NULL,
  `assignedTo` int(11) DEFAULT NULL,
  `assignedDate` timestamp NULL DEFAULT NULL,
  `createdDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `type` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_case_inv_id_idx` (`assignedTo`),
  KEY `fk_case_cli_id_idx` (`createdBy`),
  CONSTRAINT `fk_case_assignedto_id` FOREIGN KEY (`assignedTo`) REFERENCES `User` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_case_crtdby_id` FOREIGN KEY (`createdBy`) REFERENCES `ClientUser` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `CaseConversation`
--
DROP TABLE IF EXISTS `CaseConversation`;
CREATE TABLE `CaseConversation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `caseId` int(11) NOT NULL,
  `createdDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int(11) NOT NULL,
  `text` varchar(1024) DEFAULT NULL,
  `hasAttachments` tinyint(1) NOT NULL DEFAULT '0',
  `geoLocation` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_caseconv_case_id_idx` (`caseId`),
  KEY `fk_caseconv_crtdby_idx` (`createdBy`),
  CONSTRAINT `fk_caseconv_case_id` FOREIGN KEY (`caseId`) REFERENCES `PILCase` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_caseconv_crtdby_id` FOREIGN KEY (`createdBy`) REFERENCES `User` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `CaseConversationFiles`
--
DROP TABLE IF EXISTS `CaseConversationFiles`;
CREATE TABLE `CaseConversationFiles` (
  `id` int(11) NOT NULL,
  `caseConversationId` int(11) NOT NULL,
  `fileName` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_caseconvfile_conv_id_idx` (`caseConversationId`),
  CONSTRAINT `fk_caseconvfile_conv_id` FOREIGN KEY (`caseConversationId`) REFERENCES `caseconversation` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `CaseConversationParticipants`
--
DROP TABLE IF EXISTS `CaseConversationParticipants`;
CREATE TABLE `CaseConversationParticipants` (
  `caseConversationId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  KEY `fk_caseconvpart_case_id_idx` (`caseConversationId`),
  KEY `fk_caseconvpart_user_id_idx` (`userId`),
  KEY `fk_caseconvpart_case_id_idx1` (`caseConversationId`,`userId`),
  CONSTRAINT `fk_caseconvpart_caseconv_id` FOREIGN KEY (`caseConversationId`) REFERENCES `caseconversation` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_caseconvpart_user_id` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `CaseParticipants`
--
DROP TABLE IF EXISTS `CaseParticipants`;
CREATE TABLE `CaseParticipants` (
  `caseId` int(11) NOT NULL,
  `participantId` int(11) NOT NULL,
  KEY `fk_case_part_case_id_idx` (`caseId`),
  KEY `fk_case_part_part_id_idx` (`participantId`),
  CONSTRAINT `fk_case_part_part_id` FOREIGN KEY (`participantId`) REFERENCES `User` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_casepart_case_id` FOREIGN KEY (`caseId`) REFERENCES `PILCase` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `CaseInterest`
--
DROP TABLE IF EXISTS `CaseInterest`;
CREATE TABLE `CaseInterest` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `caseId` int(11) NOT NULL,
  `piId` int(11) NOT NULL,
  `interested` tinyint(1) NOT NULL DEFAULT '0',
  `accepted` tinyint(1) DEFAULT NULL,
  `createdDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedDate` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unq_case_pi_id` (`caseId`,`piId`),
  KEY `fk_caseint_pi_id_idx` (`piId`),
  KEY `fk_caseint_case_id_idx` (`caseId`),
  CONSTRAINT `fk_caseint_case_id` FOREIGN KEY (`caseId`) REFERENCES `PILCase` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_caseint_pi_id` FOREIGN KEY (`piId`) REFERENCES `InvestigatorUser` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `UserToken`
--
DROP TABLE IF EXISTS `UserToken`;
CREATE TABLE `UserAuthToken` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `authToken` varchar(64) DEFAULT NULL,
  `updatedDate` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_authuser_user_id_idx` (`userId`),
  CONSTRAINT `fk_authuser_user_id` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
