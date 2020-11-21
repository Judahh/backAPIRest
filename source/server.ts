// import App from './simpleApp';
// import databaseHandler from './database/databaseHandler';
// import RouterSingleton from './router/routerSingleton';
// // Sample
// const app = new App(
//   RouterSingleton.getInstance(),
//   databaseHandler.getInstance().getJournaly()
// ).express;

// // databaseHandler.getInstance().migrate();

// app.listen(process.env.PORT || 3333);

import { Utils } from './index';
// import dBHandler from './dBHandler';
import { Handler, Event, Operation } from 'flexiblepersistence';
import { ServiceHandler, ServiceInfo } from '@flexiblepersistence/service';
// import { PostgresInfo } from '@flexiblepersistence/postgres';
import eventDatabase from '../test/integration/eventDatabase';
import database from '../test/integration/databases';
import { Journaly } from 'journaly';
import TestService from '../test/integration/testService';
import TestDAO from '../test/integration/testDAO';
import { Pool } from 'pg';

const pool = new Pool(database);

const journaly = new Journaly();
new TestService({
  journaly: journaly,
});
new TestDAO({
  pool: pool,
  journaly: journaly,
});
const read = new ServiceHandler(new ServiceInfo(database, journaly));
const handler = new Handler(eventDatabase, read);
