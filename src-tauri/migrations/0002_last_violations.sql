ALTER TABLE `register` RENAME TO `registry`;--> statement-breakpoint
DROP INDEX `register_provider_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `registry_provider_unique` ON `registry` (`provider`);