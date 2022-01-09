/* eslint-disable no-unused-vars */
export default interface IControllerHead {
  head(request, response): Promise<Response>;
}
