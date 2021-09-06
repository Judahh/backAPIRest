/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// file deepcode ignore no-any: any needed
// file deepcode ignore object-literal-shorthand: argh
import { Default } from '@flexiblepersistence/default-initializer';
import { ServiceModel, ServiceSimpleModel } from '@flexiblepersistence/service';
import { Handler, Event, Operation } from 'flexiblepersistence';
import { settings } from 'ts-mixer';
import { RouterInitializer } from 'backapi';
settings.initFunction = 'init';
export default class BaseControllerDefault extends Default {
  protected regularErrorStatus: {
    [error: string]: number;
  } = {
    error: 400,
    Error: 400,
    RemoveError: 400,
    RequestError: 400,
    JsonWebTokenError: 401,
    Unauthorized: 401,
    PaymentRequired: 402,
    TypeError: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    UnknownError: 500,
  };
  protected method: {
    [method: string]: string;
  } = {
    GET: 'read',
    POST: 'store',
    PUT: 'forceUpdate',
    PATCH: 'update',
    DELETE: 'delete',
    OPTIONS: 'options',
    CONNECT: 'connect',
    HEAD: 'head',
    TRACE: 'trace',
  };
  // @ts-ignore
  protected handler: Handler | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected middlewares?: any[];
  async mainRequestHandler(req: Request, res: Response): Promise<Response> {
    try {
      let response;
      if (
        req.method &&
        this.method[req.method] &&
        this[this.method[req.method]]
      )
        response = await this[this.method[req.method]](req, res);
      else {
        const error = new Error('Missing HTTP method.');
        throw error;
      }
      return response;
    } catch (error) {
      console.error(error);
      return new Promise(() => this.generateError(res, error));
    }
  }

  protected errorStatus(error?: string):
    | {
        [error: string]: number;
      }
    | number {
    if (error) return this.regularErrorStatus[error];
    return this.regularErrorStatus;
  }

  constructor(initDefault?: RouterInitializer) {
    super(initDefault);
  }

  init(initDefault?: RouterInitializer): void {
    super.init(initDefault);
    if (initDefault) {
      this.handler = initDefault.handler;
      this.middlewares = [];
      if (initDefault.middlewares)
        this.middlewares.push(...initDefault.middlewares);
    }
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

  protected runMiddleware(request, response, fn) {
    return new Promise((resolve, reject) => {
      fn(request, response, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
  }

  protected async runMiddlewares(request, response) {
    if (this.middlewares)
      for (const middleware of this.middlewares)
        await this.runMiddleware(request, response, middleware);
  }

  protected generateName() {
    this.setName(this.getClassName().replace('Controller', this.getType()));
  }

  protected generateError(response, error) {
    if ((error.message as string).includes('does not exist'))
      error.name = 'NotFound';
    if (!this.errorStatus() || this.errorStatus(error.name) === undefined)
      response
        .status(this.errorStatus('UnknownError') as number)
        .send({ error: error.message });
    else
      response
        .status(this.errorStatus(error.name) as number)
        .send({ error: error.message });
    return response;
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
    if (value === undefined) value = {};
    if (this.hasObjectName()) {
      if (!this.getName()) throw new Error('Element is not specified.');
      object[this.getName()] = value;
    } else object = value;
    return object;
  }

  formatName() {
    const name = this.getClassName().replace('Controller', '');
    return name;
  }

  formatContent(request) {
    const content = request.body as ServiceSimpleModel;
    return content;
  }

  formatParams(request) {
    return request['params'];
  }

  formatQuery(request) {
    const { query } = request;
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
    // deepcode ignore HTTPSourceWithUncheckedType: <please specify a reason of ignoring this>, deepcode ignore HTTPSourceWithUncheckedType: <please specify a reason of ignoring this>
    if (params && params.filter) selection = params.filter;
    else selection = query as any;
    for (const key in selection) {
      if (Object.prototype.hasOwnProperty.call(selection, key)) {
        const element = selection[key];
        const newKey = key.split(/[\s,"'=;\-\/\\]+/)[0];
        selection[newKey] = element;
        if (key != newKey) {
          selection[key] = undefined;
          delete selection[key];
        }
      }
    }
    return selection;
  }

  formatEvent(request, operation: Operation, singleDefault?: boolean) {
    const params = this.formatParams(request);
    const name = this.formatName();
    if (request?.headers) {
      request.headers.pageSize =
        request.headers.pageSize || request.headers.pagesize;
      request.headers.numberOfPages =
        request.headers.numberOfPages || request.headers.numberofpages;
    }
    const event = new Event({
      operation,
      single: this.formatSingle(params, singleDefault),
      content: this.formatContent(request),
      selection: this.formatSelection(params, this.formatQuery(request)),
      name,
      options: request.headers,
    });
    request['event'] = {
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
          Object.keys(resultObject).length === 0 ||
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

  protected async generateHeaders(response, event) {
    const page = (event as any)?.options?.page;
    const pageSize = (event as any)?.options?.pageSize;
    const numberOfPages = (event as any)?.options?.numberOfPages;

    if (page) response.setHeader('page', page);
    if (pageSize) response.setHeader('pageSize', pageSize);
    if (numberOfPages) response.setHeader('numberOfPages', numberOfPages);
  }
  protected async generateEvent(
    request,
    response,
    operation: Operation,
    useFunction: (
      // eslint-disable-next-line no-unused-vars
      event: Event
    ) => Promise<ServiceModel[] | ServiceModel | number | boolean>,
    singleDefault?: boolean
  ): Promise<Response> {
    try {
      const event = this.formatEvent(request, operation, singleDefault);
      await this.runMiddlewares(request, response);
      const object = await this.generateObject(useFunction, event);
      const status = this.generateStatus(operation, object);
      await this.generateHeaders(response, event);
      response.status(status).json(object);
      return response;
    } catch (error) {
      console.error(error);
      return this.generateError(response, error);
    }
  }
}
