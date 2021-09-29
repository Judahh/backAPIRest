/* eslint-disable @typescript-eslint/no-this-alias */
import { ServiceHandler } from '@flexiblepersistence/service';
import { Pool } from 'pg';

import PersistenceHandler from './sequelizeHandler';
import TestController from './testController';
import { Test } from './test.class';
import { mockResponse } from './response.mock';
import { SequelizePersistence, Utils } from '@flexiblepersistence/sequelize';

test('store test, update, select all, select by id test and delete it', async (done) => {
  const pool = new Pool(
    (
      (PersistenceHandler.getReadHandler() as ServiceHandler)
        .persistence as SequelizePersistence
    ).getPersistenceInfo()
  );
  await Utils.init(pool);
  const obj = {};
  obj['test'] = 'test';
  const handler = PersistenceHandler.getHandler();
  const controller = new TestController(PersistenceHandler.getInit());
  try {
    await (
      (PersistenceHandler.getReadHandler() as ServiceHandler)
        .persistence as SequelizePersistence
    )
      .getSequelize()
      .models.Test.sync({ force: true });
    await handler?.getWrite()?.clear();

    const sentTest = new Test();
    const sentTest2 = new Test();

    const store = await controller.store(
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

    const store2 = await controller.store(
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
    const expectedUpdatedTest = [1];
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
    const expectedTests2 = [
      storedTest,
      { id: storedTest2.id, name: sentTest3.name },
    ];
    // console.log('expectedTests2:', expectedTests2);

    expect(showTest2).toStrictEqual(expectedTests2);

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
    const expectedDeletedTest = [];
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
  } catch (error) {
    console.error(error);
    await handler?.getWrite()?.clear();
    await Utils.end(pool);
    expect(error).toBe(null);
    done();
  }
  await handler?.getWrite()?.clear();
  await Utils.end(pool);
  done();
});
