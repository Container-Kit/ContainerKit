/**
 * @fileoverview Common command builders
 */

/**
 * Command arguments builder
 * Pure function that builds command argument arrays
 */
export const buildArgs = (
	subcommands: readonly string[],
	options: Readonly<Record<string, string | boolean | undefined>>,
	positional: readonly string[]
): readonly string[] => {
	const args: string[] = [...subcommands];

	// Add options
	Object.entries(options).forEach(([key, value]) => {
		if (value === undefined) return;

		args.push(key);
		if (value !== true) {
			args.push(String(value));
		}
	});

	// Add positional arguments
	args.push(...positional);

	return args;
};
