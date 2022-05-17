import { Operation } from 'flexiblepersistence';
import { AbstractControllerDefault } from 'backapi';
import { toJSON } from 'flatted';

export default class BaseControllerDefault extends AbstractControllerDefault {
  protected emit(
    response?,
    _operation?: Operation,
    status?,
    object?
  ): Promise<void> {
    return response.status(status).json(toJSON(object));
  }
}
