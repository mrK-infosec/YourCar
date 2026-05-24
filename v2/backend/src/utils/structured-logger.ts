import { LoggerService, Injectable } from '@nestjs/common';
import { getConfiguration } from '../config/configuration';

@Injectable()
export class StructuredLogger implements LoggerService {
  private config = getConfiguration();

  log(message: any, ...optionalParams: any[]) {
    this.printLog('info', message, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    this.printLog('error', message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.printLog('warn', message, ...optionalParams);
  }

  debug(message: any, ...optionalParams: any[]) {
    if (this.config.nodeEnv !== 'production') {
      this.printLog('debug', message, ...optionalParams);
    }
  }

  verbose(message: any, ...optionalParams: any[]) {
    if (this.config.nodeEnv !== 'production') {
      this.printLog('verbose', message, ...optionalParams);
    }
  }

  private printLog(level: string, message: any, ...optionalParams: any[]) {
    const timestamp = new Date().toISOString();
    const context = optionalParams[optionalParams.length - 1] || 'App';

    if (this.config.nodeEnv === 'production') {
      // Production Rule: Strictly structured JSON
      console.log(
        JSON.stringify({
          level,
          timestamp,
          context,
          message: typeof message === 'object' ? message : { msg: message },
        })
      );
    } else {
      // Development: Beautiful color coding
      const colorMap: Record<string, string> = {
        info: '\x1b[36m',   // Cyan
        warn: '\x1b[33m',   // Yellow
        error: '\x1b[31m',  // Red
        debug: '\x1b[35m',  // Magenta
        verbose: '\x1b[32m' // Green
      };
      const color = colorMap[level] || '\x1b[37m';
      const reset = '\x1b[0m';
      console.log(
        `${color}[StructuredLogger - ${level.toUpperCase()}]${reset} [${context}] ${timestamp} | ${
          typeof message === 'object' ? JSON.stringify(message) : message
        }`
      );
    }
  }
}
export default StructuredLogger;
