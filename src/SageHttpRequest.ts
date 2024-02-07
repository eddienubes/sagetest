import { HttpMethod } from './types.js';
import { FormData } from 'undici';

export interface SageHttpRequest {
  method?: HttpMethod;
  path?: string;
  query?: Record<string | number, string>;

  // Should always be a string since Undici doesn't support other types
  body?: string;
  headers?: Record<string, string>;
  formData?: FormData;
}
