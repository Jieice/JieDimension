/**
 * 错误处理系统测试
 */
import { describe, it, expect } from 'vitest';
import { GameError, ErrorCodes, createError, throwError, safeExecute } from '../js/core/error.js';

describe('Error System', () => {
  describe('GameError', () => {
    it('should create game error with code and message', () => {
      const error = new GameError('TEST_CODE', 'Test message');
      expect(error.code).toBe('TEST_CODE');
      expect(error.message).toBe('Test message');
      expect(error.name).toBe('GameError');
    });
    
    it('should include context', () => {
      const error = new GameError('TEST', 'Test', { key: 'value' });
      expect(error.context).toEqual({ key: 'value' });
    });
    
    it('should have timestamp', () => {
      const error = new GameError('TEST', 'Test');
      expect(error.timestamp).toBeDefined();
      expect(typeof error.timestamp).toBe('number');
    });
  });
  
  describe('createError', () => {
    it('should create error with predefined message', () => {
      const error = createError(ErrorCodes.INSUFFICIENT_COINS);
      expect(error.code).toBe(ErrorCodes.INSUFFICIENT_COINS);
      expect(error.message).toBe('金币不足');
    });
  });
  
  describe('throwError', () => {
    it('should throw game error', () => {
      expect(() => throwError(ErrorCodes.NOT_FOUND)).toThrow(GameError);
    });
  });
  
  describe('safeExecute', () => {
    it('should return result on success', () => {
      const result = safeExecute(() => 42);
      expect(result).toBe(42);
    });
    
    it('should return fallback on error', () => {
      const result = safeExecute(() => {
        throw new Error('Test error');
      }, 'fallback');
      expect(result).toBe('fallback');
    });
    
    it('should call error handler', () => {
      let called = false;
      safeExecute(() => {
        throw new Error('Test');
      }, null, () => { called = true; });
      expect(called).toBe(true);
    });
  });
});
