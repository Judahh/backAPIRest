/* eslint-disable @typescript-eslint/ban-ts-comment */
import BaseControllerDefault from './baseControllerDefault';
import { Operation } from 'flexiblepersistence';
import ControllerHeadAdapter from '../adapter/controllerHeadAdapter';

// @ts-ignore
export default class BaseControllerHead
  extends BaseControllerDefault
  implements ControllerHeadAdapter
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
