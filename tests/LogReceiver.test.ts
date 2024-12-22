import { LogReceiver } from '../src/index'; // Adjust the import path as necessary

jest.mock('fs/promises');
jest.mock('path');

describe('LogReceiver', () => {
  it('should return 400 for invalid log request without type', async () => {
    const mockRequest = new Request('http://localhost:3001/logger', {
      method: 'POST',
      body: JSON.stringify({ logLocation: 'location', logData: 'data' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await LogReceiver(mockRequest);
    expect(result.status).toBe(400);
    const text = await result.text();
    expect(text).toBe('Invalid log');
  });

  it('should return 400 for invalid log request without logLocation and logData', async () => {
    const mockRequest = new Request('http://localhost:3001/logger', {
      method: 'POST',
      body: JSON.stringify({ type: 'info' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await LogReceiver(mockRequest);
    expect(result.status).toBe(400);
    const text = await result.text();
    expect(text).toBe('Invalid log');
  });
});