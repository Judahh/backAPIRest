/* eslint-disable @typescript-eslint/ban-ts-comment */
import BaseControllerDefault from './baseControllerDefault';
import { Operation } from 'flexiblepersistence';
import ControllerTraceAdapter from '../adapter/controllerTraceAdapter';

// @ts-ignore
export default class BaseControllerTrace
  extends BaseControllerDefault
  implements ControllerTraceAdapter
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
