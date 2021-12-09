/* eslint-disable @typescript-eslint/ban-ts-comment */
import ControllerReadAdapter from '../adapter/controllerReadAdapter';
import { Mixin } from 'ts-mixer';
import BaseControllerShow from './baseControllerShow';
import BaseControllerIndex from './baseControllerIndex';
// @ts-ignore
export default class BaseControllerRead
  extends Mixin(BaseControllerIndex, BaseControllerShow)
  implements ControllerReadAdapter
{
  async read(request, response): Promise<Response> {
    if (Object.keys(request['query']).length !== 0 && request['query'].id)
      return this.index(request, response);
    return this.show(request, response);
  }
}
