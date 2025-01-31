import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  test(@Req() req: Request, @Res() res: Response) {
    console.log('Request received:', {
      method: req.method,
      url: req.url,
      headers: req.headers
    });
    
    return res.json({
      message: 'Test successful',
      timestamp: new Date().toISOString()
    });
  }

  @Get()
getHello(): string {
  return this.appService.getHello();
}

}
