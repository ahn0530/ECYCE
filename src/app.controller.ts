import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller()
export class AppController {
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
}
