import { BaseDAO } from '@flexiblepersistence/dao';
/* eslint-disable no-unused-vars */
export default class TestDAO extends BaseDAO {
  protected table = 'tests';

  protected values = 'element.ID ';

  protected insert = 'id';

  protected insertValues = '$1';

  protected updateQuery = '';

  constructor(initDefault) {
    super(initDefault);
    // console.log(this);
  }
}
