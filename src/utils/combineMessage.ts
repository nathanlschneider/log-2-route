const combineMessage = (...args: any[]): string => {
  return args.map(arg => {
    switch (typeof arg) {
      case 'string':
      case 'number':
      case 'boolean':
      case 'bigint':
      case 'symbol':
        return arg.toString();
      case 'object':
        return arg === null ? 'null' : 
        Object.entries(arg)
        .join(' ')
        .replaceAll(',', ' ');
      case 'function':
        return arg.toString();
      case 'undefined':
        return 'undefined';
      default:
        return '';
    }
  }).join(' ');
};

export default combineMessage;
