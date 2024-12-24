import combineMessage from '../src/utils/combineMessage';
describe('combineMessage', () => {
  it('should return a string build from the messagr array', async () => {
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
});
