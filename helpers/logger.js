const { createLogger, format, transports } = require('winston');
const { getNamespace } = require('cls-hooked');
const appRoot = require('app-root-path');
require('winston-daily-rotate-file');

const addRequestId = format((i) => {
  const info = i;
  const request = getNamespace('requestContext');
  if (request && request.get('reqId')) {
    const requestId = request.get('reqId');
    info.meta = { requestId };
  }
  return info;
});

// meta param is ensured by splat()
const myFormat = format.printf(
  ({
    timestamp, level, message, meta,
  }) => `${timestamp};${level};${message};${meta ? JSON.stringify(meta) : ''}`,
);

function createTransports() {
  const consoleTransport = new transports.Console({
    format: format.combine(
      format.timestamp(),
      format.colorize(),
      format.simple(),
    ),
  });
  const fileTransport = new transports.DailyRotateFile({
    filename: `${appRoot}/logs/application-%DATE%.log`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    handleExceptions: true,
  });

  // TODO:
  // Winston MongoDB transport testler sirasinda calistiginda sorun cikardigi icin
  // bu cozum uygulandi. Alternatif bir cozum bulunmasi iyi olur
  //   const isInTest = typeof global.it === 'function';
  //   if (!isInTest) {
  //     const mongoTransport = new transports.MongoDB({
  //       db: config.database.urlFull,
  //       collection: 'logs',
  //       level: 'error',
  //       metaKey: 'meta',
  //       capped: true,
  //       options: {
  //         useNewUrlParser: true,
  //       },
  //     });
  //     return [consoleTransport, fileTransport, mongoTransport];
  //   }
  return [consoleTransport, fileTransport];
}

const logger = createLogger({
  //   level: logLevel,
  // format: format.json(),
  format: format.combine(
    addRequestId(),
    format.timestamp(),
    format.splat(),
    myFormat,
  ),
  transports: createTransports(),
});

module.exports = logger;
