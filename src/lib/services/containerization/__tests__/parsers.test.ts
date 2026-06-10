/**
 * @fileoverview Tests for the parsers module
 */

import { describe, it, expect } from 'vitest';
import {
  parseJSON,
  parseJSONArray,
  parseJSONObject,
  parseSpaceSeparated,
  parseCommaSeparated,
  parseLines,
  parseNonEmptyString
} from '../parsers';
import { isRight, isLeft } from '../types';

describe('Parsers', () => {
  describe('parseJSON', () => {
    it('should parse valid JSON objects', () => {
      const result = parseJSON('{"name":"test"}');
      expect(isRight(result)).toBe(true);
      expect(result.value).toEqual({ name: 'test' });
    });

    it('should parse valid JSON arrays', () => {
      const result = parseJSON('[1,2,3]');
      expect(isRight(result)).toBe(true);
      expect(result.value).toEqual([1, 2, 3]);
    });

    it('should parse JSON primitives', () => {
      const result = parseJSON('42');
      expect(isRight(result)).toBe(true);
      expect(result.value).toBe(42);
    });

    it('should return Left on invalid JSON', () => {
      const result = parseJSON('{invalid json}');
      expect(isLeft(result)).toBe(true);
      expect(result.value.type).toBe('ParseError');
    });
  });

  describe('parseJSONArray', () => {
    it('should parse JSON arrays', () => {
      const result = parseJSONArray('[{"id":"1"},{"id":"2"}]');
      expect(isRight(result)).toBe(true);
      expect(Array.isArray(result.value)).toBe(true);
      expect(result.value).toHaveLength(2);
    });

    it('should return Left if not an array', () => {
      const result = parseJSONArray('{"name":"test"}');
      expect(isLeft(result)).toBe(true);
      expect(result.value.type).toBe('ParseError');
    });

    it('should return Left on invalid JSON', () => {
      const result = parseJSONArray('[invalid]');
      expect(isLeft(result)).toBe(true);
      expect(result.value.type).toBe('ParseError');
    });
  });

  describe('parseJSONObject', () => {
    it('should parse JSON objects', () => {
      const result = parseJSONObject('{"name":"test","value":42}');
      expect(isRight(result)).toBe(true);
      expect(result.value).toEqual({ name: 'test', value: 42 });
    });

    it('should return Left if it is an array', () => {
      const result = parseJSONObject('[1,2,3]');
      expect(isLeft(result)).toBe(true);
      expect(result.value.type).toBe('ParseError');
    });

    it('should return Left on invalid JSON', () => {
      const result = parseJSONObject('{invalid}');
      expect(isLeft(result)).toBe(true);
      expect(result.value.type).toBe('ParseError');
    });
  });

  describe('parseSpaceSeparated', () => {
    it('should parse space-separated values', () => {
      const result = parseSpaceSeparated('apple banana cherry');
      expect(isRight(result)).toBe(true);
      expect(result.value).toEqual(['apple', 'banana', 'cherry']);
    });

    it('should handle extra spaces', () => {
      const result = parseSpaceSeparated('  apple   banana  cherry  ');
      expect(isRight(result)).toBe(true);
      expect(result.value).toEqual(['apple', 'banana', 'cherry']);
    });

    it('should handle empty string', () => {
      const result = parseSpaceSeparated('');
      expect(isRight(result)).toBe(true);
      expect(result.value).toEqual([]);
    });
  });

  describe('parseCommaSeparated', () => {
    it('should parse comma-separated values', () => {
      const result = parseCommaSeparated('apple,banana,cherry');
      expect(isRight(result)).toBe(true);
      expect(result.value).toEqual(['apple', 'banana', 'cherry']);
    });

    it('should trim whitespace around values', () => {
      const result = parseCommaSeparated('apple , banana , cherry');
      expect(isRight(result)).toBe(true);
      expect(result.value).toEqual(['apple', 'banana', 'cherry']);
    });

    it('should filter empty values', () => {
      const result = parseCommaSeparated('apple,,banana');
      expect(isRight(result)).toBe(true);
      expect(result.value).toEqual(['apple', 'banana']);
    });
  });

  describe('parseLines', () => {
    it('should parse lines from text', () => {
      const result = parseLines('line1\nline2\nline3');
      expect(isRight(result)).toBe(true);
      expect(result.value).toEqual(['line1', 'line2', 'line3']);
    });

    it('should trim whitespace from lines', () => {
      const result = parseLines('  line1  \n  line2  \n  line3  ');
      expect(isRight(result)).toBe(true);
      expect(result.value).toEqual(['line1', 'line2', 'line3']);
    });

    it('should filter empty lines', () => {
      const result = parseLines('line1\n\nline2\n\n\nline3');
      expect(isRight(result)).toBe(true);
      expect(result.value).toEqual(['line1', 'line2', 'line3']);
    });
  });

  describe('parseNonEmptyString', () => {
    it('should parse non-empty strings', () => {
      const result = parseNonEmptyString('hello');
      expect(isRight(result)).toBe(true);
      expect(result.value).toBe('hello');
    });

    it('should trim whitespace', () => {
      const result = parseNonEmptyString('  hello  ');
      expect(isRight(result)).toBe(true);
      expect(result.value).toBe('hello');
    });

    it('should return Left for empty strings', () => {
      const result = parseNonEmptyString('');
      expect(isLeft(result)).toBe(true);
      expect(result.value.type).toBe('ParseError');
    });

    it('should return Left for whitespace-only strings', () => {
      const result = parseNonEmptyString('   ');
      expect(isLeft(result)).toBe(true);
      expect(result.value.type).toBe('ParseError');
    });
  });
});
