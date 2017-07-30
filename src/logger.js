import winston from 'winston';

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, { level: 'silly', colorize:true });
winston.add(winston.transports.File, {
    level: 'silly',
    filename: 'normalized-news.log',
    name: 'custom-log',
    handleExceptions: true,
    humanReadableUnhandledException: true
});

export default winston;