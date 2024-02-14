export interface FormDataOptions {
  /**
   * File type, e.g. 'image/jpeg'
   */
  type?: string;

  /**
   * File name, e.g. 'my-baby-dog.jpg'
   */
  filename?: string;

  /**
   * Whether to buffer the file into memory when the second argument is a stream or a file path.
   * It is not really recommended, but helpful when you need to know content-length.
   * @default false
   */
  buffer?: boolean;
}
