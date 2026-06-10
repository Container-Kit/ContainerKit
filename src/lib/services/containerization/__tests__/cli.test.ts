/**
 * @fileoverview Tests for the CLI module
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
    executeCLI,
    validateCLIOutput,
    executeAndValidate,
    type CLIError,
    type CLIOutput
} from '../cli';
import { isRight, isLeft } from '../types';

// Mock the Tauri Command
vi.mock('@tauri-apps/plugin-shell', () => ({
    Command: {
        create: vi.fn((cmd, args) => ({
            cmd,
            args,
            execute: vi.fn()
        }))
    }
}));

describe('CLI Module', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('validateCLIOutput', () => {
        it('should validate successful output', () => {
            const output: CLIOutput = {
                code: 0,
                stdout: '[]',
                stderr: ''
            };
            const result = validateCLIOutput(output);
            expect(isRight(result)).toBe(true);
            expect(result.value).toEqual(output);
        });

        it('should reject non-zero exit codes', () => {
            const output: CLIOutput = {
                code: 1,
                stdout: '',
                stderr: 'error message'
            };
            const result = validateCLIOutput(output);
            expect(isLeft(result)).toBe(true);
            expect(result.value.type).toBe('ExecutionError');
            expect(result.value.exitCode).toBe(1);
        });

        it('should reject empty output', () => {
            const output: CLIOutput = {
                code: 0,
                stdout: '',
                stderr: ''
            };
            const result = validateCLIOutput(output);
            expect(isLeft(result)).toBe(true);
            expect(result.value.type).toBe('ExecutionError');
        });

        it('should accept output with stderr but code 0', () => {
            const output: CLIOutput = {
                code: 0,
                stdout: '[]',
                stderr: 'warning'
            };
            const result = validateCLIOutput(output);
            expect(isRight(result)).toBe(true);
        });

        it('should accept null code if stdout present', () => {
            const output: CLIOutput = {
                code: null,
                stdout: 'data',
                stderr: ''
            };
            const result = validateCLIOutput(output);
            expect(isRight(result)).toBe(true);
        });
    });
});
