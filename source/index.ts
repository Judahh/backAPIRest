import { Mixin } from 'ts-mixer';

import RouterSingleton from './router/routerSingleton';

import BaseController from './controller/baseController';
import BaseControllerDefault from './controller/baseControllerDefault';
import BaseControllerDelete from './controller/baseControllerDelete';
import BaseControllerRead from './controller/baseControllerRead';
import BaseControllerCreate from './controller/baseControllerCreate';
import BaseControllerUpdate from './controller/baseControllerUpdate';
import BaseControllerConnect from './controller/baseControllerConnect';
import BaseControllerHead from './controller/baseControllerHead';
import BaseControllerTrace from './controller/baseControllerTrace';

export {
  RouterSingleton,
  BaseController,
  BaseControllerDefault,
  BaseControllerDelete,
  BaseControllerCreate,
  BaseControllerRead,
  BaseControllerUpdate,
  BaseControllerConnect,
  BaseControllerHead,
  BaseControllerTrace,
  Mixin,
};
