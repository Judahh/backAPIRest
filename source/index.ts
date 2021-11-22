import { Mixin } from 'ts-mixer';

import BaseController from './controller/baseController';
import BaseControllerDefault from './controller/baseControllerDefault';
import BaseControllerDelete from './controller/baseControllerDelete';
import BaseControllerIndex from './controller/baseControllerIndex';
import BaseControllerShow from './controller/baseControllerShow';
import BaseControllerRead from './controller/baseControllerRead';
import BaseControllerStore from './controller/baseControllerStore';
import BaseControllerUpdate from './controller/baseControllerUpdate';
import BaseControllerConnect from './controller/baseControllerConnect';
import BaseControllerHead from './controller/baseControllerHead';
import BaseControllerTrace from './controller/baseControllerTrace';
import BaseControllerOptions from './controller/baseControllerOptions';
import {
  sendPost,
  sendPut,
  sendGet,
  sendDelete,
  authenticate,
  request,
} from './utils/request';

export {
  BaseController,
  BaseControllerDefault,
  BaseControllerDelete,
  BaseControllerIndex,
  BaseControllerRead,
  BaseControllerShow,
  BaseControllerStore,
  BaseControllerUpdate,
  BaseControllerConnect,
  BaseControllerHead,
  BaseControllerTrace,
  BaseControllerOptions,
  Mixin,
  sendPost,
  sendPut,
  sendGet,
  sendDelete,
  authenticate,
  request,
};
