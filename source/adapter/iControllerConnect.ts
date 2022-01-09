/* eslint-disable no-unused-vars */
export default interface IControllerConnect {
  connect(request, response): Promise<Response>;
}
