import { SessionSQL } from 'database/entities/Session';
import { Connection, FindOneOptions, Repository } from 'typeorm';

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
}