import TestController from './testController';
import { Test } from './test.class';
import { mockResponse } from './response.mock';
import { DAOPersistence, Utils } from '@flexiblepersistence/dao';
import {
  Handler,
  MongoPersistence,
  PersistenceInfo,
} from 'flexiblepersistence';
import { Journaly, SenderReceiver } from 'journaly';
import { PGSQL } from '@flexiblepersistence/pgsql';
import TestDAO from './testDAO';
import { eventInfo, readInfo } from './databaseInfos';
import { DatabaseHandler } from 'backapi';
let read;
let write;
let handler: Handler;
let dbHandler: DatabaseHandler;
let journaly;
describe('1', () => {
  beforeEach(async () => {
    // console.log('beforeEach');
    if (handler !== undefined) {
      await handler?.getRead()?.clear();
      await handler?.getWrite()?.clear();
    }
    if (write !== undefined) {
      await write?.close();
    }
    if (read !== undefined) {
      await read?.close();
    }
    journaly = Journaly.newJournaly() as SenderReceiver<any>;
    const eventDatabase = new MongoPersistence(
      new PersistenceInfo(eventInfo, journaly)
    );
    const database = new PersistenceInfo(readInfo, journaly);
    write = eventDatabase;
    const postgres = new PGSQL(database);
    read = new DAOPersistence(postgres, {
      test: new TestDAO(),
    });
    handler = new Handler(write, read, { isInSeries: true });
    dbHandler = DatabaseHandler.getInstance({
      handler: handler,
      journaly: journaly,
    }) as DatabaseHandler;
    // await handler?.getRead()?.clear();
    // await handler?.getWrite()?.clear();
  });

  afterEach(async () => {
    // console.log('afterEach');
    if (handler !== undefined) {
      await handler?.getRead()?.clear();
      await handler?.getWrite()?.clear();
    }
    if (read !== undefined) await read?.close();
    if (write !== undefined) await write?.close();
    read = undefined;
    write = undefined;
    handler = undefined;
    dbHandler = undefined;
  });

  afterAll(async () => {
    // console.log('afterAll');
    if (handler !== undefined) {
      await handler?.getRead()?.clear();
      await handler?.getWrite()?.clear();
    }
    if (read !== undefined) await read?.close();
    if (write !== undefined) await write?.close();
  });

  test('store test, update, select all, select by id test and delete it', async () => {
    // console.log(journaly.getSubjects());
    const pool = read.getPool();
    await Utils.init(pool);
    const controller = new TestController(dbHandler.getInit());
    await handler?.getWrite()?.clear();

    const sentTest = new Test();
    const sentTest2 = new Test();

    const store = await controller.create(
      {
        body: sentTest,
      } as unknown as Request,
      mockResponse as unknown as Response
    );
    // console.log('store:', store);
    const storedTest = store['received'];
    // console.log('storedTest:', storedTest);

    sentTest.id = storedTest.id;
    const expectedTest = { id: storedTest.id, name: null };
    // console.log('expectedTest:', expectedTest);

    expect(storedTest).toStrictEqual(expectedTest);

    const index = await controller.index(
      {
        params: { filter: {} },
      } as unknown as Request,
      mockResponse as unknown as Response
    );
    // console.log('show:', show);
    const indexTest = index['received'];
    expect(indexTest).toStrictEqual(expectedTest);

    const store2 = await controller.create(
      {
        body: sentTest2,
      } as unknown as Request,
      mockResponse as unknown as Response
    );
    // console.log('store:', store);
    const storedTest2 = store2['received'];
    // console.log('storedTest2:', storedTest);

    sentTest2.id = storedTest2.id;
    const expectedTest2 = { id: storedTest2.id, name: null };
    // console.log('expectedTest:', expectedTest);

    expect(storedTest2).toStrictEqual(expectedTest2);

    const show = await controller.show(
      {
        params: { filter: {} },
      } as unknown as Request,
      mockResponse as unknown as Response
    );

    const showTest = show['received'];
    // console.log('showTest:', showTest);
    const expectedTests = [storedTest, storedTest2];
    expect(showTest).toStrictEqual(expectedTests);

    const sentTest3 = { name: 'Test' };

    const update = await controller.update(
      {
        body: sentTest3,
        params: {
          filter: { id: storedTest2.id },
        },
        headers: {
          single: false,
        },
      } as unknown as Request,
      mockResponse as unknown as Response
    );
    // console.log('storedTest2:', storedTest2);

    const updatedTest = update['received'];
    // console.log('updatedTest:', updatedTest);
    const expectedUpdatedTest = { id: storedTest2.id, name: sentTest3.name };
    // console.log('expectedUpdatedTest:', expectedUpdatedTest);
    expect(updatedTest).toStrictEqual(expectedUpdatedTest);

    const show2 = await controller.show(
      {
        params: { filter: {} },
      } as unknown as Request,
      mockResponse as unknown as Response
    );

    const showTest2 = show2['received'];
    // console.log('showTest2:', showTest2);
    const expectedTests2 = [storedTest, updatedTest];
    // console.log('expectedTests2:', expectedTests2);

    expect(showTest2).toStrictEqual(expectedTests2);

    const showFilter = await controller.show(
      {
        params: { filter: { id: storedTest2.id } },
      } as unknown as Request,
      mockResponse as unknown as Response
    );

    const showTestFilter = showFilter['received'];
    const expectedTestsFilter = updatedTest;

    expect(showTestFilter).toStrictEqual(expectedTestsFilter);

    const showFilter2 = await controller.show(
      {
        params: { filter: { 'id sdfasdf': storedTest2.id } },
      } as unknown as Request,
      mockResponse as unknown as Response
    );

    const showTestFilter2 = showFilter2['received'];
    const expectedTestsFilter2 = updatedTest;

    expect(showTestFilter2).toStrictEqual(expectedTestsFilter2);

    const showFilter3 = await controller.show(
      {
        params: {
          filter: {
            'name-sdfasdf': updatedTest.name + '" select * from tests --',
          },
        },
      } as unknown as Request,
      mockResponse as unknown as Response
    );

    const showTestFilter3 = showFilter3['received'];
    const expectedTestsFilter3 = [];

    expect(showTestFilter3).toStrictEqual(expectedTestsFilter3);

    const deleted = await controller.delete(
      {
        params: {
          filter: { id: storedTest2.id },
        },
      } as unknown as Request,
      mockResponse as unknown as Response
    );

    const deletedTest = deleted['received'];
    // console.log('deletedTest:', deletedTest);
    const expectedDeletedTest = true;
    // console.log('expectedDeletedTest:', expectedDeletedTest);
    expect(deletedTest).toStrictEqual(expectedDeletedTest);

    const show3 = await controller.show(
      {
        params: { filter: {} },
      } as unknown as Request,
      mockResponse as unknown as Response
    );

    const showTest3 = show3['received'];
    // console.log('showTest3:', showTest3);
    const expectedTests3 = [storedTest];
    expect(showTest3).toStrictEqual(expectedTests3);
  });
});
