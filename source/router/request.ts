/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { DatabaseHandler } from 'backapi';
import RouterSingleton from './routerSingleton';
// import controller from './controller';

const request = async (
  _args,
  _routerSingleton: RouterSingleton,
  _databaseHandler: DatabaseHandler,
  _name: string
): Promise<Promise<Response> | undefined> => {
  return undefined;
};

export default request;
