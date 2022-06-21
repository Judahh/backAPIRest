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
    execute?
  ) {
    this.expressBase = expressBase;
    this.express = expressBase();
    this.execute = execute;
    this.middlewares();
    this.router = router;
    this.databaseHandler = databaseHandler;
    this.routes(databaseHandler?.getInit());
  }

  protected middlewares(): void {
    this?.express?.use?.(this.expressBase?.json());
  }

  protected async routes(initDefault?: IDatabaseHandler): Promise<void> {
    const port = process.env.PORT || 3000;

    this.router?.createRoutes?.(initDefault);
    await this.execute(this.router);
    await this.express.use(this.router?.getRoutes?.());
    await this.express.listen(port);
    console.log(
      `started server on 0.0.0.0:${port}, url: http://localhost:${port}`
    );
  }
}
