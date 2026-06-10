/**
 * @fileoverview Pure functional JSON and text parsers
 * Handles parsing CLI output safely
 */

import type { Either } from './types';
import { Left, Right, tryCatch } from './types';

/**
 * Error type for parsing
 */
export type ParseError = {
    readonly type: 'ParseError';
    readonly message: string;
    readonly input: string;
};

/**
 * Create a parse error
 */
const createParseError = (message: string, input: string): ParseError => ({
    type: 'ParseError',
    message,
    input
});

/**
 * Safely parse JSON from string
 */
export const parseJSON = <T>(input: string): Either<ParseError, T> =>
    tryCatch(
        () => JSON.parse(input) as T,
        (error) => createParseError(error instanceof Error ? error.message : 'Invalid JSON', input)
    );

/**
 * Parse JSON array from string
 */
export const parseJSONArray = <T>(input: string): Either<ParseError, T[]> =>
    tryCatch(
        () => {
            const parsed = JSON.parse(input);
            if (!Array.isArray(parsed)) {
                throw new Error('Expected JSON array');
            }
            return parsed as T[];
        },
        (error) =>
            createParseError(error instanceof Error ? error.message : 'Invalid JSON array', input)
    );

/**
 * Parse JSON object from string
 */
export const parseJSONObject = <T extends Record<string, any>>(
    input: string
): Either<ParseError, T> =>
    tryCatch(
        () => {
            const parsed = JSON.parse(input);
            if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
                throw new Error('Expected JSON object');
            }
            return parsed as T;
        },
        (error) =>
            createParseError(error instanceof Error ? error.message : 'Invalid JSON object', input)
    );

/**
 * Parse space-separated values
 */
export const parseSpaceSeparated = (input: string): Either<ParseError, string[]> =>
    Right(
        input
            .trim()
            .split(/\s+/)
            .filter((item) => item.length > 0)
    );

/**
 * Parse comma-separated values
 */
export const parseCommaSeparated = (input: string): Either<ParseError, string[]> =>
    Right(
        input
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item.length > 0)
    );

/**
 * Parse lines from text
 */
export const parseLines = (input: string): Either<ParseError, string[]> =>
    Right(
        input
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.length > 0)
    );

/**
 * Trim and validate non-empty string
 */
export const parseNonEmptyString = (input: string): Either<ParseError, string> => {
    const trimmed = input.trim();
    if (trimmed.length === 0) {
        return Left(createParseError('Expected non-empty string', input));
    }
    return Right(trimmed);
};
