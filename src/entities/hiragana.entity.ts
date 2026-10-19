import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export interface Kana {
  getRomaji(): string;
}

@Entity('hiragana')
export class Hiragana implements Kana {
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
