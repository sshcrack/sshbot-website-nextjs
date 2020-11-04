import { Column, Entity, PrimaryColumn, Timestamp } from 'typeorm';

@Entity("users")
export class UserSQL {

  @PrimaryColumn({ type: "integer"})
  id: number

  @Column({ nullable: true, type: "character varying" })
  name: string

  @Column({ nullable: true, type: "character varying" })
  email: string

  @Column({ nullable: true, type: "timestamp with time zone" })
  email_verified: Timestamp

  @Column({nullable: true, type: "character varying"})
  image: string

  @Column({type: "timestamp with time zone"})
  created_at: Timestamp

  @Column({type: "timestamp with time zone"})
  updated_at: Timestamp
}