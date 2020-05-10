const config = {
  development: {
    database: {
      server: process.env.DATABASE_SERVER || 'localhost:27017',
      db: process.env.DATABASE || 'licenseDB',
      postfix: process.env.DATABASE_POSTFIX || '?authSource=admin',
      options: {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        user: process.env.DATABASE_USERNAME || 'root',
        pass: process.env.DATABASE_PASSWORD || 'Harder+1346',
        authSource: 'admin',
      },
    },
    jwt: {
      secret: 'E9DF14D66A34FE6DAF9EB65E834E7',
      saltRounds: 10,
    },
    // databaseCache: { host: 'localhost', port: 6379 },
    // redisConfig: {
    //   host: '134.209.251.92',
    //   port: 6379,
    //   password: 'a47c90dc1ac44503a59504907129bdfa',
    // },
    port: process.env.APP_PORT || 8000,
    consolePort: 2222,
    autoMigration: process.env.MIGRATE || false,
    cors: {
      whitelist: [
        'http://localhost:4200',
        'http://mcaqnap253a.myqnapcloud.com:4200',
        '*',
      ],
    },
    // logging: {
    //   sshclient: {
    //     debug: process.env.SSH_CLIENT_DEBUG || false,
    //     verbose: process.env.SSH_CLIENT_VERBOSE || false,
    //   },
    // },
    // socketConfig: { serveClient: false, perMessageDeflate: false },
  },
  // production: {
  //   database: {
  //     server: process.env.DATABASE_SERVER || 'mongo',
  //     db: process.env.DATABASE || 'sechard',
  //     postfix: process.env.DATABASE_POSTFIX || '?authSource=admin',
  //     options: {
  //       useCreateIndex: true,
  //       useNewUrlParser: true,
  //       user: process.env.DATABASE_USERNAME || 'root',
  //       pass: process.env.DATABASE_PASSWORD || 'Harder+1346',
  //     },
  //   },
  //   databaseCache: {
  //     engine: 'redis',
  //     host: process.env.REDIS_HOST,
  //     port: parseInt(process.env.REDIS_PORT, 10),
  //   },
  //   redisConfig: { host: 'redis', port: 6379 },
  //   port: process.env.APP_PORT || 8000,
  //   consolePort: 2222,
  //   autoMigration: process.env.MIGRATE || true,
  //   cors: {
  //     whitelist: ['http://localhost:4200', 'http://mcaqnap253a.myqnapcloud.com:4200', '*'],
  //   },
  //   logging: {
  //     sshclient: {
  //       debug: process.env.SSH_CLIENT_DEBUG || false,
  //       verbose: process.env.SSH_CLIENT_VERBOSE || false,
  //     },
  //   },
  //   socketConfig: { serveClient: false, perMessageDeflate: false },
  // },
};

function getConfig() {
  let cfg;
  if (process.env.NODE_ENV === 'development') {
    cfg = config.development;
  } else if (process.env.NODE_ENV === 'production') {
    cfg = config.production;
  } else {
    cfg = config.development;
  }
  cfg.database.url = process.env.DB_URL
    || `mongodb://${cfg.database.server}/${cfg.database.db}${cfg.database.postfix}`;
  cfg.database.urlFull = process.env.DB_URL
    || `mongodb://${cfg.database.options.user}:${cfg.database.options.pass}@${cfg.database.server}/${cfg.database.db}${cfg.database.postfix}`;
  return cfg;
}

module.exports = getConfig();
