import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('particle')
export class Particle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  particle: string;

  @Column()
  meaning: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  formation: string;

  @Column({ type: 'text' })
  example: string;
}
