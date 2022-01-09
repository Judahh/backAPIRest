/* eslint-disable @typescript-eslint/ban-ts-comment */
import IControllerRead from '../adapter/iControllerRead';
import { Operation } from 'flexiblepersistence';
import BaseControllerDefault from './baseControllerDefault';
// @ts-ignore
export default class BaseControllerRead
  extends BaseControllerDefault
  implements IControllerRead
{
  async read(request, response): Promise<Response> {
    if (Object.keys(request['query']).length !== 0 && request['query'].id)
      return this.index(request, response);
    return this.show(request, response);
  }

  async index(request, response): Promise<Response> {
    return this.generateEvent(
      request,
      response,
      Operation.read,
      this.event.bind(this),
      true
    );
  }

  async show(request, response): Promise<Response> {
    return this.generateEvent(
      request,
      response,
      Operation.read,
      this.event.bind(this),
      false
    );
  }
}
