/* eslint-disable no-unused-vars */
export default interface IControllerCreate {
  create(request, response): Promise<Response>;
}
