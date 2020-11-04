import { Column, Entity, PrimaryColumn, Timestamp } from 'typeorm';

@Entity("accounts")
export class AccountSQL {
  @PrimaryColumn({type: "integer"})
  id: number

  @Column({type: "character varying"})
  compound_id: string

  @Column({type: "integer"})
  user_id: number

  @Column({type: "character varying"})
  provider_type: string

  @Column({type: "character varying"})
  provider_id: string

  @Column({type: "character varying"})
  provider_account_id: string

  @Column({ nullable: true, type: "text" })
  refresh_token: string

  @Column({ nullable: true, type: "text" })
  access_token: string

  @Column({ nullable: true, type: "timestamp with time zone" })
  access_token_expires: Timestamp

  @Column({type: "timestamp with time zone" })
  created_at: Timestamp

  @Column({type: "timestamp with time zone" })
  updated_at: Timestamp
}