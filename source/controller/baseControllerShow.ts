/* eslint-disable @typescript-eslint/ban-ts-comment */
import ControllerShowAdapter from '../adapter/controllerShowAdapter';
import BaseControllerDefault from './baseControllerDefault';
import { Operation } from 'flexiblepersistence';

// @ts-ignore
export default class BaseControllerShow
  extends BaseControllerDefault
  implements ControllerShowAdapter
{
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
