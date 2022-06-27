import HttpError from './httpError';

export default class InitError extends HttpError {
  constructor() {
    super(503, 'Server still initializing, please try later');
  }
}
