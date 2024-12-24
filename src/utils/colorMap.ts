import ansi from 'micro-ansi';
const colorMap: { [key: string]: (text: string) => string } = {
  error: ansi.red,
  info: ansi.blue,
  debug: ansi.white,
  success: ansi.green,
  warn: ansi.yellow,
};

export { ansi, colorMap };
