import { logger } from "../src/index";
import { log } from "../src/utils/dataCom";

jest.mock("../src/utils/dataCom", () => ({
  log: jest.fn(),
}));

describe("logger", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should log error messages", async () => {
    const errorMessage = "This is an error";
    logger.error(errorMessage);
    expect(log).toHaveBeenCalledWith({
      type: "error",
      time: expect.any(Number),
      data: { msg: errorMessage },
    });
  });

  it("should log info messages", async () => {
    const infoMessage = "This is an info";
    logger.info(infoMessage);
    expect(log).toHaveBeenCalledWith({
      type: "info",
      time: expect.any(Number),
      data: { msg: infoMessage },
    });
  });

  it("should log success messages", async () => {
    const successMessage = "This is a success";
    logger.success(successMessage);
    expect(log).toHaveBeenCalledWith({
      type: "success",
      time: expect.any(Number),
      data: { msg: successMessage },
    });
  });

  it("should log debug messages", async () => {
    const debugMessage = "This is a debug";
    logger.debug(debugMessage);
    expect(log).toHaveBeenCalledWith({
      type: "debug",
      time: expect.any(Number),
      data: { msg: debugMessage },
    });
  });

  it("should log warn messages", async () => {
    const warnMessage = "This is a warn";
    logger.warn(warnMessage);
    expect(log).toHaveBeenCalledWith({
      type: "warn",
      time: expect.any(Number),
      data: { msg: warnMessage },
    });
  });

  it("should chain debug after error", async () => {
    const errorMessage = "This is an error";
    const debugMessage = "This is a debug";
    logger.error(errorMessage);
    logger.debug(debugMessage);
    expect(log).toHaveBeenCalledWith({
      type: "error",
      time: expect.any(Number),
      data: { msg: errorMessage },
    });
    expect(log).toHaveBeenCalledWith({
      type: "debug",
      time: expect.any(Number),
      data: { msg: debugMessage },
    });
  });
});
