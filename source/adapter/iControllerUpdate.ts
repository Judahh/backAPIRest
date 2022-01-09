/* eslint-disable no-unused-vars */
export default interface IControllerUpdate {
  update(request, response): Promise<Response>;
  forceUpdate(request, response): Promise<Response>;
}
