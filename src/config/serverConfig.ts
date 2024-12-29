
const serverConfig = {
  development: {
    serverOptions: {
      port: 3001,
      host: 'localhost',
    },
  },
  production: {
    serverOptions: {
      port: 3001,
      host: 'stashpig.com',
    },
  },
};
export default serverConfig;
