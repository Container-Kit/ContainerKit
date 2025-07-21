PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_registry` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`provider` text NOT NULL,
	`default` integer DEFAULT false
);
--> statement-breakpoint
INSERT INTO `__new_registry`("id", "name", "provider", "default") SELECT "id", "name", "provider", "default" FROM `registry`;--> statement-breakpoint
DROP TABLE `registry`;--> statement-breakpoint
ALTER TABLE `__new_registry` RENAME TO `registry`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `registry_provider_unique` ON `registry` (`provider`);--> statement-breakpoint
CREATE TABLE `__new_seeds` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`applied` integer DEFAULT false
);
--> statement-breakpoint
INSERT INTO `__new_seeds`("id", "name", "applied") SELECT "id", "name", "applied" FROM `seeds`;--> statement-breakpoint
DROP TABLE `seeds`;--> statement-breakpoint
ALTER TABLE `__new_seeds` RENAME TO `seeds`;