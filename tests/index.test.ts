import { logger, LogReceiver } from '../src/index';
import { log, getConfigContents } from '../src/utils/dataCom';

// Mocking dependencies
jest.mock('../src/utils/dataCom', () => ({
  log: jest.fn(),
  getConfigContents: jest.fn(),
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

describe('LogReceiver', () => {
  const mockRequest = (body: any) => ({
    json: jest.fn().mockResolvedValue(body),
  });

  it('should return 400 if body is invalid', async () => {
    const req = mockRequest({});
    const res = await LogReceiver(req as any);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'Invalid log' });
  });

  it('should return 200 and log data if body is valid', async () => {
    const req = mockRequest({ type: 'info', data: { message: 'Test message' }, time: Date.now() });
    (getConfigContents as jest.Mock).mockResolvedValue('');
    const res = await LogReceiver(req as any);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ logData: expect.any(String), error: '' });
  });

  it('should return 500 if an error occurs', async () => {
    const req = mockRequest({ type: 'info', data: { message: 'Test message' }, time: Date.now() });
    (getConfigContents as jest.Mock).mockRejectedValue(new Error('Test error'));
    const res = await LogReceiver(req as any);
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ status: 500, error: 'Test error' });
  });
});
describe('LogReceiver', () => {
  const mockRequest = (body: any) => ({
    json: jest.fn().mockResolvedValue(body),
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if body is invalid', async () => {
    const req = mockRequest({});
    const res = await LogReceiver(req as any);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'Invalid log' });
  });

  it('should return 200 and log data if body is valid', async () => {
    const req = mockRequest({ type: 'info', data: { message: 'Test message' }, time: Date.now() });
    (getConfigContents as jest.Mock).mockResolvedValue('');
    const res = await LogReceiver(req as any);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ logData: expect.any(String), error: '' });
  });

  it('should return 500 if an error occurs', async () => {
    const req = mockRequest({ type: 'info', data: { message: 'Test message' }, time: Date.now() });
    (getConfigContents as jest.Mock).mockRejectedValue(new Error('Test error'));
    const res = await LogReceiver(req as any);
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ status: 500, error: 'Test error' });
  });

  it('should use default config if config file is empty', async () => {
    const req = mockRequest({ type: 'info', data: { message: 'Test message' }, time: Date.now() });
    (getConfigContents as jest.Mock).mockResolvedValue('');
    const res = await LogReceiver(req as any);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ logData: expect.any(String), error: '' });
  });

  it('should use provided config if config file is not empty', async () => {
    const config = {
      logFile: {
        enabled: true,
        format: 'styled',
        colorizeStyledLog: true,
        timeType: 'locale',
      },
      console: {
        enabled: true,
        format: 'styled',
        colorizeStyledLog: true,
        timeType: 'locale',
      },
    };
    const req = mockRequest({ type: 'info', data: { message: 'Test message' }, time: Date.now() });
    (getConfigContents as jest.Mock).mockResolvedValue(config);
    const res = await LogReceiver(req as any);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ logData: expect.any(String), error: '' });
  });

  it('should log to console in development environment', async () => {
    process.env.NODE_ENV = 'development';
    const config = {
      logFile: {
        enabled: false,
        format: 'styled',
        colorizeStyledLog: true,
        timeType: 'locale',
      },
      console: {
        enabled: true,
        format: 'styled',
        colorizeStyledLog: true,
        timeType: 'locale',
      },
    };
    const req = mockRequest({ type: 'info', data: { message: 'Test message' }, time: Date.now() });
    (getConfigContents as jest.Mock).mockResolvedValue(config);
    console.log = jest.fn();
    await LogReceiver(req as any);
    expect(console.log).toHaveBeenCalled();
    process.env.NODE_ENV = 'test';
  });
});