/**
 * 格式化工具测试
 */
import { describe, it, expect } from 'vitest';
import { fmt, formatTime, formatPercent, parseFormatted } from '../js/utils/format.js';

describe('Format Utils', () => {
  describe('fmt', () => {
    it('should format small numbers', () => {
      expect(fmt(0)).toBe('0');
      expect(fmt(100)).toBe('100');
      expect(fmt(999)).toBe('999');
    });
    
    it('should format thousands', () => {
      expect(fmt(1000)).toBe('1.00K');
      expect(fmt(5000)).toBe('5.00K');
      expect(fmt(9999)).toBe('10.00K');
    });
    
    it('should format millions', () => {
      expect(fmt(1000000)).toBe('1.00M');
      expect(fmt(5000000)).toBe('5.00M');
    });
    
    it('should format billions', () => {
      expect(fmt(1000000000)).toBe('1.00B');
    });
  });
  
  describe('formatTime', () => {
    it('should format seconds', () => {
      expect(formatTime(30)).toBe('30秒');
      expect(formatTime(59)).toBe('59秒');
    });
    
    it('should format minutes', () => {
      expect(formatTime(60)).toBe('1分0秒');
      expect(formatTime(90)).toBe('1分30秒');
    });
    
    it('should format hours', () => {
      expect(formatTime(3600)).toBe('1小时0分钟');
      expect(formatTime(3661)).toBe('1小时1分钟');
    });
  });
  
  describe('formatPercent', () => {
    it('should format percentage', () => {
      expect(formatPercent(0.5)).toBe('50.0%');
      expect(formatPercent(0.123)).toBe('12.3%');
      expect(formatPercent(1)).toBe('100.0%');
    });
  });
  
  describe('parseFormatted', () => {
    it('should parse K suffix', () => {
      expect(parseFormatted('1K')).toBe(1000);
      expect(parseFormatted('5.5K')).toBe(5500);
    });
    
    it('should parse M suffix', () => {
      expect(parseFormatted('1M')).toBe(1000000);
    });
  });
});
