import { Column, Entity, PrimaryColumn, Timestamp } from 'typeorm';

@Entity("sessions")
export class SessionSQL {
  @PrimaryColumn({type: "integer"})
  id: number

  @Column({type: "integer"})
  user_id: number

  @Column({type: "timestamp with time zone"})
  expires: Timestamp

  @Column({type: "character varying"})
  session_token: string

  @Column({type: "character varying"})
  access_token: string

  @Column({type: "timestamp with time zone" })
  created_at: Timestamp

  @Column({type: "timestamp with time zone"})
  updated_at: Timestamp
}