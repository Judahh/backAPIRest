/* eslint-disable @typescript-eslint/ban-ts-comment */
import BaseControllerDefault from './baseControllerDefault';
import { Operation } from 'flexiblepersistence';
import IControllerTrace from '../adapter/iControllerTrace';

// @ts-ignore
export default class BaseControllerTrace
  extends BaseControllerDefault
  implements IControllerTrace
{
  async trace(request, response): Promise<Response> {
    return this.generateEvent(
      request,
      response,
      Operation.other,
      this.event.bind(this)
    );
  }
}
