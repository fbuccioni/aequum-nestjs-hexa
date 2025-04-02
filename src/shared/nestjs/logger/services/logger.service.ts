import {
    Inject,
    Injectable,
    Logger,
    LoggerService as NestLoggerService,
} from '@nestjs/common';
import { formatWithOptions, InspectOptions } from 'util';


/**
 * service for logging
 */
@Injectable()
export class LoggerService implements NestLoggerService {
    /**
     * defaultFormatOptions
     */
    static defaultFormatOptions: InspectOptions = {
        colors: true,
        depth: 5,
    };

    /**
     * logger
     */
    private readonly logger: Logger;

    /**
     * constructor for the logger
     */
    constructor(
        public readonly context: string = 'main',
        @Inject('LogFormatOptions') public formatOptions: InspectOptions = {}
    ) {
        this.logger = new Logger(this.context);
    }

    /**
     * Creates the logger service instance
     *
     * @param context Context
     * @param formatOptions Format options
     * @returns logger
     */
    static create(context?: string, formatOptions?: InspectOptions): LoggerService {
        return new LoggerService(context, formatOptions);
    }

    /**
     * logs the message
     * @param message message
     * @param args arguments
     */
    public log(message: string, ...args: any[]) {
        this.logger.log(this.format(message, args));
    }

    /**
     * logs the error message
     * @param message message
     * @param error error
     * @param args arguments
     */
    public error(message: string, error?: string | Error, ...args: any[]) {
        this.logger.error(
            this.format(message, args),
            error instanceof Error ? error.stack : error
        );
    }

    /**
     * logs the warning message
     * @param message message
     * @param args arguments
     */
    public warn(message: string, ...args: any[]) {
        this.logger.warn(this.format(message, args));
    }

    /**
     * logs the debug message
     * @param message message
     * @param args arguments
     */
    public debug(message: string, ...args: any[]) {
        this.logger.debug(this.format(message, args));
    }

    /**
     * logs the verbose message
     * @param message message
     * @param args arguments
     */
    public verbose(message: string, ...args: any[]) {
        this.logger.verbose(this.format(message, args));
    }

    /**
     * formats the message
     * @param message message
     * @param args arguments
     * @returns formatted message
     */
    private format(message: string, args?: string[]) {
        const self = this.constructor as typeof LoggerService;
        const formatOptions =  {
            ...self.defaultFormatOptions,
            ...( this.formatOptions || {} ),
        }

        return formatWithOptions(formatOptions, message, ...args);
    }
}
