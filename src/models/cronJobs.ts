import { Entity, PrimaryGeneratedColumn, Column,JoinColumn, ManyToOne } from "typeorm";

@Entity({ name: 'CronJobs', synchronize: true })
export class CronJobs {
  @PrimaryGeneratedColumn()
  CronJobId: number;

  @Column({ type: 'datetime', nullable: true })
  LastUpdate: Date;

  @Column({ type: 'datetime', nullable: true })
  GMPLastUpdate: Date;
}
