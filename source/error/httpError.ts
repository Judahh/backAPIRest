export default class HttpError extends Error {
  public code: number;
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}
