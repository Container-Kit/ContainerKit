CREATE TABLE `seeds` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`applied` integer DEFAULT false
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_register` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`default` integer DEFAULT false,
	`provider` text
);
--> statement-breakpoint
INSERT INTO `__new_register`("id", "name", "default", "provider") SELECT "id", "name", "default", "provider" FROM `register`;--> statement-breakpoint
DROP TABLE `register`;--> statement-breakpoint
ALTER TABLE `__new_register` RENAME TO `register`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `register_provider_unique` ON `register` (`provider`);--> statement-breakpoint
CREATE TABLE `__new_user` (
	`id` text PRIMARY KEY NOT NULL,
	`age` integer
);
--> statement-breakpoint
INSERT INTO `__new_user`("id", "age") SELECT "id", "age" FROM `user`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;