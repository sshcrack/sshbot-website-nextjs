import { SessionSQL } from 'database/entities/Session';
import { Connection, FindConditions, FindOneOptions, Repository } from 'typeorm';

export default class sessions {
  private repo: Repository<SessionSQL>

  private search: FindOneOptions<SessionSQL>
  constructor(conn: Connection, search: FindOneOptions<SessionSQL>) {
    this.repo = conn.getRepository(SessionSQL)

    this.search = search
  }

  public get() {
    return this.repo.findOne(this.search);
  }

  public set(sql: SessionSQL) {
    return this.repo.save(sql)
  }

  public delete(criteria: string | number | FindConditions<SessionSQL>) {
    return this.repo.delete(criteria);
  }
}