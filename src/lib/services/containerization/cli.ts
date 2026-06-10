/**
 * @fileoverview Pure functional container CLI command execution
 * Handles shell command execution with functional error handling
 */

import { Command } from '@tauri-apps/plugin-shell';
import { Either, Left, Right, tryCatchAsync } from './types';

/**
 * Error type for CLI execution
 */
export type CLIError = {
  readonly type: 'ExecutionError';
  readonly message: string;
  readonly exitCode: number | null;
  readonly stderr: string;
};

/**
 * Raw output from a CLI command
 */
export type CLIOutput = {
  readonly code: number | null;
  readonly stdout: string;
  readonly stderr: string;
};

/**
 * Create a CLI error
 */
const createCLIError = (
  message: string,
  exitCode: number | null,
  stderr: string
): CLIError => ({
  type: 'ExecutionError',
  message,
  exitCode,
  stderr
});

/**
 * Execute a raw container CLI command
 * Pure function that returns Either<CLIError, CLIOutput>
 */
export const executeCLI = async (args: readonly string[]): Promise<Either<CLIError, CLIOutput>> => {
  return tryCatchAsync(
    async () => {
      const command = Command.create('container', Array.from(args));
      const output = await command.execute();

      if (output == null) {
        throw new Error('No output received from command');
      }

      return {
        code: output.code,
        stdout: output.stdout ?? '',
        stderr: output.stderr ?? ''
      };
    },
    (error) =>
      createCLIError(
        error instanceof Error ? error.message : 'Unknown error',
        null,
        error instanceof Error ? error.message : ''
      )
  )();
};

/**
 * Validate CLI output - check if command succeeded
 */
export const validateCLIOutput = (output: CLIOutput): Either<CLIError, CLIOutput> => {
  if (output.code !== 0 && output.code !== null) {
    return Left(
      createCLIError(
        `Command failed with exit code ${output.code}`,
        output.code,
        output.stderr
      )
    );
  }

  if (!output.stdout && !output.stderr) {
    return Left(
      createCLIError('Command returned empty output', output.code, output.stderr)
    );
  }

  return Right(output);
};

/**
 * Execute CLI and validate output
 * Combination of execution + validation in one function
 */
export const executeAndValidate = async (
  args: readonly string[]
): Promise<Either<CLIError, CLIOutput>> => {
  const result = await executeCLI(args);

  if (result.type === 'Left') {
    return result;
  }

  return validateCLIOutput(result.value);
};
