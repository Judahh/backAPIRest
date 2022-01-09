/* eslint-disable no-unused-vars */
export default interface IControllerTrace {
  trace(request, response): Promise<Response>;
}
