import combineMessage from '../src/utils/combineMessage';

describe('combineMessage', () => {
  // Existing test
  it('should return a string build from the message array', async () => {
    const result = combineMessage(
      'Hello',
      'World',
      1,
      93290329,
      -1,
      0,
      0.1,
      -0.1,
      true,
      false,
      null,
      undefined,
      {}
    );
    expect(typeof result).toBe('string');
  });

  // New tests
  it('should return the message of an Error object', () => {
    const error = new Error('This is an error message');
    const result = combineMessage(error);
    expect(result).toBe('This is an error message');
  });

  it('should handle multiple Error objects', () => {
    const error1 = new Error('First error');
    const error2 = new Error('Second error');
    const result = combineMessage(error1, error2);
    expect(result).toBe('First error Second error');
  });

  it('should handle mixed types including Error objects', () => {
    const error = new Error('Error message');
    const result = combineMessage('Hello', error, 123, true);
    expect(result).toBe('Hello Error message 123 true');
  });
});
