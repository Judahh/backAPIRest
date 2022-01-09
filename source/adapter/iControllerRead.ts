/* eslint-disable no-unused-vars */
export default interface IControllerRead {
  read(request, response): Promise<Response>;
  index(request, response): Promise<Response>;
  show(request, response): Promise<Response>;
}
