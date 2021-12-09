/* eslint-disable @typescript-eslint/ban-ts-comment */
import BaseControllerDefault from './baseControllerDefault';
import ControllerStoreAdapter from '../adapter/controllerStoreAdapter';
import { Operation } from 'flexiblepersistence';

// @ts-ignore
export default class BaseControllerStore
  extends BaseControllerDefault
  implements ControllerStoreAdapter
{
  // @ts-ignore
  async store(request, response): Promise<Response> {
    return this.generateEvent(
      request,
      response,
      Operation.create,
      this.event.bind(this),
      true
    );
  }
}
