ALTER TABLE `registry` RENAME COLUMN "provider" TO "url";--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
DROP INDEX `registry_provider_unique`;--> statement-breakpoint
ALTER TABLE `registry` ADD `logged_in` integer DEFAULT false;--> statement-breakpoint
CREATE UNIQUE INDEX `registry_url_unique` ON `registry` (`url`);