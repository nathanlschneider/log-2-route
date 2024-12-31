import { logger } from '../src/index';
import { log } from '../src/utils/dataCom';

jest.mock('../src/utils/dataCom', () => ({
  log: jest.fn(),
}));

describe('logger', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log error messages', async () => {
    const errorMessage = 'This is an error';
    await logger.error(errorMessage);
    expect(log).toHaveBeenCalledWith({
      type: 'error',
      time: expect.any(Number),
      data: { message: errorMessage },
    });
  });

  it('should log info messages', async () => {
    const infoMessage = 'This is an info';
    await logger.info(infoMessage);
    expect(log).toHaveBeenCalledWith({
      type: 'info',
      time: expect.any(Number),
      data: { message: infoMessage },
    });
  });

  it('should log success messages', async () => {
    const successMessage = 'This is a success';
    await logger.success(successMessage);
    expect(log).toHaveBeenCalledWith({
      type: 'success',
      time: expect.any(Number),
      data: { message: successMessage },
    });
  });

  it('should log debug messages', async () => {
    const debugMessage = 'This is a debug';
    await logger.debug(debugMessage);
    expect(log).toHaveBeenCalledWith({
      type: 'debug',
      time: expect.any(Number),
      data: { message: debugMessage },
    });
  });

  it('should log warn messages', async () => {
    const warnMessage = 'This is a warn';
    await logger.warn(warnMessage);
    expect(log).toHaveBeenCalledWith({
      type: 'warn',
      time: expect.any(Number),
      data: { message: warnMessage },
    });
  });

  it('should chain debug after error', async () => {
    const errorMessage = 'This is an error';
    const debugMessage = 'This is a debug';
    await logger.error(errorMessage);
    await logger.debug(debugMessage);
    expect(log).toHaveBeenCalledWith({
      type: 'error',
      time: expect.any(Number),
      data: { message: errorMessage },
    });
    expect(log).toHaveBeenCalledWith({
      type: 'debug',
      time: expect.any(Number),
      data: { message: debugMessage },
    });
  });
});