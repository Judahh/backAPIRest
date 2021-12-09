/* eslint-disable @typescript-eslint/ban-ts-comment */
import BaseControllerDefault from './baseControllerDefault';
import { Operation } from 'flexiblepersistence';
import ControllerOptionsAdapter from '../adapter/controllerOptionsAdapter';

// @ts-ignore
export default class BaseControllerOptions
  extends BaseControllerDefault
  implements ControllerOptionsAdapter
{
  async options(request, response): Promise<Response> {
    return this.generateEvent(
      request,
      response,
      Operation.other,
      this.event.bind(this)
    );
  }
}
