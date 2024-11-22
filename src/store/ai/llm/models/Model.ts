import md5 from '@store/ai/llm/models/utils/md5.ts';

class Model {
  public libUrl: string;
  public url: string;
  public title: string;
  public size: number;
  public about: string;
  public id: string;
  public requiredFeatures: Array<string>;
  public cardLink: string;

  constructor({
    url,
    libUrl,
    cardLink,
    title,
    size = 0,
    about = '',
    requiredFeatures = [],
    id = null,
  }: {
    url: string;
    libUrl: string;
    cardLink: string;
    title: string;
    size?: number;
    about?: string;
    requiredFeatures?: Array<string>;
    id?: string;
  }) {
    this.url = url;
    this.libUrl = libUrl;
    this.cardLink = cardLink;
    this.title = title;
    this.size = size;
    this.about = about;
    this.id = id || md5(`${url}-${title}`);
    this.requiredFeatures = requiredFeatures;
  }
}

export default Model;
