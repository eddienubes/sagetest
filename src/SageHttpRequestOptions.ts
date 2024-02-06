import { HttpMethod } from './types.js';
import { FormData } from 'undici';

export interface SageHttpRequestOptions {
  method?: HttpMethod;
  path?: string;
  query?: Record<string | number, string>;
  body?: string | object;
  headers?: Record<string, string>;
  formData?: FormData;
}
