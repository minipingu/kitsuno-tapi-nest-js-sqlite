import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  User,
  Hiragana,
  Katakana,
  Kanji,
  Particle,
  Flashcard,
} from './entities';
import { AuthModule } from './modules/auth/auth.module';
import { EmailModule } from './modules/email/email.module';
import { CharactersModule } from './modules/characters/characters.module';
import { ParticlesModule } from './modules/particles/particles.module';
import { FlashcardsModule } from './modules/flashcards/flashcards.module';
import { VocabularyModule } from './modules/vocabulary/vocabulary.module';
import { WebModule } from './modules/web/web.module';
import { DatabaseModule } from './modules/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbType = config.get<string>('DATABASE_TYPE', 'sqlite');
        const entities = [User, Hiragana, Katakana, Kanji, Particle, Flashcard];

        if (dbType === 'postgres') {
          return {
            type: 'postgres',
            host: config.get<string>('DB_HOST', 'localhost'),
            port: parseInt(config.get<string>('DB_PORT', '5432'), 10),
            username: config.get<string>('DB_USERNAME', 'postgres'),
            password: config.get<string>('DB_PASSWORD', 'postgres'),
            database: config.get<string>('DB_NAME', 'kitsuno'),
            entities,
            synchronize: true,
            autoLoadEntities: true,
          };
        }

        return {
          type: 'better-sqlite3',
          database: config.get<string>('DATABASE_FILE', 'kitsuno.sqlite'),
          entities,
          synchronize: true,
          autoLoadEntities: true,
        };
      },
    }),
    AuthModule,
    EmailModule,
    CharactersModule,
    ParticlesModule,
    FlashcardsModule,
    VocabularyModule,
    WebModule,
    DatabaseModule,
  ],
})
export class AppModule {}
