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
import {urlencoded, json} from 'express';
import { initializeTransactionalContext } from 'typeorm-transactional';
import {HttpRequestHeaderKeysEnum} from "@journey-analytic/shared";

const corsOptionsDelegate = function (req: any, callback: any) {
  const corsOptions = {
    origin: false as boolean | string | string[] | undefined,
    preflightContinue: false,
    maxAge: 86400,
    allowedHeaders: ['Content-Type', 'Authorization', 'sentry-trace', HttpRequestHeaderKeysEnum.API_KEY],
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
      'http://localhost:4202',
      'http://localhost:4200',
    ];
    if (process.env.WIDGET_BASE_URL && Array.isArray(corsOptions.origin)) {
      corsOptions.origin.push(process.env.WIDGET_BASE_URL);
    }
  }
  callback(null, corsOptions);
};

async function bootstrap() {
  initializeTransactionalContext();
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
      .addTag('Project')
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
      json({ limit: '500kb'}),
  );
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors(corsOptionsDelegate);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();

function isBlueprintRoute(url: string) {
  return url.includes('project/config') || url.includes('event/collects') || url.startsWith('/v1/blueprints');
}