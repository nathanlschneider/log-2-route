import flattenJSON from "./flattenJSON";

const combineMessage = (...args: any[]) : string => {
  args.forEach((arg, i) => {
    if (typeof arg === 'string') {
      args[i] = arg;
    } else if (typeof arg === 'number') {
      args[i] = arg.toString();
    } else if (typeof arg === 'boolean') {
      args[i] = arg.toString();
    } else if (arg === null) {
      args[i] = 'null';
    } else if (arg === undefined) {
      args[i] = 'undefined';
    } else if (typeof arg === 'object') {
      args[i] = Object.entries(arg).join(' ').replaceAll(',', ' ');
    } else if (typeof arg === 'function') {
      args[i] = arg.toString();
    } else if (typeof arg === 'symbol') {
      args[i] = arg.toString();
    } else if (typeof arg === 'bigint') {
      args[i] = arg.toString();
    } else if (typeof arg === 'undefined') {
      args[i] = 'undefined';
    }
  });

  console.log(args.join(' '));
  return args.join(' ')
};

export default combineMessage;
