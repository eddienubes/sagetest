import {
  HTTP_STATUS_TO_MESSAGE,
  HttpStatusText,
  MIME_TYPES
} from './constants.js';
import { Readable } from 'node:stream';
import path from 'node:path';
import { ReadStream, createReadStream } from 'node:fs';
import {
  CookieOptions,
  CookieSameSiteProperty,
  SetCookieHeaderProperties
} from './types.js';
import { Blob, Buffer } from 'node:buffer';

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

export const isError = (status: number): boolean => status >= 400;

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
    value instanceof Buffer
  );
};

/**
 * @returns [filename, path]
 * @param readable
 */
export const getFileDescriptorFromReadable = (
  readable: Readable
): { filename: string; path: string; mimetype: string } | null => {
  // Let's assume that it's a ReadStream first
  let filePath = (readable as ReadStream).path;

  if (!filePath) {
    return null;
  }

  if (filePath instanceof Buffer) {
    filePath = filePath.toString();
  }

  const filename = path.basename(filePath);

  const extension = path.extname(filePath).slice(1);
  const mimetype = MIME_TYPES[extension as keyof typeof MIME_TYPES];

  return {
    filename,
    path: filePath,
    mimetype
  };
};

export const isObject = (candidate: unknown): candidate is object => {
  return (
    typeof candidate === 'object' &&
    candidate !== null &&
    !Array.isArray(candidate)
  );
};

/**
 * Doesn't preserver functions and other non-serializable values
 * @param obj
 */
export const copyObject = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

export const wrapArray = <T>(value: T | T[]): T[] => {
  if (Array.isArray(value)) {
    return value;
  }

  return [value];
};

/**
 * Converts a stream to a buffer. Loads a file if string is passed.
 * @param stream
 */
export const streamToBuffer = async (
  stream: Readable | string
): Promise<Buffer> => {
  if (typeof stream === 'string') {
    stream = createReadStream(stream);
  }

  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
};

export const parseSetCookieHeader = (
  setCookieHeader?: string[] | string
): Record<string, CookieOptions> => {
  if (!setCookieHeader) {
    return {};
  }

  setCookieHeader = wrapArray(setCookieHeader);
  const cookies: Record<string, CookieOptions> = {};

  for (const cookieString of setCookieHeader) {
    // Split each cookieString by '; ' to separate the key-value pair from the options
    const parts = cookieString.split('; ');
    const [nameValue, ...optionsParts] = parts;
    const [name, value] = nameValue.split('=');

    const cookieOptions: CookieOptions = {
      value: decodeURIComponent(value), // Decode the value
      path: '/' // Default path
    };

    // Iterate over the options to set them on the cookieOptions object
    for (const option of optionsParts) {
      const [optionName, optionValue] = option.split('=');
      const lowerCaseOptionName =
        optionName.toLowerCase() as Lowercase<SetCookieHeaderProperties>;
      switch (lowerCaseOptionName) {
        case 'domain':
          cookieOptions.domain = optionValue;
          break;
        case 'expires':
          cookieOptions.expires = new Date(optionValue);
          break;
        case 'httponly':
          cookieOptions.httpOnly = true;
          break;
        case 'max-age':
          cookieOptions.maxAge = parseInt(optionValue, 10);
          break;
        case 'partitioned':
          cookieOptions.partitioned = true;
          break;
        case 'path':
          cookieOptions.path = optionValue || '/';
          break;
        case 'samesite':
          cookieOptions.sameSite =
            optionValue.toLowerCase() as CookieSameSiteProperty;
          break;
        case 'secure':
          cookieOptions.secure = true;
          break;
      }

      cookies[name] = cookieOptions;
    }
  }

  return cookies;
};

/**
 * Just a more verbose syntactic sugar for create an async function and immediately calling it.
 * @param value
 */
export const wrapInPromise = (value: () => Promise<void>): Promise<void> => {
  return value();
};
