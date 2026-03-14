CREATE TABLE `body_tracking` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`body_weight_kg` real,
	`chest_cm` real,
	`arm_cm` real,
	`thigh_cm` real,
	`waist_cm` real,
	`notes` text
);
--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`muscle_group` text NOT NULL,
	`equipment` text,
	`notes` text
);
--> statement-breakpoint
CREATE TABLE `phases` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`phase_number` integer NOT NULL,
	`name` text NOT NULL,
	`weeks` text NOT NULL,
	`focus` text,
	`tempo` text,
	`rep_range` text
);
--> statement-breakpoint
CREATE TABLE `plan_exercises` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`training_day_id` integer NOT NULL,
	`exercise_id` integer NOT NULL,
	`sets` text NOT NULL,
	`reps` text NOT NULL,
	`rest_seconds` integer NOT NULL,
	`intensity_tech` text,
	`superset_with` integer,
	`notes` text,
	`sort_order` integer NOT NULL,
	FOREIGN KEY (`training_day_id`) REFERENCES `training_days`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `training_days` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`phase_id` integer NOT NULL,
	`day_label` text NOT NULL,
	`day_name` text NOT NULL,
	`target_muscles` text,
	FOREIGN KEY (`phase_id`) REFERENCES `phases`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `workout_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`training_day_id` integer NOT NULL,
	`date` text NOT NULL,
	`duration_min` integer,
	`notes` text,
	FOREIGN KEY (`training_day_id`) REFERENCES `training_days`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `workout_sets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`workout_log_id` integer NOT NULL,
	`exercise_id` integer NOT NULL,
	`set_number` integer NOT NULL,
	`weight_kg` real,
	`reps` integer,
	`rpe` real,
	`is_drop_set` integer DEFAULT false,
	`is_myo_set` integer DEFAULT false,
	FOREIGN KEY (`workout_log_id`) REFERENCES `workout_logs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
