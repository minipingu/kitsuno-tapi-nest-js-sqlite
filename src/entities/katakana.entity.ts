import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Kana } from './hiragana.entity';

@Entity('katakana')
export class Katakana implements Kana {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  character: string;

  @Column({ nullable: true })
  romaji: string;

  @Column({ nullable: true })
  audio: string;

  @Column({ nullable: true })
  mnemonic: string;

  @Column({ nullable: true })
  story: string;

  @Column({ name: 'stroke_order', nullable: true })
  strokeOrder: string;

  getRomaji(): string {
    return this.romaji;
  }
}
