import { Controller, Get } from '@nestjs/common';

@Controller()
export class BaseController {
  @Get()
  getStartEntry() {
    return 'Hello World!';
  }
}
