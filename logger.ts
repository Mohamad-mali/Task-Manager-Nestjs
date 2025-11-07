import { WinstonModule } from 'nest-winston';
import { dirname } from 'path';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

export const winstonLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.colorize(),
        winston.format.printf(
          ({ timestamp, level, message }) =>
            `${timestamp} [${level}] ${message}`,
        ),
      ),
    }),
    new (winston.transport as any).DailyRotatefile({
      dirname: 'logs',
      filename: 'app-%DATA%.log',
      dataPattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '2',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(
          ({ timestamp, level, message }) =>
            `${timestamp} [${level}] ${message}`,
        ),
      ),
    }),
  ],
});
