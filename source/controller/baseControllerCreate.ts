/* eslint-disable @typescript-eslint/ban-ts-comment */
import BaseControllerDefault from './baseControllerDefault';
import IControllerCreate from '../adapter/iControllerCreate';
import { Operation } from 'flexiblepersistence';

// @ts-ignore
export default class BaseControllerCreate
  extends BaseControllerDefault
  implements IControllerCreate
{
  // @ts-ignore
  async create(request, response): Promise<Response> {
    return this.generateEvent(
      request,
      response,
      Operation.create,
      this.event.bind(this),
      true
    );
  }
}
