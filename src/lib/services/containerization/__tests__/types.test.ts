/**
 * @fileoverview Tests for the Either type and functional utilities
 */

import { describe, it, expect } from 'vitest';
import {
  Left,
  Right,
  isLeft,
  isRight,
  mapRight,
  mapLeft,
  flatMap,
  fold,
  getOrElse,
  tryCatch
} from '../types';

describe('Either type', () => {
  describe('constructors', () => {
    it('should create Left values', () => {
      const error = Left('error message');
      expect(error.type).toBe('Left');
      expect(error.value).toBe('error message');
    });

    it('should create Right values', () => {
      const value = Right(42);
      expect(value.type).toBe('Right');
      expect(value.value).toBe(42);
    });
  });

  describe('type guards', () => {
    it('isLeft should identify Left values', () => {
      const left = Left('error');
      expect(isLeft(left)).toBe(true);
      expect(isRight(left)).toBe(false);
    });

    it('isRight should identify Right values', () => {
      const right = Right(42);
      expect(isRight(right)).toBe(true);
      expect(isLeft(right)).toBe(false);
    });
  });

  describe('mapRight', () => {
    it('should transform Right values', () => {
      const result = mapRight((x: number) => x * 2)(Right(21));
      expect(isRight(result)).toBe(true);
      expect(result.value).toBe(42);
    });

    it('should ignore Left values', () => {
      const result = mapRight((x: number) => x * 2)(Left('error'));
      expect(isLeft(result)).toBe(true);
      expect(result.value).toBe('error');
    });
  });

  describe('mapLeft', () => {
    it('should transform Left values', () => {
      const result = mapLeft((e: string) => e.toUpperCase())(Left('error'));
      expect(isLeft(result)).toBe(true);
      expect(result.value).toBe('ERROR');
    });

    it('should ignore Right values', () => {
      const result = mapLeft((e: string) => e.toUpperCase())(Right(42));
      expect(isRight(result)).toBe(true);
      expect(result.value).toBe(42);
    });
  });

  describe('flatMap', () => {
    it('should chain Right values', () => {
      const result = flatMap((x: number) => Right(x * 2))(Right(21));
      expect(isRight(result)).toBe(true);
      expect(result.value).toBe(42);
    });

    it('should short-circuit on Left values', () => {
      const result = flatMap((x: number) => Right(x * 2))(Left('error'));
      expect(isLeft(result)).toBe(true);
      expect(result.value).toBe('error');
    });

    it('should propagate Left values from chain', () => {
      const result = flatMap(() => Left('new error'))(Right(21));
      expect(isLeft(result)).toBe(true);
      expect(result.value).toBe('new error');
    });
  });

  describe('fold', () => {
    it('should handle Right values', () => {
      const result = fold(
        () => 'error',
        (x: number) => x * 2
      )(Right(21));
      expect(result).toBe(42);
    });

    it('should handle Left values', () => {
      const result = fold(
        () => 'error happened',
        (x: number) => x * 2
      )(Left(null));
      expect(result).toBe('error happened');
    });
  });

  describe('getOrElse', () => {
    it('should extract Right values', () => {
      const result = getOrElse(0)(Right(42));
      expect(result).toBe(42);
    });

    it('should return default for Left values', () => {
      const result = getOrElse(0)(Left('error'));
      expect(result).toBe(0);
    });
  });

  describe('tryCatch', () => {
    it('should catch successful operations', () => {
      const result = tryCatch(
        () => 42,
        () => 'error'
      );
      expect(isRight(result)).toBe(true);
      expect(result.value).toBe(42);
    });

    it('should catch thrown errors', () => {
      const result = tryCatch(
        () => {
          throw new Error('boom');
        },
        () => 'caught error'
      );
      expect(isLeft(result)).toBe(true);
      expect(result.value).toBe('caught error');
    });
  });
});
