/* eslint-disable @typescript-eslint/ban-ts-comment */
import BaseControllerDefault from './baseControllerDefault';
import { Operation } from 'flexiblepersistence';
import IControllerHead from '../adapter/iControllerHead';

// @ts-ignore
export default class BaseControllerHead
  extends BaseControllerDefault
  implements IControllerHead
{
  async head(request, response): Promise<Response> {
    return this.generateEvent(
      request,
      response,
      Operation.other,
      this.event.bind(this)
    );
  }
}
