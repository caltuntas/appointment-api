const config = {
  development: {
    database: {
      server: process.env.DATABASE_SERVER || 'mongodb+srv://admin:Mnabcdef1!@cluster0-9cus0.mongodb.net/test?retryWrites=true&w=majority',
      db: process.env.DATABASE || 'appointment',
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
    port: process.env.PORT || 8000,
    autoMigration: process.env.MIGRATE || false,
    cors: {
      whitelist: [
        'http://localhost:4200',
        'https://appointment-ui.herokuapp.com',
        '*',
      ],
    },
  },
  production: {
    database: {
      server: process.env.DATABASE_SERVER || 'mongodb+srv://admin:Mnabcdef1!@cluster0-9cus0.mongodb.net/test?retryWrites=true&w=majority',
      db: process.env.DATABASE || 'appointment',
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
    port: process.env.PORT || 8000,
    autoMigration: process.env.MIGRATE || false,
    cors: {
      whitelist: [
        'http://localhost:4200',
        'https://appointment-ui.herokuapp.com',
        '*',
      ],
    },
  }
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
