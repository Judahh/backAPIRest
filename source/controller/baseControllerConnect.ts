/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import BaseControllerDefault from './baseControllerDefault';
import { Operation } from 'flexiblepersistence';
import ControllerConnectAdapter from '../adapter/controllerConnectAdapter';

// @ts-ignore
export default class BaseControllerConnect
  extends BaseControllerDefault
  implements ControllerConnectAdapter
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
