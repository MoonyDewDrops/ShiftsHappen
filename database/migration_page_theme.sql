-- Per-page theme colors (header stays global in site_settings)

USE `shiftshappen`;

ALTER TABLE `paginas`
  ADD COLUMN `body_bg` VARCHAR(20) DEFAULT NULL AFTER `heeft_contactformulier`,
  ADD COLUMN `page_bg` VARCHAR(20) DEFAULT NULL AFTER `body_bg`,
  ADD COLUMN `page_text_color` VARCHAR(20) DEFAULT NULL AFTER `page_bg`,
  ADD COLUMN `footer_bg` VARCHAR(20) DEFAULT NULL AFTER `page_text_color`,
  ADD COLUMN `footer_text` VARCHAR(20) DEFAULT NULL AFTER `footer_bg`;
