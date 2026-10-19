import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { Flashcard } from './flashcard.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 14 })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ name: 'join_date', type: 'varchar', length: 20 })
  joinDate: string;

  @Column({ name: 'api_key', unique: true, nullable: true })
  apiKey: string;

  @Column({ default: false })
  enabled: boolean;

  @Column({ name: 'verification_token', length: 64, unique: true, nullable: true })
  verificationToken: string | null;

  @OneToMany(() => Flashcard, (flashcard) => flashcard.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  flashcards: Flashcard[];

  @BeforeInsert()
  setJoinDate() {
    if (!this.joinDate) {
      const now = new Date();
      this.joinDate = now.toISOString().split('T')[0];
    }
  }
}
