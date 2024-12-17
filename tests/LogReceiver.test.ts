import { LogReceiver } from '../src/index'; // Adjust the import path as necessary

describe('LogReceiver', () => {
  it('should process a log entry correctly', async () => {
    const logEntry = { message: 'Test log', type: 'info', time: { epoch: 172626262, locale: '12/12/2024, 01:01:11PM' }, data: {} };
    const mockRequest = new Request('http://localhost:3001/', {
      method: 'POST',
      body: JSON.stringify(logEntry),
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await LogReceiver(mockRequest);
    const json = await result.text();
    expect(json).toBe('Ok'); // Adjust the expected result based on your function's behavior
  });

  it('should handle empty log entry', async () => {
    const logEntry = { };
    const mockRequest = new Request('http://localhost:3001/', {
      method: 'POST',
      body: JSON.stringify(logEntry),
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await LogReceiver(mockRequest);
    const json = await result.text();
    expect(json).toBe('Invalid log type'); // Adjust the expected result based on your function's behavior
  });


  it('should handle null log entry', async () => {
      const logEntry = null;
      const mockRequest = new Request('http://localhost:3001/', {
        method: 'POST',
        body: JSON.stringify(logEntry),
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await LogReceiver(mockRequest);
      const json = await result.text();
      expect(json).toBe('Invalid log type'); // Adjust the expected result based on your function's behavior
    });
    
  // it('should handle log entry with missing level', () => {
  //     const logEntry = { message: 'Test log' };
  //     const result = LogReceiver(logEntry);
  //     expect(result).toBe(false); // Adjust the expected result based on your function's behavior
  // });

  // it('should handle log entry with missing message', () => {
  //     const logEntry = { level: 'info' };
  //     const result = LogReceiver(logEntry);
  //     expect(result).toBe(false); // Adjust the expected result based on your function's behavior
  // });
});
