import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

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

  // 정적 파일 및 뷰 엔진 설정 (EJS 사용)
  app.useStaticAssets(join(__dirname, '..', 'public')); // 정적 파일 폴더
  app.setBaseViewsDir(join(__dirname, '..', 'views')); // 뷰 파일 폴더
  app.setViewEngine('ejs'); // 템플릿 엔진을 EJS로 설정


  await app.listen(20221);
}
bootstrap();