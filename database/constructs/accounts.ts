import { AccountSQL } from 'database/entities/Account';
import { Connection, FindOneOptions, Repository } from 'typeorm';

export default class accounts {
  private repo: Repository<AccountSQL>

  private search: FindOneOptions<AccountSQL>
  constructor(conn: Connection, search: FindOneOptions<AccountSQL>) {
    this.repo = conn.getRepository(AccountSQL)

    this.search = search
  }

  public get() {
    return this.repo.findOne(this.search);
  }
}