/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import {Logger, ValidationPipe} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import process from "process";
import {ConfigService} from "@nestjs/config";
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import helmet from "helmet";
import {urlencoded} from 'express';

const corsOptionsDelegate = function (req: any, callback: any) {
  const corsOptions = {
    origin: false as boolean | string | string[] | undefined,
    preflightContinue: false,
    maxAge: 86400,
    allowedHeaders: ['Content-Type', 'Authorization', 'sentry-trace'],
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    exposedHeaders: ['Content-Disposition'],
  };

  if (
      ['dev', 'test', 'local'].includes(process.env.NODE_ENV ?? 'dev') ||
      isBlueprintRoute(req.url)
  ) {
    corsOptions.origin = '*';
  } else {
    corsOptions.origin = [
      process.env.FRONT_BASE_URL ?? '',
      process.env.API_ROOT_URL ?? '',
      'https://dpm-frontend.pages.dev/',
      'http://localhost:3000',
      'http://localhost:5173',
      'http://192.168.1.51:5173',
      'http://192.168.1.102:5173',
      'https://accounts.google.com',
      'https://dpm.io.vn',
      'https://dhn.io.vn',
      'https://admin.dhn.io.vn',
      'https://donghangnhanh.vn',
    ];
    if (process.env.WIDGET_BASE_URL && Array.isArray(corsOptions.origin)) {
      corsOptions.origin.push(process.env.WIDGET_BASE_URL);
    }
  }
  callback(null, corsOptions);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<any>(ConfigService);
  const apiVersion = configService.get('APP_VERSION');

  const globalPrefix = `api/${apiVersion}`;
  app.setGlobalPrefix(globalPrefix);
  // * swagger
  const config = new DocumentBuilder()
      .setTitle(configService.get('APP_NAME'))
      .setDescription(configService.get('APP_DESCRIPTION'))
      .setVersion(apiVersion)
      .addTag('Auth')
      .addTag('User')
      .addTag('Channel')
      .addTag('Event')
      .addBearerAuth()
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // * cors
  app.use(
      helmet({
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: false,
      }),
  );
  app.use(
      urlencoded({ extended: true, limit: '2mb', parameterLimit: 10000 }),
  );
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors(corsOptionsDelegate);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();

function isBlueprintRoute(url: string) {
  return url.startsWith('/v1/blueprints');
}