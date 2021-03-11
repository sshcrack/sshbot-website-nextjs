import { UserSQL } from 'database/entities/User';
import "reflect-metadata";
import { Connection, createConnection, getConnectionOptions } from 'typeorm';
import { isNull } from 'utils/tools';
import { AccountSQL } from './entities/Account';
import { SessionSQL } from './entities/Session';
import { VerificationRequestSQL } from './entities/VerificationRequest';

export default function initializeDatabase(name?: string): Promise<Connection> {
  return new Promise(async resolve => {
    /*let connection: Connection | undefined
    try {
      connection = getConnection();
    } catch (e) { connection = undefined }

    console.log("Connection Null", isNull(connection));
    if (!isNull(connection)) return resolve(connection)
*/
    const options = await getConnectionOptions()

    let connection = await createConnection({
      ...options,
      entities: [UserSQL, SessionSQL, AccountSQL, VerificationRequestSQL],
      name: isNull(name) ? "default" : name
    })

    resolve(connection)
  });
}