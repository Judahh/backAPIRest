export default class MissingMethodError extends Error {
  name = 'MissingMethodError';
  message = 'There is a Flexible Persistence Method call missing or a typo.';
}
