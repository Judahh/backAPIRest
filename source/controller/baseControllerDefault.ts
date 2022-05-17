import { Operation } from 'flexiblepersistence';
import { AbstractControllerDefault } from 'backapi';

export default class BaseControllerDefault extends AbstractControllerDefault {
  protected emit(
    response?,
    _operation?: Operation,
    status?,
    object?
  ): Promise<void> {
    const cache: any[] = [];
    const cleanObject = JSON.parse(
      JSON.stringify(object, (_key, value) => {
        if (typeof value === 'object' && value !== null) {
          // Duplicate reference found, discard key
          if (cache.includes(value)) return;
          // Store value in our collection
          cache.push(value);
        }
        return value;
      })
    );
    return response.status(status).json(cleanObject);
  }
}
