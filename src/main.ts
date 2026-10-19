import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const session = require('express-session');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const passport = require('passport');
import * as hbs from 'hbs';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static assets from public/
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Configure Handlebars view engine
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  // Register Handlebars helpers
  hbs.registerHelper('json', (context) => JSON.stringify(context));

  hbs.registerHelper('join', (arr, sep) => {
    if (Array.isArray(arr)) {
      return arr.join(typeof sep === 'string' ? sep : ', ');
    }
    return arr || '-';
  });

  hbs.registerHelper('vocabWord', (item) => {
    if (!item || typeof item !== 'string') return '';
    const idx = item.indexOf('】');
    return idx !== -1 ? item.substring(0, idx + 1) : item;
  });

  hbs.registerHelper('vocabMeaning', (item) => {
    if (!item || typeof item !== 'string') return '';
    const idx = item.indexOf('】');
    return idx !== -1 ? item.substring(idx + 1).trim() : '';
  });

  hbs.registerHelper('particleExJp', (item) => {
    if (!item || typeof item !== 'string') return '';
    const idx = item.indexOf('】');
    return idx !== -1 ? item.substring(0, idx + 1) : item;
  });

  hbs.registerHelper('particleExEn', (item) => {
    if (!item || typeof item !== 'string') return '';
    const idx = item.indexOf('】');
    return idx !== -1 ? item.substring(idx + 1).trim() : '';
  });

  hbs.registerHelper('formatDate', (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString();
    } catch {
      return dateStr;
    }
  });

  hbs.registerHelper('eq', (a, b) => a === b);
  hbs.registerHelper('ne', (a, b) => a !== b);
  hbs.registerHelper('not', (a) => !a);
  hbs.registerHelper('or', (a, b) => a || b);
  hbs.registerHelper('and', (a, b) => a && b);

  // Express Session & Passport authentication
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'kitsuno-secret-key-987654321',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
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

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
  await app.listen(port);
  console.log(`\n======================================================`);
  console.log(`🌸 Kitsuno NestJS is running on: http://localhost:${port}`);
  console.log(`📚 Swagger Documentation at: http://localhost:${port}/v1/api-docs`);
  console.log(`======================================================\n`);
}
bootstrap();
