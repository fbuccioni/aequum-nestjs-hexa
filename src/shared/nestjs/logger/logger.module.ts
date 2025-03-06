import { Module } from '@nestjs/common';

import { LoggerService } from './services';


@Module({
  providers: [{
    useFactory: () => new LoggerService(),
    provide: LoggerService,
  }],
  exports: [ LoggerService ],
})
export class LoggerModule {}
