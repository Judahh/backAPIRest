/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import BaseControllerDefault from './baseControllerDefault';
import { Operation } from 'flexiblepersistence';
import IControllerConnect from '../adapter/iControllerConnect';

// @ts-ignore
export default class BaseControllerConnect
  extends BaseControllerDefault
  implements IControllerConnect
{
  async connect(request, response): Promise<Response> {
    return this.generateEvent(
      request,
      response,
      Operation.other,
      this.event.bind(this)
    );
  }
}
