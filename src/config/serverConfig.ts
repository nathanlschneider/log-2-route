
const serverConfig = {
  development: {
    serverOptions: {
      port: 3000,
      host: 'localhost',
    },
  },
  production: {
    serverOptions: {
      port: 3000,
      host: 'stashpig.com',
    },
  },
};
export default serverConfig;
