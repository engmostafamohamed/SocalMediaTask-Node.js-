import { IPost } from '../interfaces/IPost';

export class PostResource {
  id: string;
  authorHandle: string;
  content: string;
  timestamp: string;
  mentions: string[];
  hasNipNipHashtag: boolean;

  constructor(post: IPost) {
    this.id = post.id;
    this.authorHandle = post.authorHandle;
    this.content = post.content;
    this.timestamp = post.timestamp.toISOString();
    this.mentions = post.mentions;
    this.hasNipNipHashtag = post.hasNipNipHashtag;
  }

  static toResource(post: IPost): PostResource {
    return new PostResource(post);
  }

  static toCollection(posts: IPost[]): PostResource[] {
    return posts.map(post => new PostResource(post));
  }
}