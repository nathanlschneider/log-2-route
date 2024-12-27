import { logger } from '../src/index';
import { log } from '../src/utils/dataCom';

// FILE: src/index.test.ts

jest.mock('../src/utils/dataCom', () => ({
  log: jest.fn(),
}));

describe('logger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('error', () => {
    it('should log error with valid string message', async () => {
      await logger.error('Test error message', { data: "doot"}, 12345, null, undefined);
      expect(log).toHaveBeenCalledWith({
        type: 'error',
        time: expect.any(Number),
        data: { message: 'Test error message data doot 12345 null undefined' },
      });
    });
  });

  describe('info', () => {
    it('should log info with valid string message', async () => {
      await logger.info('Test info message');
      expect(log).toHaveBeenCalledWith({
        type: 'info',
        time: expect.any(Number),
        data: { message: 'Test info message' },
      });
    });
  });

  describe('success', () => {
    it('should log success with valid string message', async () => {
      await logger.success('Test success message');
      expect(log).toHaveBeenCalledWith({
        type: 'success',
        time: expect.any(Number),
        data: { message: 'Test success message' },
      });
    });
  });

  describe('debug', () => {
    it('should log debug with valid string message', async () => {
      await logger.debug('Test debug message');
      expect(log).toHaveBeenCalledWith({
        type: 'debug',
        time: expect.any(Number),
        data: { message: 'Test debug message' },
      });
    });
  });

  describe('warn', () => {
    it('should log warn with valid string message and level', async () => {
      await logger.warn('Test warn message', { data: "doot"});
      expect(log).toHaveBeenCalledWith({
        type: 'warn',
        time: expect.any(Number),
        data: { message: 'Test warn message data doot' },
      });
    });
  });
});


