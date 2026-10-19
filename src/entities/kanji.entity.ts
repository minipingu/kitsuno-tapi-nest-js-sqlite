import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('kanji')
export class Kanji {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  character: string;

  @Column({ name: 'stroke_count', default: 0 })
  strokeCount: number;

  @Column({ default: 1 })
  grade: number;

  @Column({ type: 'text', nullable: true })
  meanings: string;

  @Column('simple-array', { name: 'onyomi_readings', nullable: true })
  onyomiReadings: string[];

  @Column('simple-array', { name: 'kunyomi_readings', nullable: true })
  kunyomiReadings: string[];

  @Column({ name: 'stroke_order_svg', type: 'text', nullable: true })
  strokeOrderSvg: string;

  @Column('simple-array', { nullable: true })
  vocab: string[];
}
