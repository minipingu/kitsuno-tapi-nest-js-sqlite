import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const session = require('express-session');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const passport = require('passport');
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS for Next.js frontend
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, server-to-server) or from localhost / LAN
      if (!origin) return callback(null, true);
      if (
        origin.startsWith('http://localhost') ||
        origin.startsWith('http://127.0.0.1') ||
        /^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'API-KEY',
      'api-key',
      'X-API-KEY',
      'x-api-key',
    ],
  });

  // Serve static assets from public/
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Express Session & Passport authentication
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'kitsuno-secret-key-987654321',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: false,
      forbidUnknownValues: false,
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger Documentation configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Kitsuno API')
    .setDescription('Complete OpenAPI documentation for Kitsuno Japanese learning platform')
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-API-KEY',
        in: 'header',
        description: 'Personal API key for Kitsuno REST services',
      },
      'X-API-KEY',
    )
    .build();

  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('v1/api-docs', app, swaggerDoc);
  SwaggerModule.setup('api-docs', app, swaggerDoc);

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
  await app.listen(port);
  console.log(`\n======================================================`);
  console.log(`🌸 Kitsuno NestJS is running on: http://localhost:${port}`);
  console.log(`📚 Swagger Documentation at: http://localhost:${port}/v1/api-docs`);
  console.log(`======================================================\n`);
}
bootstrap();
