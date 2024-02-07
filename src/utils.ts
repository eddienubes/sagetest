import { HTTP_STATUS_TO_MESSAGE, HttpStatusText } from './constants.js';

export const serializeToString = (value: unknown): string => {
  const result = JSON.stringify(value);

  if (!result) {
    throw new TypeError('Value is not JSON serializable');
  }

  return result;
};

export const isOkay = (status: number): boolean =>
  status >= 200 && status < 300;

export const isRedirect = (status: number): boolean => {
  return [301, 302, 303, 307, 308].includes(status);
};

export const statusCodeToMessage = (status: number): HttpStatusText => {
  return (
    HTTP_STATUS_TO_MESSAGE[status as keyof typeof HTTP_STATUS_TO_MESSAGE] ||
    'Unknown'
  );
};

export const parseJsonStr = (jsonString: string): object | null => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    // No-op, just swallow the error here.
    // Helps when we have redirects and such.
    return null;
  }
};

export const isBinary = (value: unknown): boolean => {
  return (
    value instanceof ArrayBuffer ||
    value instanceof Blob ||
    value instanceof File ||
    value instanceof Buffer
  );
};
