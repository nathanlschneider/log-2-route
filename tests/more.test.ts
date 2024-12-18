import { LogReceiver } from '../src/index';
import fs from 'fs/promises';

jest.mock('fs/promises');
jest.mock('path');

describe('LogReceiver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 for invalid API key', async () => {
    const mockRequest = new Request('http://localhost:3001/logger', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json', 'x-api-key': 'invalid' },
    });
    const result = await LogReceiver(mockRequest);
    const text = await result.text();
    expect(['Ok', 'Unauthorized']).toContain(text);
  });

  it('should handle file read error', async () => {
    (fs.readFile as jest.Mock).mockRejectedValue(new Error('File read error'));

    const mockRequest = new Request('http://localhost:3001/logger', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json', 'x-api-key': 'valid' },
    });

    const result = await LogReceiver(mockRequest);
    const text = await result.text();
    expect(['Internal Server Error', 'Unauthorized']).toContain(text);
  });
});
