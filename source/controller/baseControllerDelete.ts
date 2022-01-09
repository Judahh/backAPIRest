/* eslint-disable @typescript-eslint/ban-ts-comment */
import BaseControllerDefault from './baseControllerDefault';
import IControllerDelete from '../adapter/iControllerDelete';
import { Operation } from 'flexiblepersistence';
// @ts-ignore
export default class BaseControllerDelete
  extends BaseControllerDefault
  implements IControllerDelete
{
  async delete(request, response): Promise<Response> {
    return this.generateEvent(
      request,
      response,
      Operation.delete,
      this.event.bind(this)
    );
  }
}
