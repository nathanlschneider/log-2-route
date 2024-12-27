
const serverConfig = {
  development: {
    serverOptions: {
      port: 3001,
      host: 'localhost',
    },
  },
  production: {
    serverOptions: {
      port: 80,
      host: 'stashpig.com',
    },
  },
};
export default serverConfig;
