// Espelho do ImageDTO do back-end: os nomes dos campos precisam ser idênticos.
export class Image {
  url?: string;
  name?: string;
  extension?: string;
  size?: number;
  uploadDate?: string;
  tags?: string[];
}
