/* eslint-disable @typescript-eslint/ban-ts-comment */
// file deepcode ignore no-any: any needed
// file deepcode ignore object-literal-shorthand: argh
import { Request, Response } from 'express';
import { ServiceModel, ServiceSimpleModel } from '@flexiblepersistence/service';
import { Handler, Event, Operation, Default } from 'flexiblepersistence';
import { settings } from 'ts-mixer';
import DatabaseHandlerInitializer from '../database/databaseHandlerInitializer';
settings.initFunction = 'init';
export default class BaseControllerDefault extends Default {
  protected regularErrorStatus: {
    [error: string]: number;
  } = {
    error: 400,
    Error: 400,
    RemoveError: 400,
    JsonWebTokenError: 401,
    Unauthorized: 401,
    PaymentRequired: 402,
    TypeError: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    UnknownError: 500,
  };
  // @ts-ignore

  protected handler: Handler | undefined;

  protected errorStatus(
    error?: string
  ):
    | {
        [error: string]: number;
      }
    | number {
    if (error) return this.regularErrorStatus[error];
    return this.regularErrorStatus;
  }

  constructor(initDefault?: DatabaseHandlerInitializer) {
    super(initDefault);
  }

  init(initDefault?: DatabaseHandlerInitializer): void {
    super.init(initDefault);
    if (initDefault) this.handler = initDefault.handler;
    // console.log(this.handler);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected async event(event: Event): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (!this.journaly) reject(new Error('No journaly connected!'));
      if (this.handler) {
        this.handler
          .addEvent(event)
          .then((value) => resolve(value))
          .catch((error) => reject(error));
      } else reject(new Error('No handler connected!'));
    });
  }

  protected hasObjectName() {
    if (process.env.API_HAS_OBJECT_NAME)
      return /^true$/i.test(process.env.API_HAS_OBJECT_NAME);
    return false;
  }

  protected getObject(object) {
    if (this.hasObjectName()) return object[this.getName()];
    return object;
  }

  protected setObject(object, value) {
    if (this.hasObjectName()) {
      if (!this.getName()) throw new Error('Element is not specified.');
      object[this.getName()] = value;
    } else object = value;
  }

  protected generateName() {
    this.setName(this.getClassName().replace('Controller', this.getType()));
  }

  protected generateError(res: Response, error) {
    if ((error.message as string).includes('does not exist'))
      error.name = 'NotFound';
    if (!this.errorStatus() || this.errorStatus(error.name) === undefined)
      res
        .status(this.errorStatus('UnknownError') as number)
        .send({ error: error.message });
    else
      res
        .status(this.errorStatus(error.name) as number)
        .send({ error: error.message });
    return res;
  }

  formatName() {
    const name = this.getClassName().replace('Controller', '');
    return name;
  }

  formatContent(req: Request) {
    const content = req.body as ServiceSimpleModel;
    return content;
  }

  formatParams(req: Request) {
    return req['params'];
  }

  formatQuery(req: Request) {
    const { query } = req;
    return query;
  }

  formatSingle(params?, singleDefault?: boolean) {
    //  deepcode ignore HTTPSourceWithUncheckedType: params do not exist on next
    let single;
    if (params) {
      single = params.single as boolean;
    }
    // console.log(single);
    if (singleDefault !== undefined && single === undefined)
      single = singleDefault;
    return single;
  }

  formatSelection(params?, query?) {
    let selection;
    if (params && params.filter) selection = params.filter;
    else selection = query as any;
    return selection;
  }

  formatEvent(req: Request, operation: Operation, singleDefault?: boolean) {
    const params = this.formatParams(req);
    const name = this.formatName();
    const event = new Event({
      operation,
      single: this.formatSingle(params, singleDefault),
      content: this.formatContent(req),
      selection: this.formatSelection(params, this.formatQuery(req)),
      name,
      headers: req.headers,
    });
    req['event'] = {
      operation,
      name,
    };
    return event;
  }
  protected generateStatus(operation: Operation, object): number {
    const resultObject = this.getObject(object);
    switch (operation) {
      case Operation.create:
        return 201;
      case Operation.nonexistent:
        return 410;
      default:
        if (
          resultObject === undefined ||
          resultObject === {} ||
          resultObject.length === 0
        )
          return 204;
        else return 200;
    }
    // 206 Partial Content - pagination
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  protected async generateObject(
    useFunction: (
      // eslint-disable-next-line no-unused-vars
      event: Event
    ) => Promise<ServiceModel[] | ServiceModel | number | boolean>,
    event: Event
  ) {
    return this.setObject({}, (await useFunction(event))['receivedItem']);
  }
  protected async generateEvent(
    req: Request,
    res: Response,
    operation: Operation,
    useFunction: (
      // eslint-disable-next-line no-unused-vars
      event: Event
    ) => Promise<ServiceModel[] | ServiceModel | number | boolean>,
    singleDefault?: boolean
  ): Promise<Response> {
    try {
      const event = this.formatEvent(req, operation, singleDefault);
      const object = await this.generateObject(useFunction, event);
      const status = this.generateStatus(operation, object);
      return res.status(status).json(object);
      // return res;
    } catch (error) {
      return this.generateError(res, error);
    }
  }
}
