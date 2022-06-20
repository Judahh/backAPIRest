/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import BaseControllerDefault from '../controller/baseControllerDefault';
import { IRouter } from 'backapi';
// @ts-ignore
export default class RouterSingleton {
  protected controller:
    | {
        [name: string]: BaseControllerDefault;
      }
    | undefined;
  // @ts-ignore
  // eslint-disable-next-line no-unused-vars
  abstract createRoutes(initDefault?: IRouter): void;
  protected static _instance: RouterSingleton;

  protected routes;

  static getInstance(): RouterSingleton {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }

  getControllers() {
    return this.controller;
  }

  getController(
    name?: string
  ):
    | { [name: string]: BaseControllerDefault }
    | BaseControllerDefault
    | undefined {
    if (name !== undefined) return this.controller?.[name];
    return this.controller;
  }

  getRoutes() {
    return this.routes;
  }

  addRoute(route: string, handler: string): void {
    const routes = this.routes;
    const controller = this.controller?.[handler] as any;
    if (controller !== undefined) {
      const optionsM = controller?.options?.bind(controller);
      const createM = controller?.create?.bind(controller);
      const readM = controller?.read?.bind(controller);
      const updateM = controller?.update?.bind(controller);
      const deleteM = controller?.delete?.bind(controller);

      if (optionsM) routes.options(route, optionsM);
      if (createM) routes.post(route, createM);
      if (readM) routes.get(route, readM);
      if (updateM) {
        routes.put(route, updateM);
        routes.patch(route, updateM);
      }
      if (deleteM) routes.delete(route, deleteM);
    }
  }
}
