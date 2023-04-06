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
    if (routes) await this.express?.use?.(routes);
    await this.express.listen(port);
    console.log(
      `started server on 0.0.0.0:${port}, url: http://localhost:${port}`
    );
  }
}
