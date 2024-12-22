const altChalk = {
  red: (text: string) => `\x1b[31;1;4m${text}\x1b[0m`,
  green: (text: string) => `\x1b[32;1;4m${text}\x1b[0m`,
  yellow: (text: string) => `\x1b[33;1;4m${text}\x1b[0m`,
  blue: (text: string) => `\x1b[34;1;4m${text}\x1b[0m`,
  purple: (text: string) => `\x1b[35;1;4m${text}\x1b[0m`,
  cyan: (text: string) => `\x1b[36;1;4m${text}\x1b[0m`,
  orange: (text: string) => `\x1b[38;5;208m${text}\x1b[0m`,
};


const colorMap: { [key: string]: (text: string) => string } = {
  error: altChalk.red,
  info: altChalk.blue,
  debug: altChalk.yellow,
  success: altChalk.green,
  warn: altChalk.orange,
};

export {altChalk, colorMap};