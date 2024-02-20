import md5 from './utils/md5';

class Model {
  public libUrl: string;
  public url: string;
  public title: string;
  public size: number;
  public id: string;
  public requiredFeatures: Array<string>;

  constructor({
    url,
    libUrl,
    title,
    size = 0,
    requiredFeatures = [],
  }: {
    url: string;
    libUrl: string;
    title: string;
    size?: number;
    requiredFeatures?: Array<string>;
  }) {
    this.url = url;
    this.libUrl = libUrl;
    this.title = title;
    this.size = size;
    this.id = md5(`${url}-${title}`);
    this.requiredFeatures = requiredFeatures;
  }
}

export default Model;
