import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: false,
    }),
  );

  // `passport` 초기화
  app.use(passport.initialize());
  app.use(passport.session()); // 세션을 사용하는 경우 필요

  await app.listen(20221);
}
bootstrap();