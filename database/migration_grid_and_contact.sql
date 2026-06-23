-- Run this in phpMyAdmin if you already imported shiftshappen.sql earlier.

USE `shiftshappen`;

ALTER TABLE `paginas`
  ADD COLUMN `heeft_contactformulier` TINYINT(1) NOT NULL DEFAULT 0 AFTER `inhoud`;

CREATE TABLE IF NOT EXISTS `paginagrid` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `pageValue` INT UNSIGNED NOT NULL,
  `rowPosition` INT NOT NULL DEFAULT 0,
  `columnType` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `pageValue` (`pageValue`),
  CONSTRAINT `paginagrid_page_fk` FOREIGN KEY (`pageValue`) REFERENCES `paginas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `paginainfo` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `whichRow` INT UNSIGNED NOT NULL,
  `colum` TINYINT NOT NULL,
  `informatie` TEXT NOT NULL,
  `foto` TINYINT(1) NOT NULL DEFAULT 0,
  `backgroundColor` TINYINT(1) NOT NULL DEFAULT 0,
  `bold` TINYINT(1) NOT NULL DEFAULT 0,
  `italic` TINYINT(1) NOT NULL DEFAULT 0,
  `opacity` TINYINT NOT NULL DEFAULT 10,
  `kleur` VARCHAR(20) NOT NULL DEFAULT '#111827',
  PRIMARY KEY (`id`),
  KEY `whichRow` (`whichRow`),
  CONSTRAINT `paginainfo_row_fk` FOREIGN KEY (`whichRow`) REFERENCES `paginagrid` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `paginas` (`titel`, `slug`, `inhoud`, `heeft_contactformulier`)
SELECT 'Contact', 'contact', 'Heb je een vraag? Vul het formulier hieronder in.', 1
WHERE NOT EXISTS (SELECT 1 FROM `paginas` WHERE `slug` = 'contact');

UPDATE `paginas` SET `heeft_contactformulier` = 1 WHERE `slug` = 'contact';

INSERT INTO `paginagrid` (`pageValue`, `rowPosition`, `columnType`)
SELECT p.id, 1, 1 FROM `paginas` p
WHERE p.slug = 'home' AND NOT EXISTS (SELECT 1 FROM `paginagrid` g WHERE g.pageValue = p.id);

INSERT INTO `paginagrid` (`pageValue`, `rowPosition`, `columnType`)
SELECT p.id, 2, 2 FROM `paginas` p
WHERE p.slug = 'home' AND (SELECT COUNT(*) FROM `paginagrid` g WHERE g.pageValue = p.id) = 1;

INSERT INTO `paginainfo` (`whichRow`, `colum`, `informatie`, `foto`, `backgroundColor`, `bold`, `italic`, `opacity`, `kleur`)
SELECT g.id, 1, 'Welkom bij ShiftsHappen! Wij helpen je met shifts die echt gebeuren.', 0, 1, 1, 0, 10, '#111827'
FROM `paginagrid` g
JOIN `paginas` p ON p.id = g.pageValue
WHERE p.slug = 'home' AND g.rowPosition = 1
AND NOT EXISTS (SELECT 1 FROM `paginainfo` i WHERE i.whichRow = g.id AND i.colum = 1);

INSERT INTO `paginainfo` (`whichRow`, `colum`, `informatie`, `foto`, `backgroundColor`, `bold`, `italic`, `opacity`, `kleur`)
SELECT g.id, 1, 'Onze missie is om planning simpel en overzichtelijk te maken voor iedereen.', 0, 0, 0, 0, 10, '#111827'
FROM `paginagrid` g
JOIN `paginas` p ON p.id = g.pageValue
WHERE p.slug = 'home' AND g.rowPosition = 2
AND NOT EXISTS (SELECT 1 FROM `paginainfo` i WHERE i.whichRow = g.id AND i.colum = 1);

INSERT INTO `paginainfo` (`whichRow`, `colum`, `informatie`, `foto`, `backgroundColor`, `bold`, `italic`, `opacity`, `kleur`)
SELECT g.id, 2, 'Neem contact op via de contactpagina als je vragen hebt.', 0, 0, 0, 1, 10, '#1d4ed8'
FROM `paginagrid` g
JOIN `paginas` p ON p.id = g.pageValue
WHERE p.slug = 'home' AND g.rowPosition = 2
AND NOT EXISTS (SELECT 1 FROM `paginainfo` i WHERE i.whichRow = g.id AND i.colum = 2);
