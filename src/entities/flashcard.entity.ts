import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Kanji } from './kanji.entity';
import { User } from './user.entity';

@Entity('flashcard')
export class Flashcard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('simple-array', { nullable: true })
  vocabulary: string[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => Kanji, { eager: true, nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'kanji_id' })
  kanji: Kanji;

  @ManyToOne(() => User, (user) => user.flashcards, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
