import { IPost } from '../interfaces/IPost';

export class Post implements IPost {
  id: string;
  authorHandle: string;
  content: string;
  createdAt: Date;
  timestamp: Date;
  mentions: string[];
  hasNipNipHashtag: boolean;

  constructor(id: string, authorHandle: string, content: string) {
    this.id = id;
    this.authorHandle = authorHandle;
    this.content = content;
    this.createdAt = new Date();
    this.timestamp = new Date();
    this.mentions = this.extractMentions(content);
    this.hasNipNipHashtag = content.includes('#NipNip');
  }

  private extractMentions(content: string): string[] {
    const regex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      mentions.push(match[1]);
    }
    return mentions;
  }
}