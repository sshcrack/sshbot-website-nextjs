import { Column, Entity, PrimaryColumn, Timestamp } from 'typeorm';

@Entity("verification_requests")
export class VerificationRequestSQL {

  @PrimaryColumn({type: "integer"})
  id: number

  @Column({ nullable: true, type: "character varying" })
  identifier: string

  @Column({ nullable: true, type: "character varying" })
  token: string

  @Column({type: "timestamp with time zone", nullable: true })
  expires: Timestamp

  @Column({type: "timestamp with time zone"})
  created_at: Timestamp

  @Column({type: "timestamp with time zone"})
  updated_at: Timestamp
}