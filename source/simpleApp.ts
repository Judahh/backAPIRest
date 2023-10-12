import RouterSingleton from './router/routerSingleton';
import { DatabaseHandler, IDatabaseHandler } from 'backapi';
import dotEnv from 'dotenv';

dotEnv.config();

const verbose = JSON.parse(
  (process.env.BACK_API_REST_DEBUG || 'false').toLowerCase()
);

export default class SimpleApp {
  express;
  expressBase;
  execute;
  router?: RouterSingleton;
  databaseHandler: DatabaseHandler;
  constructor(
    router: RouterSingleton,
    databaseHandler: DatabaseHandler,
    expressBase?,
    execute?,
    autoStart = true
  ) {
    this.expressBase = expressBase;
    this.express = expressBase();
    this.execute = execute;
    this.middlewares();
    this.router = router;
    this.databaseHandler = databaseHandler;
    if (autoStart) this.routes(databaseHandler?.getInit());
  }

  protected middlewares(): void {
    let config =
      JSON.parse(process.env.BACK_API_REST_JSON_CONFIG || '{}') || {};
    config.limit = process.env.BACK_API_REST_JSON_LIMIT || config.limit;
    config.extended = process.env.BACK_API_REST_JSON_EXTENDED
      ? JSON.parse(process.env.BACK_API_REST_JSON_EXTENDED || 'false')
      : config.extended;
    if (Object.keys(config).length == 0) config = undefined;
    this?.express?.use?.(this.expressBase?.json(config));
  }

  protected async migrate(): Promise<boolean> {
    return this.databaseHandler.getHandler().migrate();
  }

  protected async routes(initDefault?: IDatabaseHandler): Promise<void> {
    const port = process.env.PORT || 3000;

    this.router?.createRoutes?.(initDefault);
    await this.execute?.(this.router);
    const routes = await this.router?.getRoutes?.();
    if (verbose) console.log('Routes', routes);
    if (process.env.REST_API_PROPERTY_ETAG) {
      let etag = process.env.REST_API_PROPERTY_ETAG;
      try {
        etag = JSON.parse(etag);
      } catch (error) {
        console.error('Error parsing etag', etag, error);
      }
      await this.express?.set?.('etag', etag);
    }
    if (process.env.REST_API_PROPERTY_VIEW_ENGINE)
      await this.express?.set?.(
        'view engine',
        process.env.REST_API_PROPERTY_VIEW_ENGINE
      );
    if (process.env.REST_API_PROPERTY_VIEW_CACHE)
      await this.express?.set?.(
        'view cache',
        JSON.parse(process.env.REST_API_PROPERTY_VIEW_CACHE || 'false')
      );
    if (process.env.REST_API_PROPERTY_JSON_ESCAPE)
      await this.express?.set?.(
        'json escape',
        JSON.parse(process.env.REST_API_PROPERTY_JSON_ESCAPE || 'false')
      );
    if (process.env.REST_API_PROPERTY_CASE_SENSITIVE_ROUTING)
      await this.express?.set?.(
        'case sensitive routing',
        JSON.parse(
          process.env.REST_API_PROPERTY_CASE_SENSITIVE_ROUTING || 'false'
        )
      );
    if (process.env.REST_API_PROPERTY_X_POWERED_BY)
      await this.express?.set?.(
        'x-powered-by',
        JSON.parse(process.env.REST_API_PROPERTY_X_POWERED_BY || 'false')
      );
    if (process.env.REST_API_PROPERTY_STRICT_ROUTING)
      await this.express?.set?.(
        'strict routing',
        JSON.parse(process.env.REST_API_PROPERTY_STRICT_ROUTING || 'false')
      );
    if (process.env.REST_API_PROPERTY_SUBDOMAIN_OFFSET) {
      let subdomainOffset = process.env.REST_API_PROPERTY_SUBDOMAIN_OFFSET;
      try {
        subdomainOffset = JSON.parse(subdomainOffset);
      } catch (error) {
        console.error('Error parsing subdomain offset', subdomainOffset, error);
      }
      await this.express?.set?.(
        'subdomain offset',
        process.env.REST_API_PROPERTY_SUBDOMAIN_OFFSET.toLowerCase() == 'true'
          ? true
          : process.env.REST_API_PROPERTY_SUBDOMAIN_OFFSET.toLowerCase() ==
            'false'
          ? false
          : subdomainOffset
      );
    }
    if (process.env.REST_API_PROPERTY_TRUST_PROXY) {
      let trustProxy = process.env.REST_API_PROPERTY_TRUST_PROXY;
      try {
        trustProxy = JSON.parse(trustProxy);
      } catch (error) {
        console.error('Error parsing trust proxy', trustProxy, error);
      }
      await this.express?.set?.(
        'trust proxy',
        process.env.REST_API_PROPERTY_TRUST_PROXY.toLowerCase() == 'true'
          ? true
          : process.env.REST_API_PROPERTY_TRUST_PROXY.toLowerCase() == 'false'
          ? false
          : trustProxy
      );
    }
    if (process.env.REST_API_PROPERTY_JSONP_CALLBACK_NAME)
      await this.express?.set?.(
        'jsonp callback name',
        process.env.REST_API_PROPERTY_JSONP_CALLBACK_NAME
      );
    if (routes) await this.express?.use?.(routes);
    await this.express.listen(port);
    console.log(
      `started server on 0.0.0.0:${port}, url: http://localhost:${port}`
    );
  }
}
