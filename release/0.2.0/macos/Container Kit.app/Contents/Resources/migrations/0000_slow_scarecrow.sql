CREATE TABLE `register` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`provider` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `register_provider_unique` ON `register` (`provider`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY NOT NULL,
	`age` integer
);
