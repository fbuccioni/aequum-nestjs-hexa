import { Module } from '@nestjs/common';

import { HttpResponseService } from './services';


@Module({
    providers: [HttpResponseService],
    exports: [HttpResponseService],
})
export class HttpResponseModule {}
