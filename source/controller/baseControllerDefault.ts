import { Operation } from 'flexiblepersistence';
import { AbstractControllerDefault } from 'backapi';

export default class BaseControllerDefault extends AbstractControllerDefault {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  protected abstract restFramework;
  protected socketFramework = undefined;
  protected communication = 'rest';
  protected emit(
    _requestOrData?,
    responseOrSocket?,
    headers?,
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
    return responseOrSocket.send({ headers, body: cleanObject, status });
  }
}
