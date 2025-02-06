import { describe, it, expect } from 'vitest';
import { sum } from './sum';

describe('sum', () => {
    it('should return the sum of two numbers', () => {
        expect(sum(1, 2)).toBe(3);
    });

    it('should return the sum of negative numbers', () => {
        expect(sum(-1, -2)).toBe(-3);
    });

    it('should return the same number if one of the arguments is zero', () => {
        expect(sum(0, 5)).toBe(5);
        expect(sum(5, 0)).toBe(5);
    });
});