import axios from 'axios';

const request = async (
  method: string,
  host: string,
  endpoint?: string,
  input?: unknown,
  config?: unknown,
  out?: unknown
): Promise<unknown> => {
  try {
    if (host && host.length > 0) {
      const response = await axios[method](host + endpoint, input, config);
      return response.data;
    } else throw new Error('Missing Params');
  } catch (error: any) {
    error.data = out;
    throw error;
  }
};

const sendPost = async (
  host: string,
  endpoint?: string,
  input?: unknown,
  config?: unknown,
  out?: unknown
): Promise<unknown> => {
  return request('post', host, endpoint, input, config, out);
};
const sendPut = async (
  host: string,
  endpoint?: string,
  input?: unknown,
  config?: unknown,
  out?: unknown
): Promise<unknown> => {
  return request('put', host, endpoint, input, config, out);
};
const sendGet = async (
  host: string,
  endpoint?: string,
  input?: unknown,
  config?: unknown,
  out?: unknown
): Promise<unknown> => {
  return request('get', host, endpoint, input, config, out);
};
const sendDelete = async (
  host: string,
  endpoint?: string,
  input?: unknown,
  config?: unknown,
  out?: unknown
): Promise<unknown> => {
  return request('delete', host, endpoint, input, config, out);
};

const authenticate = async (): Promise<string> => {
  const host = process.env.AUTH_HOST || '';
  const input = {
    type: 'SERVICE',
    identification: process.env.SERVICE_NAME,
    key: process.env.SERVICE_KEY,
  };
  const config = {
    headers: {
      Type: 'application/json',
      Accept: 'application/json',
    },
  };
  const { token } = (await sendPost(host, '/signIn', input, config)) as {
    token: string;
  };
  return token;
};

export { sendPost, sendPut, sendGet, sendDelete, authenticate, request };
