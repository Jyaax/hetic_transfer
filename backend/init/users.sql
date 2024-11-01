-- Crée la base de données si elle n'existe pas déjà
CREATE DATABASE IF NOT EXISTS `hetic_transfer`;
USE `hetic_transfer`;

-- Crée la table `users`
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `firstname` VARCHAR(255) NOT NULL,
    `lastname` VARCHAR(255) NOT NULL
);

-- Ajouter un utilisateur
INSERT INTO `users` (`email`, `password`, `firstname`, `lastname`) 
VALUES ('JoDu87@gmail.com', 'JonathanHeticTransfer', 'Jonathan', 'Jonathan');
