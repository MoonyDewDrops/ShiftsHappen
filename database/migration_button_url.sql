-- Run once on an existing ShiftsHappen database before using button blocks.
ALTER TABLE `paginainfo`
  ADD COLUMN `button_url` VARCHAR(2048) NOT NULL DEFAULT '' AFTER `foto`;