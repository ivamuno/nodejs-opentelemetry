import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Event', { schema: 'EventStore' })
export class Event {
  @PrimaryGeneratedColumn({ name: 'Id', type: 'bigint' })
  id: number;

  @Column({ name: 'CorrelationId', length: 36, nullable: true })
  correlationId: string;

  @Column({ name: 'TimeStamp', type: 'datetime2', precision: 7 })
  timeStamp: Date;

  @Column({ name: 'Data', type: 'nvarchar', length: 'MAX', nullable: true })
  data: string;
}