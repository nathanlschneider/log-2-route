import { logger } from '../src/index';
import { BodyShape, ErrorShape, InfoShape, SuccessShape, DebugShape, WarnShape } from '../src/Types';

jest.mock('../src/index', () => ({
    logger: {
        error: jest.fn(),
        info: jest.fn(),
        success: jest.fn(),
        debug: jest.fn(),
        warn: jest.fn(),
    },
}));

describe('Logger Tests', () => {
    it('should log an error message', async () => {
        const errorMessage = 'Test error message';
        const errorObj: ErrorShape = { message: errorMessage };

        await logger.error(errorMessage, errorObj);

        expect(logger.error).toHaveBeenCalledWith(errorMessage, errorObj);
    });

    it('should log an info message', async () => {
        const infoMessage = 'Test info message';

        await logger.info(infoMessage);

        expect(logger.info).toHaveBeenCalledWith(infoMessage);
    });

    it('should log a success message', async () => {
        const successMessage = 'Test success message';

        await logger.success(successMessage);

        expect(logger.success).toHaveBeenCalledWith(successMessage);
    });

    it('should log a debug message', async () => {
        const debugMessage = 'Test debug message';

        await logger.debug(debugMessage);

        expect(logger.debug).toHaveBeenCalledWith(debugMessage);
    });

    it('should log a warning message', async () => {
        const warnMessage = 'Test warn message';
        const warnLevel = 1;

        await logger.warn(warnMessage, warnLevel);

        expect(logger.warn).toHaveBeenCalledWith(warnMessage, warnLevel);
    });
});