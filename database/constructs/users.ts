import { UserSQL } from 'database/entities/User';
import { Connection, FindOneOptions, Repository } from 'typeorm';

export default class users {
  private repo: Repository<UserSQL>

  private search: FindOneOptions<UserSQL>
  constructor(conn: Connection, search: FindOneOptions<UserSQL>) {
    this.repo = conn.getRepository(UserSQL)

    this.search = search
  }

  public get() {
    return this.repo.findOne(this.search);
  }
}