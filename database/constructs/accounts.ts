import { AccountSQL } from 'database/entities/Account';
import { Connection, FindConditions, FindOneOptions, Repository } from 'typeorm';

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

  public set(sql: AccountSQL) {
    return this.repo.save(sql)
  }

  public delete(criteria: string | number | FindConditions<AccountSQL>) {
    return this.repo.delete(criteria);
  }
}