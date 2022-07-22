import RouterSingleton from './router/routerSingleton';
import { DatabaseHandler, IDatabaseHandler } from 'backapi';
import dotEnv from 'dotenv';

dotEnv.config();

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
    this?.express?.use?.(this.expressBase?.json());
  }

  protected async migrate(): Promise<boolean> {
    return this.databaseHandler.getHandler().migrate();
  }

  protected async routes(initDefault?: IDatabaseHandler): Promise<void> {
    const port = process.env.PORT || 3000;

    this.router?.createRoutes?.(initDefault);
    await this.execute?.(this.router);
    const routes = await this.router?.getRoutes?.();
    console.log('Routes', routes);
    if (routes) await this.express?.use?.(routes);
    await this.express.listen(port);
    console.log(
      `started server on 0.0.0.0:${port}, url: http://localhost:${port}`
    );
  }
}
