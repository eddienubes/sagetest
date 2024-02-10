import { HttpMethod } from './types.js';
import { FormData } from 'undici';
import { IncomingHttpHeaders } from 'undici/types/header.js';

export interface SageHttpRequest {
  method?: HttpMethod;
  path?: string;
  query?: Record<string | number, string>;

  // Should always be a string since Undici doesn't support other types
  body?: string;
  headers?: IncomingHttpHeaders;
  formData?: FormData;
}
