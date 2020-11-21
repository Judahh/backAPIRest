/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response } from 'express';
import { ServiceModel, ServiceSimpleModel } from '@flexiblepersistence/service';
import BaseControllerDefault from './baseControllerDefault';
import ControllerStoreAdapter from '../adapter/controllerStoreAdapter';

// @ts-ignore
export default class BaseControllerStore
  extends BaseControllerDefault
  implements ControllerStoreAdapter {
  // @ts-ignore
  protected async storeElement(
    content: ServiceSimpleModel
  ): Promise<ServiceModel> {
    return await this.service('store', content);
  }

  public async store(req: Request, res: Response): Promise<Response> {
    try {
      const content = req.body as ServiceSimpleModel;
      const object = {};
      if (this.element) object[this.element] = await this.storeElement(content);
      else throw new Error('Element is not specified.');
      return res.json(object);
    } catch (error) {
      return res
        .status(this.errorStatus[error.name])
        .send({ error: error.message });
    }
  }
}
